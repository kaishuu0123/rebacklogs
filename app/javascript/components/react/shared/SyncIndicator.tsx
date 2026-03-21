import { RefreshCw } from 'lucide-react';
import { useEffect, useState } from 'react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '~/components/ui/tooltip';

interface Props {
  lastReceivedAt: Date | null;
}

function relativeTime(date: Date): string {
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
  if (seconds < 10) return 'just now';
  if (seconds < 60) return `${seconds} seconds ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return minutes === 1 ? '1 minute ago' : `${minutes} minutes ago`;
  const hours = Math.floor(minutes / 60);
  return hours === 1 ? '1 hour ago' : `${hours} hours ago`;
}

export default function SyncIndicator({ lastReceivedAt }: Props) {
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
