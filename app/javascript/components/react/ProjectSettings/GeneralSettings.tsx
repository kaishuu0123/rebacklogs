import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import api from '~/lib/api';

interface Project {
  id: number;
  title: string;
  body: string | null;
  ticket_prefix: string | null;
  is_public: boolean;
  image: string | null;
  is_image_attached: boolean;
}

interface Props {
  projectId: string;
}

export default function GeneralSettings({ projectId }: Props) {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const [form, setForm] = useState({
    title: '',
    body: '',
    ticket_prefix: '',
    is_public: false,
  });
  const [file, setFile] = useState<File | null>(null);

  const { data: project } = useQuery({
    queryKey: ['project', projectId],
    queryFn: () =>
      api.get<Project>(`/projects/${projectId}`).then((r) => r.data),
  });

  useEffect(() => {
    if (project) {
      setForm({
        title: project.title,
        body: project.body ?? '',
        ticket_prefix: project.ticket_prefix ?? '',
        is_public: project.is_public,
      });
    }
  }, [project]);

  const updateMutation = useMutation({
    mutationFn: (data: typeof form) =>
      api.patch(`/projects/${projectId}`, { project: data }),
    onSuccess: () => {
      toast.success(t('message.updateProjectSettingsSuccess'));
      queryClient.invalidateQueries({ queryKey: ['project', projectId] });
    },
    onError: () => toast.error(t('message.failedToUpdateProjectSettings')),
  });

  const uploadImageMutation = useMutation({
    mutationFn: (f: File) => {
      const formData = new FormData();
      formData.append('project[image]', f);
      return api.patch(`/projects/${projectId}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['project', projectId] });
      setFile(null);
    },
    onError: () => toast.error(t('message.failedToUploadImage')),
  });

  const deleteImageMutation = useMutation({
    mutationFn: () => api.delete(`/projects/${projectId}/delete_image`),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ['project', projectId] }),
    onError: () => toast.error(t('message.failedToDeleteImage')),
  });

  const inputClass =
    'h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring';

  return (
    <div className="space-y-6">


      <div className="rounded-xl border bg-card shadow-sm p-6">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            updateMutation.mutate(form);
          }}
          className="space-y-4"
        >
          <div className="space-y-2">
            <label htmlFor="project-title" className="text-sm font-medium">
              {t('settings.general.title')}
            </label>
            <input
              id="project-title"
              type="text"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              required
              className={inputClass}
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="project-body" className="text-sm font-medium">
              {t('settings.general.description')}
            </label>
            <textarea
              id="project-body"
              value={form.body}
              onChange={(e) => setForm({ ...form, body: e.target.value })}
              rows={6}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="ticket-prefix" className="text-sm font-medium">
              {t('settings.general.ticketPrefix')}
            </label>
            <input
              id="ticket-prefix"
              type="text"
              value={form.ticket_prefix}
              onChange={(e) =>
                setForm({ ...form, ticket_prefix: e.target.value })
              }
              required
              className={inputClass}
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              id="is_public"
              type="checkbox"
              checked={form.is_public}
              onChange={(e) =>
                setForm({ ...form, is_public: e.target.checked })
              }
              className="h-4 w-4 rounded border-input"
            />
            <label htmlFor="is_public" className="text-sm font-medium">
              {t('settings.general.isPublic')}
            </label>
          </div>

          <button
            type="submit"
            disabled={updateMutation.isPending}
            className="h-9 cursor-pointer rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
          >
            {t('action.save')}
          </button>
        </form>
      </div>

      <div className="rounded-xl border bg-card shadow-sm p-6 space-y-4">
        <h3 className="text-base font-semibold">
          {t('settings.general.projectImage')}
        </h3>
        <div className="flex items-start gap-4">
          <div className="shrink-0">
            <p className="text-sm font-medium mb-2">
              {t('settings.general.currentImage')}
            </p>
            {project?.image && (
              <img
                src={project.image}
                width={90}
                className="rounded"
                alt="project"
              />
            )}
          </div>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (file) uploadImageMutation.mutate(file);
            }}
            className="flex-1 space-y-3"
          >
            <div className="space-y-2">
              <label htmlFor="project-image" className="text-sm font-medium">
                {t('settings.general.projectImage')}
              </label>
              <input
                id="project-image"
                type="file"
                onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                className="w-full text-sm text-muted-foreground file:mr-3 file:h-9 file:cursor-pointer file:rounded-md file:border file:border-input file:bg-background file:px-3 file:text-sm file:font-medium"
              />
            </div>
            <div className="flex gap-2">
              <button
                type="submit"
                disabled={!file || uploadImageMutation.isPending}
                className="h-8 cursor-pointer rounded-md bg-primary px-3 text-xs font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
              >
                {t('action.upload')}
              </button>
              {project?.is_image_attached && (
                <button
                  type="button"
                  onClick={() => deleteImageMutation.mutate()}
                  disabled={deleteImageMutation.isPending}
                  className="h-8 cursor-pointer rounded-md border border-destructive px-3 text-xs font-medium text-destructive hover:bg-destructive/10 disabled:opacity-50"
                >
                  {t('action.delete')}
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
