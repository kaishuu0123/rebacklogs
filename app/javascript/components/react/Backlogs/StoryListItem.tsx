import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Ban, Check, GripVertical, Pencil } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import api from "~/lib/api";
import { idealTextColor } from "../shared/colorUtils";
import type { Story } from "../shared/types";

interface Props {
  story: Story;
  projectId: string;
  onOpenModal: (storyId: number) => void;
  isDraggingActive?: boolean;
}

export default function StoryListItem({
  story,
  projectId,
  onOpenModal,
  isDraggingActive = false,
}: Props) {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const [isEdit, setIsEdit] = useState(false);
  const [title, setTitle] = useState(story.title);
  const [point, setPoint] = useState(
    story.point !== null && story.point !== undefined
      ? String(story.point)
      : "",
  );
  const titleRef = useRef<HTMLInputElement>(null);
  const pointRef = useRef<HTMLInputElement>(null);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: story.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  useEffect(() => {
    setTitle(story.title);
    setPoint(
      story.point !== null && story.point !== undefined
        ? String(story.point)
        : "",
    );
  }, [story]);

  const updateMutation = useMutation({
    mutationFn: (data: object) =>
      api.patch(`/projects/${projectId}/stories/${story.id}`, data),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["sprints", projectId] }),
    onError: () => toast.error(t("message.failedToUpdateStory")),
  });

  const catColor = story.project_ticket_category?.color ?? "#ffffff";
  const textStyle = { color: idealTextColor(catColor) };
  const bgStyle = { backgroundColor: catColor };

  const editDone = (save: boolean) => {
    setIsEdit(false);
    if (save) {
      updateMutation.mutate({
        title,
        point: point === "" ? null : Number.parseFloat(point),
      });
    } else {
      setTitle(story.title);
      setPoint(
        story.point !== null && story.point !== undefined
          ? String(story.point)
          : "",
      );
    }
  };

  if (isDraggingActive) {
    return (
      <li
        ref={setNodeRef}
        style={style}
        className="list-none border-b border-dashed border-primary/40 bg-primary/5 px-2 py-1.5 min-h-[34px]"
      />
    );
  }

  return (
    <li
      ref={setNodeRef}
      style={{ ...style, ...bgStyle }}
      className={`list-none border-b px-2 py-1.5 text-sm${!isEdit ? " cursor-grab active:cursor-grabbing" : ""}`}
      {...attributes}
      {...(!isEdit ? listeners : undefined)}
    >
      {isEdit ? (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            editDone(true);
          }}
        >
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground/40">
              <GripVertical size={12} />
            </span>
            <a
              href={`/${story.ticket_number_with_ticket_prefix}`}
              className="shrink-0 rounded border border-border bg-background px-1 py-0.5 font-mono text-xs text-foreground"
              onClick={(e) => e.stopPropagation()}
            >
              {story.ticket_number_with_ticket_prefix}
            </a>
            <input
              ref={titleRef}
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="flex-1 rounded border border-border bg-background px-2 py-0.5"
            />
            <input
              ref={pointRef}
              type="number"
              value={point}
              onChange={(e) => setPoint(e.target.value)}
              step={0.5}
              className="w-16 rounded border border-border bg-background px-2 py-0.5"
            />
          </div>
          <div className="mt-1 flex justify-end gap-1">
            <button
              type="submit"
              className="inline-flex items-center gap-1 h-6 cursor-pointer rounded bg-primary px-2 text-sm text-primary-foreground"
            >
              <Check size={16} /> {t("action.save")}
            </button>
            <button
              type="button"
              onClick={() => editDone(false)}
              className="inline-flex items-center gap-1 h-6 cursor-pointer rounded border border-border bg-background px-2 text-sm"
            >
              <Ban size={16} /> {t("action.cancel")}
            </button>
          </div>
        </form>
      ) : (
        <div className="flex items-center gap-2" style={textStyle}>
          <span className="text-muted-foreground/40">
            <GripVertical size={12} />
          </span>
          <a
            href={`/${story.ticket_number_with_ticket_prefix}`}
            className="shrink-0 rounded border border-border bg-background px-1 py-0.5 font-mono text-xs text-foreground"
            onPointerDown={(e) => e.stopPropagation()}
            onClick={(e) => {
              e.preventDefault();
              onOpenModal(story.id);
            }}
          >
            {story.ticket_number_with_ticket_prefix}
          </a>
          <span className="flex-1 min-w-0 group/title flex items-center gap-1">
            <button
              type="button"
              className="truncate font-medium cursor-pointer"
              onPointerDown={(e) => e.stopPropagation()}
              onClick={() => {
                setIsEdit(true);
                setTimeout(() => titleRef.current?.focus(), 50);
              }}
            >
              {story.is_done ? <s>{story.title}</s> : story.title}
            </button>
            <button
              type="button"
              className="shrink-0 cursor-pointer opacity-0 group-hover/title:opacity-60 hover:!opacity-100 transition-opacity"
              onPointerDown={(e) => e.stopPropagation()}
              onClick={() => {
                setIsEdit(true);
                setTimeout(() => titleRef.current?.focus(), 50);
              }}
            >
              <Pencil size={14} />
            </button>
          </span>
          <button
            type="button"
            className="shrink-0 cursor-pointer"
            onPointerDown={(e) => e.stopPropagation()}
            onClick={() => {
              setIsEdit(true);
              setTimeout(() => pointRef.current?.focus(), 50);
            }}
          >
            {story.point !== null && story.point !== undefined
              ? Number(story.point).toFixed(1)
              : "-"}
          </button>
        </div>
      )}
      {story.tags && story.tags.length > 0 && (
        <div className="mt-0.5 flex flex-wrap gap-1 pl-5">
          {story.tags.map((tag) => (
            <span
              key={tag.id}
              className="rounded border border-border bg-background px-1.5 py-0.5 text-sm"
            >
              {tag.name}
            </span>
          ))}
        </div>
      )}
    </li>
  );
}
