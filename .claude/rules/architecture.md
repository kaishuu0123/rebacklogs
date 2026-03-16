# Re:Backlogs — アーキテクチャ詳細

## ドメインモデル

```
Project
├── Sprint (反復期間、通常2週間)
│   ├── Story (< Ticket, STI) ─ バックログ単位
│   │   └── Task  (< Ticket, STI) ─ Story を細分化した作業
│   └── ...
├── ProjectTicketStatus (カスタムステータス、色付き)
├── ProjectTicketCategory (カスタムカテゴリ、色付き → Swimlane の色)
└── Tag / TagTicket
```

```
User ─── SocialProfile (OAuth)
     ─── GroupUser ─── Group ─── GroupProject ─── Project
     └── Role (Rolify + CanCanCan)
```

### Ticket STI の注意
```ruby
# Ticket (基底)
#   Story < Ticket
#   Task  < Ticket  (story_id は ticket_id カラム)

# ticket_number はプロジェクトスコープで自動採番
# 表示形式: "PREFIX-番号" (例: "PRJ-42")
ticket.ticket_number_with_ticket_prefix  # => "PRJ-42"
```

## ルーティング構造

```
/                          # projects#index (ルート)
/:ticket_number            # projects#show_with_ticket_number (例: /PRJ-42)

/projects/:id              # バックログ画面 (Vue: BacklogsPage)
/projects/:id/sprints/:id/kanban  # Kanban画面 (Vue: KanbanPage)
/projects/:id/closed_sprints      # 完了Sprint (Vue: ClosedSprintsPage)
/projects/:id/settings     # 設定 (Vue: ProjectSettingsPage)

# API エンドポイント (JSON only)
/projects/:id/sprints             # constraints: { format: :json }
/projects/:id/stories             # constraints: { format: :json }
/projects/:id/tasks               # constraints: { format: :json }
/projects/:id/api/closed_sprints  # closed sprints 一覧 API

/application_settings/            # 管理画面 (namespace)
/installer                        # 初期セットアップ
```

## Vue.js / フロントエンド構成

### Not SPA の設計
- 各ページは ERB テンプレートに Vue アプリをマウント
- `app/javascript/packs/` にページごとのエントリーポイント
- ページ間のルーティングは Rails (Turbolinks)
- ページ内のルーティングは Vue Router (モーダル開閉など)

### ディレクトリ
```
app/javascript/
├── packs/          # Webpackエントリーポイント (ページ単位)
├── pages/          # ページレベルの Vue コンポーネント
├── components/
│   ├── backlogs/   # バックログ画面用
│   ├── kanban/     # Kanban画面用
│   └── commons/    # 共通コンポーネント
├── stores/         # Vuex ストア
│   ├── backlogs.js
│   ├── kanban.js
│   ├── stories.js
│   ├── tasks.js
│   └── project_settings/
└── mixins/
    └── colorUtils.js  # 色処理 mixin (必ず使う)
```

### 色処理パターン (重要)
```javascript
// colorUtils.js mixin を import して使う
import ColorUtils from '../mixins/colorUtils'

// カテゴリ色に対して読みやすいテキスト色を返す (WCAG準拠)
this.idealTextColor(color)  // '#ffffff' or Color(color).darken(0.7).hex()

// カテゴリバッジのスタイル例
categoryBadgeStyle(story) {
  let Color = require('color');
  let color = story.project_ticket_category?.color || '#E2E3E5'
  return {
    "background-color": color,
    color: this.idealTextColor(color),
    border: `1px solid ${Color(color).darken(0.1)}`
  }
}
```

## Swimlane 構造

Kanban 画面のテーブル構造:
```
<table>
  <thead>
    <tr> <th>ステータス1</th> <th>ステータス2</th> ... </tr>
  </thead>
  <tbody v-for="story in stories">  ← Story が行 (Swimlane)
    <tr> Story タイトル行 </tr>
    <tr>
      <td v-for="status">           ← Status が列
        <VueDraggable>              ← Task をドラッグ可能
          <TaskCard v-for="task" />
        </VueDraggable>
      </td>
    </tr>
  </tbody>
</table>
```

## 認可 (CanCanCan + Rolify)

### ロール構成
- `:developer` — 一般ユーザー（登録時に付与）
- `:admin` — 全権限 (`can :manage, :all`)

### 認可フロー
```ruby
# ability.rb — デフォルトは全剥奪
cannot :manage, :all

# グループ経由の認可判定（プロジェクト操作の基本）
can :manage, Project, groups: { id: user.groups.pluck(:id) }
can :manage, Story do |ticket|
  (ticket.project.groups.pluck(:id) & user.groups.pluck(:id)).present?
end
```

- **Project に直接 user を紐付けない** — 必ず Group 経由
- public project は read 系のみ許可（`:developer` ユーザーでも）
- コントローラーで `authorize! :manage, @project` のように使う

## バックエンドパターン

### サービス層
- `app/services/` は `OAuthService::GetOAuthUser` のみ（実質未発達）
- ビジネスロジックは Controller / Model に直接記述されている
- OAuth ユーザー作成時: 仮メール (`TEMP_EMAIL_PREFIX`) + `save(validate: false)` で保存する特殊フローあり

### PaperTrail (変更履歴)
```ruby
# Ticket モデルで has_paper_trail
ticket.versions                          # 変更履歴
ticket.created_user_by                   # 作成者
ticket.last_updated_user_by              # 最終更新者
```

### 設定管理
`rails-settings-cached` gem でアプリ設定を DB 管理
`config/settings/` に環境別設定 YAML
