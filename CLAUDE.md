# Re:Backlogs — CLAUDE.md

OSS プロジェクト管理ツール。Backlogs (redmine_backlogs) ライクな Swimlane Kanban が特徴。

詳細アーキテクチャ → @.claude/rules/architecture.md

## 技術スタック

| レイヤー | 技術 |
|---------|------|
| Backend | Ruby 3.3.1 / Rails 7.1.3 |
| Frontend | Vue.js **2** (Options API) / Vuex 3 / Bootstrap-Vue 2 |
| Build | Webpacker 5 (Vite ではない) |
| DB (dev) | SQLite3 |
| DB (prod) | PostgreSQL 16 |
| Auth | Devise + OmniAuth (GitHub / Google) + CanCanCan + Rolify |
| 変更履歴 | PaperTrail (Ticket 全体) |
| i18n | 英語・日本語対応 (`config/locales/`) |

## 開発起動手順

```bash
# ① gem インストール（vendor/ 以下に入る）
bundle install --path=vendor/bundle

# ② JS パッケージ
yarn install

# ③ DB セットアップ
bundle exec rails db:create db:migrate

# ④ 起動（ターミナル2つ必要）
bin/webpack-dev-server   # ターミナル 1
bin/rails s              # ターミナル 2
```

開発メール確認: `http://localhost:3000/letter_opener`

## 地雷・注意点

### Vue.js
- **Vue 2 確定** — Composition API / `<script setup>` は使えない
- **Not SPA** — Turbolinks + 各ページ独立した Vue アプリ (packs/ にエントリーポイント)
- JWT 不使用、普通のセッション認証 (意図的設計)

### データモデル
- `Story` と `Task` は `Ticket` の STI サブクラス
- `ticket_number` はプロジェクトスコープで連番 (`acts_as_sequenced`)
- ルーティングも `/stories` と `/tasks` で分離

### 色処理 (重要)
- カテゴリの背景色に応じてテキスト色を自動判定
- **必ず `colorUtils.js` の `idealTextColor()` mixin を使うこと**
- WCAG コントラスト比ガイドライン 1.4.3 準拠

### DB
- 開発: SQLite3 / 本番: PostgreSQL — 型やクエリの差異に注意
- マイグレーション 20+ 件あり、スキーマ確認は `db/schema.rb`

### 認可 (CanCanCan)
- デフォルトは **`cannot :manage, :all`（全権限剥奪）** から始まる
- ロールは **`:developer`** と **`:admin`** の2種類のみ
- 認可はグループ経由: `User → GroupUser → Group → GroupProject → Project`
  - ユーザーが属するグループとプロジェクトが属するグループの**積集合**で判定
  - Project に直接 user を紐付けない設計
- public project は `:developer` でも read only（コメント作成は可）
- 詳細 → @.claude/rules/architecture.md

### テスト
- **ほぼ全てスケルトン（空）** — 実際のアサーションが存在しない
- Fixtures は一式揃っているが使われていない
- 新機能追加時はテストをゼロから書く前提

### その他
- `bundle install --path=vendor/bundle` (vendor/bundle に gem が入る)
- Services 層は `OAuthService` のみ。ビジネスロジックは Controller/Model に直書き
- CI: GitHub Actions で Docker イメージを ghcr.io へビルド・プッシュ

## モダナイズ計画（決定済み）

以下の方針が確定している。作業時はこの順序を前提にすること。

### 技術選定の決定事項
- Vue 2 → **React + TypeScript**
- Webpacker → **vite_rails**（React マウントは **turbo-mount**）
- UI ライブラリ → **shadcn/ui**（Tailwind CSS ベース）
- DB → **PostgreSQL に統一**（dev/test の SQLite を廃止）
- Linter/Formatter → **Biome**（ESLint + Prettier の代替）
- **Rails は継続**（Go への移行は見送り）
- インスタンスごとのブランドカラー設定機能を実装予定
  - CSS Custom Properties (`--primary` 等) を DB 設定で上書きする方式
  - ブランドカラー1色からテキスト色は `idealTextColor()` 相当で自動計算

### 推奨する進め方（順序）

```
① SQLite → PostgreSQL 統一
    database.yml の dev/test 変更、sqlite3 gem 削除

② vite_rails + turbo-mount 導入
    Webpacker と一時並存させながら段階移行
    Node.js を LTS (22.x) に更新

③ React + TypeScript + Tailwind + shadcn セットアップ
    Biome も同時に導入

④ ページ単位で Vue → React に置き換え
    移行完了ページから Bootstrap を剥がす
    CSS 共存期間中はリセット系スタイルの干渉に注意

⑤ 全ページ移行完了後に Webpacker・Bootstrap・Vue を削除

⑥ ブランドカラー設定機能の実装

⑦ テストを整備（現状ほぼゼロのため）
```
