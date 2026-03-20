import { format, parseISO } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { useState } from 'react';
import type { DateRange } from 'react-day-picker';
import { cn } from '~/lib/utils';
import { Calendar } from './calendar';
import { Popover, PopoverContent, PopoverTrigger } from './popover';

interface DateRangePickerProps {
  from: string | null; // YYYY-MM-DD
  to: string | null;   // YYYY-MM-DD
  onChange: (from: string | null, to: string | null) => void;
  placeholder?: string;
  className?: string;
}

export function DateRangePicker({
  from,
  to,
  onChange,
  placeholder = '–',
  className,
}: DateRangePickerProps) {
  const [open, setOpen] = useState(false);

  const selected: DateRange | undefined = from
    ? { from: parseISO(from), to: to ? parseISO(to) : undefined }
    : undefined;

  const handleSelect = (range: DateRange | undefined) => {
    const newFrom = range?.from ? format(range.from, 'yyyy-MM-dd') : null;
    const newTo = range?.to ? format(range.to, 'yyyy-MM-dd') : null;
    onChange(newFrom, newTo);
    // Close only when both dates are selected and they are different days
    if (newFrom && newTo && newFrom !== newTo) setOpen(false);
  };

  const label = from
    ? to
      ? `${format(parseISO(from), 'yyyy/MM/dd')} – ${format(parseISO(to), 'yyyy/MM/dd')}`
      : format(parseISO(from), 'yyyy/MM/dd')
    : placeholder;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          className={cn(
            'flex h-8 items-center gap-2 rounded-md border border-input bg-background px-3 text-sm hover:bg-accent',
            !from && 'text-muted-foreground',
            className,
          )}
        >
          <CalendarIcon className="h-4 w-4 shrink-0 opacity-60" />
          <span>{label}</span>
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="range"
          selected={selected}
          onSelect={handleSelect}
          numberOfMonths={2}
        />
      </PopoverContent>
    </Popover>
  );
}
