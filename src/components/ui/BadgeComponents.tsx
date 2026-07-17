/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ReactNode } from 'react';
import { Award, Zap, ShieldCheck, Check, AlertCircle, Sparkles } from 'lucide-react';
import { Badge } from './Badge';
import { cn } from '../../utils';

interface BadgeWrapperProps {
  children?: ReactNode;
  className?: string;
}

// XP BADGE
export function XPBadge({ xp = 15, className }: { xp?: number; className?: string }) {
  return (
    <Badge
      className={cn(
        'bg-indigo-500/10 text-indigo-500 dark:text-indigo-400 border-indigo-500/20 px-2.5 py-0.5 rounded-full font-mono font-bold text-[10px] flex items-center gap-1 shrink-0',
        className
      )}
    >
      <Zap className="h-3 w-3 fill-indigo-500 dark:fill-indigo-400" />
      <span>{xp} XP</span>
    </Badge>
  );
}

// PREMIUM BADGE
export function PremiumBadge({ className }: BadgeWrapperProps) {
  return (
    <Badge
      className={cn(
        'bg-linear-to-r from-purple-500/20 via-pink-500/20 to-indigo-500/20 border-purple-500/30 text-purple-600 dark:text-purple-300 font-display font-semibold tracking-wide text-[10px] px-2.5 py-0.5 rounded-full flex items-center gap-1 shadow-xs shrink-0',
        className
      )}
    >
      <Sparkles className="h-3 w-3 text-purple-500" />
      <span>PRO MEMBER</span>
    </Badge>
  );
}

// VERIFIED BADGE
export function VerifiedBadge({ label = 'Verified', className }: { label?: string; className?: string }) {
  return (
    <Badge
      className={cn(
        'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20 px-2 py-0.5 rounded-full text-[10px] font-semibold flex items-center gap-1 shrink-0',
        className
      )}
    >
      <ShieldCheck className="h-3 w-3" />
      <span>{label}</span>
    </Badge>
  );
}

// SUCCESS BADGE
export function SuccessBadge({ label = 'Approved', className }: { label?: string; className?: string }) {
  return (
    <Badge
      variant="success"
      className={cn(
        'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 px-2 py-0.5 rounded-full text-[10px] font-semibold flex items-center gap-1 shrink-0',
        className
      )}
    >
      <Check className="h-3 w-3" />
      <span>{label}</span>
    </Badge>
  );
}

// WARNING BADGE
export function WarningBadge({ label = 'Pending', className }: { label?: string; className?: string }) {
  return (
    <Badge
      variant="warning"
      className={cn(
        'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20 px-2 py-0.5 rounded-full text-[10px] font-semibold flex items-center gap-1 shrink-0',
        className
      )}
    >
      <AlertCircle className="h-3 w-3" />
      <span>{label}</span>
    </Badge>
  );
}

// NEW BADGE
export function NewBadge({ className }: BadgeWrapperProps) {
  return (
    <Badge
      className={cn(
        'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/25 px-2 py-0.5 rounded-md font-mono font-bold text-[9px] tracking-wider uppercase shrink-0',
        className
      )}
    >
      New
    </Badge>
  );
}
