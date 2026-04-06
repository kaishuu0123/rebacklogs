import Editor from '@monaco-editor/react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  ArrowDown,
  ArrowRight,
  Check,
  ChevronsUpDown,
  Clock,
  Ellipsis,
  MessageCircle,
  Paperclip,
  Pencil,
  Trash2,
  X,
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '~/components/ui/command';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTitle,
} from '~/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '~/components/ui/dropdown-menu';
import { Input } from '~/components/ui/input';
import { Label } from '~/components/ui/label';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '~/components/ui/popover';
import api from '~/lib/api';
import { categoryBadgeStyle } from './colorUtils';
import MarkdownContent from './MarkdownContent';
import type {
  Comment,
  History,
  Story,
  Tag,
  Task,
  TicketCategory,
  TicketStatus,
  User,
} from './types';

type TicketType = 'stories' | 'tasks';
type Ticket = Story | Task;

interface TicketModalProps {
  open: boolean;
  onClose: () => void;
  projectId: string;
  ticketType: TicketType;
  ticketId: number | null;
  storyId?: number | null; // for new task
  initialEdit?: boolean;
  onSuccess?: () => void;
}

export default function TicketModal({
  open,
  onClose,
  projectId,
  ticketType,
  ticketId,
  storyId,
  initialEdit,
  onSuccess,
}: TicketModalProps) {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const isNew = ticketId === null;
  const [isEdit, setIsEdit] = useState(isNew);
  const [tab, setTab] = useState<'comments' | 'history'>('comments');
  const [form, setForm] = useState({ title: '', body: '' });
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [commentBody, setCommentBody] = useState('');
  const [newCategoryId, setNewCategoryId] = useState('');
  const [newAssigneeId, setNewAssigneeId] = useState('');
  const [newStatusId, setNewStatusId] = useState('');
  const titleRef = useRef<HTMLInputElement>(null);

  // Reset state when modal opens
  useEffect(() => {
    if (open) {
      setIsEdit(isNew || (initialEdit ?? false));
      setTab('comments');
      setCommentBody('');
      if (isNew) {
        setForm({ title: '', body: '' });
        setTags([]);
        setNewCategoryId('');
        setNewAssigneeId('');
        setNewStatusId('');
      }
    }
  }, [open, isNew, initialEdit]);

  const { data: ticket } = useQuery<Ticket>({
    queryKey: [ticketType, ticketId, projectId],
    queryFn: () =>
      api
        .get<Ticket>(`/projects/${projectId}/${ticketType}/${ticketId}`)
        .then((r) => r.data),
    enabled: open && !isNew,
  });

  const isDirty =
    isEdit &&
    (() => {
      if (isNew)
        return (
          form.title.trim() !== '' ||
          form.body.trim() !== '' ||
          tags.length > 0 ||
          newCategoryId !== '' ||
          newAssigneeId !== '' ||
          newStatusId !== ''
        );
      return (
        form.title !== (ticket?.title ?? '') ||
        form.body !== (ticket?.body ?? '')
      );
    })();

  const handleClose = () => {
    if (isDirty && !window.confirm(t('message.confirmDiscardChanges'))) return;
    onClose();
  };

  const handleCancelEdit = () => {
    if (isDirty && !window.confirm(t('message.confirmDiscardChanges'))) return;
    if (isNew) onClose();
    else setIsEdit(false);
  };

  // Sync form when ticket loads
  useEffect(() => {
    if (ticket) {
      setForm({ title: ticket.title, body: ticket.body ?? '' });
      setTags(ticket.tags?.map((t) => t.name) ?? []);
    }
  }, [ticket]);

  // Focus title on edit
  useEffect(() => {
    if (isEdit) {
      setTimeout(() => titleRef.current?.focus(), 50);
    }
  }, [isEdit]);

  const { data: assignees = [] } = useQuery<User[]>({
    queryKey: ['assignees', projectId],
    queryFn: () =>
      api.get<User[]>(`/projects/${projectId}/users`).then((r) => r.data),
    enabled: open,
  });

  const { data: statuses = [] } = useQuery<TicketStatus[]>({
    queryKey: ['ticketStatuses', projectId],
    queryFn: () =>
      api
        .get<TicketStatus[]>(`/projects/${projectId}/project_ticket_statuses`)
        .then((r) => r.data),
    enabled: open,
  });

  const { data: categories = [] } = useQuery<TicketCategory[]>({
    queryKey: ['ticketCategories', projectId],
    queryFn: () =>
      api
        .get<TicketCategory[]>(
          `/projects/${projectId}/project_ticket_categories`,
        )
        .then((r) => r.data),
    enabled: open && ticketType === 'stories',
  });

  const { data: availableTags = [] } = useQuery<Tag[]>({
    queryKey: ['projectTags', projectId],
    queryFn: () =>
      api.get<Tag[]>(`/projects/${projectId}/project_tags`).then((r) => r.data),
    enabled: open && !isNew,
  });

  const invalidate = () => {
    queryClient.invalidateQueries({
      queryKey: [ticketType, ticketId, projectId],
    });
    queryClient.invalidateQueries({ queryKey: ['sprints', projectId] });
    queryClient.invalidateQueries({ queryKey: ['kanban', projectId] });
    onSuccess?.();
  };

  const createMutation = useMutation({
    mutationFn: (data: object) =>
      api.post(`/projects/${projectId}/${ticketType}`, data),
    onSuccess: () => {
      invalidate();
      onClose();
    },
    onError: () => toast.error(t('message.failedToCreate')),
  });

  const updateMutation = useMutation({
    mutationFn: (data: object) =>
      api.patch(`/projects/${projectId}/${ticketType}/${ticketId}`, data),
    onSuccess: () => {
      invalidate();
      setIsEdit(false);
    },
    onError: () => toast.error(t('message.failedToUpdate')),
  });

  const deleteMutation = useMutation({
    mutationFn: () =>
      api.delete(`/projects/${projectId}/${ticketType}/${ticketId}`),
    onSuccess: () => {
      invalidate();
      onClose();
    },
    onError: () => toast.error(t('message.failedToDelete')),
  });

  const updateFieldMutation = useMutation({
    mutationFn: (data: object) =>
      api.patch(`/projects/${projectId}/${ticketType}/${ticketId}`, data),
    onSuccess: () => invalidate(),
    onError: () => toast.error(t('message.failedToUpdate')),
  });

  const createCommentMutation = useMutation({
    mutationFn: (body: string) =>
      api.post(`/projects/${projectId}/${ticketType}/${ticketId}/comments`, {
        ticket_id: ticketId,
        body,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [ticketType, ticketId, projectId],
      });
      setCommentBody('');
    },
    onError: () => toast.error(t('message.failedToAddComment')),
  });

  const deleteCommentMutation = useMutation({
    mutationFn: (commentId: number) =>
      api.delete(
        `/projects/${projectId}/${ticketType}/${ticketId}/comments/${commentId}`,
      ),
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: [ticketType, ticketId, projectId],
      }),
    onError: () => toast.error(t('message.failedToDeleteComment')),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload: Record<string, unknown> = {
      ...form,
      tags: tags.map((name) => ({ name })),
    };
    if (isNew && ticketType === 'tasks' && storyId) {
      payload.story_id = storyId;
    }
    if (isNew) {
      if (newCategoryId)
        payload.project_ticket_category_id = Number(newCategoryId);
      if (newAssigneeId) payload.assignee_id = Number(newAssigneeId);
      if (newStatusId) payload.project_ticket_status_id = Number(newStatusId);
      createMutation.mutate(payload);
    } else {
      updateMutation.mutate(payload);
    }
  };

  const saveTags = (nextTags: string[]) => {
    if (isNew) return;
    updateFieldMutation.mutate({ tags: nextTags.map((name) => ({ name })) });
  };

  const handleRemoveTag = (name: string) => {
    const nextTags = tags.filter((t) => t !== name);
    setTags(nextTags);
    saveTags(nextTags);
  };

  const handleDelete = () => {
    if (confirm(t('message.areYouSure'))) deleteMutation.mutate();
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(
      () => toast.success(t('action.copiedToClipboard')),
      () => toast.error(t('action.cannotCopiedToClipboard')),
    );
  };

  const displayTicket = isNew ? null : (ticket as Story | Task | undefined);
  const storyTicket =
    ticketType === 'stories' ? (displayTicket as Story | undefined) : null;
  const taskTicket =
    ticketType === 'tasks' ? (displayTicket as Task | undefined) : null;

  const ticketPrefix = displayTicket?.ticket_number_with_ticket_prefix;
  const ticketURL = ticketPrefix
    ? `${window.location.origin}/${ticketPrefix}`
    : '';

  return (
    <Dialog open={open} onOpenChange={(o) => !o && handleClose()}>
      <DialogContent
        hideCloseButton
        className="max-w-4xl max-h-[90vh] overflow-y-auto"
      >
        <DialogTitle className={isNew ? 'text-lg font-semibold' : 'sr-only'}>
          {isNew
            ? ticketType === 'stories'
              ? t('title.newStory')
              : t('title.newTask')
            : ticketType === 'stories'
              ? t('title.story')
              : t('title.task')}
        </DialogTitle>

        {/* Ticket number + category badge */}
        {!isNew && displayTicket && (
          <div className="flex items-center gap-2 text-sm">
            <span className="rounded border border-border bg-background px-1.5 py-0.5 font-mono text-foreground">
              {ticketPrefix}
            </span>
            {ticketType === 'stories' && (
              <span className="rounded border border-border bg-background px-1.5 py-0.5 text-sm text-foreground">
                {t('title.story')}
              </span>
            )}
            {ticketType === 'stories' &&
              storyTicket?.project_ticket_category && (
                <span
                  className="rounded px-1.5 py-0.5 text-sm font-medium"
                  style={categoryBadgeStyle(
                    storyTicket.project_ticket_category.color,
                  )}
                >
                  {storyTicket.project_ticket_category.title}
                </span>
              )}
            {ticketType === 'tasks' && (
              <span className="rounded border border-border bg-background px-1.5 py-0.5 text-sm text-foreground">
                {t('title.task')}
              </span>
            )}
            <div className="ml-auto flex items-center gap-3 text-muted-foreground">
              {displayTicket.created_user && (
                <span>
                  {t('ticket.createdBy')} {displayTicket.created_user.username}
                </span>
              )}
              {displayTicket.last_updated_user && (
                <span>
                  {t('ticket.updatedBy')}{' '}
                  {displayTicket.last_updated_user.username}
                </span>
              )}
              {!isEdit && (
                <button
                  type="button"
                  onClick={() => setIsEdit(true)}
                  className="inline-flex items-center gap-1 h-6 cursor-pointer rounded bg-primary px-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
                >
                  <Pencil size={14} /> {t('action.edit')}
                </button>
              )}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    type="button"
                    className="inline-flex h-6 cursor-pointer items-center rounded border border-input px-2 hover:bg-accent hover:text-foreground"
                  >
                    <Ellipsis size={14} />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem
                    className="flex items-center gap-1 text-destructive focus:text-destructive cursor-pointer"
                    onClick={handleDelete}
                  >
                    <Trash2 size={16} /> {t('action.delete')}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <DialogClose className="h-6 w-6 cursor-pointer rounded-sm opacity-70 hover:opacity-100 flex items-center justify-center">
                <X size={16} />
              </DialogClose>
            </div>
          </div>
        )}

        <div className="flex gap-4 min-w-0">
          {/* Main content */}
          <div className="flex-1 min-w-0 space-y-4 text-sm">
            {isEdit ? (
              <form onSubmit={handleSubmit} className="space-y-3">
                <div className="grid w-full gap-1.5">
                  <Label htmlFor="ticket-title">{t('ticket.title')}</Label>
                  <Input
                    id="ticket-title"
                    ref={titleRef}
                    value={form.title}
                    onChange={(e) =>
                      setForm({ ...form, title: e.target.value })
                    }
                    placeholder={t('ticket.titlePlaceholder')}
                    required
                  />
                </div>
                <div className="grid w-full gap-1.5">
                  <Label>{t('ticket.body')}</Label>
                  <div className="relative rounded-md border border-input overflow-hidden focus-within:ring-1 focus-within:ring-ring pr-2">
                    {!form.body && (
                      <div className="pointer-events-none absolute left-[10px] top-2 text-sm text-muted-foreground z-10">
                        {t('message.leaveADescription')}
                      </div>
                    )}
                    <Editor
                      height="240px"
                      language="markdown"
                      value={form.body}
                      onChange={(v) => setForm({ ...form, body: v ?? '' })}
                      options={{
                        minimap: { enabled: false },
                        lineNumbers: 'off',
                        glyphMargin: false,
                        folding: false,
                        lineDecorationsWidth: 10,
                        lineNumbersMinChars: 0,
                        wordWrap: 'on',
                        tabSize: 2,
                        insertSpaces: true,
                        scrollBeyondLastLine: false,
                        renderLineHighlight: 'none',
                        overviewRulerLanes: 0,
                        scrollbar: {
                          vertical: 'hidden',
                          alwaysConsumeMouseWheel: false,
                        },
                        fontFamily:
                          'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
                        fontSize: 13,
                        lineHeight: 20,
                        padding: { top: 8, bottom: 8 },
                      }}
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  {isNew ? (
                    <>
                      <button
                        type="button"
                        onClick={handleCancelEdit}
                        className="h-8 cursor-pointer rounded-md border border-input px-3 text-sm font-medium text-foreground hover:bg-accent hover:text-foreground"
                      >
                        {t('action.cancel')}
                      </button>
                      <button
                        type="submit"
                        disabled={createMutation.isPending}
                        className="h-8 cursor-pointer rounded-md bg-primary px-3 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
                      >
                        {t('action.create')}
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        type="button"
                        onClick={handleCancelEdit}
                        className="h-8 cursor-pointer rounded-md border border-input px-3 text-sm font-medium text-foreground hover:bg-accent hover:text-foreground"
                      >
                        {t('action.cancel')}
                      </button>
                      <button
                        type="submit"
                        className="inline-flex items-center gap-1 h-8 cursor-pointer rounded-md bg-primary px-3 text-sm font-medium text-primary-foreground hover:bg-primary/90"
                      >
                        <Check size={14} /> {t('action.saveChanges')}
                      </button>
                    </>
                  )}
                </div>
              </form>
            ) : (
              <div className="space-y-4 min-w-0">
                <div className="flex items-start justify-between gap-2 min-w-0 overflow-hidden">
                  <h2 className="text-xl font-semibold truncate min-w-0">
                    {displayTicket?.title}
                  </h2>
                  {ticketPrefix && (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button
                          type="button"
                          className="shrink-0 h-6 cursor-pointer rounded border border-input px-2 text-sm text-foreground hover:bg-accent hover:text-foreground"
                        >
                          <Paperclip size={16} />
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-64">
                        <DropdownMenuItem
                          className="cursor-pointer"
                          onClick={() =>
                            copyToClipboard(
                              `${ticketPrefix} ${displayTicket?.title}`,
                            )
                          }
                        >
                          <div>
                            <div className="font-medium text-sm">
                              {t('ticket.title')}
                            </div>
                            <pre className="truncate text-sm text-muted-foreground">
                              {ticketPrefix} {displayTicket?.title}
                            </pre>
                          </div>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="cursor-pointer"
                          onClick={() => copyToClipboard(ticketURL)}
                        >
                          <div>
                            <div className="font-medium text-sm">URL</div>
                            <pre className="truncate text-sm text-muted-foreground">
                              {ticketURL}
                            </pre>
                          </div>
                        </DropdownMenuItem>
                        {taskTicket?.story && (
                          <DropdownMenuItem
                            className="cursor-pointer"
                            onClick={() =>
                              copyToClipboard(
                                `${taskTicket.story?.ticket_number_with_ticket_prefix ?? ''} ${taskTicket.story?.title ?? ''}\n  ${ticketPrefix} ${displayTicket?.title}`,
                              )
                            }
                          >
                            <span className="text-sm">
                              {t('ticket.title')} ({t('message.withStory')})
                            </span>
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}
                </div>
                <div className="min-h-[8rem]">
                  <MarkdownContent content={displayTicket?.body} />
                </div>
              </div>
            )}

            {/* Related tasks (story only) */}
            {!isNew && storyTicket?.tasks && storyTicket.tasks.length > 0 && (
              <div className="space-y-1">
                <hr />
                <div className="py-2 font-medium text-muted-foreground">
                  {t('title.relatedTasks')}
                </div>
                {storyTicket.tasks.map((task) => (
                  <div key={task.id} className="flex items-center gap-2">
                    <span className="rounded border border-border bg-background px-1 py-0.5 font-mono text-foreground">
                      {task.ticket_number_with_ticket_prefix}
                    </span>
                    <span>{task.title}</span>
                    <span className="ml-auto text-muted-foreground">
                      {task.project_ticket_status?.title}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {/* Tabs (comments + history) */}
            {!isNew && (
              <div>
                <hr />
                <div className="flex gap-2 border-b">
                  <button
                    type="button"
                    onClick={() => setTab('comments')}
                    className={`inline-flex items-center gap-1 px-3 py-2 font-medium ${tab === 'comments' ? 'border-b-2 border-primary text-primary' : 'text-muted-foreground'}`}
                  >
                    <MessageCircle size={16} /> {t('tab.comment')}
                  </button>
                  <button
                    type="button"
                    onClick={() => setTab('history')}
                    className={`inline-flex items-center gap-1 px-3 py-2 text-sm font-medium ${tab === 'history' ? 'border-b-2 border-primary text-primary' : 'text-muted-foreground'}`}
                  >
                    <Clock size={16} /> {t('tab.history')}
                  </button>
                </div>
                <div className="mt-3">
                  {tab === 'comments' && (
                    <CommentsTab
                      comments={displayTicket?.comments}
                      commentBody={commentBody}
                      setCommentBody={setCommentBody}
                      onSubmit={() => {
                        if (commentBody.trim()) {
                          createCommentMutation.mutate(commentBody.trim());
                        }
                      }}
                      onDelete={(id) => deleteCommentMutation.mutate(id)}
                      isPending={createCommentMutation.isPending}
                    />
                  )}
                  {tab === 'history' && (
                    <HistoryTab histories={displayTicket?.histories} />
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="w-44 shrink-0 space-y-3 rounded-lg bg-muted/30 p-3 text-sm">
            {/* Story link (task only) */}
            {!isNew && taskTicket?.story && (
              <div className="space-y-1">
                <p className="font-medium">{t('title.story')}:</p>
                <a
                  href={`/${taskTicket.story.ticket_number_with_ticket_prefix}`}
                  className="block truncate rounded border-b border-border text-foreground hover:text-foreground"
                >
                  <span className="mr-1 rounded border border-border bg-background px-1 font-mono text-sm text-foreground">
                    {taskTicket.story.ticket_number_with_ticket_prefix}
                  </span>
                  {taskTicket.story.title}
                </a>
              </div>
            )}

            {/* Category (story only) */}
            {ticketType === 'stories' && (
              <SidebarCombobox
                label={t('ticket.category')}
                value={
                  isNew
                    ? newCategoryId
                    : (storyTicket?.project_ticket_category_id?.toString() ??
                      '')
                }
                options={[
                  { value: '', label: '-' },
                  ...categories.map((c) => ({
                    value: c.id.toString(),
                    label: c.title,
                    color: c.color ?? undefined,
                  })),
                ]}
                onChange={(val) =>
                  isNew
                    ? setNewCategoryId(val)
                    : updateFieldMutation.mutate({
                        project_ticket_category_id: val ? Number(val) : null,
                      })
                }
              />
            )}

            {/* Assignee */}
            <SidebarCombobox
              label={t('ticket.assignee')}
              value={
                isNew
                  ? newAssigneeId
                  : (displayTicket?.assignee_id?.toString() ?? '')
              }
              options={[
                { value: '', label: t('title.unassigned') },
                ...assignees.map((u) => ({
                  value: u.id.toString(),
                  label: u.username,
                  image: u.image ?? undefined,
                })),
              ]}
              onChange={(val) =>
                isNew
                  ? setNewAssigneeId(val)
                  : updateFieldMutation.mutate({
                      assignee_id: val ? Number(val) : null,
                    })
              }
            />

            {/* Status */}
            <SidebarCombobox
              label={t('ticket.status')}
              value={
                isNew
                  ? newStatusId
                  : (displayTicket?.project_ticket_status_id?.toString() ?? '')
              }
              options={[
                { value: '', label: '-' },
                ...statuses.map((s) => ({
                  value: s.id.toString(),
                  label: s.title,
                })),
              ]}
              onChange={(val) =>
                isNew
                  ? setNewStatusId(val)
                  : updateFieldMutation.mutate({
                      project_ticket_status_id: val ? Number(val) : null,
                    })
              }
            />

            {/* Point (story only) */}
            {ticketType === 'stories' && !isNew && ticketId !== null && (
              <PointInput
                projectId={projectId}
                ticketId={ticketId}
                ticketType={ticketType}
                initialPoint={storyTicket?.point ?? null}
                onSuccess={invalidate}
              />
            )}
            {/* Tags */}
            {!isNew && (
              <div className="space-y-1">
                <p className="font-medium">{t('title.tag')}:</p>
                <div className="flex flex-wrap gap-1">
                  {tags.map((name) => (
                    <span
                      key={name}
                      className="flex items-center gap-0.5 rounded border border-border bg-background px-1.5 py-0.5 text-sm"
                    >
                      {name}
                      <button
                        type="button"
                        onClick={() => handleRemoveTag(name)}
                        className="text-foreground hover:text-foreground"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
                <TagInput
                  tagInput={tagInput}
                  setTagInput={setTagInput}
                  availableTags={availableTags}
                  tags={tags}
                  onAdd={(name) => {
                    if (
                      !tags.some((t) => t.toLowerCase() === name.toLowerCase())
                    ) {
                      const nextTags = [...tags, name];
                      setTags(nextTags);
                      saveTags(nextTags);
                    }
                    setTagInput('');
                  }}
                />
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function TagInput({
  tagInput,
  setTagInput,
  availableTags,
  tags,
  onAdd,
}: {
  tagInput: string;
  setTagInput: (v: string) => void;
  availableTags: Tag[];
  tags: string[];
  onAdd: (name: string) => void;
}) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);

  const filtered = availableTags.filter(
    (tag) =>
      !tags.some((t) => t.toLowerCase() === tag.name.toLowerCase()) &&
      tag.name.toLowerCase().includes(tagInput.toLowerCase()),
  );
  const canCreate =
    tagInput.trim().length > 0 &&
    !availableTags.some(
      (tag) => tag.name.toLowerCase() === tagInput.trim().toLowerCase(),
    ) &&
    !tags.some((t) => t.toLowerCase() === tagInput.trim().toLowerCase());

  const handleSelect = (name: string) => {
    onAdd(name);
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <input
          type="text"
          value={tagInput}
          onChange={(e) => {
            setTagInput(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              const name = tagInput.trim();
              if (!name) return;
              handleSelect(name);
            }
            if (e.key === 'Escape') setOpen(false);
          }}
          placeholder={t('message.tagInput')}
          className="h-7 w-full rounded-md border border-border bg-background px-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
        />
      </PopoverTrigger>
      {(filtered.length > 0 || canCreate) && (
        <PopoverContent
          className="w-40 p-1"
          align="start"
          onOpenAutoFocus={(e) => e.preventDefault()}
        >
          <div className="space-y-0.5">
            {filtered.map((tag) => (
              <button
                key={tag.id}
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => handleSelect(tag.name)}
                className="w-full rounded px-2 py-1 text-left text-sm hover:bg-accent"
              >
                {tag.name}
              </button>
            ))}
            {canCreate && (
              <button
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => handleSelect(tagInput.trim())}
                className="w-full rounded px-2 py-1 text-left text-sm text-foreground hover:bg-accent"
              >
                + {t('action.create')} &ldquo;{tagInput.trim()}&rdquo;
              </button>
            )}
          </div>
        </PopoverContent>
      )}
    </Popover>
  );
}

type ComboboxOption = {
  value: string;
  label: string;
  color?: string;
  image?: string;
};

function SidebarCombobox({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: ComboboxOption[];
  onChange: (val: string) => void;
}) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const selected = options.find((o) => o.value === value);

  return (
    <div className="space-y-1">
      <p className="font-medium">{label}:</p>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <button
            type="button"
            className="flex h-7 w-full items-center justify-between rounded-md border border-border bg-background px-2 text-left hover:bg-accent"
          >
            <span className="flex items-center gap-1.5 truncate">
              {selected?.color && (
                <span
                  className="inline-block h-3 w-3 shrink-0 rounded-sm border border-black/10"
                  style={{ backgroundColor: selected.color }}
                />
              )}
              {selected?.image && (
                <img src={selected.image} className="h-4 w-4 rounded" alt="" />
              )}
              <span className="truncate">{selected?.label ?? '-'}</span>
            </span>
            <ChevronsUpDown className="h-3 w-3 shrink-0 opacity-50" />
          </button>
        </PopoverTrigger>
        <PopoverContent className="w-48 p-0" align="start">
          <Command>
            <CommandInput placeholder={t('title.search')} className="h-8" />
            <CommandList>
              <CommandEmpty className="py-3">
                {t('message.notFound')}
              </CommandEmpty>
              <CommandGroup>
                {options.map((o) => (
                  <CommandItem
                    key={o.value}
                    value={o.label}
                    onSelect={() => {
                      onChange(o.value);
                      setOpen(false);
                    }}
                  >
                    {o.color && (
                      <span
                        className="inline-block h-3 w-3 shrink-0 rounded-sm border border-black/10"
                        style={{ backgroundColor: o.color }}
                      />
                    )}
                    {o.image && (
                      <img src={o.image} className="h-4 w-4 rounded" alt="" />
                    )}
                    <span className="truncate">{o.label}</span>
                    {o.value === value && (
                      <Check className="ml-auto h-3 w-3 shrink-0" />
                    )}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}

function PointInput({
  projectId,
  ticketId,
  ticketType,
  initialPoint,
  onSuccess,
}: {
  projectId: string;
  ticketId: number;
  ticketType: TicketType;
  initialPoint: number | null;
  onSuccess: () => void;
}) {
  const { t } = useTranslation();
  const [point, setPoint] = useState<string>(
    initialPoint !== null ? String(initialPoint) : '',
  );

  useEffect(() => {
    setPoint(initialPoint !== null ? String(initialPoint) : '');
  }, [initialPoint]);

  const updatePoint = () => {
    const value = point === '' ? null : Number(point);
    api
      .patch(`/projects/${projectId}/${ticketType}/${ticketId}`, {
        point: value,
      })
      .then(onSuccess)
      .catch(() => toast.error(t('message.failedToUpdatePoint')));
  };

  return (
    <div className="space-y-1">
      <p className="font-medium">{t('ticket.point')}:</p>
      <input
        type="number"
        value={point}
        onChange={(e) => setPoint(e.target.value)}
        onBlur={updatePoint}
        onKeyDown={(e) =>
          e.key === 'Enter' && (e.target as HTMLInputElement).blur()
        }
        step={0.5}
        className="h-7 w-full rounded-md border-b border-input bg-transparent px-2 focus-visible:outline-none"
      />
    </div>
  );
}

function CommentsTab({
  comments,
  commentBody,
  setCommentBody,
  onSubmit,
  onDelete,
  isPending,
}: {
  comments?: Comment[];
  commentBody: string;
  setCommentBody: (s: string) => void;
  onSubmit: () => void;
  onDelete: (id: number) => void;
  isPending: boolean;
}) {
  const { t } = useTranslation();
  return (
    <div className="space-y-3 text-sm">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit();
        }}
        className="space-y-2"
      >
        <div className="relative rounded-md border border-border overflow-hidden focus-within:ring-2 focus-within:ring-ring pr-2">
          {!commentBody && (
            <div className="pointer-events-none absolute left-[10px] top-2 text-sm text-muted-foreground z-10">
              {t('message.leaveAComment')}
            </div>
          )}
          <Editor
            height="120px"
            language="markdown"
            value={commentBody}
            onChange={(v) => setCommentBody(v ?? '')}
            options={{
              minimap: { enabled: false },
              lineNumbers: 'off',
              wordWrap: 'on',
              tabSize: 2,
              insertSpaces: true,
              scrollBeyondLastLine: false,
              renderLineHighlight: 'none',
              overviewRulerLanes: 0,
              scrollbar: { vertical: 'hidden', alwaysConsumeMouseWheel: false },
              fontFamily:
                'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
              fontSize: 13,
              lineHeight: 20,
              padding: { top: 8, bottom: 8 },
              glyphMargin: false,
              folding: false,
              lineDecorationsWidth: 10,
              lineNumbersMinChars: 0,
            }}
          />
        </div>
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isPending || !commentBody.trim()}
            className="h-8 cursor-pointer rounded-md bg-primary px-3 font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
          >
            {t('action.comment')}
          </button>
        </div>
      </form>
      {(comments ?? []).map((c) => (
        <div key={c.id} className="rounded-md border">
          <div className="flex items-center justify-between border-b bg-muted/30 px-3 py-2">
            <div className="flex items-center gap-2">
              {c.user.image && (
                <img
                  src={c.user.image}
                  width={20}
                  height={20}
                  className="rounded"
                  alt=""
                />
              )}
              <span className="font-medium">{c.user.username}</span>
              <span className="text-muted-foreground">
                {new Date(c.created_at).toLocaleString()}
              </span>
            </div>
            <button
              type="button"
              onClick={() => onDelete(c.id)}
              className="text-destructive hover:text-destructive/80"
            >
              <Trash2 size={16} />
            </button>
          </div>
          <div className="p-3">
            <MarkdownContent content={c.body} />
          </div>
        </div>
      ))}
    </div>
  );
}

function HistoryTab({ histories }: { histories?: History[] }) {
  const { t } = useTranslation();
  if (!histories || histories.length === 0) {
    return (
      <div className="rounded border bg-muted/30 p-3 text-sm text-muted-foreground">
        {t('message.historyIsEmpty')}
      </div>
    );
  }

  return (
    <div className="space-y-3 text-sm">
      {histories.map((h) => (
        <div key={h.id} className="rounded-md border p-3">
          <p className="font-medium">
            {t('ticket.updatedAt')}: {new Date(h.changed_at).toLocaleString()}
          </p>
          <p className="text-muted-foreground">
            {t('ticket.updatedBy')}: {h.changed_by}
          </p>
          {h.changes.map((change) => (
            <div key={change.attribute} className="mt-2">
              {change.attribute === 'body' ? (
                <div>
                  <p className="font-semibold">{change.attribute}</p>
                  <pre className="rounded bg-destructive/10 p-2 text-sm">
                    {change.before}
                  </pre>
                  <div className="flex justify-center py-1">
                    <ArrowDown size={16} className="text-muted-foreground" />
                  </div>
                  <pre className="rounded bg-green-50 p-2 text-sm">
                    {change.after}
                  </pre>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <span className="w-24 font-semibold">{change.attribute}</span>
                  <span className="rounded bg-destructive/10 px-1">
                    {change.before}
                  </span>
                  <ArrowRight size={16} className="text-muted-foreground" />
                  <span className="rounded bg-green-50 px-1">
                    {change.after}
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
