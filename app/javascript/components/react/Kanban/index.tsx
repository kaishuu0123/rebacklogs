import {
  DndContext,
  type DragEndEvent,
  type DragOverEvent,
  DragOverlay,
  PointerSensor,
  useDroppable,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import {
  QueryClient,
  QueryClientProvider,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { CircleUser, GripVertical, Plus } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Toaster, toast } from 'sonner';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '~/components/ui/tooltip';
import { useProjectChannel } from '~/hooks/useProjectChannel';
import api from '~/lib/api';
import { categoryBadgeStyle } from '../shared/colorUtils';
import SyncIndicator from '../shared/SyncIndicator';
import TicketModal from '../shared/TicketModal';
import type { Story, Task, TicketStatus, User } from '../shared/types';
import TaskCard from './TaskCard';

const queryClient = new QueryClient();

interface Props {
  projectId: string;
  projectTitle: string;
  sprintId: string;
  sprintTitle: string;
  isPublic: boolean;
}

export default function Kanban(props: Props) {
  return (
    <QueryClientProvider client={queryClient}>
      <Toaster position="top-right" />
      <KanbanInner {...props} />
    </QueryClientProvider>
  );
}

function KanbanInner({
  projectId,
  projectTitle,
  sprintId,
  sprintTitle,
  isPublic,
}: Props) {
  const { t } = useTranslation();
  const qc = useQueryClient();
  const { lastReceivedAt, connectionStatus } = useProjectChannel(projectId);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [taskModalOpen, setTaskModalOpen] = useState(false);
  const [taskModalAsEdit, setTaskModalAsEdit] = useState(false);
  const [storyModalOpen, setStoryModalOpen] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState<number | null>(null);
  const [selectedStoryId, setSelectedStoryId] = useState<number | null>(null);
  const [newTaskStoryId, setNewTaskStoryId] = useState<number | null>(null);
  const [activeTaskId, setActiveTaskId] = useState<number | null>(null);
  const [localStories, setLocalStories] = useState<Story[]>([]);
  const mutatingCount = useRef(0);
  const [isMutating, setIsMutating] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
  );

  const { data: stories = [] } = useQuery<Story[]>({
    queryKey: ['kanban', projectId, sprintId],
    queryFn: () =>
      api
        .get<Story[]>(`/projects/${projectId}/sprints/${sprintId}/kanban/api`)
        .then((r) => r.data),
  });

  const { data: statuses = [] } = useQuery<TicketStatus[]>({
    queryKey: ['ticketStatuses', projectId],
    queryFn: () =>
      api
        .get<TicketStatus[]>(`/projects/${projectId}/project_ticket_statuses`)
        .then((r) => r.data),
  });

  const { data: assignees = [] } = useQuery<User[]>({
    queryKey: ['assignees', projectId],
    queryFn: () =>
      api.get<User[]>(`/projects/${projectId}/users`).then((r) => r.data),
  });

  const updateTaskMutation = useMutation({
    mutationFn: (data: {
      taskId: number;
      storyId: number;
      statusId: number | null;
      newIndex: number;
    }) =>
      api.patch(`/projects/${projectId}/tasks/${data.taskId}`, {
        story_id: data.storyId,
        project_ticket_status_id: data.statusId,
        row_order_position: data.newIndex,
      }),
    onMutate: () => {
      mutatingCount.current += 1;
      setIsMutating(true);
    },
    onSuccess: async () => {
      try {
        await qc.invalidateQueries({ queryKey: ['kanban', projectId, sprintId] });
      } finally {
        mutatingCount.current -= 1;
        if (mutatingCount.current === 0) setIsMutating(false);
      }
    },
    onError: () => {
      mutatingCount.current -= 1;
      if (mutatingCount.current === 0) setIsMutating(false);
      toast.error(t('message.failedToMoveTask'));
    },
  });

  useEffect(() => {
    if (activeTaskId === null && !isMutating) setLocalStories(stories);
  }, [stories, activeTaskId, isMutating]);

  const filteredStories = searchKeyword
    ? localStories.filter((story) => {
        const q = searchKeyword.toLowerCase();
        return (
          story.ticket_number_with_ticket_prefix.toLowerCase().includes(q) ||
          story.title.toLowerCase().includes(q) ||
          (story.tags ?? []).some((t) => t.name.toLowerCase().includes(q)) ||
          (story.tasks ?? []).some(
            (task) =>
              task.ticket_number_with_ticket_prefix.toLowerCase().includes(q) ||
              task.title.toLowerCase().includes(q) ||
              (task.assignee?.username.toLowerCase().includes(q) ?? false),
          )
        );
      })
    : localStories;

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = Number(active.id);
    const overId = String(over.id);

    setLocalStories((prev) => {
      // Find source task and its story
      let sourceStoryId = -1;
      let sourceTask: Task | undefined;
      let sourceStatusId: number | null = null;
      for (const story of prev) {
        const task = (story.tasks ?? []).find((t) => t.id === activeId);
        if (task) {
          sourceStoryId = story.id;
          sourceTask = task;
          sourceStatusId = task.project_ticket_status_id;
          break;
        }
      }
      if (!sourceTask) return prev;

      let targetStoryId: number;
      let targetStatusId: number | null;
      let insertIndex: number;

      if (overId.startsWith('droppable-')) {
        const parts = overId.replace('droppable-', '').split('-');
        targetStoryId = Number(parts[0]);
        targetStatusId = parts[1] === 'null' ? null : Number(parts[1]);
        const targetStory = prev.find((s) => s.id === targetStoryId);
        insertIndex = (targetStory?.tasks ?? []).filter(
          (t) =>
            t.project_ticket_status_id === targetStatusId && t.id !== activeId,
        ).length;
      } else {
        const overTaskId = Number(overId);
        if (overTaskId === activeId) return prev;
        let targetStory: Story | undefined;
        let overTask: Task | undefined;
        for (const story of prev) {
          const task = (story.tasks ?? []).find((t) => t.id === overTaskId);
          if (task) {
            targetStory = story;
            overTask = task;
            break;
          }
        }
        if (!targetStory || !overTask) return prev;
        targetStoryId = targetStory.id;
        targetStatusId = overTask.project_ticket_status_id;
        // Same container — use arrayMove
        if (
          sourceStoryId === targetStoryId &&
          sourceStatusId === targetStatusId
        ) {
          const cellTasks = (targetStory.tasks ?? []).filter(
            (t) => t.project_ticket_status_id === targetStatusId,
          );
          const oldIdx = cellTasks.findIndex((t) => t.id === activeId);
          const newIdx = cellTasks.findIndex((t) => t.id === overTaskId);
          if (oldIdx === -1 || newIdx === -1 || oldIdx === newIdx) return prev;
          const reordered = arrayMove(cellTasks, oldIdx, newIdx);
          const otherTasks = (targetStory.tasks ?? []).filter(
            (t) => t.project_ticket_status_id !== targetStatusId,
          );
          return prev.map((s) =>
            s.id === targetStoryId
              ? { ...s, tasks: [...otherTasks, ...reordered] }
              : s,
          );
        }
        const tasksInCell = (targetStory.tasks ?? []).filter(
          (t) =>
            t.project_ticket_status_id === targetStatusId && t.id !== activeId,
        );
        insertIndex = tasksInCell.findIndex((t) => t.id === overTaskId);
        if (insertIndex === -1) insertIndex = tasksInCell.length;
      }

      // Same container — no move needed (droppable case)
      if (sourceStoryId === targetStoryId && sourceStatusId === targetStatusId)
        return prev;

      const movedTask = {
        ...sourceTask,
        project_ticket_status_id: targetStatusId,
        story_id: targetStoryId,
      };

      return prev.map((story) => {
        if (story.id === sourceStoryId && story.id === targetStoryId) {
          // Same story, cross-status
          const without = (story.tasks ?? []).filter((t) => t.id !== activeId);
          const inTarget = without.filter(
            (t) => t.project_ticket_status_id === targetStatusId,
          );
          const others = without.filter(
            (t) => t.project_ticket_status_id !== targetStatusId,
          );
          inTarget.splice(insertIndex, 0, movedTask);
          return { ...story, tasks: [...others, ...inTarget] };
        }
        if (story.id === sourceStoryId) {
          return {
            ...story,
            tasks: (story.tasks ?? []).filter((t) => t.id !== activeId),
          };
        }
        if (story.id === targetStoryId) {
          const without = (story.tasks ?? []).filter((t) => t.id !== activeId);
          const inTarget = without.filter(
            (t) => t.project_ticket_status_id === targetStatusId,
          );
          const others = without.filter(
            (t) => t.project_ticket_status_id !== targetStatusId,
          );
          inTarget.splice(insertIndex, 0, movedTask);
          return { ...story, tasks: [...others, ...inTarget] };
        }
        return story;
      });
    });
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active } = event;
    setActiveTaskId(null);

    const activeId = Number(active.id);
    for (const story of localStories) {
      const task = (story.tasks ?? []).find((t) => t.id === activeId);
      if (task) {
        const tasksInCell = (story.tasks ?? []).filter(
          (t) => t.project_ticket_status_id === task.project_ticket_status_id,
        );
        const newIndex = tasksInCell.findIndex((t) => t.id === activeId);
        updateTaskMutation.mutate({
          taskId: activeId,
          storyId: story.id,
          statusId: task.project_ticket_status_id,
          newIndex,
        });
        return;
      }
    }
  };

  // Use snapshot from drag start for DragOverlay (task data doesn't need to move)
  const allTasks = stories.flatMap((s) => s.tasks ?? []);
  const activeTask = activeTaskId
    ? allTasks.find((t) => t.id === activeTaskId)
    : undefined;

  return (
    <div className="w-full text-sm">
      {/* Top bar */}
      <div className="sticky top-0 z-10 flex items-center gap-3 bg-background px-4 py-3">
        <div className="flex min-w-0 items-center gap-1.5 text-sm">
          <a
            href={`/projects/${projectId}`}
            className="shrink-0 text-foreground hover:text-foreground"
          >
            {projectTitle}
          </a>
          <span className="text-muted-foreground/40">/</span>
          <h1 className="truncate font-semibold">{sprintTitle}</h1>
          {isPublic && (
            <span className="ml-1 shrink-0 rounded-full bg-blue-100 px-1.5 py-0.5 text-sm text-blue-800">
              {t('title.is_public')}
            </span>
          )}
        </div>
        <div className="ml-auto flex shrink-0 items-center gap-3">
          <SyncIndicator
            lastReceivedAt={lastReceivedAt}
            connectionStatus={connectionStatus}
          />
          <input
            type="text"
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
            placeholder={t('title.search')}
            className="h-8 rounded-md border border-border bg-background px-3 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          />
        </div>
      </div>

      {/* Kanban table */}
      <DndContext
        sensors={sensors}
        onDragStart={(e) => setActiveTaskId(Number(e.active.id))}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <div className="overflow-x-auto px-4">
          <div className="overflow-hidden rounded-md border">
            <table
              className="w-full border-collapse text-sm"
              style={{ tableLayout: 'fixed' }}
            >
              <thead>
                <tr className="bg-muted/30">
                  {statuses.map((status) => (
                    <th
                      key={status.id}
                      className="border-b border-r px-3 py-2 text-left text-sm font-medium text-muted-foreground last:border-r-0"
                    >
                      {status.title}
                    </th>
                  ))}
                </tr>
              </thead>
              {filteredStories.map((story) => (
                <StoryRows
                  key={story.id}
                  story={story}
                  statuses={statuses}
                  projectId={projectId}
                  assignees={assignees}
                  onOpenTaskModal={(taskId) => {
                    setSelectedTaskId(taskId);
                    setNewTaskStoryId(null);
                    setTaskModalAsEdit(false);
                    setTaskModalOpen(true);
                  }}
                  onOpenTaskModalAsEdit={(taskId) => {
                    setSelectedTaskId(taskId);
                    setNewTaskStoryId(null);
                    setTaskModalAsEdit(true);
                    setTaskModalOpen(true);
                  }}
                  onNewTask={(storyId) => {
                    setSelectedTaskId(null);
                    setNewTaskStoryId(storyId);
                    setTaskModalOpen(true);
                  }}
                  onOpenStoryModal={(storyId) => {
                    setSelectedStoryId(storyId);
                    setStoryModalOpen(true);
                  }}
                />
              ))}
            </table>
          </div>
        </div>

        <DragOverlay dropAnimation={null}>
          {activeTask && (
            <div className="mb-2 cursor-grabbing rounded border bg-card shadow-xl overflow-hidden opacity-95">
              <div className="px-2.5 py-2 space-y-1.5">
                {/* Row 1: handle + ticket number */}
                <div className="flex items-center gap-1">
                  <GripVertical
                    size={12}
                    className="text-muted-foreground/30"
                  />
                  <span className="rounded border border-border bg-background px-1 py-0.5 font-mono text-sm text-foreground">
                    {activeTask.ticket_number_with_ticket_prefix}
                  </span>
                </div>
                {/* Row 2: title */}
                <div className="text-sm leading-snug break-words">
                  {activeTask.is_done ? (
                    <s>{activeTask.title}</s>
                  ) : (
                    activeTask.title
                  )}
                </div>
                {/* Row 3: assignee */}
                <div className="flex justify-end">
                  {activeTask.assignee ? (
                    <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
                      {activeTask.assignee.image && (
                        <img
                          src={activeTask.assignee.image}
                          alt={activeTask.assignee.username}
                          width={24}
                          height={24}
                          className="rounded"
                        />
                      )}
                      {activeTask.assignee.username}
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
          )}
        </DragOverlay>
      </DndContext>

      <TicketModal
        open={taskModalOpen}
        onClose={() => {
          setTaskModalOpen(false);
          setSelectedTaskId(null);
          setNewTaskStoryId(null);
        }}
        projectId={projectId}
        ticketType="tasks"
        ticketId={selectedTaskId}
        storyId={newTaskStoryId}
        initialEdit={taskModalAsEdit}
        onSuccess={() =>
          qc.invalidateQueries({ queryKey: ['kanban', projectId, sprintId] })
        }
      />

      <TicketModal
        open={storyModalOpen}
        onClose={() => {
          setStoryModalOpen(false);
          setSelectedStoryId(null);
        }}
        projectId={projectId}
        ticketType="stories"
        ticketId={selectedStoryId}
        onSuccess={() =>
          qc.invalidateQueries({ queryKey: ['kanban', projectId, sprintId] })
        }
      />
    </div>
  );
}

function StoryRows({
  story,
  statuses,
  projectId,
  assignees,
  onOpenTaskModal,
  onOpenTaskModalAsEdit,
  onNewTask,
  onOpenStoryModal,
}: {
  story: Story;
  statuses: TicketStatus[];
  projectId: string;
  assignees: User[];
  onOpenTaskModal: (taskId: number) => void;
  onOpenTaskModalAsEdit: (taskId: number) => void;
  onNewTask: (storyId: number) => void;
  onOpenStoryModal: (storyId: number) => void;
}) {
  const { t } = useTranslation();
  const catColor = story.project_ticket_category?.color ?? null;
  const catBadgeStyle = catColor ? categoryBadgeStyle(catColor) : {};

  return (
    <tbody>
      {/* Story header row */}
      <tr>
        <td
          colSpan={statuses.length || 1}
          className="border-b px-3 py-2"
          style={
            catColor
              ? { borderLeft: `3px solid ${catColor}` }
              : { borderLeft: '3px solid transparent' }
          }
        >
          <div className="flex items-center gap-2">
            <TooltipProvider delayDuration={300}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    type="button"
                    onClick={() => onNewTask(story.id)}
                    className="flex h-6 w-6 shrink-0 cursor-pointer items-center justify-center rounded border border-primary text-primary hover:bg-primary/10"
                  >
                    <Plus size={12} />
                  </button>
                </TooltipTrigger>
                <TooltipContent>{t('action.addTask')}</TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <button
              type="button"
              onClick={() => onOpenStoryModal(story.id)}
              className="flex cursor-pointer items-center gap-1 text-left"
            >
              <span className="rounded border border-border bg-background px-1 py-0.5 font-mono text-sm text-foreground">
                {story.ticket_number_with_ticket_prefix}
              </span>
              {story.project_ticket_category && (
                <span
                  className="rounded px-1.5 py-0.5 text-sm font-medium"
                  style={catBadgeStyle}
                >
                  {story.project_ticket_category.title}
                </span>
              )}
              <span className="text-sm font-medium">
                {story.is_done ? <s>{story.title}</s> : story.title}
              </span>
            </button>
            <div className="ml-auto flex flex-wrap gap-1">
              {(story.tags ?? []).map((tag) => (
                <span
                  key={tag.id}
                  className="rounded border border-border bg-background px-1.5 py-0.5 text-sm"
                >
                  {tag.name}
                </span>
              ))}
            </div>
          </div>
        </td>
      </tr>
      {/* Tasks row */}
      <tr className="border-b">
        {statuses.map((status) => (
          <DroppableCell
            key={status.id}
            storyId={story.id}
            statusId={status.id}
            tasks={(story.tasks ?? []).filter(
              (t) => t.project_ticket_status_id === status.id,
            )}
            projectId={projectId}
            assignees={assignees}
            onOpenTaskModal={onOpenTaskModal}
            onOpenTaskModalAsEdit={onOpenTaskModalAsEdit}
          />
        ))}
      </tr>
    </tbody>
  );
}

function DroppableCell({
  storyId,
  statusId,
  tasks,
  projectId,
  assignees,
  onOpenTaskModal,
  onOpenTaskModalAsEdit,
}: {
  storyId: number;
  statusId: number;
  tasks: Task[];
  projectId: string;
  assignees: User[];
  onOpenTaskModal: (taskId: number) => void;
  onOpenTaskModalAsEdit: (taskId: number) => void;
}) {
  const { setNodeRef, isOver } = useDroppable({
    id: `droppable-${storyId}-${statusId}`,
  });

  return (
    <td
      ref={setNodeRef}
      className={`border-r px-1.5 py-2 align-top last:border-r-0 ${
        isOver ? 'bg-primary/5' : 'bg-background'
      }`}
    >
      <div className="min-h-[100px]">
        <SortableContext
          items={tasks.map((t) => t.id)}
          strategy={verticalListSortingStrategy}
        >
          {tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              projectId={projectId}
              assignees={assignees}
              onOpenModal={(_, taskId) => onOpenTaskModal(taskId)}
              onOpenModalAsEdit={(_, taskId) => onOpenTaskModalAsEdit(taskId)}
            />
          ))}
        </SortableContext>
      </div>
    </td>
  );
}
