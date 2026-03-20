import { useDroppable } from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { PlusCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import api from '~/lib/api';
import type { Story } from '../shared/types';
import StoryListItem from './StoryListItem';

interface Props {
  stories: Story[];
  projectId: string;
  searchKeyword: string;
  onOpenStoryModal: (storyId: number) => void;
  onNewStory: () => void;
  activeId: number | null;
}

export default function BacklogsCard({
  stories,
  projectId,
  searchKeyword,
  onOpenStoryModal,
  onNewStory,
  activeId,
}: Props) {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const { setNodeRef } = useDroppable({ id: 'sprint-null' });

  const createSprintMutation = useMutation({
    mutationFn: () =>
      api.post(`/projects/${projectId}/sprints`, { title: 'untitled sprint' }),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ['sprints', projectId] }),
    onError: () => toast.error(t('message.failedToCreateSprint')),
  });

  const filteredStories = searchKeyword
    ? stories.filter((s) => {
        const q = searchKeyword.toLowerCase();
        return (
          s.ticket_number_with_ticket_prefix.toLowerCase().includes(q) ||
          s.title.toLowerCase().includes(q) ||
          (s.tags ?? []).some((t) => t.name.toLowerCase().includes(q))
        );
      })
    : stories;

  return (
    <div className="rounded-md border bg-card shadow-sm text-sm">
      <div className="flex items-center justify-between border-b px-3 py-2">
        <h3 className="font-semibold">{t('title.productBacklogs')}</h3>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={onNewStory}
            className="inline-flex items-center gap-1 h-7 cursor-pointer rounded border border-primary px-2 text-xs text-primary hover:bg-primary/10"
          >
            <PlusCircle size={16} /> {t('action.addStory')}
          </button>
          <button
            type="button"
            onClick={() => createSprintMutation.mutate()}
            disabled={createSprintMutation.isPending}
            className="inline-flex items-center gap-1 h-7 cursor-pointer rounded border border-primary px-2 text-xs text-primary hover:bg-primary/10 disabled:opacity-50"
          >
            <PlusCircle size={16} /> {t('action.addSprint')}
          </button>
        </div>
      </div>

      <ul ref={setNodeRef} className="divide-y">
        <SortableContext
          items={stories.map((s) => s.id)}
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
        {stories.length === 0 && (
          <li className="flex flex-col items-center justify-center gap-1 px-3 py-6 text-xs text-muted-foreground border-2 border-dashed border-muted m-2 rounded-md">
            <span>{t('message.storyDoesNotExists')}</span>
          </li>
        )}
      </ul>
    </div>
  );
}
