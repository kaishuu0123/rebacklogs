# Re:Backlogs — CLAUDE.md

OSS プロジェクト管理ツール。Backlogs (redmine_backlogs) ライクな Swimlane Kanban が特徴。

詳細アーキテクチャ → @.claude/rules/architecture.md
ロードマップ → @.claude/rules/roadmap.md
作業ログ（設計判断の経緯など）→ `docs/progress/`（日付別 Markdown）

## 技術スタック

| レイヤー | 技術 |
|---------|------|
| Backend | Ruby 3.4 / Rails 8.0 |
| Frontend | React 18 + TypeScript / shadcn/ui (Tailwind CSS v4) |
| 状態管理 | TanStack Query（サーバー状態）+ `useState` / `useRef`（ローカル状態）|
| Build | Vite (vite_rails) + turbo-mount |
| DB | PostgreSQL 18（dev/prod 統一） |
| Auth | Devise + OmniAuth (GitHub / Google) + CanCanCan + Rolify |
| 変更履歴 | PaperTrail (Ticket 全体) |
| i18n | 英語・日本語対応 (`config/locales/`) |

## 開発起動手順

```bash
# ① gem インストール
bundle install

# ② JS パッケージ
yarn install

# ③ DB セットアップ
bundle exec rails db:create db:migrate

# ④ 起動（ターミナル2つ）
bin/vite dev    # ターミナル 1
bin/rails s     # ターミナル 2
```

開発メール確認: `http://localhost:3000/letter_opener`

## 開発ルール

### ERB vs React の切り分け（重要）

| ERB + Tailwind | React（turbo-mount） |
|---|---|
| 静的・読み取り中心（一覧、フォーム、認証画面） | D&D・モーダル・リアルタイム更新など高インタラクション |
| projects#index、devise、application_settings、profiles | BacklogsPage、KanbanPage、ProjectSettingsPage、Header |

### 色処理（重要）
カテゴリ色に対するテキスト色は **必ず `colorUtils.ts` の `idealTextColor()` を使うこと**（WCAG 1.4.3 準拠）。

### 認可
- デフォルト `cannot :manage, :all` からスタート、ロールは `:developer` / `:admin` のみ
- Project へのアクセスは **必ず Group 経由**。Project に直接 User を紐付けない
- 詳細 → @.claude/rules/architecture.md、仕様 → `.claude/specs/`

### テスト
- RSpec: model specs + request specs。新機能追加時は対象モデル・エンドポイントのテストも書く

### その他
- Services 層は `OAuthService` のみ。ビジネスロジックは Controller/Model に直書き
- スキーマ確認は `db/schema.rb`
