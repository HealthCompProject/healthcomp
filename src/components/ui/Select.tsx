'use client';

import { forwardRef, type SelectHTMLAttributes } from 'react';

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  options: readonly SelectOption[];
  error?: string;
  helperText?: string;
  variant?: 'dark' | 'light';
  placeholder?: string;
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, options, error, helperText, variant = 'dark', placeholder = 'Select...', className = '', id, ...props }, ref) => {
    const inputId = id || label.toLowerCase().replace(/\s+/g, '-');

    const selectClasses =
      variant === 'dark'
        ? 'bg-navy-800 border-white/10 text-white focus:border-gold-500 focus:ring-gold-500/20'
        : 'bg-white border-navy-200 text-navy-950 focus:border-gold-500 focus:ring-gold-500/20';

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
        <select
          ref={ref}
          id={inputId}
          className={`
            w-full rounded-lg border px-3 py-2.5 text-sm
            transition-colors duration-200
            focus:outline-none focus:ring-2
            appearance-none
            bg-[url('data:image/svg+xml;charset=UTF-8,%3csvg%20xmlns%3d%22http%3a%2f%2fwww.w3.org%2f2000%2fsvg%22%20width%3d%2224%22%20height%3d%2224%22%20viewBox%3d%220%200%2024%2024%22%20fill%3d%22none%22%20stroke%3d%22%239fb3c8%22%20stroke-width%3d%222%22%20stroke-linecap%3d%22round%22%20stroke-linejoin%3d%22round%22%3e%3cpolyline%20points%3d%226%209%2012%2015%2018%209%22%3e%3c%2fpolyline%3e%3c%2fsvg%3e')]
            bg-[length:1.25rem] bg-[right_0.5rem_center] bg-no-repeat pr-10
            ${selectClasses}
            ${error ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : ''}
          `}
          {...props}
        >
          <option value="" disabled>
            {placeholder}
          </option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
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

Select.displayName = 'Select';

export default Select;
