import React from 'react';
import clsx from 'clsx';

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, placeholder, error, className, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1 w-full">
        {label && (
          <label className="text-[11px] text-slate-400 font-medium">
            {label}
          </label>
        )}

        <input
          ref={ref}
          placeholder={placeholder}
          className={clsx(
            'w-full bg-slate-950 border rounded-md px-3 py-2 text-sm text-slate-100 outline-none transition',
            'border-slate-700 focus:border-sky-500',
            error && 'border-red-500 focus:border-red-500',
            className
          )}
          {...props}
        />

        {error && (
          <span className="text-[10px] text-red-400 mt-0.5">{error}</span>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
