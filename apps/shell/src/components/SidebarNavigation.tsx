import { Link, useLocation } from 'react-router-dom';
import clsx from 'clsx';
import { useThemeColor } from '@mfe-notion/shared';

export function SidebarNavigation() {
  const location = useLocation();
  const { getColor } = useThemeColor();

  const links = [
    { to: '/', label: 'Workspace' },
    { to: '/notes', label: 'Notes' },
    { to: '/tasks', label: 'Tasks' },
    { to: '/calendar', label: 'Calendar' },
  ];

  return (
    <nav className="flex flex-col gap-2 text-sm mb-4">
      {links.map((link) => {
        const isActive =
          location.pathname === link.to ||
          (link.to !== '/' && location.pathname.startsWith(link.to));

        return (
          <Link
            key={link.to}
            to={link.to}
            className={clsx(
              'px-2 py-1 rounded transition-colors',
              'hover:underline',
              // hover bg dinámico
              'hover:opacity-80'
            )}
            style={{
              color: getColor(isActive ? 'primary' : 'text'),
              backgroundColor: isActive
                ? getColor('background_light')
                : 'transparent',
            }}
          >
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}
