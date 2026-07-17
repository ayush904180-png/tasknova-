/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { cn } from '../../utils';

export type AvatarSize = 'sm' | 'md' | 'lg';
export type AvatarStatus = 'online' | 'idle' | 'offline' | 'none';

export interface AvatarProps {
  src?: string;
  alt?: string;
  initials?: string;
  size?: AvatarSize;
  status?: AvatarStatus;
  className?: string;
}

export function Avatar({
  src,
  alt = 'User Avatar',
  initials = 'JD',
  size = 'md',
  status = 'none',
  className
}: AvatarProps) {
  const sizeClasses = {
    sm: 'h-8 w-8 text-xs',
    md: 'h-12 w-12 text-sm',
    lg: 'h-16 w-16 text-lg',
  };

  const statusIndicatorSizes = {
    sm: 'h-2 w-2 ring-1.5',
    md: 'h-3 w-3 ring-2',
    lg: 'h-4 w-4 ring-2',
  };

  const statusColors = {
    online: 'bg-emerald-400',
    idle: 'bg-amber-400',
    offline: 'bg-zinc-500',
    none: 'hidden',
  };

  return (
    <div className={cn('relative inline-block shrink-0', className)} id={`avatar-wrapper-${initials}`}>
      {src ? (
        <img
          src={src}
          alt={alt}
          referrerPolicy="no-referrer"
          className={cn('rounded-full object-cover border border-slate-200 dark:border-white/10', sizeClasses[size])}
        />
      ) : (
        <div
          className={cn(
            'rounded-full bg-linear-to-tr from-indigo-500 to-purple-600 text-white font-bold font-display flex items-center justify-center border border-slate-200 dark:border-white/10 select-none shadow-sm',
            sizeClasses[size]
          )}
        >
          {initials}
        </div>
      )}

      {status !== 'none' && (
        <span
          className={cn(
            'absolute bottom-0 right-0 rounded-full ring-white dark:ring-[#030303] block',
            statusIndicatorSizes[size],
            statusColors[status]
          )}
          aria-label={`Status: ${status}`}
          title={`Status: ${status}`}
        />
      )}
    </div>
  );
}
