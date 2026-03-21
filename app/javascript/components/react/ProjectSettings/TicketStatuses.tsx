import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Pencil, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '~/components/ui/dialog';
import api from '~/lib/api';

interface TicketStatus {
  id: number;
  title: string;
  sort_order: number | null;
  is_done: boolean;
}

interface StatusForm {
  title: string;
  sort_order: string;
  is_done: boolean;
}

const emptyForm: StatusForm = { title: '', sort_order: '', is_done: false };

interface Props {
  projectId: string;
}

export default function TicketStatuses({ projectId }: Props) {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<StatusForm>(emptyForm);

  const { data: statuses = [] } = useQuery({
    queryKey: ['ticketStatuses', projectId],
    queryFn: () =>
      api
        .get<TicketStatus[]>(`/projects/${projectId}/project_ticket_statuses`)
        .then((r) => r.data),
  });

  const createMutation = useMutation({
    mutationFn: (data: StatusForm) =>
      api.post(`/projects/${projectId}/project_ticket_statuses`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['ticketStatuses', projectId],
      });
      closeDialog();
    },
    onError: () => toast.error(t('message.failedToCreateStatus')),
  });

  const updateMutation = useMutation({
    mutationFn: (data: StatusForm & { id: number }) =>
      api.patch(
        `/projects/${projectId}/project_ticket_statuses/${data.id}`,
        data,
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['ticketStatuses', projectId],
      });
      closeDialog();
    },
    onError: () => toast.error(t('message.failedToUpdateStatus')),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) =>
      api.delete(`/projects/${projectId}/project_ticket_statuses/${id}`),
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: ['ticketStatuses', projectId],
      }),
    onError: () => toast.error(t('message.failedToDeleteStatus')),
  });

  const openNew = () => {
    setEditingId(null);
    setForm(emptyForm);
    setDialogOpen(true);
  };

  const openEdit = (status: TicketStatus) => {
    setEditingId(status.id);
    setForm({
      title: status.title,
      sort_order: String(status.sort_order ?? ''),
      is_done: status.is_done,
    });
    setDialogOpen(true);
  };

  const closeDialog = () => {
    setDialogOpen(false);
    setEditingId(null);
    setForm(emptyForm);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId !== null) {
      updateMutation.mutate({ ...form, id: editingId });
    } else {
      createMutation.mutate(form);
    }
  };

  const inputClass =
    'h-9 w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring';

  return (
    <div className="space-y-6">
      <div className="rounded-xl border bg-card shadow-sm">
        <div className="flex items-center justify-between border-b px-4 py-3">
          <h3 className="text-sm font-semibold">
            {t('settings.ticketStatuses')}
          </h3>
          <button
            type="button"
            onClick={openNew}
            className="h-8 cursor-pointer rounded-md bg-primary px-3 text-xs font-medium text-primary-foreground hover:bg-primary/90"
          >
            {t('action.addStatus')}
          </button>
        </div>
        <table className="w-full text-sm">
          <thead className="border-b bg-muted/50">
            <tr>
              <th className="px-4 py-2 text-left font-medium">
                {t('status.title')}
              </th>
              <th className="px-4 py-2 text-left font-medium">
                {t('status.sort_order')}
              </th>
              <th className="px-4 py-2 text-left font-medium">
                {t('status.is_done')}
              </th>
              <th className="px-4 py-2 text-left font-medium">
                {t('action.actions')}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {statuses.map((s) => (
              <tr key={s.id}>
                <td className="px-4 py-2">{s.title}</td>
                <td className="px-4 py-2">{s.sort_order}</td>
                <td className="px-4 py-2">
                  <input
                    type="checkbox"
                    checked={s.is_done}
                    readOnly
                    className="h-4 w-4"
                  />
                </td>
                <td className="px-4 py-2">
                  <div className="flex gap-1">
                    <button
                      type="button"
                      onClick={() => openEdit(s)}
                      className="h-7 rounded px-2 text-xs text-muted-foreground hover:text-foreground hover:bg-accent"
                    >
                      <Pencil size={16} />
                    </button>
                    <button
                      type="button"
                      onClick={() => deleteMutation.mutate(s.id)}
                      className="h-7 rounded px-2 text-xs text-destructive hover:bg-destructive/10"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {statuses.length === 0 && (
              <tr>
                <td
                  colSpan={4}
                  className="px-4 py-6 text-center text-muted-foreground"
                >
                  {t('message.noStatusesYet')}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Dialog open={dialogOpen} onOpenChange={(open) => !open && closeDialog()}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingId ? t('action.edit') : t('action.addStatus')}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="status-title" className="text-sm font-medium">
                {t('status.title')}
              </label>
              <input
                id="status-title"
                type="text"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                required
                className={inputClass}
              />
            </div>
            <div className="space-y-2">
              <label
                htmlFor="status-sort-order"
                className="text-sm font-medium"
              >
                {t('status.sort_order')}
              </label>
              <input
                id="status-sort-order"
                type="number"
                value={form.sort_order}
                onChange={(e) =>
                  setForm({ ...form, sort_order: e.target.value })
                }
                className={inputClass}
              />
            </div>
            <div className="flex items-center gap-2">
              <input
                id="is_done"
                type="checkbox"
                checked={form.is_done}
                onChange={(e) =>
                  setForm({ ...form, is_done: e.target.checked })
                }
                className="h-4 w-4 rounded border-input"
              />
              <label htmlFor="is_done" className="text-sm font-medium">
                {t('status.is_done')}
              </label>
            </div>
            <DialogFooter>
              <button
                type="button"
                onClick={closeDialog}
                className="h-9 rounded-md border border-input bg-background px-4 text-sm font-medium hover:bg-accent"
              >
                {t('action.cancel')}
              </button>
              <button
                type="submit"
                disabled={createMutation.isPending || updateMutation.isPending}
                className="h-9 cursor-pointer rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
              >
                {t('action.save')}
              </button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
