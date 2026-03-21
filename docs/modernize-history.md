# Re:Backlogs — モダナイズ計画 完了記録

Vue 2 / Webpacker 構成から React + Vite 構成へのモダナイズ。2026-03-21 に全工程完了。

## 技術選定の決定事項

- Vue 2 → **React + TypeScript**
- Webpacker → **vite_rails**（React マウントは **turbo-mount**）
- UI ライブラリ → **shadcn/ui**（Tailwind CSS ベース）
- DB → **PostgreSQL に統一**（dev/test の SQLite を廃止）
- Linter/Formatter → **Biome**（ESLint + Prettier の代替）
- 状態管理 → **Jotai**（クライアント状態）+ **TanStack Query**（サーバー状態）
- ドラッグ&ドロップ → **dnd-kit**
- i18n → **i18next + react-i18next**（既存 `globals.json` の構造を流用）
- HTTP クライアント → **axios** 継続
- **Rails は継続**（Go への移行は見送り）
- インスタンスごとのブランドカラー設定機能を実装
  - CSS Custom Properties (`--primary` 等) を DB 設定で上書きする方式
  - ブランドカラー1色からテキスト色は `idealTextColor()` 相当で自動計算

## 完了した作業

### ① SQLite → PostgreSQL 統一
`database.yml` の dev/test 変更、`sqlite3` gem 削除

### ② vite_rails + turbo-mount 導入
Webpacker と一時並存させながら段階移行。Node.js を LTS (22.x) に更新

### ③ React + TypeScript + Tailwind + shadcn セットアップ
Biome も同時に導入

### ④ ページ単位で移行

**[ERB + Tailwind]**
- `projects/index.html.erb`
- `kaminari/_*.html.erb`（paginator, page, first/prev/next/last_page, gap）
- 認証系: devise/sessions, registrations, passwords, confirmations, omniauth_finished
- プロジェクト: projects/new, edit, _form
- プロフィール: profiles/index
- 管理画面: application_settings/dashboard, group_managements/\*, user_managements/\*
- セットアップ: installer/index, root/index

**[React]**
- BacklogsPage → `projects/show.html.erb`
- KanbanPage → `sprints/kanban.html.erb`
- ProjectSettingsPage → `projects/settings.html.erb`
- ClosedSprintsPage → `projects/closed_sprints.html.erb`

### ⑤ Webpacker・Bootstrap・Vue・sass-rails を削除
`public/packs/`、`config/webpacker.yml`、`bin/webpack-dev-server`、`app/assets/` も削除済み

### ⑥ ブランドカラー設定機能の実装
ThemePicker コンポーネント、`theme-presets-light.ts`、`theme_helper.rb` 等で実装済み

### ⑦ テストを整備
RSpec: model specs + request specs（69 examples 完了）
