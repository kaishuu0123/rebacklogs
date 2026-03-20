import { CheckIcon } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { THEME_PREVIEWS, type ThemePreview } from '~/lib/theme-previews';
import { cn } from '~/lib/utils';

interface ThemePickerProps {
  currentTheme: string;
  inputName: string;
}

function ThemeCard({
  theme,
  selected,
  onSelect,
}: {
  theme: ThemePreview;
  selected: boolean;
  onSelect: (key: string) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onSelect(theme.key)}
      className={cn(
        'group relative flex flex-col gap-2 rounded-lg border p-3 text-left transition-all hover:border-primary hover:shadow-sm',
        selected
          ? 'border-primary ring-2 ring-primary ring-offset-1'
          : 'border-border',
      )}
      style={{ backgroundColor: theme.background }}
    >
      {selected && (
        <div className="absolute right-2 top-2 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-primary-foreground">
          <CheckIcon className="h-2.5 w-2.5" />
        </div>
      )}

      {/* Color chips */}
      <div className="flex gap-1">
        <span
          className="h-5 w-5 rounded-full border border-black/10"
          style={{ backgroundColor: theme.primary }}
        />
        <span
          className="h-5 w-5 rounded-full border border-black/10"
          style={{ backgroundColor: theme.accent }}
        />
        <span
          className="h-5 w-5 rounded-full border border-black/10"
          style={{ backgroundColor: theme.secondary }}
        />
        <span
          className="h-5 w-5 rounded-full border border-black/10"
          style={{ backgroundColor: theme.muted }}
        />
      </div>

      <span
        className="text-xs font-medium leading-tight"
        style={{ color: theme.primary }}
      >
        {theme.label}
      </span>
    </button>
  );
}

export default function ThemePicker({
  currentTheme,
  inputName,
}: ThemePickerProps) {
  const { t } = useTranslation();
  const [selected, setSelected] = useState(currentTheme || '');

  return (
    <div className="space-y-3">
      <input type="hidden" name={inputName} value={selected} />

      {/* "Default (no theme)" option */}
      <button
        type="button"
        onClick={() => setSelected('')}
        className={cn(
          'flex items-center gap-2 rounded-lg border px-3 py-2 text-sm transition-all hover:border-primary',
          selected === ''
            ? 'border-primary ring-2 ring-primary ring-offset-1'
            : 'border-border',
        )}
      >
        {selected === '' && <CheckIcon className="h-3.5 w-3.5 text-primary" />}
        <span>
          {t('settings.theme.default', { defaultValue: 'Default (shadcn)' })}
        </span>
      </button>

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
        {THEME_PREVIEWS.map((theme) => (
          <ThemeCard
            key={theme.key}
            theme={theme}
            selected={selected === theme.key}
            onSelect={setSelected}
          />
        ))}
      </div>
    </div>
  );
}
