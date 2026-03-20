import {
  LayoutListIcon,
  LogOutIcon,
  PaletteIcon,
  SettingsIcon,
  UserIcon,
} from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '~/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '~/components/ui/dropdown-menu';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '~/components/ui/popover';
import { THEME_PREVIEWS } from '~/lib/theme-previews';
import { getDemoTheme, setDemoTheme } from '~/lib/theme-utils';
import { cn } from '~/lib/utils';

type CurrentUser = {
  username: string;
  imageUrl: string;
  isAdmin: boolean;
  settingsPath: string;
  profilePath: string;
  signOutPath: string;
};

type Props = {
  currentUser?: CurrentUser;
  signInPath: string;
  rootPath: string;
  demoMode?: boolean;
};

function DemoThemePicker() {
  const { t } = useTranslation();
  const [selected, setSelected] = useState(getDemoTheme);
  const [open, setOpen] = useState(false);

  const handleSelect = (key: string) => {
    setSelected(key);
    setDemoTheme(key);
    setOpen(false);
  };

  const currentTheme = THEME_PREVIEWS.find((t) => t.key === selected);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="sm" className="gap-2">
          <PaletteIcon size={14} />
          {currentTheme ? (
            <span className="flex items-center gap-1.5">
              <span
                className="inline-block h-3 w-3 rounded-full border border-black/10"
                style={{ backgroundColor: currentTheme.primary }}
              />
              {currentTheme.label}
            </span>
          ) : (
            <span>{t('settings.theme.default')}</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-80 p-3">
        <p className="mb-2 text-xs font-medium text-muted-foreground">
          {t('settings.theme.demoLabel', {
            defaultValue: 'Preview theme (saved locally)',
          })}
        </p>
        <div className="grid grid-cols-4 gap-1.5">
          {/* Default option */}
          <button
            type="button"
            onClick={() => handleSelect('')}
            className={cn(
              'flex flex-col items-center gap-1 rounded-md border p-1.5 text-center transition-all hover:border-primary',
              selected === ''
                ? 'border-primary ring-1 ring-primary'
                : 'border-border',
            )}
          >
            <span className="flex gap-0.5">
              <span className="h-3.5 w-3.5 rounded-full border border-black/10 bg-zinc-900" />
            </span>
            <span className="text-[10px] leading-tight">Default</span>
          </button>

          {THEME_PREVIEWS.map((theme) => (
            <button
              key={theme.key}
              type="button"
              onClick={() => handleSelect(theme.key)}
              className={cn(
                'flex flex-col items-center gap-1 rounded-md border p-1.5 text-center transition-all hover:border-primary',
                selected === theme.key
                  ? 'border-primary ring-1 ring-primary'
                  : 'border-border',
              )}
              style={{ backgroundColor: theme.background }}
            >
              <span className="flex gap-0.5">
                <span
                  className="h-3.5 w-3.5 rounded-full border border-black/10"
                  style={{ backgroundColor: theme.primary }}
                />
                <span
                  className="h-3.5 w-3.5 rounded-full border border-black/10"
                  style={{ backgroundColor: theme.accent }}
                />
              </span>
              <span
                className="line-clamp-1 text-[10px] leading-tight"
                style={{ color: theme.primary }}
              >
                {theme.label}
              </span>
            </button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}

function signOut(signOutPath: string) {
  const csrfToken =
    document.querySelector<HTMLMetaElement>('meta[name="csrf-token"]')
      ?.content ?? '';
  const form = document.createElement('form');
  form.method = 'post';
  form.action = signOutPath;
  const methodInput = document.createElement('input');
  methodInput.type = 'hidden';
  methodInput.name = '_method';
  methodInput.value = 'delete';
  const csrfInput = document.createElement('input');
  csrfInput.type = 'hidden';
  csrfInput.name = 'authenticity_token';
  csrfInput.value = csrfToken;
  form.append(methodInput, csrfInput);
  document.body.appendChild(form);
  form.submit();
}

export default function Header({
  currentUser,
  signInPath,
  rootPath,
  demoMode,
}: Props) {
  const { t } = useTranslation();
  return (
    <header className="border-b">
      <nav className="flex items-center justify-between px-4 h-14">
        <a href={rootPath} className="flex items-center gap-2 font-bold tracking-tight">
          <LayoutListIcon size={18} />
          Re:Backlogs
        </a>

        <ul className="hidden md:flex items-center gap-1">
          {demoMode && (
            <li>
              <DemoThemePicker />
            </li>
          )}

          {currentUser?.isAdmin && (
            <li>
              <Button variant="ghost" size="sm" asChild>
                <a href={currentUser.settingsPath}>
                  <SettingsIcon size={14} />
                  {t('action.settings')}
                </a>
              </Button>
            </li>
          )}

          <li>
            {currentUser ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="gap-2">
                    <img
                      src={currentUser.imageUrl}
                      width={24}
                      className="rounded"
                      alt={currentUser.username}
                    />
                    <span>{currentUser.username}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem asChild>
                    <a href={currentUser.profilePath}>
                      <UserIcon size={14} />
                      {t('settings.userSettings')}
                    </a>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onSelect={() => signOut(currentUser.signOutPath)}>
                    <LogOutIcon size={14} />
                    {t('action.signOut')}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button variant="ghost" size="sm" asChild>
                <a href={signInPath}>{t('action.signIn')}</a>
              </Button>
            )}
          </li>
        </ul>
      </nav>
    </header>
  );
}
