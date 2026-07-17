/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { HTMLAttributes, ReactNode } from 'react';
import { cn } from '../../utils';

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  children: ReactNode;
  variant?: 'primary' | 'success' | 'warning' | 'danger' | 'neutral';
  className?: string;
  id?: string;
}

export function Badge({ children, className, variant = 'primary', id, ...props }: BadgeProps) {
  const baseStyle = 'inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium font-mono tracking-tight';

  const variants = {
    primary: 'bg-indigo-50 text-indigo-700 border border-indigo-200 dark:bg-indigo-950/40 dark:text-indigo-400 dark:border-indigo-900',
    success: 'bg-brand-50 text-brand-700 border border-brand-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-900',
    warning: 'bg-amber-50 text-amber-700 border border-amber-200 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-900',
    danger: 'bg-rose-50 text-rose-700 border border-rose-200 dark:bg-rose-950/40 dark:text-rose-400 dark:border-rose-900',
    neutral: 'bg-slate-100 text-slate-700 border border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700',
  };

  return (
    <span
      id={id || `badge-${Math.random().toString(36).substr(2, 9)}`}
      className={cn(baseStyle, variants[variant], className)}
      {...props}
    >
      {children}
    </span>
  );
}
