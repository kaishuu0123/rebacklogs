import { PRESET_CSS_VAR_KEYS, PRESETS_LIGHT } from './theme-presets-light';

const STORAGE_KEY = 'demo-theme';

export function getDemoTheme(): string {
  try {
    return localStorage.getItem(STORAGE_KEY) ?? '';
  } catch {
    return '';
  }
}

export function setDemoTheme(themeKey: string) {
  try {
    if (themeKey) {
      localStorage.setItem(STORAGE_KEY, themeKey);
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  } catch {}
  applyDemoTheme(themeKey);
}

export function applyDemoTheme(themeKey: string) {
  const root = document.documentElement;
  // Clear any previously applied demo variables first
  for (const key of PRESET_CSS_VAR_KEYS) {
    root.style.removeProperty(`--${key}`);
  }
  if (!themeKey) return;
  const vars = PRESETS_LIGHT[themeKey];
  if (!vars) return;
  for (const [key, value] of Object.entries(vars)) {
    root.style.setProperty(`--${key}`, value);
  }
}
