# Re:Backlogs — ロードマップ

実装予定の機能・改善タスク一覧。実装着手時は `.claude/specs/` に仕様書を作成してから進める。

## メンテナンス・品質改善

- **RSpec カバレッジ拡充** — 現状 69 examples で最小限。新機能追加に合わせてカバレッジを増やす
- **Vite チャンクサイズ警告の対応** — ビルド時に 1MB 超チャンクが出ている。dynamic import や code splitting で分割

## 認証拡張

- **OIDC 対応** — OpenID Connect によるシングルサインオン。omniauth-openid-connect 等を検討
- **SAML 対応** — SAML 2.0 によるシングルサインオン。omniauth-saml 等を検討
- **LDAP 対応** — LDAP/Active Directory によるユーザー認証。devise_ldap_authenticatable 等を検討

## Application Settings 拡充

> **設計方針:** ENV 優先 → DB fallback。ENV が設定済みの場合は GUI フィールドを disabled にして「環境変数で設定済みです (`REBACKLOGS_XXX`)」と表示する。
> 詳細 → @.claude/rules/architecture.md

- **SMTP 設定** — host / port / username / password / from アドレスを GUI 設定可能にする（Devise メール送信に必要）
- **ユーザー登録制御** — 新規登録の許可/禁止（招待制モード）
- **ファイルアップロード先** — Local / PostgreSQL / AWS S3 / GCS を選択可能にする
- **ファイルアップロード制限** — 最大ファイルサイズ（MB）・許可拡張子ホワイトリスト
- **セッションタイムアウト** — セッション有効期間（分）の設定
- **OAuth 有効/無効** — GitHub / Google OAuth の個別 on/off
- **サイト名・外部 URL** — メール本文のリンク生成等に使用

## 新機能

- **プロジェクト作成時のボードタイプ選択** — 「Kanban」か「Swimlane」かをプロジェクト作成時に選択可能にする
- **リアルタイム通知** — Solid Cable + ActionCable + TanStack Query の invalidateQueries で実装（詳細: `docs/realtime_notifications.md`）
