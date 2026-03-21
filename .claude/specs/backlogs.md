# Backlogs ページ 仕様書

## 概要

プロジェクト全体のスプリント一覧とバックログ（スプリント未割り当てストーリー）を管理する画面。
ストーリーをスプリント間でドラッグ&ドロップで移動できる。

## ファイル構成

```
app/javascript/components/react/Backlogs/
  index.tsx        # メインコンポーネント（BacklogsInner）
  SprintCard.tsx   # スプリント列カード
  BacklogsCard.tsx # バックログ列カード
  StoryListItem.tsx # ストーリー行
```

## レイアウト

2モード切り替え可能：
- `DEFAULT`: 2列グリッド（左：スプリント群、右：バックログ）
- `HORIZONTAL`: 横スクロール（スプリント＋バックログを左から右へ並べる）

## D&D 設計

- ライブラリ: `@dnd-kit/core` + `@dnd-kit/sortable`
- `PointerSensor` に `activationConstraint: { distance: 5 }` → 誤クリック防止
- `DragOverlay` でドラッグ中のゴースト表示（透過度・枠線）
- ドラッグ中は `localStories`（ローカル状態）を即時更新し、マウスアップで API 送信
- API 送信中（`isMutating`）は新しいドラッグを受け付けない

## 状態管理

| state | 型 | 役割 |
|---|---|---|
| `localStories` | `LocalStory[]` | D&D 用ローカルコピー（`localSprintId` を保持） |
| `activeId` | `number \| null` | ドラッグ中のストーリーID |
| `searchKeyword` | `string` | 検索フィルタ |
| `storyModalOpen` / `taskModalOpen` | `boolean` | モーダル開閉 |

## API

```
GET  /projects/:id/sprints
  → { sprints: Sprint[], storiesInBacklogs: Story[] }

PATCH /projects/:id/stories/:id
  body: { sprint_id: number | null, row_order_position: number }

POST  /projects/:id/sprints
  body: { title: string }

PATCH /projects/:id/sprints/:id
  body: { title?, start_datetime?, end_datetime?, closed? }
```

## リアルタイム更新

`useProjectChannel(projectId)` → `sprint_updated` / `task_updated` 受信時に
`['sprints', projectId]` クエリを invalidate。

## 認可

- Public Project: 読み取り専用（コメント作成は可）
- Private Project（Group 経由）: 全操作可
