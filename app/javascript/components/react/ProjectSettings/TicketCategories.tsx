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
import ColorPicker from './ColorPicker';

interface Category {
  id: number;
  title: string;
  sort_order: number | null;
  color: string | null;
}

interface CategoryForm {
  title: string;
  sort_order: string;
  color: string;
}

const emptyForm: CategoryForm = { title: '', sort_order: '', color: '#e2e3e5' };

interface Props {
  projectId: string;
}

export default function TicketCategories({ projectId }: Props) {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<CategoryForm>(emptyForm);

  const { data: categories = [] } = useQuery({
    queryKey: ['ticketCategories', projectId],
    queryFn: () =>
      api
        .get<Category[]>(`/projects/${projectId}/project_ticket_categories`)
        .then((r) => r.data),
  });

  const createMutation = useMutation({
    mutationFn: (data: CategoryForm) =>
      api.post(`/projects/${projectId}/project_ticket_categories`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['ticketCategories', projectId],
      });
      closeDialog();
    },
    onError: () => toast.error(t('message.failedToCreateCategory')),
  });

  const updateMutation = useMutation({
    mutationFn: (data: CategoryForm & { id: number }) =>
      api.patch(
        `/projects/${projectId}/project_ticket_categories/${data.id}`,
        data,
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['ticketCategories', projectId],
      });
      closeDialog();
    },
    onError: () => toast.error(t('message.failedToUpdateCategory')),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) =>
      api.delete(`/projects/${projectId}/project_ticket_categories/${id}`),
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: ['ticketCategories', projectId],
      }),
    onError: () => toast.error(t('message.failedToDeleteCategory')),
  });

  const openNew = () => {
    setEditingId(null);
    setForm(emptyForm);
    setDialogOpen(true);
  };

  const openEdit = async (category: Category) => {
    setEditingId(category.id);
    setForm({
      title: category.title,
      sort_order: String(category.sort_order ?? ''),
      color: category.color ?? '#e2e3e5',
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
            {t('settings.ticketCategories')}
          </h3>
          <button
            type="button"
            onClick={openNew}
            className="h-8 cursor-pointer rounded-md bg-primary px-3 text-xs font-medium text-primary-foreground hover:bg-primary/90"
          >
            {t('action.addCategory')}
          </button>
        </div>
        <table className="w-full text-sm">
          <thead className="border-b bg-muted/50">
            <tr>
              <th className="px-4 py-2 text-left font-medium">
                {t('category.title')}
              </th>
              <th className="px-4 py-2 text-left font-medium">
                {t('category.sort_order')}
              </th>
              <th className="px-4 py-2 text-left font-medium">
                {t('category.color')}
              </th>
              <th className="px-4 py-2 text-left font-medium">
                {t('action.actions')}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {categories.map((cat) => (
              <tr key={cat.id}>
                <td className="px-4 py-2">{cat.title}</td>
                <td className="px-4 py-2">{cat.sort_order}</td>
                <td className="px-4 py-2">
                  <div className="flex items-center gap-2">
                    <span
                      className="inline-block h-4 w-4 rounded-sm border border-input"
                      style={{ backgroundColor: cat.color ?? undefined }}
                    />
                    <span className="font-mono text-xs">{cat.color}</span>
                  </div>
                </td>
                <td className="px-4 py-2">
                  <div className="flex gap-1">
                    <button
                      type="button"
                      onClick={() => openEdit(cat)}
                      className="h-7 rounded px-2 text-xs text-muted-foreground hover:text-foreground hover:bg-accent"
                    >
                      <Pencil size={16} />
                    </button>
                    <button
                      type="button"
                      onClick={() => deleteMutation.mutate(cat.id)}
                      className="h-7 rounded px-2 text-xs text-destructive hover:bg-destructive/10"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {categories.length === 0 && (
              <tr>
                <td
                  colSpan={4}
                  className="px-4 py-6 text-center text-muted-foreground"
                >
                  {t('message.noCategoriesYet')}
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
              {editingId ? t('action.edit') : t('action.addCategory')}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="cat-title" className="text-sm font-medium">
                {t('category.title')}
              </label>
              <input
                id="cat-title"
                type="text"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                required
                className={inputClass}
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="cat-sort-order" className="text-sm font-medium">
                {t('category.sort_order')}
              </label>
              <input
                id="cat-sort-order"
                type="number"
                value={form.sort_order}
                onChange={(e) =>
                  setForm({ ...form, sort_order: e.target.value })
                }
                className={inputClass}
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="cat-color" className="text-sm font-medium">
                {t('category.color')}
              </label>
              <div
                className="mt-1 mb-2 rounded-md px-3 py-2 text-sm border border-input"
                style={{ backgroundColor: form.color }}
              >
                <span
                  style={{
                    color: isLightColor(form.color) ? '#000' : '#fff',
                  }}
                >
                  Preview
                </span>
              </div>
              <ColorPicker
                value={form.color}
                onChange={(c) => setForm({ ...form, color: c })}
              />
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

function isLightColor(hex: string): boolean {
  const c = hex.replace('#', '');
  const r = Number.parseInt(c.substring(0, 2), 16);
  const g = Number.parseInt(c.substring(2, 4), 16);
  const b = Number.parseInt(c.substring(4, 6), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.5;
}
