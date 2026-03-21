# Application Settings 仕様書

## 概要

管理者専用の設定画面。`rails-settings-cached` gem で設定値を DB 管理。
**ENV 優先 → DB fallback** の設計方針。

## ファイル構成

```
app/controllers/application_settings/
  dashboard_controller.rb         # 一般設定
  user_managements_controller.rb  # ユーザー管理
  group_managements_controller.rb # グループ管理
app/models/setting.rb             # rails-settings-cached
app/views/application_settings/
```

## 設計方針

- ENV が設定済みの場合は GUI フィールドを `disabled` にして「環境変数で設定済みです (`REBACKLOGS_XXX`)」と表示
- ENV 未設定の場合は DB の値を使用

## 現在実装済みの設定

| キー | 説明 |
|---|---|
| `site_title` | サイトタイトル |
| `head_custom_script` | `<head>` 内カスタムスクリプト |
| `body_custom_script` | `<body>` 末尾カスタムスクリプト |
| `theme_name` | テーマ名（`clean_slate` / `solar_dusk` など） |

## ルーティング

```
GET  /application_settings                                        # dashboard#index
POST /application_settings                                        # dashboard#update
GET  /application_settings/user_managements                       # ユーザー一覧
PATCH /application_settings/user_managements/:id/update_role      # ロール変更
DELETE /application_settings/user_managements/:id/destroy_image   # 画像削除
GET  /application_settings/group_managements                      # グループ一覧
PATCH /application_settings/group_managements/:id/add_user        # ユーザー追加
DELETE /application_settings/group_managements/:id/remove_user/:user_id  # ユーザー削除
```

## 認可

- `:admin` ロールのみアクセス可（`ApplicationSettingsController` 基底クラスで制限）

## 拡張予定（ロードマップより）

- SMTP 設定（host / port / username / password / from）
- ユーザー登録制御（新規登録の許可/禁止）
- ファイルアップロード先（Local / PostgreSQL / AWS S3 / GCS）
- ファイルアップロード制限（最大サイズ・許可拡張子）
- セッションタイムアウト
- OAuth 個別 on/off（GitHub / Google）
- サイト名・外部 URL
