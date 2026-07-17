/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { cn } from '../../utils';

// SPINNER
export interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function Spinner({ size = 'md', className }: SpinnerProps) {
  const sizes = {
    sm: 'h-4 w-4 stroke-[3]',
    md: 'h-7 w-7 stroke-[2.5]',
    lg: 'h-12 w-12 stroke-[2]',
  };

  return (
    <svg
      className={cn('animate-spin text-indigo-500 dark:text-indigo-400', sizes[size], className)}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-20 stroke-current"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-80 fill-current"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );
}

// SKELETON
export interface SkeletonProps {
  variant?: 'text' | 'rect' | 'circle';
  className?: string;
  width?: string | number;
  height?: string | number;
}

export function Skeleton({ variant = 'rect', className, width, height }: SkeletonProps) {
  const styles = {
    text: 'h-3.5 w-3/4 rounded',
    rect: 'h-24 w-full rounded-xl',
    circle: 'h-12 w-12 rounded-full',
  };

  return (
    <div
      style={{ width, height }}
      className={cn(
        'animate-pulse bg-slate-200 dark:bg-white/5',
        styles[variant],
        className
      )}
    />
  );
}

// PROGRESS BAR
export interface ProgressBarProps {
  progress: number; // 0 to 100
  className?: string;
}

export function ProgressBar({ progress, className }: ProgressBarProps) {
  const clampedProgress = Math.max(0, Math.min(100, progress));

  return (
    <div className={cn('w-full bg-slate-100 dark:bg-white/5 h-2 rounded-full overflow-hidden', className)} id="progress-bar-wrapper">
      <div
        className="bg-indigo-500 h-full rounded-full transition-all duration-350 ease-out"
        style={{ width: `${clampedProgress}%` }}
        role="progressbar"
        aria-valuenow={clampedProgress}
        aria-valuemin={0}
        aria-valuemax={100}
      />
    </div>
  );
}

// PAGE LOADER (IMMERSIVE CONTEXT LOADER)
export function PageLoader({ text = 'Aligning Neural Datasets...' }: { text?: string }) {
  return (
    <div className="min-h-[400px] w-full flex flex-col items-center justify-center gap-4 text-center p-8 bg-slate-50/50 dark:bg-transparent rounded-2xl border border-slate-200/50 dark:border-white/5" id="page-loader-wrapper">
      <Spinner size="lg" />
      <div className="space-y-1">
        <h4 className="text-xs font-bold uppercase tracking-widest font-mono text-slate-800 dark:text-zinc-300">{text}</h4>
        <p className="text-[11px] font-mono text-slate-400">WCAG 2.1 AAA accessibility metrics live</p>
      </div>
    </div>
  );
}

// CARD LOADER
export function CardLoader() {
  return (
    <div className="p-5 border border-slate-200 dark:border-white/5 rounded-xl bg-white dark:bg-[#09090b] space-y-4 text-left shadow-xs" id="card-loader-wrapper">
      <div className="flex justify-between items-center">
        <Skeleton variant="text" className="w-1/3 h-4" />
        <Skeleton variant="text" className="w-16 h-3.5 rounded-full" />
      </div>
      <div className="space-y-2">
        <Skeleton variant="text" className="w-full h-4" />
        <Skeleton variant="text" className="w-5/6 h-3.5" />
      </div>
      <div className="pt-4 border-t border-slate-100 dark:border-white/5 flex justify-between items-center">
        <div className="flex gap-2 items-center">
          <Skeleton variant="circle" className="h-6 w-6" />
          <Skeleton variant="text" className="w-12 h-3" />
        </div>
        <Skeleton variant="text" className="w-20 h-7 rounded-lg" />
      </div>
    </div>
  );
}
