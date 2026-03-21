import { AlertTriangle, RefreshCw, WifiOff } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '~/components/ui/tooltip';
import type { ConnectionStatus } from '~/hooks/useProjectChannel';

interface Props {
  lastReceivedAt: Date | null;
  connectionStatus: ConnectionStatus;
}

export default function SyncIndicator({
  lastReceivedAt,
  connectionStatus,
}: Props) {
  const { t } = useTranslation();
  const [fresh, setFresh] = useState(false);
  const [label, setLabel] = useState('');

  const relativeTime = useCallback(
    (date: Date): string => {
      const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
      if (seconds < 10) return t('sync.justNow');
      if (seconds < 60) return t('sync.secondsAgo', { count: seconds });
      const minutes = Math.floor(seconds / 60);
      if (minutes < 60)
        return minutes === 1
          ? t('sync.minuteAgo')
          : t('sync.minutesAgo', { count: minutes });
      const hours = Math.floor(minutes / 60);
      return hours === 1
        ? t('sync.hourAgo')
        : t('sync.hoursAgo', { count: hours });
    },
    [t],
  );

  useEffect(() => {
    if (!lastReceivedAt) return;
    setFresh(true);
    setLabel(relativeTime(lastReceivedAt));

    const freshnessTimer = setTimeout(() => setFresh(false), 1500);

    const ticker = setInterval(() => {
      setLabel(relativeTime(lastReceivedAt));
    }, 10000);

    return () => {
      clearTimeout(freshnessTimer);
      clearInterval(ticker);
    };
  }, [lastReceivedAt, relativeTime]);

  if (connectionStatus === 'rejected') {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <span className="flex cursor-default items-center gap-1 text-xs text-destructive">
              <AlertTriangle size={11} />
              {t('sync.unavailable')}
            </span>
          </TooltipTrigger>
          <TooltipContent side="bottom">
            <p>{t('sync.unavailableTooltip')}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  if (connectionStatus === 'disconnected') {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <span className="flex cursor-default items-center gap-1 text-xs text-muted-foreground/50">
              <WifiOff size={11} />
              {t('sync.reconnecting')}
            </span>
          </TooltipTrigger>
          <TooltipContent side="bottom">
            <p>{t('sync.reconnectingTooltip')}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  if (!lastReceivedAt) return null;

  const exactTime = lastReceivedAt.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <span
            className={`flex cursor-default items-center gap-1 text-xs transition-colors duration-300 ${
              fresh ? 'text-green-500' : 'text-muted-foreground/50'
            }`}
          >
            <RefreshCw size={11} className={fresh ? 'animate-spin' : ''} />
            {label}
          </span>
        </TooltipTrigger>
        <TooltipContent side="bottom">
          <p>{exactTime}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
