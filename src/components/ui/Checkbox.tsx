'use client';

import { forwardRef, type InputHTMLAttributes } from 'react';

interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label: string;
  description?: string;
  variant?: 'dark' | 'light';
}

const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, description, variant = 'dark', className = '', id, ...props }, ref) => {
    const inputId = id || label.toLowerCase().replace(/\s+/g, '-');

    return (
      <div className={`flex items-start gap-3 ${className}`}>
        <input
          ref={ref}
          type="checkbox"
          id={inputId}
          className={`
            mt-1 h-4 w-4 rounded border transition-colors
            focus:ring-2 focus:ring-gold-500/50 focus:ring-offset-2
            ${variant === 'dark'
              ? 'border-white/20 bg-navy-800 text-gold-500 focus:ring-offset-navy-950'
              : 'border-navy-300 bg-white text-gold-500 focus:ring-offset-white'
            }
          `}
          {...props}
        />
        <div>
          <label
            htmlFor={inputId}
            className={`text-sm font-medium cursor-pointer ${
              variant === 'dark' ? 'text-white' : 'text-navy-900'
            }`}
          >
            {label}
          </label>
          {description && (
            <p className={`text-sm mt-0.5 ${
              variant === 'dark' ? 'text-white/50' : 'text-navy-500'
            }`}>
              {description}
            </p>
          )}
        </div>
      </div>
    );
  }
);

Checkbox.displayName = 'Checkbox';

export default Checkbox;
