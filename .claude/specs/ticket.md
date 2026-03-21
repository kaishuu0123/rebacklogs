# Ticket（Story / Task）仕様書

## 概要

Story と Task は `Ticket` の STI（単一テーブル継承）サブクラス。
`tickets` テーブルの `type` カラムで判別。

## クラス構造

```ruby
class Ticket < ApplicationRecord
  # 基底クラス

class Story < Ticket
  belongs_to :sprint, optional: true
  belongs_to :project_ticket_category, optional: true
  has_many :tasks, foreign_key: :ticket_id
  ranks :row_order, with_same: [:project_id, :sprint_id]

class Task < Ticket
  belongs_to :story, foreign_key: :ticket_id
  alias_attribute :story_id, :ticket_id
  ranks :row_order, with_same: [:ticket_id, :project_ticket_status_id]
```

## スキーマ（tickets テーブル）

| カラム | 説明 |
|---|---|
| `type` | `'Story'` または `'Task'` |
| `ticket_number` | プロジェクト内の連番（`sequenced` gem）|
| `title` | タイトル |
| `body` | 本文 |
| `point` | ストーリーポイント（float）|
| `is_done` | 完了フラグ |
| `project_id` | 所属プロジェクト |
| `sprint_id` | 所属スプリント（Story のみ有効）|
| `ticket_id` | 親 Story の ID（Task のみ有効）|
| `project_ticket_status_id` | ステータス |
| `project_ticket_category_id` | カテゴリ（Story のみ有効）|
| `assignee_id` | 担当者 |
| `sort_order` | 表示順（`ranked-model` gem）|

## ticket_number（採番）

- `sequenced` gem でプロジェクトスコープの連番
- 表示形式: `"#{project.ticket_prefix}-#{ticket_number}"` (例: `PRJ-42`)
- メソッド: `ticket.ticket_number_with_ticket_prefix`

## 順序管理（ranked-model）

- Story: `with_same: [:project_id, :sprint_id]` → スプリント内での順序
- Task: `with_same: [:ticket_id, :project_ticket_status_id]` → セル内での順序
- D&D 時: `row_order_position` パラメータで更新

## is_done 更新ロジック

```ruby
# Ticket（status 変更時に before_validation で実行）
self.is_done = project_ticket_status.is_done

# Story（Task 更新後に実行）
is_done = status.is_done || (tasks.all?(&:is_done) && tasks.count > 0)
# ← Task が全て完了したら Story も完了
```

## API エンドポイント

ルーティングは `resources :stories` / `resources :tasks` で分離、
コントローラーは共通の `TicketsController`。
`type:` ルートパラメータで STI クラスを判別。

```
POST   /projects/:id/stories           # Story 作成
POST   /projects/:id/tasks             # Task 作成
PATCH  /projects/:id/stories/:id       # Story 更新
PATCH  /projects/:id/tasks/:id         # Task 更新
DELETE /projects/:id/stories/:id       # Story 削除
DELETE /projects/:id/tasks/:id         # Task 削除
```

## Strong Parameters

`wrap_parameters false` を設定済み（`:ticket` ラップを無効化）。

許可パラメータ:
```ruby
params.permit(
  :title, :body, :project_id, :sprint_id, :row_order_position,
  :story_id, :project_ticket_status_id, :project_ticket_category_id,
  :assignee_id, :point, tags: [:id, :name, :project_id]
)
```

## 変更履歴（PaperTrail）

- `has_paper_trail` で全変更を `versions` テーブルに記録
- `ticket.created_user_by` / `ticket.last_updated_user_by` で作成者・更新者取得

## リアルタイム通知（Broadcastable）

Story / Task 保存後（`after_commit`）に ActionCable で broadcast:
- Story: `{ event: 'sprint_updated', project_id: ... }`
- Task: `{ event: 'task_updated', project_id: ..., sprint_id: ... }`
