import { createConsumer } from '@rails/actioncable';
import { useQueryClient } from '@tanstack/react-query';
import { useEffect, useRef, useState } from 'react';

const consumer = createConsumer();

type ProjectEvent =
  | { event: 'sprint_updated'; project_id: number }
  | { event: 'task_updated'; project_id: number; sprint_id: number | null }
  | { event: 'comment_updated'; project_id: number; ticket_id: number; ticket_type: string }
  | { event: 'ticket_updated'; project_id: number };

export function useProjectChannel(projectId: string) {
  const qc = useQueryClient();
  const subscriptionRef = useRef<ReturnType<typeof consumer.subscriptions.create> | null>(null);
  const [lastReceivedAt, setLastReceivedAt] = useState<Date | null>(null);

  useEffect(() => {
    subscriptionRef.current = consumer.subscriptions.create(
      { channel: 'ProjectChannel', project_id: projectId },
      {
        received(data: ProjectEvent) {
          setLastReceivedAt(new Date());
          switch (data.event) {
            case 'sprint_updated':
              qc.invalidateQueries({ queryKey: ['sprints', projectId] });
              qc.invalidateQueries({ queryKey: ['kanban', projectId] });
              break;
            case 'task_updated':
              qc.invalidateQueries({ queryKey: ['kanban', projectId] });
              qc.invalidateQueries({ queryKey: ['sprints', projectId] });
              break;
            case 'comment_updated':
              qc.invalidateQueries({
                queryKey: [data.ticket_type, data.ticket_id, projectId],
              });
              break;
            case 'ticket_updated':
              qc.invalidateQueries({ queryKey: ['sprints', projectId] });
              qc.invalidateQueries({ queryKey: ['kanban', projectId] });
              break;
          }
        },
      },
    );

    return () => {
      subscriptionRef.current?.unsubscribe();
    };
  }, [projectId, qc]);

  return { lastReceivedAt };
}
