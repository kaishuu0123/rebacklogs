# Re:Backlogs — ロードマップ

実装予定の機能・改善タスク一覧。実装着手時は `.claude/specs/` に仕様書を作成してから進める。

## メンテナンス・品質改善

- ~~**RSpec カバレッジ拡充**~~ ✅ 完了（69 → 117 examples、Tasks/Comments/Statuses/Categories/Profiles/Groups/ApplicationSettings を追加、セキュリティバグ3件修正、2026-03-21）
- ~~**Vite チャンクサイズ警告の対応**~~ ✅ 完了（manualChunks で 11 チャンクに分割、警告解消、2026-03-21）

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
- ~~**リアルタイム通知（基本）**~~ ✅ 完了（Solid Cable + ActionCable + TanStack Query、SyncIndicator 表示、2026-03-21）
- **ハイライトフラッシュ** — 更新を受け取ったカード・行を一瞬光らせる。詳細計画 → `docs/highlight_flash_plan.md`
