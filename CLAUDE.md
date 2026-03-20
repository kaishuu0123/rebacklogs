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

# ④ 起動（ターミナル3つ必要 — Webpacker と Vite が並走中）
bin/webpack-dev-server   # ターミナル 1（既存 Vue ページ）
bin/vite dev             # ターミナル 2（React ページ / Header / Sidebar）
bin/rails s              # ターミナル 3
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
- 状態管理 → **Jotai**（クライアント状態）+ **TanStack Query**（サーバー状態）
- ドラッグ&ドロップ → **dnd-kit**
- i18n → **i18next + react-i18next**（既存 `globals.json` の構造を流用）
- HTTP クライアント → **axios** 継続（`app/javascript/commons/custom-axios.js` のインターセプターを React 用に移植）
- **Rails は継続**（Go への移行は見送り）
- インスタンスごとのブランドカラー設定機能を実装予定
  - CSS Custom Properties (`--primary` 等) を DB 設定で上書きする方式
  - ブランドカラー1色からテキスト色は `idealTextColor()` 相当で自動計算

### ERB vs React の切り分け原則（重要）

**ERB + Tailwind（サーバーレンダリング）で書くもの：**
- 静的・読み取り中心のページ（一覧、詳細、フォーム）
- SEO や初期表示パフォーマンスが重要な箇所
- 具体的: projects#index、devise 認証画面、application_settings、profiles、Kaminari ページネーション

**React（turbo-mount）で書くもの：**
- D&D、モーダル、リアルタイム更新など高インタラクションな島
- Vue を使っていた箇所（Backlogs、Kanban、Project Settings）
- 具体的: BacklogsPage、KanbanPage、ProjectSettingsPage、ClosedSprintsPage、Header、ProjectSidebar

> Rails の SSR の恩恵（SEO・初期表示）を活かすため、サーバーで完結できるものは ERB に残す。
> React は「インタラクティブな島」としてのみ使う。

### Bootstrap 共存期間中の CSS ルール（重要）

Tailwind v4 はユーティリティを `@layer utilities` に出力する。Bootstrap はレイヤーなしの CSS のため、CSS カスケードの優先度で **Bootstrap が Tailwind ユーティリティに常に勝つ**。

これを回避するため、**Tailwind を使うすべての要素（ERB ページ・React コンポーネント）は必ず `.react-root` クラスを付けること**。

`app/javascript/entrypoints/application.css` の Bootstrap 共存オーバーライドセクションが、`.react-root` スコープ内で `!important` を使って Bootstrap の同名クラスを上書きする。

```
ERB ページ  → 外側の div に class="react-root ..." を追加
React コンポーネント → ルート要素に className="react-root ..." を追加（Header, ProjectSidebar 参照）
```

⚠️ `.react-root` がない状態で Tailwind クラスを使っても Bootstrap に上書きされて効かない。

### 推奨する進め方（順序）

```
① SQLite → PostgreSQL 統一
    database.yml の dev/test 変更、sqlite3 gem 削除

② vite_rails + turbo-mount 導入
    Webpacker と一時並存させながら段階移行
    Node.js を LTS (22.x) に更新

③ React + TypeScript + Tailwind + shadcn セットアップ
    Biome も同時に導入

④ ページ単位で移行（ERB vs React の切り分け原則に従う）

    [ERB + Tailwind] Bootstrap クラスを Tailwind/shadcn に書き換え
      外側の div に class="react-root ..." を付けること（必須）
      ※ Vue コンテナ ERB（show/settings/closed_sprints/kanban）は React 化時に削除

      ✅ 完了（全ページ）
        projects/index.html.erb
        kaminari/_*.html.erb（paginator, page, first/prev/next/last_page, gap）
        認証系: devise/sessions, registrations, passwords, confirmations, omniauth_finished
        プロジェクト: projects/new, edit, _form
        プロフィール: profiles/index
        管理画面: application_settings/dashboard, group_managements/*, user_managements/*
        セットアップ: installer/index, root/index

    [React] Vue を使っているインタラクティブページを React に置き換え

      ✅ 完了（全ページ）
        BacklogsPage       → projects/show.html.erb
        KanbanPage         → sprints/kanban.html.erb
        ProjectSettingsPage → projects/settings.html.erb
        ClosedSprintsPage  → projects/closed_sprints.html.erb

⑤ 全ページ移行完了後に Webpacker・Bootstrap・Vue を削除

⑥ ブランドカラー設定機能の実装

✅ ⑦ テストを整備（RSpec: model specs + request specs、69 examples 完了）
```
