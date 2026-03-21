# bin/ スクリプト一覧

Rails 標準コマンド（`rails`, `rake`, `bundle` 等）を除いた、プロジェクト独自スクリプトの説明。

## bin/bump_version

アプリバージョンを一括更新する。

```bash
bin/bump_version <version>
# 例: bin/bump_version 4.2.0
```

以下の2ファイルを同時に書き換える：
- `config/initializers/version.rb`
- `package.json`

## bin/generate_screenshots

README 用スクリーンショットを生成する。

```bash
bin/generate_screenshots
# APP_URL を指定する場合:
APP_URL=http://localhost:3000 bin/generate_screenshots
```

事前に `DEMO_MODE=true` でサーバーが起動している必要がある。
生成されるファイル: `screenshots/backlogs.png`, `screenshots/kanban.png`, `screenshots/theme_clean_slate.png`, `screenshots/theme_solar_dusk.png`

## bin/setup

開発環境の初期セットアップ。

```bash
bin/setup
```

## bin/dev

Rails サーバーを起動する（`bin/rails s` のショートカット）。

```bash
bin/dev
```
