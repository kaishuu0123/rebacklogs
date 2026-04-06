import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { CircleUser, GripVertical, Pencil } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import type { Task, User } from '../shared/types';

interface Props {
  task: Task;
  projectId: string;
  onOpenModal: (storyId: number, taskId: number) => void;
  onOpenModalAsEdit: (storyId: number, taskId: number) => void;
  assignees: User[];
}

export default function TaskCard({
  task,
  onOpenModal,
  onOpenModalAsEdit,
}: Props) {
  const { t } = useTranslation();
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  if (isDragging) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className="mb-2 rounded border-2 border-dashed border-primary/30 bg-primary/5 overflow-hidden"
      >
        <div className="px-2.5 py-2 space-y-1.5 invisible">
          <div className="font-mono text-sm">
            {task.ticket_number_with_ticket_prefix}
          </div>
          <div className="text-sm leading-snug break-words">{task.title}</div>
          <div className="text-sm">-</div>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="group/card mb-2 cursor-grab rounded border bg-card shadow-md overflow-hidden"
    >
      <div className="px-2.5 py-2">
        {/* Row 1: handle + ticket number + pencil */}
        <div className="flex items-center gap-1">
          <GripVertical size={14} className="text-muted-foreground/30" />
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onOpenModal(task.story_id, task.id);
            }}
            onPointerDown={(e) => e.stopPropagation()}
            className="cursor-pointer rounded border border-border bg-background px-1 py-0.5 font-mono text-sm text-foreground"
          >
            {task.ticket_number_with_ticket_prefix}
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onOpenModalAsEdit(task.story_id, task.id);
            }}
            onPointerDown={(e) => e.stopPropagation()}
            className="ml-auto cursor-pointer opacity-0 transition-opacity group-hover/card:opacity-40 hover:!opacity-100"
          >
            <Pencil size={14} />
          </button>
        </div>
        {/* Row 2: title */}
        <div className="mt-2 text-sm leading-snug break-words">
          {task.is_done ? <s>{task.title}</s> : task.title}
        </div>
        {/* Row 3: assignee */}
        <div className="mt-1.5 flex justify-end">
          {task.assignee ? (
            <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
              {task.assignee.image && (
                <img
                  src={task.assignee.image}
                  alt={task.assignee.username}
                  width={24}
                  height={24}
                  className="rounded"
                />
              )}
              {task.assignee.username}
            </span>
          ) : (
            <span className="flex items-center gap-1.5 text-sm text-muted-foreground/50">
              <CircleUser size={16} className="opacity-40" />
              {t('title.unassigned')}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
