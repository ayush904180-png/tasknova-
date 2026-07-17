/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ButtonHTMLAttributes, ReactNode, MouseEvent } from 'react';
import { cn } from '../../utils';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  className?: string;
  id?: string;
  disabled?: boolean;
  onClick?: (event: MouseEvent<HTMLButtonElement>) => void;
}

export function Button({
  children,
  className,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled = false,
  leftIcon,
  rightIcon,
  id,
  ...props
}: ButtonProps) {
  // Styles inspired by Linear and Stripe (pristine spacing, micro border-radius, clean offsets)
  const baseStyle = 'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 active:scale-[0.98] cursor-pointer disabled:opacity-50 disabled:pointer-events-none disabled:active:scale-100';

  const variants = {
    primary: 'bg-slate-900 hover:bg-slate-800 text-white shadow-sm border border-slate-950 focus:ring-slate-500 dark:bg-white dark:hover:bg-slate-100 dark:text-slate-900 dark:border-white',
    secondary: 'bg-slate-100 hover:bg-slate-200 text-slate-900 border border-slate-200 focus:ring-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-white dark:border-slate-700',
    outline: 'bg-transparent hover:bg-slate-50 text-slate-700 border border-slate-200 focus:ring-slate-200 dark:text-slate-300 dark:border-slate-700 dark:hover:bg-slate-800',
    ghost: 'bg-transparent hover:bg-slate-100/50 text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white',
    danger: 'bg-rose-500 hover:bg-rose-600 text-white shadow-sm border border-rose-600 focus:ring-rose-400',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-xs tracking-tight',
    md: 'px-4 py-2 text-sm tracking-tight',
    lg: 'px-5 py-2.5 text-base tracking-tight',
  };

  return (
    <button
      id={id || `btn-${Math.random().toString(36).substr(2, 9)}`}
      disabled={disabled || isLoading}
      className={cn(
        baseStyle,
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {isLoading && (
        <svg
          className="animate-spin -ml-1 mr-2 h-4 w-4 text-current"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      )}

      {!isLoading && leftIcon && <span className="mr-1.5 inline-flex">{leftIcon}</span>}
      <span>{children}</span>
      {!isLoading && rightIcon && <span className="ml-1.5 inline-flex">{rightIcon}</span>}
    </button>
  );
}
