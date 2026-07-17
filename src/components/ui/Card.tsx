/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { HTMLAttributes, ReactNode } from 'react';
import { cn } from '../../utils';

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  hoverable?: boolean;
  className?: string;
  id?: string;
}

export function Card({ children, className, hoverable = false, id, ...props }: CardProps) {
  return (
    <div
      id={id || `card-${Math.random().toString(36).substr(2, 9)}`}
      className={cn(
        'bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm transition-all duration-300',
        'dark:bg-[#09090b] dark:border-white/5 dark:shadow-2xl dark:shadow-black',
        hoverable && 'hover:shadow-md hover:border-slate-300 hover:scale-[1.005] dark:hover:border-white/10 dark:hover:bg-[#0d0d11]',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({ children, className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('px-6 py-4 border-b border-slate-100 dark:border-white/5', className)} {...props}>
      {children}
    </div>
  );
}

export function CardTitle({ children, className, ...props }: HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3
      className={cn('text-base font-semibold text-slate-900 tracking-tight dark:text-white font-display', className)}
      {...props}
    >
      {children}
    </h3>
  );
}

export function CardDescription({ children, className, ...props }: HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p className={cn('text-xs text-slate-500 mt-1 dark:text-slate-400', className)} {...props}>
      {children}
    </p>
  );
}

export function CardBody({ children, className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('p-6 text-sm text-slate-600 dark:text-slate-300', className)} {...props}>
      {children}
    </div>
  );
}

export function CardFooter({ children, className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between dark:bg-[#09090b]/50 dark:border-white/5', className)} {...props}>
      {children}
    </div>
  );
}
