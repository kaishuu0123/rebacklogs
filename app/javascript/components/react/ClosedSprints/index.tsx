import {
  QueryClient,
  QueryClientProvider,
  useQuery,
} from "@tanstack/react-query";
import { ChevronRight, LayoutGrid } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Toaster } from "sonner";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "~/components/ui/tooltip";
import api from "~/lib/api";
import { categoryBadgeStyle } from "../shared/colorUtils";
import TicketModal from "../shared/TicketModal";
import type { BacklogsData, Sprint, Story } from "../shared/types";

const queryClient = new QueryClient();

interface Props {
  projectId: string;
}

export default function ClosedSprints(props: Props) {
  return (
    <QueryClientProvider client={queryClient}>
      <Toaster position="top-right" />
      <ClosedSprintsInner {...props} />
    </QueryClientProvider>
  );
}

function ClosedSprintsInner({ projectId }: Props) {
  const { t } = useTranslation();
  const [storyModalOpen, setStoryModalOpen] = useState(false);
  const [selectedStoryId, setSelectedStoryId] = useState<number | null>(null);

  const { data } = useQuery<BacklogsData>({
    queryKey: ["closedSprints", projectId],
    queryFn: () =>
      api
        .get<BacklogsData>(`/projects/${projectId}/api/closed_sprints`)
        .then((r) => r.data),
  });

  const sprints = data?.sprints ?? [];

  const openStoryModal = (storyId: number) => {
    setSelectedStoryId(storyId);
    setStoryModalOpen(true);
  };

  const formatDate = (d: string | null) => {
    if (!d) return "";
    return new Date(d).toLocaleDateString("en-ZA");
  };

  return (
    <div className="w-full px-4 mt-3 text-sm">
      {sprints.length === 0 ? (
        <div className="mx-auto mt-8 flex max-w-md items-center justify-center rounded-xl border border-dashed bg-muted/20 p-8 text-muted-foreground">
          {t("message.noClosedSprints")}
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4">
          {sprints.map((sprint) => (
            <ClosedSprintCard
              key={sprint.id}
              sprint={sprint}
              projectId={projectId}
              onOpenStory={openStoryModal}
              formatDate={formatDate}
            />
          ))}
        </div>
      )}

      <TicketModal
        open={storyModalOpen}
        onClose={() => {
          setStoryModalOpen(false);
          setSelectedStoryId(null);
        }}
        projectId={projectId}
        ticketType="stories"
        ticketId={selectedStoryId}
      />
    </div>
  );
}

function ClosedSprintCard({
  sprint,
  projectId,
  onOpenStory,
  formatDate,
}: {
  sprint: Sprint;
  projectId: string;
  onOpenStory: (id: number) => void;
  formatDate: (d: string | null) => string;
}) {
  const { t } = useTranslation();
  const doneCount = sprint.stories.filter((s) => s.is_done).length;
  const totalCount = sprint.stories.length;
  const progressPct = totalCount > 0 ? (doneCount / totalCount) * 100 : 0;
  const totalPoints = sprint.stories.reduce(
    (acc, s) => acc + (s.point ?? 0),
    0,
  );

  return (
    <div className="rounded-xl border bg-card shadow-sm">
      <div className="flex items-center justify-between border-b px-3 py-2">
        <div>
          <h3 className="text-sm font-semibold">{sprint.title}</h3>
          {sprint.start_datetime && (
            <p className="inline-flex items-center gap-0.5 text-sm text-muted-foreground">
              {formatDate(sprint.start_datetime)}
              <ChevronRight size={12} />
              {formatDate(sprint.end_datetime)}
            </p>
          )}
        </div>
        <TooltipProvider delayDuration={300}>
          <Tooltip>
            <TooltipTrigger asChild>
              <a
                href={`/projects/${projectId}/sprints/${sprint.id}/kanban`}
                className="h-7 rounded px-2 text-sm text-foreground hover:bg-accent"
              >
                <LayoutGrid size={16} />
              </a>
            </TooltipTrigger>
            <TooltipContent>{t("action.viewKanban")}</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      <ul className="divide-y">
        {sprint.stories.map((story) => (
          <StoryRow key={story.id} story={story} onOpen={onOpenStory} />
        ))}
        {sprint.stories.length === 0 && (
          <li className="px-3 py-3 text-sm text-muted-foreground">
            {t("message.noStories")}
          </li>
        )}
      </ul>

      {sprint.stories.length > 0 && (
        <div className="border-t bg-muted/20 px-3 py-2 text-sm">
          <div className="flex items-center justify-between">
            <span className="font-medium">
              {doneCount} / {totalCount} ({Math.round(progressPct)}%)
            </span>
            <span className="font-medium">{totalPoints.toFixed(1)} pts</span>
          </div>
          <div className="mt-1.5 h-1 w-full rounded-full bg-muted">
            <div
              className="h-1 rounded-full bg-green-500"
              style={{ width: `${progressPct}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
}

function StoryRow({
  story,
  onOpen,
}: {
  story: Story;
  onOpen: (id: number) => void;
}) {
  const catColor = story.project_ticket_category?.color ?? null;

  return (
    <li
      className="flex items-center gap-2 px-3 py-2"
      style={{ backgroundColor: catColor ?? undefined }}
    >
      <button
        type="button"
        onClick={() => onOpen(story.id)}
        className="shrink-0 rounded border border-border bg-background px-1 py-0.5 font-mono text-xs text-foreground hover:bg-muted/50"
      >
        {story.ticket_number_with_ticket_prefix}
      </button>
      {story.project_ticket_category && (
        <span
          className="shrink-0 rounded px-1.5 py-0.5 text-sm font-medium"
          style={categoryBadgeStyle(catColor)}
        >
          {story.project_ticket_category.title}
        </span>
      )}
      <span className="flex-1 truncate text-sm font-medium">
        {story.is_done ? <s>{story.title}</s> : story.title}
      </span>
      <span className="shrink-0 text-sm text-muted-foreground">
        {Number(story.point ?? 0).toFixed(1)} pt
      </span>
    </li>
  );
}
