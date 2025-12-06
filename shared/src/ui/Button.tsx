import React from 'react';
import clsx from 'clsx';

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
  isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      variant = 'primary',
      size = 'md',
      icon,
      isLoading = false,
      disabled,
      className,
      ...props
    },
    ref
  ) => {
    const isDisabled = disabled || isLoading;

    const hasChildren = Boolean(children);
    const hasIcon = Boolean(icon);

    const justifyContent =
      hasChildren && hasIcon ? 'justify-between' : 'justify-center';

    return (
      <button
        ref={ref}
        disabled={isDisabled}
        className={clsx(
          'inline-flex items-center gap-2 rounded-md font-medium transition border outline-none',
          'focus:ring-2 focus:ring-sky-500 focus:ring-offset-0',

          // Variantes
          variant === 'primary' &&
            'bg-sky-600 hover:bg-sky-700 border-sky-500 text-white',
          variant === 'secondary' &&
            'bg-slate-800 hover:bg-slate-700 border-slate-600 text-slate-200',
          variant === 'danger' &&
            'bg-red-600 hover:bg-red-700 border-red-500 text-white',
          variant === 'ghost' &&
            'bg-transparent border-slate-700 hover:bg-slate-800 text-slate-200',

          // Tamaños
          size === 'sm' && 'text-xs px-2 py-1',
          size === 'md' && 'text-sm px-3 py-1.5',
          size === 'lg' && 'text-base px-4 py-2',

          // Estado disabled
          isDisabled &&
            'opacity-55 cursor-not-allowed hover:bg-inherit hover:border-inherit',

          // Reglas de layout
          justifyContent,

          className
        )}
        {...props}
      >
        {/* Spinner al cargar */}
        {isLoading ? (
          <span className="animate-spin rounded-full border-[2px] border-slate-300 border-t-transparent w-3 h-3" />
        ) : (
          <>
            {/* Texto o children */}
            {hasChildren && <span>{children}</span>}

            {/* Si no hay children, icono se centra naturalmente */}
            {hasIcon && (
              <span className="flex items-center text-lg">{icon}</span>
            )}
          </>
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';
