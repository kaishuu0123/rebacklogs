import {
  DndContext,
  type DragEndEvent,
  type DragOverEvent,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';
import {
  QueryClient,
  QueryClientProvider,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { Info } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Toaster, toast } from 'sonner';
import api from '~/lib/api';
import TicketModal from '../shared/TicketModal';
import type { BacklogsData, Story } from '../shared/types';
import BacklogsCard from './BacklogsCard';
import SprintCard from './SprintCard';

const queryClient = new QueryClient();

interface Props {
  projectId: string;
  projectTitle: string;
  isPublic: boolean;
}

export default function Backlogs(props: Props) {
  return (
    <QueryClientProvider client={queryClient}>
      <Toaster position="top-right" />
      <BacklogsInner {...props} />
    </QueryClientProvider>
  );
}

type Layout = 'DEFAULT' | 'HORIZONTAL';
type LocalStory = Story & { localSprintId: number | null };

function BacklogsInner({ projectId, projectTitle, isPublic }: Props) {
  const { t } = useTranslation();
  const qc = useQueryClient();
  const [searchKeyword, setSearchKeyword] = useState('');
  const [layout, setLayout] = useState<Layout>('DEFAULT');
  const [storyModalOpen, setStoryModalOpen] = useState(false);
  const [selectedStoryId, setSelectedStoryId] = useState<number | null>(null);
  const [activeId, setActiveId] = useState<number | null>(null);
  const [dragWidth, setDragWidth] = useState<number | null>(null);
  const [localStories, setLocalStories] = useState<LocalStory[]>([]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
  );

  const { data } = useQuery<BacklogsData>({
    queryKey: ['sprints', projectId],
    queryFn: () =>
      api
        .get<BacklogsData>(`/projects/${projectId}/sprints`)
        .then((r) => r.data),
  });

  const sprints = data?.sprints ?? [];
  const storiesInBacklogs = data?.storiesInBacklogs ?? [];

  // Sync local state from server (skip during active drag)
  useEffect(() => {
    if (activeId) return;
    setLocalStories([
      ...sprints.flatMap((s) =>
        s.stories.map((story) => ({ ...story, localSprintId: s.id })),
      ),
      ...storiesInBacklogs.map((story) => ({
        ...story,
        localSprintId: null,
      })),
    ]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sprints, storiesInBacklogs, activeId]);

  // Derive ordered stories per sprint/backlog from local state
  const localSprintsStories = (sprintId: number) =>
    localStories.filter((s) => s.localSprintId === sprintId);
  const localBacklogStories = localStories.filter(
    (s) => s.localSprintId === null,
  );

  const openStoryModal = (storyId: number) => {
    setSelectedStoryId(storyId);
    setStoryModalOpen(true);
  };

  const openNewStory = (_sprintId: number | null = null) => {
    setSelectedStoryId(null);
    setStoryModalOpen(true);
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeStoryId = Number(active.id);
    const overId = String(over.id);

    const activeIdx = localStories.findIndex((s) => s.id === activeStoryId);
    if (activeIdx === -1) return;

    if (overId.startsWith('sprint-')) {
      // Dropped over a container
      const sprintIdStr = overId.replace('sprint-', '');
      const targetSprintId =
        sprintIdStr === 'null' ? null : Number(sprintIdStr);

      if (localStories[activeIdx].localSprintId === targetSprintId) return;

      setLocalStories((prev) => {
        const next = [...prev];
        next[activeIdx] = { ...next[activeIdx], localSprintId: targetSprintId };
        return next;
      });
    } else {
      // Dropped over another story
      const overStoryId = Number(over.id);
      const overIdx = localStories.findIndex((s) => s.id === overStoryId);
      if (overIdx === -1 || activeIdx === overIdx) return;

      const targetSprintId = localStories[overIdx].localSprintId;

      setLocalStories((prev) => {
        const next = prev.map((s, i) =>
          i === activeIdx ? { ...s, localSprintId: targetSprintId } : s,
        );
        return arrayMove(next, activeIdx, overIdx);
      });
    }
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active } = event;
    const storyId = Number(active.id);
    setActiveId(null);
    setDragWidth(null);

    const story = localStories.find((s) => s.id === storyId);
    if (!story) return;

    const targetSprintId = story.localSprintId;
    const storiesInTarget = localStories.filter(
      (s) => s.localSprintId === targetSprintId,
    );
    const newIndex = storiesInTarget.findIndex((s) => s.id === storyId);

    try {
      await api.patch(`/projects/${projectId}/stories/${storyId}`, {
        sprint_id: targetSprintId,
        row_order_position: newIndex,
      });
      qc.invalidateQueries({ queryKey: ['sprints', projectId] });
    } catch {
      toast.error(t('message.failedToMoveStory'));
    }
  };

  const activeStory = localStories.find((s) => s.id === activeId);

  return (
    <div className="w-full text-sm">
      {/* Top bar */}
      <div className="sticky top-0 z-10 flex items-center gap-3 bg-background px-4 py-3">
        <div className="flex min-w-0 items-center gap-1.5 text-sm">
          <span className="shrink-0 text-muted-foreground">{projectTitle}</span>
          <span className="text-muted-foreground/40">/</span>
          <h1 className="truncate font-semibold">
            {t('title.masterBacklogs')}
          </h1>
          {isPublic && (
            <span className="ml-1 shrink-0 rounded-full bg-blue-100 px-1.5 py-0.5 text-xs text-blue-800">
              {t('title.is_public')}
            </span>
          )}
        </div>
        <div className="ml-auto flex shrink-0 items-center gap-2">
          <input
            type="text"
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
            placeholder={t('title.search')}
            className="h-8 rounded-md border border-input bg-background px-3 placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          />
          <div className="flex rounded-md border border-input">
            {(['DEFAULT', 'HORIZONTAL'] as Layout[]).map((l) => (
              <button
                key={l}
                type="button"
                onClick={() => setLayout(l)}
                className={`px-3 py-1 text-xs ${
                  layout === l
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-background text-muted-foreground hover:bg-accent'
                } first:rounded-l-md last:rounded-r-md`}
              >
                {l === 'DEFAULT' ? t('title.default') : t('title.horizontal')}
              </button>
            ))}
          </div>
        </div>
      </div>
      <div className="space-y-4 px-4">
        <DndContext
          sensors={sensors}
          onDragStart={(e) => {
            setActiveId(Number(e.active.id));
            setDragWidth(e.active.rect.current.initial?.width ?? null);
          }}
          onDragOver={handleDragOver}
          onDragEnd={handleDragEnd}
        >
          {layout === 'HORIZONTAL' ? (
            <div className="flex gap-6 overflow-x-auto pb-4">
              <div className="min-w-[380px]">
                <BacklogsCard
                  stories={localBacklogStories}
                  projectId={projectId}
                  searchKeyword={searchKeyword}
                  onOpenStoryModal={openStoryModal}
                  onNewStory={() => openNewStory(null)}
                  activeId={activeId}
                />
              </div>
              {sprints.map((sprint) => (
                <div key={sprint.id} className="min-w-[380px]">
                  <SprintCard
                    sprint={{
                      ...sprint,
                      stories: localSprintsStories(sprint.id),
                    }}
                    projectId={projectId}
                    searchKeyword={searchKeyword}
                    onOpenStoryModal={openStoryModal}
                    activeId={activeId}
                  />
                </div>
              ))}
              {sprints.length === 0 && (
                <div className="inline-flex items-center gap-1 min-w-[380px] justify-center rounded-md border border-dashed bg-muted/20 p-6 text-muted-foreground">
                  <Info size={16} /> {t('message.sprintDoesNotExists')}
                </div>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                {sprints.length > 0 ? (
                  sprints.map((sprint) => (
                    <SprintCard
                      key={sprint.id}
                      sprint={{
                        ...sprint,
                        stories: localSprintsStories(sprint.id),
                      }}
                      projectId={projectId}
                      searchKeyword={searchKeyword}
                      onOpenStoryModal={openStoryModal}
                      activeId={activeId}
                    />
                  ))
                ) : (
                  <div className="inline-flex items-center gap-1 rounded-md border border-dashed bg-muted/20 p-6 text-xs text-muted-foreground">
                    <Info size={16} /> {t('message.sprintDoesNotExists')}
                  </div>
                )}
              </div>
              <div>
                <BacklogsCard
                  stories={localBacklogStories}
                  projectId={projectId}
                  searchKeyword={searchKeyword}
                  onOpenStoryModal={openStoryModal}
                  onNewStory={() => openNewStory(null)}
                  activeId={activeId}
                />
              </div>
            </div>
          )}

          <DragOverlay dropAnimation={null}>
            {activeStory && (
              <div
                style={{ width: dragWidth ?? undefined }}
                className="flex items-center gap-2 rounded-md border-2 border-primary bg-white px-2 py-1.5 shadow-lg opacity-90 cursor-grabbing overflow-hidden"
              >
                <span className="shrink-0 rounded border border-gray-300 bg-gray-100 px-1 py-0.5 font-mono text-xs">
                  {activeStory.ticket_number_with_ticket_prefix}
                </span>
                <span className="font-medium text-gray-900 truncate">
                  {activeStory.title}
                </span>
              </div>
            )}
          </DragOverlay>
        </DndContext>

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
            qc.invalidateQueries({ queryKey: ['sprints', projectId] })
          }
        />
      </div>
    </div>
  );
}
