# 認証 仕様書

## 概要

Devise + OmniAuth による認証。ローカル認証（email/username + password）と
OAuth 認証（GitHub / Google）の2系統。JWT は使用しない（セッション認証）。

## ファイル構成

```
app/models/user.rb
app/models/social_profile.rb
app/controllers/omniauth_callbacks_controller.rb
app/controllers/registrations_controller.rb
app/services/o_auth_service.rb
config/initializers/devise.rb
```

## ローカル認証

- Devise: `:database_authenticatable`, `:registerable`, `:recoverable`, `:rememberable`, `:validatable`
- **Authentication key: `:login`** → username または email どちらでもログイン可能
  - `User.find_for_database_authentication` をオーバーライドして両対応

```ruby
config.authentication_keys = [:login]
config.case_insensitive_keys = [:email]
```

## OAuth 認証（GitHub / Google）

フロー：
```
1. /users/auth/:provider → OmniAuth ミドルウェア
2. コールバック → OmniauthCallbacksController#callback_for_all_providers
3. OAuthService::GetOAuthUser.call(auth) で User 探索・作成
   a. SocialProfile.find_or_initialize_by(uid, provider)
   b. メール一致する既存 User を探索
   c. 見つからなければ User.new（仮メール: change@me-{uid}-{provider}.com）
4. email_verified? チェック
   - YES → sign_in_and_redirect
   - NO  → finish_signup_path（メール入力画面）
5. PATCH /users/:id/finish_signup でメール確定
```

## User モデル

- Rolify: `:developer`（登録時自動付与）/ `:admin`
- `after_create_commit :create_default_group` → username と同名のグループを自動作成
  - `skip_create_default_group = true` で OAuth 時スキップ可能
- Image: Active Storage + Identicon 生成
- `TEMP_EMAIL_REGEX` で仮メール判定（`change@me-` プレフィックス）

## SocialProfile

- OmniAuth データを永続化（uid, provider, name, email, image_url）
- 複数プロバイダーを同一 User に関連付け可能
- Provider ごとの差異は `OAuth::OAuthPolicy::{Provider}` で吸収

## ActionCable 認証

`app/channels/application_cable/connection.rb` で Devise セッションを参照：

```ruby
def find_verified_user
  user_id = env['warden']&.user&.id
  User.find_by(id: user_id) || reject_unauthorized_connection
end
```

## 環境変数

```
GITHUB_OAUTH_KEY
GITHUB_OAUTH_SECRET
GOOGLE_OAUTH_KEY
GOOGLE_OAUTH_SECRET
```

未設定の場合、OAuth ボタンは非表示になる。
