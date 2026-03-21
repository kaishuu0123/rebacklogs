# ハイライトフラッシュ実装計画

更新を受け取ったカード・行を一瞬光らせてフェードアウトする。
Notion や Linear でよく見るパターン。

## 現状の課題

今の broadcast ペイロードは「どのアイテムが変わったか」を含んでいない。

```json
{ "event": "task_updated", "project_id": 54, "sprint_id": 5 }
```

`task_id` がないため「どのカードを光らせるか」が特定できない。

## 実装ステップ

### ① Backend: ペイロードに `id` を追加

`app/models/concerns/broadcastable.rb` の `build_payload` を修正。

```ruby
when Task
  { event: 'task_updated', project_id: project_id, sprint_id: sprint_id, id: id }
when Story
  { event: 'sprint_updated', project_id: project_id, id: id }
```

### ② Hook: `highlightedIds` を返す

`app/javascript/hooks/useProjectChannel.ts` を拡張。

- 受信した `id` を `Set<number>` に追加
- 一定時間（例: 2000ms）後に自動削除
- `lastReceivedAt` と並べて return

```typescript
const [highlightedIds, setHighlightedIds] = useState<Set<number>>(new Set());

// received 内で:
setHighlightedIds(prev => new Set(prev).add(data.id));
setTimeout(() => {
  setHighlightedIds(prev => {
    const next = new Set(prev);
    next.delete(data.id);
    return next;
  });
}, 2000);

return { lastReceivedAt, highlightedIds };
```

### ③ コンポーネント: `isHighlighted` を渡す

**Kanban:**
```
KanbanInner
  → テーブル行（story ループ）
    → TaskCard に isHighlighted={highlightedIds.has(task.id)}
```

**Backlogs:**
```
BacklogsInner
  → SprintCard に highlightedIds を渡す
    → StoryListItem に isHighlighted={highlightedIds.has(story.id)}
```

### ④ CSS: フラッシュアニメーション

Tailwind の `animate-pulse` でも可だが、一発光って消える動きなら keyframes の方がきれい。

```css
@keyframes highlight-flash {
  0%   { background-color: hsl(var(--primary) / 0.15); }
  100% { background-color: transparent; }
}
.animate-highlight {
  animation: highlight-flash 1.5s ease-out forwards;
}
```

カード側:
```tsx
<div className={isHighlighted ? 'animate-highlight' : ''}>
```

## 工数感

集中すれば 1〜2 時間。
スコープ: Task カード + Story 行（Comment は対象外でよい）。
