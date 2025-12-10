import { useGlobalStore } from '../store/useGlobalStore';
import { ColorKey, Colors, ThemeName } from '../theme/theme';

export const useThemeColor = () => {
  const theme = useGlobalStore((s) => s.theme) as ThemeName;

  const getColor = (colorKey: ColorKey) => {
    return Colors[theme ?? 'light'][colorKey];
  };

  return { getColor, theme };
};
