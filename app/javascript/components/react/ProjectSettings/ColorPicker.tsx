import { useEffect, useRef, useState } from 'react';
import { HexColorPicker } from 'react-colorful';

interface Props {
  value: string;
  onChange: (color: string) => void;
}

export default function ColorPicker({ value, onChange }: Props) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div ref={ref} className="relative">
      <div className="flex gap-2">
        <button
          type="button"
          className="h-9 w-9 shrink-0 rounded-md border border-input cursor-pointer"
          style={{ backgroundColor: value }}
          onClick={() => setOpen(!open)}
        />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="h-9 flex-1 rounded-md border border-input bg-background px-3 text-sm font-mono focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        />
      </div>
      {open && (
        <div className="absolute top-11 left-0 z-50 shadow-lg rounded-lg overflow-hidden">
          <HexColorPicker color={value} onChange={onChange} />
        </div>
      )}
    </div>
  );
}
