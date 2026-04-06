import { useDroppable } from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Ban,
  CalendarCheck,
  Check,
  ChevronRight,
  DoorOpen,
  LayoutGrid,
  MoreHorizontal,
  Pencil,
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { DateRangePicker } from '~/components/ui/date-range-picker';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '~/components/ui/dropdown-menu';
import api from '~/lib/api';
import type { Sprint } from '../shared/types';
import StoryListItem from './StoryListItem';

interface Props {
  sprint: Sprint;
  projectId: string;
  searchKeyword: string;
  onOpenStoryModal: (storyId: number) => void;
  activeId: number | null;
}

export default function SprintCard({
  sprint,
  projectId,
  searchKeyword,
  onOpenStoryModal,
  activeId,
}: Props) {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const [isEdit, setIsEdit] = useState(false);
  const [title, setTitle] = useState(sprint.title);
  const [dateRange, setDateRange] = useState({
    from: sprint.start_datetime
      ? sprint.start_datetime.substring(0, 10)
      : (null as string | null),
    to: sprint.end_datetime
      ? sprint.end_datetime.substring(0, 10)
      : (null as string | null),
  });
  const titleRef = useRef<HTMLInputElement>(null);

  const { setNodeRef } = useDroppable({ id: `sprint-${sprint.id}` });

  useEffect(() => {
    setTitle(sprint.title);
    setDateRange({
      from: sprint.start_datetime
        ? sprint.start_datetime.substring(0, 10)
        : null,
      to: sprint.end_datetime ? sprint.end_datetime.substring(0, 10) : null,
    });
  }, [sprint]);

  const updateMutation = useMutation({
    mutationFn: (data: object) =>
      api.put(`/projects/${projectId}/sprints/${sprint.id}`, data),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ['sprints', projectId] }),
    onError: () => toast.error(t('message.failedToUpdateSprint')),
  });

  const closeMutation = useMutation({
    mutationFn: () =>
      api.patch(`/projects/${projectId}/sprints/${sprint.id}`, {
        closed: true,
      }),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ['sprints', projectId] }),
    onError: () => toast.error(t('message.failedToCloseSprint')),
  });

  const openMutation = useMutation({
    mutationFn: () =>
      api.patch(`/projects/${projectId}/sprints/${sprint.id}`, {
        closed: false,
      }),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ['sprints', projectId] }),
    onError: () => toast.error(t('message.failedToOpenSprint')),
  });

  const editDone = (save: boolean) => {
    setIsEdit(false);
    if (save) {
      updateMutation.mutate({
        title,
        start_datetime: dateRange.from || null,
        end_datetime: dateRange.to || null,
      });
    } else {
      setTitle(sprint.title);
      setDateRange({
        from: sprint.start_datetime
          ? sprint.start_datetime.substring(0, 10)
          : null,
        to: sprint.end_datetime ? sprint.end_datetime.substring(0, 10) : null,
      });
    }
  };

  const filteredStories = searchKeyword
    ? sprint.stories.filter((s) => {
        const q = searchKeyword.toLowerCase();
        return (
          s.ticket_number_with_ticket_prefix.toLowerCase().includes(q) ||
          s.title.toLowerCase().includes(q) ||
          (s.tags ?? []).some((t) => t.name.toLowerCase().includes(q))
        );
      })
    : sprint.stories;

  const doneCount = sprint.stories.filter((s) => s.is_done).length;
  const totalCount = sprint.stories.length;
  const progressPct = totalCount > 0 ? (doneCount / totalCount) * 100 : 0;
  const totalPoints = sprint.stories.reduce(
    (acc, s) => acc + (s.point ?? 0),
    0,
  );

  const progressColor =
    progressPct === 100
      ? 'bg-green-500'
      : progressPct >= 50
        ? 'bg-blue-500'
        : 'bg-amber-400';

  const formatDate = (d: string | null) => {
    if (!d) return '';
    return new Date(d).toLocaleDateString('en-ZA');
  };

  return (
    <div
      className={`rounded-md border bg-card shadow-sm text-sm ${sprint.closed ? 'opacity-70' : ''}`}
    >
      {isEdit ? (
        <div className="border-b px-3 py-2">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              editDone(true);
            }}
            className="space-y-2"
          >
            <input
              ref={titleRef}
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="h-8 w-full rounded-md border border-input bg-background px-3 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            />
            <DateRangePicker
              from={dateRange.from}
              to={dateRange.to}
              onChange={(from, to) => setDateRange({ from, to })}
            />
            <div className="flex justify-end gap-1">
              <button
                type="submit"
                className="inline-flex items-center gap-1 h-7 cursor-pointer rounded bg-primary px-2 text-xs font-medium text-primary-foreground"
              >
                <Check size={14} /> {t('action.save')}
              </button>
              <button
                type="button"
                onClick={() => editDone(false)}
                className="inline-flex items-center gap-1 h-7 cursor-pointer rounded border border-input bg-background px-2 text-xs"
              >
                <Ban size={14} /> {t('action.cancel')}
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div className="flex items-center justify-between gap-2 border-b px-3 py-2">
          <div className="group/sprint-title flex min-w-0 items-center gap-2">
            <span className="font-semibold truncate">{sprint.title}</span>
            {sprint.start_datetime ? (
              <span className="inline-flex items-center gap-0.5 text-xs text-muted-foreground shrink-0">
                {formatDate(sprint.start_datetime)}
                <ChevronRight size={12} />
                {formatDate(sprint.end_datetime)}
              </span>
            ) : (
              <span className="text-xs text-muted-foreground shrink-0">
                {t('message.noPeriodSpecified')}
              </span>
            )}
            {!sprint.closed && (
              <button
                type="button"
                onClick={() => {
                  setIsEdit(true);
                  setTimeout(() => titleRef.current?.focus(), 50);
                }}
                className="shrink-0 cursor-pointer opacity-0 transition-opacity group-hover/sprint-title:opacity-40 hover:!opacity-100"
              >
                <Pencil size={14} />
              </button>
            )}
          </div>
          <div className="flex shrink-0 items-center gap-1">
            <a
              href={`/projects/${projectId}/sprints/${sprint.id}/kanban`}
              className="inline-flex h-7 w-7 items-center justify-center rounded text-muted-foreground hover:bg-accent hover:text-foreground"
            >
              <LayoutGrid size={16} />
            </a>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  className="shrink-0 inline-flex h-7 w-7 items-center justify-center rounded text-muted-foreground hover:bg-accent hover:text-foreground"
                >
                  <MoreHorizontal size={16} />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                  <a
                    href={`/projects/${projectId}/sprints/${sprint.id}/kanban`}
                    className="inline-flex items-center gap-2"
                  >
                    <LayoutGrid size={14} />
                    {t('action.viewKanban')}
                  </a>
                </DropdownMenuItem>
                {!sprint.closed && (
                  <>
                    <DropdownMenuItem
                      onClick={() => {
                        setIsEdit(true);
                        setTimeout(() => titleRef.current?.focus(), 50);
                      }}
                    >
                      <Pencil size={14} />
                      {t('action.editSprint')}
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => closeMutation.mutate()}>
                      <CalendarCheck size={14} />
                      {t('action.closeSprint')}
                    </DropdownMenuItem>
                  </>
                )}
                {sprint.closed && (
                  <DropdownMenuItem onClick={() => openMutation.mutate()}>
                    <DoorOpen size={14} />
                    {t('action.openSprint')}
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      )}

      <ul
        ref={setNodeRef}
        className={`divide-y${filteredStories.length === 0 ? ' min-h-[48px]' : ''}`}
      >
        <SortableContext
          items={sprint.stories.map((s) => s.id)}
          strategy={verticalListSortingStrategy}
        >
          {filteredStories.map((story) => (
            <StoryListItem
              key={story.id}
              story={story}
              projectId={projectId}
              onOpenModal={onOpenStoryModal}
              isDraggingActive={activeId === story.id}
            />
          ))}
        </SortableContext>
        {sprint.stories.length === 0 && (
          <li className="flex flex-col items-center justify-center gap-1 px-3 py-6 text-xs text-muted-foreground border-2 border-dashed border-muted m-2 rounded-md">
            <span>{t('message.storyDoesNotExistsInSprint')}</span>
          </li>
        )}
      </ul>

      {sprint.stories.length > 0 && (
        <div className="border-t bg-muted/20 px-3 py-2 text-xs">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-muted-foreground">
              {t('title.progress')}{' '}
              <span className="font-medium text-foreground">
                {doneCount} / {totalCount} ({Math.round(progressPct)}%)
              </span>
            </span>
            <span className="text-muted-foreground">
              {t('title.totalStoryPoints')}{' '}
              <span className="font-medium text-foreground">
                {totalPoints.toFixed(1)} {t('title.points')}
              </span>
            </span>
          </div>
          <div className="h-2 w-full rounded-full bg-muted">
            <div
              className={`h-2 rounded-full transition-all ${progressColor}`}
              style={{ width: `${progressPct}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
