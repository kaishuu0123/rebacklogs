import { AlertTriangle, RefreshCw, WifiOff } from 'lucide-react';
import { useEffect, useState } from 'react';
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

function relativeTime(date: Date): string {
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
  if (seconds < 10) return 'just now';
  if (seconds < 60) return `${seconds} seconds ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60)
    return minutes === 1 ? '1 minute ago' : `${minutes} minutes ago`;
  const hours = Math.floor(minutes / 60);
  return hours === 1 ? '1 hour ago' : `${hours} hours ago`;
}

export default function SyncIndicator({ lastReceivedAt, connectionStatus }: Props) {
  const [fresh, setFresh] = useState(false);
  const [label, setLabel] = useState('');

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
  }, [lastReceivedAt]);

  if (connectionStatus === 'rejected') {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <span className="flex cursor-default items-center gap-1 text-xs text-destructive">
              <AlertTriangle size={11} />
              sync unavailable
            </span>
          </TooltipTrigger>
          <TooltipContent side="bottom">
            <p>リアルタイム同期が無効です。ページを再読み込みしてください。</p>
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
              reconnecting...
            </span>
          </TooltipTrigger>
          <TooltipContent side="bottom">
            <p>接続が切断されました。再接続中...</p>
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
