import { createConsumer } from '@rails/actioncable';
import { useQueryClient } from '@tanstack/react-query';
import { useCallback, useEffect, useRef, useState } from 'react';

const consumer = createConsumer();

type ProjectEvent =
  | { event: 'sprint_updated'; project_id: number }
  | { event: 'task_updated'; project_id: number; sprint_id: number | null }
  | {
      event: 'comment_updated';
      project_id: number;
      ticket_id: number;
      ticket_type: string;
    }
  | { event: 'ticket_updated'; project_id: number };

export type ConnectionStatus =
  | 'connecting'
  | 'connected'
  | 'disconnected'
  | 'rejected';

export function useProjectChannel(projectId: string) {
  const qc = useQueryClient();
  const subscriptionRef = useRef<ReturnType<
    typeof consumer.subscriptions.create
  > | null>(null);
  const [lastReceivedAt, setLastReceivedAt] = useState<Date | null>(null);
  const [connectionStatus, setConnectionStatus] =
    useState<ConnectionStatus>('connecting');

  // Debounce timers per query key prefix to collapse rapid successive invalidations
  const debounceTimers = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map());

  const debounceInvalidate = useCallback((key: string, fn: () => void) => {
    const existing = debounceTimers.current.get(key);
    if (existing) clearTimeout(existing);
    debounceTimers.current.set(key, setTimeout(() => {
      debounceTimers.current.delete(key);
      fn();
    }, 300));
  }, []);

  useEffect(() => {
    setConnectionStatus('connecting');
    subscriptionRef.current = consumer.subscriptions.create(
      { channel: 'ProjectChannel', project_id: projectId },
      {
        connected() {
          setConnectionStatus('connected');
        },
        disconnected() {
          setConnectionStatus('disconnected');
        },
        rejected() {
          setConnectionStatus('rejected');
        },
        received(data: ProjectEvent) {
          setLastReceivedAt(new Date());
          switch (data.event) {
            case 'sprint_updated':
              debounceInvalidate(`sprints-${projectId}`, () =>
                qc.invalidateQueries({ queryKey: ['sprints', projectId] }),
              );
              debounceInvalidate(`kanban-${projectId}`, () =>
                qc.invalidateQueries({ queryKey: ['kanban', projectId] }),
              );
              break;
            case 'task_updated':
              debounceInvalidate(`kanban-${projectId}`, () =>
                qc.invalidateQueries({ queryKey: ['kanban', projectId] }),
              );
              debounceInvalidate(`sprints-${projectId}`, () =>
                qc.invalidateQueries({ queryKey: ['sprints', projectId] }),
              );
              break;
            case 'comment_updated':
              debounceInvalidate(`${data.ticket_type}-${data.ticket_id}`, () =>
                qc.invalidateQueries({
                  queryKey: [data.ticket_type, data.ticket_id, projectId],
                }),
              );
              break;
            case 'ticket_updated':
              debounceInvalidate(`sprints-${projectId}`, () =>
                qc.invalidateQueries({ queryKey: ['sprints', projectId] }),
              );
              debounceInvalidate(`kanban-${projectId}`, () =>
                qc.invalidateQueries({ queryKey: ['kanban', projectId] }),
              );
              break;
          }
        },
      },
    );

    return () => {
      subscriptionRef.current?.unsubscribe();
      debounceTimers.current.forEach((t) => clearTimeout(t));
      debounceTimers.current.clear();
    };
  }, [projectId, qc, debounceInvalidate]);

  return { lastReceivedAt, connectionStatus };
}
