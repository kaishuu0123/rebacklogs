# リアルタイム通知システム

## 概要

バックログ・Kanban の複数ユーザー同時操作に対応するため、リアルタイム通知システムが必要。
ストーリー移動・タスク更新・コメント追加などを、他のユーザーのブラウザに即時反映することが目的。

## 方針

**Solid Cable** を使って実装する。

- Rails 8 公式の ActionCable バックエンド
- PostgreSQL / SQLite をアダプターとして使えるため Redis 不要
- 参考: https://github.com/rails/solid_cable

## 実装を見送った経緯

PostgreSQL `LISTEN/NOTIFY` + `ActionController::Live` (SSE) による自前実装を試みたが、
デバッグが複雑だったため一旦削除し、Solid Cable への移行を決定した。

## 通知が必要なイベント

| イベント名 | ペイロード | 対象ページ |
|---|---|---|
| `sprint_updated` | `{ story_id }` | Backlogs / Kanban |
| `task_updated` | `{ task_id, sprint_id }` | 該当 Sprint の Kanban |
| `ticket_updated` | `{ ticket_id }` | TicketModal（タイトル・説明・担当者・ポイント・カテゴリ・履歴） |
| `comment_updated` | `{ ticket_id }` | TicketModal のコメント欄 |

## フロントエンド側の設計方針

- ActionCable の WebSocket を購読する React フック（`useProjectEvents` 相当）を実装する
- イベント受信時に TanStack Query の `invalidateQueries` を呼び出してデータを再取得する
- 購読チャンネルはプロジェクト単位（`ProjectChannel`）

## 楽観的ロックとの関係

### TanStack Query（リアルタイム更新）が解決すること

「A が古いデータを見ている」状態をなくす。A が画面を開いている間に B が更新したら A の画面も自動で最新化されるため、**古いデータで保存しようとする状況を減らす**。

ただし「A と B が同時に編集フォームを開いて、ほぼ同時に保存」するケースは防げない。

### 楽観的ロックが解決すること

「同時に保存しようとした」ときの**データの上書き衝突（サイレントロスト）**を防ぐ。どれだけリアルタイムに画面を更新しても、送信タイミングが重なるケースはゼロにできない。

### 判断基準

| ケース | 対策 |
|---|---|
| コメント・ステータス変更などフィールドが独立している操作 | リアルタイム更新で十分 |
| タイトル・説明文などテキストをまるごと上書きする操作 | 楽観的ロックも入れると安全 |

### React アーキテクチャでの楽観的ロック実装方針

Rails 標準の `lock_version` カラムを使う。

- API レスポンスに `lock_version` を含める
- モーダルを開いた時点の `lock_version` を form state に固定する（TanStack Query のキャッシュ更新に引きずられないよう）
- PATCH 時に `lock_version` を body に含めて送る
- Rails が `ActiveRecord::StaleObjectError` を raise したら 409 を返す
- React 側で 409 を受けたら「他のユーザーが更新しました。再読み込みしてください。」と表示し、`invalidateQueries` で最新データを取得する

### 導入優先度

まず Solid Cable でリアルタイム更新を入れて、実運用で衝突が問題になったら楽観的ロックを追加する。

---

## 実装済み構成

- `solid_cable` gem（ActionCable バックエンド、PostgreSQL アダプター）
- `ProjectChannel` — プロジェクト単位で購読、admin ユーザーはグループ未所属でも購読可
- `Broadcastable` concern — Sprint / Story / Task / Comment の `after_commit` でブロードキャスト
- `useProjectChannel` フック — 接続状態（`connecting` / `connected` / `disconnected` / `rejected`）を管理
- `SyncIndicator` — 接続状態に応じた UI フィードバック
