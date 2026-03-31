'use client';

import { forwardRef, type InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  helperText?: string;
  variant?: 'dark' | 'light';
  prefix?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, variant = 'dark', prefix, className = '', id, ...props }, ref) => {
    const inputId = id || label.toLowerCase().replace(/\s+/g, '-');

    const inputClasses =
      variant === 'dark'
        ? 'bg-navy-800 border-white/10 text-white placeholder:text-white/30 focus:border-gold-500 focus:ring-gold-500/20'
        : 'bg-white border-navy-200 text-navy-950 placeholder:text-navy-400 focus:border-gold-500 focus:ring-gold-500/20';

    return (
      <div className={className}>
        <label
          htmlFor={inputId}
          className={`block text-sm font-medium mb-1.5 ${
            variant === 'dark' ? 'text-white/70' : 'text-navy-600'
          }`}
        >
          {label}
        </label>
        <div className="relative">
          {prefix && (
            <span
              className={`absolute left-3 top-1/2 -translate-y-1/2 text-sm ${
                variant === 'dark' ? 'text-white/40' : 'text-navy-400'
              }`}
            >
              {prefix}
            </span>
          )}
          <input
            ref={ref}
            id={inputId}
            className={`
              w-full rounded-lg border px-3 py-2.5 text-sm
              transition-colors duration-200
              focus:outline-none focus:ring-2
              ${inputClasses}
              ${prefix ? 'pl-7' : ''}
              ${error ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : ''}
            `}
            {...props}
          />
        </div>
        {error && (
          <p className="mt-1 text-sm text-red-400">{error}</p>
        )}
        {helperText && !error && (
          <p
            className={`mt-1 text-sm ${
              variant === 'dark' ? 'text-white/40' : 'text-navy-400'
            }`}
          >
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;
