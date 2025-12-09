import { useGlobalStore } from '../store/useGlobalStore';
import { ThemeName, themePalettes } from '../theme/theme';

// Hook de tema global
export function useTheme() {
  const theme = useGlobalStore((s) => s.theme) as ThemeName;
  const toggleTheme = useGlobalStore((s) => s.toggleTheme);

  const palette = themePalettes[theme];

  return {
    theme,
    isDark: theme === 'dark',
    isLight: theme === 'light',
    palette,
    toggleTheme,
  };
}
