
export type ThemeName = 'light' | 'dark';

export type ThemePalette = {
  bodyBg: string;
  bodyText: string;

  panelBg: string;
  panelBorder: string;

  accent: string;
  accentSoft: string;

  subtleText: string;
  mutedText: string;

  inputBg: string;
  inputBorder: string;
};

export const themePalettes: Record<ThemeName, ThemePalette> = {
  dark: {
    bodyBg: 'bg-slate-950',
    bodyText: 'text-slate-100',

    panelBg: 'bg-slate-900/80',
    panelBorder: 'border-slate-800',

    accent: 'text-sky-400',
    accentSoft: 'bg-sky-500/10',

    subtleText: 'text-slate-400',
    mutedText: 'text-slate-500',

    inputBg: 'bg-slate-900',
    inputBorder: 'border-slate-700',
  },
  light: {
    bodyBg: 'bg-slate-50',
    bodyText: 'text-slate-900',

    panelBg: 'bg-white',
    panelBorder: 'border-slate-200',

    accent: 'text-sky-600',
    accentSoft: 'bg-sky-100',

    subtleText: 'text-slate-500',
    mutedText: 'text-slate-400',

    inputBg: 'bg-white',
    inputBorder: 'border-slate-300',
  },
};

