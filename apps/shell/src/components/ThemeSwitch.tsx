import React from 'react';
import { useGlobalStore, useThemeColor } from '@mfe-notion/shared';
import { IoSunny, IoMoon } from 'react-icons/io5';

export const ThemeSwitch: React.FC = () => {
  const { theme, toggleTheme } = useGlobalStore();
  const { getColor } = useThemeColor();

  const isDark = theme === 'dark';

  return (
    <div className="flex gap-2 items-center">
      <p className="text-xl">Tema: {theme}</p>
      <button
        onClick={toggleTheme}
        className="w-11 h-5 rounded-full flex items-center shadow transition duration-300 focus:outline-none border"
        style={{
          backgroundColor: getColor('background_light'),
          borderColor: getColor('border'),
        }}
      >
        {/* Circle that moves */}
        <div
          className={`
          w-6 h-6 rounded-full absolute flex items-center justify-center
          transition-all duration-500 transform
        `}
          style={{
            backgroundColor: isDark
              ? getColor('background_dark')
              : '#FACC15' /* amarillo */,
            color: isDark ? getColor('text') : '#ffffff',
            transform: isDark ? 'translateX(80%)' : 'translateX(-1%)',
          }}
        >
          {isDark ? (
            <IoMoon className="text-xl" />
          ) : (
            <IoSunny className="text-xl" />
          )}
        </div>
      </button>
    </div>
  );
};
