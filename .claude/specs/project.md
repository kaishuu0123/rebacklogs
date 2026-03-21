# プロジェクト 仕様書

## 概要

プロジェクトは Re:Backlogs の中心エンティティ。
Sprint・Story・Task・Status・Category を束ねる。
アクセス制御は **Group 経由** で行い、Project に直接 User を紐付けない。

## ファイル構成

```
app/models/project.rb
app/controllers/projects_controller.rb
app/javascript/components/react/ProjectSettings/   # 設定画面（React）
```

## スキーマ

| カラム | 型 | 説明 |
|---|---|---|
| `title` | string | プロジェクト名 |
| `body` | text | 説明 |
| `ticket_prefix` | string | チケット番号プレフィックス（例: PRJ）。英字のみ・ユニーク |
| `is_public` | boolean | 公開プロジェクトかどうか |

## 作成フロー

```ruby
# ProjectsController#create
Transaction:
  1. project.save!
  2. GroupProject.create(group: current_user.groups.first)
     ← 作成者の default group に自動紐付け
  3. MasterTicketStatus.all → ProjectTicketStatus 一括作成
  4. MasterTicketCategory.all → ProjectTicketCategory 一括作成
```

## 認可設計（重要）

- `skip_authorization_check only: [:new, :create]` → ログイン済みなら誰でも作成可
- `load_and_authorize_resource` → show/edit/update/destroy は Group 経由でチェック
- Public Project: 誰でも read（`can :read, Project, is_public: true`）

**Group 経由のアクセス判定:**
```
User → GroupUser → Group → GroupProject → Project
権限あり ⟺ (project.groups.ids & user.groups.ids).present?
```

## API エンドポイント

```
GET    /projects                          # 一覧（Kaminari ページネーション）
GET    /projects/:id                      # Backlogs 画面（React マウント）
POST   /projects                          # 作成
PATCH  /projects/:id                      # 更新
GET    /projects/:id/settings             # 設定画面（React マウント）
GET    /projects/:id/users                # プロジェクト参加ユーザー一覧
GET    /projects/:id/groups               # 関連グループ一覧
POST   /projects/:id/add_group            # グループ追加
DELETE /projects/:id/delete_group         # グループ削除
DELETE /projects/:id/delete_image         # プロジェクト画像削除
GET    /projects/:id/project_tags         # タグ一覧
GET    /:ticket_number                    # チケット番号で直接アクセス（例: /PRJ-42）
```

## プロジェクト画像

- Active Storage で管理
- 未設定時は `InitialAvatar`（プロジェクト名のイニシャル）を生成
- `project_image_url()` ヘルパーで Base64 エンコード URL を返す

## ProjectTicketStatus / ProjectTicketCategory

- プロジェクト作成時に MasterTicketStatus / MasterTicketCategory からコピー
- プロジェクトごとに独立してカスタマイズ可能
- Category の `color` に対してテキスト色は `idealTextColor()` で自動判定（WCAG 1.4.3 準拠）
