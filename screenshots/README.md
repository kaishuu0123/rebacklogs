# Screenshots

README 用スクリーンショット（`screenshots/`）を自動生成するための仕組みです。

## ファイル構成

```
screenshots/
├── README.md               # このファイル
├── seed.rb                 # デモデータ投入スクリプト（べき等）
└── take_screenshots.mjs    # Playwright スクリーンショット撮影スクリプト
```

## 使い方

### 手順

**事前準備**（DB がまだセットアップされていない場合）

```bash
bundle exec rails db:create db:migrate
```

**ターミナル 1** — Vite dev サーバーを起動

```bash
bin/vite dev
```

**ターミナル 2** — Rails サーバーを起動（`DEMO_MODE=true` が必要）

```bash
DEMO_MODE=true bin/rails s
```

**ターミナル 3** — スクリーンショットを生成

```bash
bin/generate_screenshots
```

`bin/generate_screenshots` は内部で以下を順番に実行します：

1. `rails screenshots:seed` — デモデータを DB に投入
2. `node screenshots/take_screenshots.mjs` — Chromium でページを開きスクショを保存

出力先:

| ファイル | 内容 |
|---|---|
| `screenshots/backlogs.png` | バックログ画面（デフォルトテーマ） |
| `screenshots/kanban.png` | カンバン画面（デフォルトテーマ） |
| `screenshots/theme_clean_slate.png` | バックログ画面（Clean Slate テーマ） |
| `screenshots/theme_solar_dusk.png` | バックログ画面（Solar Dusk テーマ） |

### DB をリセットしてやり直す場合

```bash
bundle exec rails db:reset  # drop → create → migrate を一括実行

# その後、上記の手順 1〜3 を実行
```

### サーバーポートを変える場合

```bash
APP_URL=http://localhost:3001 bin/generate_screenshots
```

> **Note:** テーマスクショ（`theme_*.png`）は `DEMO_MODE=true` で起動したサーバーが必要です。
> `DEMO_MODE=true` にするとヘッダーにテーマピッカーボタンが表示されます。

### 個別実行

```bash
# データ投入だけ（べき等なので何度実行しても安全）
bundle exec rails screenshots:seed

# スクショ撮影だけ（seed 実行済みで tmp/screenshot_urls.json があること）
node screenshots/take_screenshots.mjs
```

## デモデータの内容

seed を実行すると以下のデータが作成されます（既存なら skip）。

| 種別 | 内容 |
|------|------|
| ユーザー | `admin@example.com` / `password`（admin権限）、`kaishuu0123@example.com` / `password` |
| プロジェクト | `Re:Backlogs`（ticket_prefix: `REEN`） |
| ステータス | New / In Progress / Resolved / Feedback / Done / Rejected |
| Sprint-1 | Can Create Public Project …、Deploy to Demo site |
| Sprint-2 | Add Link to Docs pages …、Can Add Tags to Ticket |
| Backlogs | Can View Ticket History ほか8件 |
| タスク | Sprint-1 の各ストーリーに Review & Merge、Implementation など |

## 注意事項

- `Setting.installed` が `false` の場合は seed 内で自動的に `true` に設定します
- Playwright の Chromium は初回セットアップが必要です

  ```bash
  # Chromium 本体のダウンロード
  yarn playwright install chromium

  # システム依存ライブラリのインストール（devcontainer / Linux 環境で必要）
  yarn playwright install-deps chromium
  ```
