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

## 地雷・注意点

### フロントエンド
- **React 18 + TypeScript** — turbo-mount でインタラクティブな島としてマウント
- **Not SPA** — Turbo Drive + 各ページ独立した React アプリ (entrypoints/ にエントリーポイント)
- JWT 不使用、普通のセッション認証 (意図的設計)

### データモデル
- `Story` と `Task` は `Ticket` の STI サブクラス
- `ticket_number` はプロジェクトスコープで連番 (`acts_as_sequenced`)
- ルーティングも `/stories` と `/tasks` で分離

### 色処理 (重要)
- カテゴリの背景色に応じてテキスト色を自動判定
- **必ず `app/javascript/components/react/shared/colorUtils.ts` の `idealTextColor()` を使うこと**
- WCAG コントラスト比ガイドライン 1.4.3 準拠

### DB
- dev/prod ともに PostgreSQL 18 で統一
- マイグレーション 20+ 件あり、スキーマ確認は `db/schema.rb`

### 認可 (CanCanCan)
- デフォルトは **`cannot :manage, :all`（全権限剥奪）** から始まる
- ロールは **`:developer`** と **`:admin`** の2種類のみ
- 認可はグループ経由: `User → GroupUser → Group → GroupProject → Project`
  - ユーザーが属するグループとプロジェクトが属するグループの**積集合**で判定
  - Project に直接 user を紐付けない設計
- public project は `:developer` でも read only（コメント作成は可）
- 詳細 → @.claude/rules/architecture.md

### フロントエンド — ERB vs React の切り分け原則（重要）

**ERB + Tailwind（サーバーレンダリング）で書くもの：**
- 静的・読み取り中心のページ（一覧、詳細、フォーム）
- SEO や初期表示パフォーマンスが重要な箇所
- 具体的: projects#index、devise 認証画面、application_settings、profiles、Kaminari ページネーション

**React（turbo-mount）で書くもの：**
- D&D、モーダル、リアルタイム更新など高インタラクションな島
- 具体的: BacklogsPage、KanbanPage、ProjectSettingsPage、ClosedSprintsPage、Header、ProjectSidebar

> Rails の SSR の恩恵（SEO・初期表示）を活かすため、サーバーで完結できるものは ERB に残す。
> React は「インタラクティブな島」としてのみ使う。

### テスト
- RSpec: model specs + request specs（69 examples）
- FactoryBot + Faker でテストデータ生成
- カバレッジは最小限 — 新機能追加時は対象モデル・エンドポイントのテストも書く

### その他
- Services 層は `OAuthService` のみ。ビジネスロジックは Controller/Model に直書き
- CI: GitHub Actions で Docker イメージを ghcr.io へビルド・プッシュ
- モダナイズ計画の完了記録 → `docs/modernize-history.md`
