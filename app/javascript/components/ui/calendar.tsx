import { ChevronLeft, ChevronRight } from 'lucide-react';
import type * as React from 'react';
import { DayPicker } from 'react-day-picker';
import { cn } from '~/lib/utils';

export type CalendarProps = React.ComponentProps<typeof DayPicker>;

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: CalendarProps) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn('p-3', className)}
      classNames={{
        months: 'flex flex-col sm:flex-row gap-4',
        month: 'flex flex-col gap-4',
        month_caption: 'flex justify-center relative items-center h-7',
        caption_label: 'text-sm font-medium',
        nav: 'absolute inset-x-0 top-0 flex justify-between items-center h-7 px-1',
        button_previous:
          'h-7 w-7 rounded-md border border-input bg-transparent p-0 opacity-50 hover:opacity-100 hover:bg-accent inline-flex items-center justify-center',
        button_next:
          'h-7 w-7 rounded-md border border-input bg-transparent p-0 opacity-50 hover:opacity-100 hover:bg-accent inline-flex items-center justify-center',
        month_grid: 'w-full border-collapse',
        weekdays: 'flex',
        weekday:
          'text-muted-foreground w-9 font-normal text-[0.8rem] text-center',
        week: 'flex w-full mt-1',
        day: 'relative p-0 text-center text-sm [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md',
        day_button:
          'h-9 w-9 p-0 font-normal rounded-md hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
        selected:
          '[&>button]:bg-primary [&>button]:text-primary-foreground [&>button]:hover:bg-primary [&>button]:hover:text-primary-foreground',
        today: '[&>button]:bg-accent [&>button]:text-accent-foreground',
        outside: 'opacity-50',
        disabled: 'opacity-50',
        range_start: 'rounded-r-none',
        range_end: 'rounded-l-none',
        range_middle:
          'bg-accent rounded-none [&>button]:!bg-transparent [&>button]:!text-foreground [&>button]:rounded-none',
        hidden: 'invisible',
        ...classNames,
      }}
      components={{
        Chevron: ({ orientation }: { orientation?: string }) =>
          orientation === 'left' ? (
            <ChevronLeft className="h-4 w-4" />
          ) : (
            <ChevronRight className="h-4 w-4" />
          ),
      }}
      {...props}
    />
  );
}

Calendar.displayName = 'Calendar';

export { Calendar };
