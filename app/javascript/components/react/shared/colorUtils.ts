import Color from 'color';

export function idealTextColor(hex: string | null): string {
  if (!hex) return '#000000';
  try {
    const c = hex.replace('#', '');
    const r = Number.parseInt(c.substring(0, 2), 16);
    const g = Number.parseInt(c.substring(2, 4), 16);
    const b = Number.parseInt(c.substring(4, 6), 16);
    const bgDelta = r * 0.299 + g * 0.587 + b * 0.114;
    return 255 - bgDelta < 105 ? Color(hex).darken(0.7).hex() : '#ffffff';
  } catch {
    return '#000000';
  }
}

export function categoryBadgeStyle(color: string | null) {
  const c = color ?? '#E2E3E5';
  try {
    return {
      backgroundColor: c,
      color: idealTextColor(c),
      border: `1px solid ${Color(c).darken(0.1).hex()}`,
    };
  } catch {
    return { backgroundColor: c };
  }
}
