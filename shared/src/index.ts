
import { useGlobalStore } from './store/useGlobalStore';

export * from './ui/Button';
export * from './ui/Input';
export * from './ui/Loading';
export * from './store/useGlobalStore';
export * from './ui/Modal'

export const Colors = {
  light: {
    text: '#1F1F1F',
    text_messages: '#000',
    text_i: '#fff',
    text_light: '#6C6C6C',
    text_light1: '#C8C7CC',
    text_light2: '#808080',
    text_light3: '#000',
    text_dark: '#242E42',
    text_darkblue7: '#004282',
    text_darkblue8: '#002851',
    background: '#FFFFFF',
    background2: '#E9E9E9',
    background_light: '#F8F8F8',
    background_light1: '#E9E9E9',
    background_dark: '#D8D8D8',
    primary: '#1F6EFA',
    secondary: '#F8F8F8',
    border: '#E2E2E2',
    border_light: '#D8D8D8',
    border_light_i: '#444444',
    shadow: '0px 4px 20px rgba(25,26,28,0.1)',
    shadow1: '0px 4px 20px 0px rgba(25, 26, 28, 0.10)',
    disabled: '#666',
    btn_light_bg: '#eee',
    btn_dark_bg: '#000',
    btn_dark_text: '#fff',
    icons: '#8d8a9e',
    icons_light: '#AAB5C3',
    icons_dark: '#fff',
    icons1: '#A1A1A1',
    icons_i: '#C1C0C9',
    icons_bg: '#C1C0C9',
    icons_blue6: '#2563EB',
    icons_link: '#21288a',
    card_placeholder: '#efefef',
    gradient_bg_1: 'rgba(250, 250, 250, 0.3)',
    gradient_bg_2: 'rgba(250, 250, 250, 0.15)',
    success: '#25D366',
    delete: '#f82f00',
    ios_modal_status_bar: 'light',
    status_bar: 'dark',

    indigo900: '#312E81',
    amber600: '#D97706',
    blue600: '#2563EB',
    blue700: '#1D4ED8',
    darkblue700: '#004282',
    darkblue800: '#002851',

    yellow_warning: '#ffff00',
    accent: '#566193',

    badge_bg: '#1b1b1b',
    badge_border: '#1b1b1b',
    badge_icon: '#FFFFFF',
    badge_text: '#FFFFFF',

    shape_ellipse: '#EAF1FF',
    popup_icon: '#292D32',
    header: '#1F1F1F',
    subheader: '#545454',
    separator: '#DBE5F4',
    popup_trigger: '#292D32',
    post_icons: '#7D8997',

    bg_shape1: '#EFF5FF',
    bg_shape2: '#FFF',
    icons_bg1: '#EDF4FF',
  },
  dark: {
    text_messages: 'white',

    text: '#fff',
    text_i: '#000',
    text_light: '#fff',
    text_light1: '#FFFFFF',
    text_light2: '#808080',
    text_light3: '#fff',
    text_dark: '#C8C7CC',
    text_darkblue7: '#808080',
    text_darkblue8: '#777',
    background: '#1b1b1b',
    background2: '#333333',
    background_light: '#1b1b1b',
    background_light1: '#333333',
    background_dark: '#1b1b1b',
    primary: '#2563EB',
    secondary: '#222222',
    border: '#A3A3A3',
    border_light: '#444444',
    border_light_i: '#D8D8D8',
    shadow: '0px 4px 20px rgba(250, 250, 250, 0.1)',
    shadow1: '0px 4px 20px 0px rgba(250, 250, 250, 0.04)',
    disabled: '#666',
    btn_light_bg: '#eee',
    btn_dark_bg: '#222222',
    btn_dark_text: '#999',
    icons: '#C1C0C9',
    icons_dark: '#000',
    icons_light: '#A1A1A1',
    icons1: '#A1A1A1',
    icons_i: '#8d8a9e',
    icons_bg: '#A1A1A1',
    icons_blue6: '#2563EB',
    icons_link: '#766acd',
    card_placeholder: '#808080',
    gradient_bg_1: 'rgba(0, 0, 0, 0.5)',
    gradient_bg_2: 'rgba(0, 0, 0, 0.3)',
    success: '#137136',
    delete: '#f82a11',
    ios_modal_status_bar: 'light',
    status_bar: 'light',

    indigo900: '#C8C7CC',
    amber600: '#D97706',
    blue600: '#2563EB',
    blue700: '#1D4ED8',
    darkblue700: '#004282',
    darkblue800: '#002851',

    yellow_warning: '#ffca28',
    accent: '#429AFF',

    badge_bg: '#FFFFFF',
    badge_border: '#FFFFFF',
    badge_icon: '#1b1b1b',
    badge_text: '#1b1b1b',

    shape_ellipse: '#222222',
    popup_icon: '#292D32',
    header: '#fff',
    subheader: '#fff',
    separator: '#fff',
    popup_trigger: '#fff',
    post_icons: '#fff',

    bg_shape1: '#222',
    bg_shape2: '#1b1b1b',
    icons_bg1: '#444',
  },
} as const;

export type ThemeName = keyof typeof Colors; 
export type ColorKey = keyof (typeof Colors)['light'];


export const useThemeColor = () => {
  const theme = useGlobalStore((s) => s.theme) as ThemeName;

  const getColor = (colorKey: ColorKey) => {
    return Colors[theme ?? 'light'][colorKey];
  };

  return { getColor, theme };
};