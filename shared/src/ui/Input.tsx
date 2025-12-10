import React from 'react';
import clsx from 'clsx';
import { useThemeColor } from '..';

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, placeholder, error, className, ...props }, ref) => {
    const { getColor } = useThemeColor();

    return (
      <div className="flex flex-col gap-1 w-full">
        {/* Label */}
        {label && (
          <label
            className="text-[11px] font-medium"
            style={{ color: getColor('text_light') }}
          >
            {label}
          </label>
        )}

        {/* Input */}
        <input
          ref={ref}
          placeholder={placeholder}
          className={clsx(
            'w-full rounded-md px-3 py-2 text-sm outline-none transition border',
            error && 'border-red-500',
            className
          )}
          style={{
            backgroundColor: getColor('background_light'),
            color: getColor('text'),
            borderColor: error ? getColor('delete') : getColor('border'),
            borderWidth: '1px',
          }}
          {...props}
        />

        {/* Error */}
        {error && (
          <span
            className="text-[10px] mt-0.5"
            style={{ color: getColor('delete') }}
          >
            {error}
          </span>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
