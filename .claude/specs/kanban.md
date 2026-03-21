# Kanban ページ 仕様書

## 概要

スプリント内のタスクを Swimlane Kanban で管理する画面。
行＝Story、列＝Status の二次元テーブル構造。

## ファイル構成

```
app/javascript/components/react/Kanban/
  index.tsx    # メインコンポーネント（KanbanInner）
  TaskCard.tsx # タスクカード
```

## テーブル構造

```
<table>
  <thead>
    <tr> <th>ステータス1</th> <th>ステータス2</th> ... </tr>
  </thead>
  <tbody> ← Story ごとに <tbody>
    <tr> Story ヘッダー行（タイトル・カテゴリ・プログレスバー・操作ボタン） </tr>
    <tr>
      <td> ← Status × Story のセル（DroppableCell）
        <SortableContext>
          <TaskCard> × n
        </SortableContext>
      </td>
    </tr>
  </tbody>
</table>
```

## D&D 設計

- `DroppableCell`: `useDroppable()` でドロップターゲット
- `SortableContext` + `verticalListSortingStrategy` で縦並びソート
- **同一セル内移動**: `arrayMove` でローカル順序変更
- **異なるセル間移動**: `project_ticket_status_id` と `story_id` を更新
- ドラッグ中はローカル状態を即時反映 → マウスアップで API 送信

## 状態管理

| state | 型 | 役割 |
|---|---|---|
| `localStories` | `Story[]` | D&D 用ローカルコピー |
| `activeTaskId` | `number \| null` | ドラッグ中のタスクID |
| `searchKeyword` | `string` | 検索フィルタ |
| `taskModalOpen` / `storyModalOpen` | `boolean` | モーダル開閉 |

## 検索フィルタ

Story 番号・タイトル・タグ、Task 番号・タイトル・担当者名で絞り込み。

## API

```
GET  /projects/:id/sprints/:sprint_id/kanban/api
  → Story[] (tasks・assignee・tags 含む)

GET  /projects/:id/project_ticket_statuses
  → TicketStatus[]

GET  /projects/:id/users
  → User[]

PATCH /projects/:id/tasks/:id
  body: { story_id, project_ticket_status_id, row_order_position }
```

## リアルタイム更新

`useProjectChannel(projectId)` → `task_updated` / `sprint_updated` 受信時に
`['kanban', projectId]` クエリを invalidate。

## 認可

- Public Project: 読み取り専用
- Private Project（Group 経由）: 全操作可
