/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ReactNode } from 'react';
import { Coins, Award, User, TrendingUp, HelpCircle, Archive, ShieldAlert, BadgeCheck, Zap, ArrowRight, IndianRupee } from 'lucide-react';
import { Card, CardHeader, CardContent, CardFooter } from './Card';
import { Badge } from './Badge';
import { Button } from './Button';
import { cn } from '../../utils';

// TASK CARD
interface TaskCardProps {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  rewardCoins: number;
  timeEstimate: string;
  onClick?: () => void;
  actionLabel?: string;
  className?: string;
}

export function TaskCard({
  id,
  title,
  description,
  category,
  difficulty,
  rewardCoins,
  timeEstimate,
  onClick,
  actionLabel = 'Evaluate Now',
  className
}: TaskCardProps) {
  const difficultyBadgeColor = {
    Easy: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    Medium: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
    Hard: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
  };

  return (
    <Card hoverable className={cn('text-left border-slate-200 dark:border-white/5', className)}>
      <CardHeader className="flex flex-row items-center justify-between py-3.5 bg-slate-50/50 dark:bg-[#030303]/40 border-b border-slate-100 dark:border-white/5">
        <div className="flex items-center gap-2">
          <Badge className={cn('font-semibold', difficultyBadgeColor[difficulty])}>
            {difficulty}
          </Badge>
          <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400 dark:text-zinc-500">{category}</span>
        </div>
        <span className="text-[10px] font-mono font-bold text-slate-400 dark:text-zinc-500">{id}</span>
      </CardHeader>
      
      <CardContent className="p-5 space-y-4">
        <div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white font-display line-clamp-1">{title}</h3>
          <p className="text-xs text-slate-500 dark:text-zinc-400 mt-1 line-clamp-2 leading-relaxed font-sans font-light">{description}</p>
        </div>

        <div className="flex items-center justify-between border-t border-slate-100 dark:border-white/5 pt-3.5">
          <div className="flex items-center gap-1.5">
            <div className="flex h-6 w-6 items-center justify-center rounded-md bg-indigo-500/10 text-indigo-400">
              <Coins className="h-3.5 w-3.5" />
            </div>
            <div>
              <span className="text-[10px] text-slate-400 block leading-none">Reward yield</span>
              <span className="text-xs font-mono font-bold text-indigo-600 dark:text-indigo-400 mt-0.5 inline-block">{rewardCoins} Coins</span>
            </div>
          </div>

          <div className="text-right">
            <span className="text-[10px] text-slate-400 block leading-none">Est. effort</span>
            <span className="text-xs font-mono text-slate-700 dark:text-zinc-300 font-medium mt-0.5 inline-block">{timeEstimate}</span>
          </div>
        </div>
      </CardContent>

      {onClick && (
        <CardFooter className="py-3 px-5 flex items-center justify-between bg-slate-50/50 dark:bg-[#030303]/40 border-t border-slate-100 dark:border-white/5">
          <span className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
            <Zap className="h-3 w-3 fill-emerald-500 text-emerald-500" /> +{rewardCoins} Credit Potential
          </span>
          <Button variant="ghost" size="sm" onClick={onClick} className="text-xs font-semibold hover:gap-1.5 transition-all text-indigo-500 hover:text-indigo-600 dark:text-indigo-400 shrink-0">
            {actionLabel} <ArrowRight className="h-3 w-3 ml-1" />
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}

// REWARD CARD
interface RewardCardProps {
  title: string;
  totalRewards: number;
  unclaimedCoins: number;
  multiplier: number;
  onClaim?: () => void;
  className?: string;
}

export function RewardCard({
  title,
  totalRewards,
  unclaimedCoins,
  multiplier,
  onClaim,
  className
}: RewardCardProps) {
  return (
    <Card className={cn('text-left border-slate-200 dark:border-white/5 bg-gradient-to-br from-white to-slate-50 dark:from-[#09090b] dark:to-[#0d0d11]', className)}>
      <CardHeader className="flex flex-row items-center justify-between py-4 border-b border-slate-150 dark:border-white/5">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-400">
            <Award className="h-4 w-4" />
          </div>
          <span className="text-xs font-semibold text-slate-800 dark:text-zinc-200 uppercase tracking-wider font-mono">{title}</span>
        </div>
        <Badge variant="primary" className="dark:bg-indigo-500/10 dark:text-indigo-400">Multiplier: {multiplier}x</Badge>
      </CardHeader>
      
      <CardContent className="p-6 grid grid-cols-2 gap-4">
        <div>
          <span className="text-[10px] text-slate-400 uppercase tracking-wider font-mono block">Lifetime Earned</span>
          <span className="text-2xl font-bold font-display text-slate-900 dark:text-white mt-1 inline-block">{totalRewards} <span className="text-xs font-mono font-medium text-slate-400">Coins</span></span>
        </div>
        <div>
          <span className="text-[10px] text-slate-400 uppercase tracking-wider font-mono block">Unclaimed Holdings</span>
          <span className="text-2xl font-bold font-display text-indigo-600 dark:text-indigo-400 mt-1 inline-block">{unclaimedCoins} <span className="text-xs font-mono font-medium text-slate-400">Coins</span></span>
        </div>
      </CardContent>

      {onClaim && (
        <CardFooter className="py-4 border-t border-slate-150 dark:border-white/5">
          <span className="text-[11px] text-slate-500 dark:text-zinc-400 leading-tight">Minimum payouts: 500 coins to UPI/Bank.</span>
          <Button variant="primary" size="sm" onClick={onClaim} disabled={unclaimedCoins === 0} className="font-semibold text-xs py-1.5 rounded-full">
            Payout Holdings
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}

// WALLET CARD
interface WalletCardProps {
  balance: number;
  inrValue: number;
  walletAddress: string;
  transactionsCount: number;
  className?: string;
}

export function WalletCard({
  balance,
  inrValue,
  walletAddress,
  transactionsCount,
  className
}: WalletCardProps) {
  return (
    <Card className={cn('text-left border-none bg-gradient-to-br from-indigo-950 via-[#09090b] to-purple-950 text-white relative overflow-hidden', className)}>
      <div className="absolute -right-12 -bottom-12 opacity-10">
        <Coins className="h-44 w-44" />
      </div>
      <CardHeader className="border-b border-white/5 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400">Consolidated Ledger</span>
          </div>
          <Badge className="bg-white/10 text-white border-transparent font-mono text-[9px] uppercase tracking-wider">v0.1 Ledger</Badge>
        </div>
      </CardHeader>
      
      <CardContent className="p-6 space-y-4">
        <div>
          <span className="text-[10px] text-slate-400 uppercase tracking-widest font-mono block">Available Ledger Balance</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-4xl font-bold font-display text-white tracking-tight">{balance}</span>
            <span className="text-xs font-mono font-medium text-indigo-400">Coins</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/5 font-mono text-xs text-slate-300">
          <div>
            <span className="text-[9px] text-zinc-500 uppercase block tracking-wider">Estimated INR (₹)</span>
            <span className="font-semibold text-emerald-400 flex items-center gap-0.5 mt-0.5">
              <IndianRupee className="h-3.5 w-3.5" /> {inrValue.toFixed(2)}
            </span>
          </div>
          <div>
            <span className="text-[9px] text-zinc-500 uppercase block tracking-wider">Activities Tracked</span>
            <span className="font-semibold text-zinc-100 block mt-0.5">{transactionsCount} Submissions</span>
          </div>
        </div>
      </CardContent>

      <CardFooter className="py-3 px-6 bg-black/40 border-t border-white/5 font-mono text-[10px] text-zinc-500 flex justify-between items-center">
        <span className="truncate max-w-[150px]">ID: {walletAddress}</span>
        <span className="text-zinc-400 shrink-0 uppercase tracking-widest">Enterprise Ledger</span>
      </CardFooter>
    </Card>
  );
}

// PROFILE CARD
interface ProfileCardProps {
  username: string;
  role: 'Contributor' | 'Creator' | 'Administrator';
  isVerified: boolean;
  xpPoints: number;
  level: number;
  completionRate: number;
  className?: string;
}

export function ProfileCard({
  username,
  role,
  isVerified,
  xpPoints,
  level,
  completionRate,
  className
}: ProfileCardProps) {
  return (
    <Card className={cn('text-left border-slate-200 dark:border-white/5', className)}>
      <CardContent className="p-6 flex items-center gap-4">
        <div className="relative shrink-0">
          <div className="h-14 w-14 rounded-full bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center text-white shadow-md">
            <User className="h-7 w-7" />
          </div>
          <div className="absolute -bottom-1 -right-1 h-5 w-5 rounded-full bg-[#030303] flex items-center justify-center border border-white/10 text-white">
            <span className="text-[9px] font-mono font-bold">{level}</span>
          </div>
        </div>

        <div className="space-y-1 overflow-hidden">
          <div className="flex items-center gap-1.5">
            <h3 className="text-sm font-bold font-display text-slate-900 dark:text-white truncate">{username}</h3>
            {isVerified && <BadgeCheck className="h-4 w-4 text-indigo-500 dark:text-indigo-400 shrink-0" />}
          </div>
          
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider">{role}</span>
            <span className="h-1 w-1 rounded-full bg-slate-300 dark:bg-zinc-800"></span>
            <span className="text-[10px] font-mono text-indigo-500 dark:text-indigo-400 font-bold">{xpPoints} XP</span>
          </div>
        </div>
      </CardContent>

      <div className="px-6 pb-6 grid grid-cols-2 gap-4 border-t border-slate-100 dark:border-white/5 pt-4">
        <div>
          <span className="text-[9px] font-mono text-slate-400 dark:text-zinc-500 uppercase block tracking-wider">Task Level</span>
          <span className="text-sm font-bold text-slate-800 dark:text-zinc-200 mt-0.5 inline-block">Tier {level} Professional</span>
        </div>
        <div>
          <span className="text-[9px] font-mono text-slate-400 dark:text-zinc-500 uppercase block tracking-wider">Completion Accuracy</span>
          <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400 mt-0.5 inline-block">{completionRate}% Accuracy</span>
        </div>
      </div>
    </Card>
  );
}

// ANALYTICS CARD
interface AnalyticsCardProps {
  label: string;
  value: string | number;
  change: string;
  isPositive: boolean;
  chartIcon?: ReactNode;
  className?: string;
}

export function AnalyticsCard({
  label,
  value,
  change,
  isPositive,
  chartIcon,
  className
}: AnalyticsCardProps) {
  return (
    <Card className={cn('text-left border-slate-200 dark:border-white/5 p-5 flex flex-col justify-between', className)}>
      <div className="flex justify-between items-start">
        <span className="text-xs font-semibold text-slate-500 dark:text-zinc-400 uppercase tracking-wider font-mono">
          {label}
        </span>
        {chartIcon || (
          <div className="p-1.5 rounded bg-indigo-50 dark:bg-white/5 text-indigo-500 shrink-0">
            <TrendingUp className="h-4 w-4" />
          </div>
        )}
      </div>

      <div className="mt-4">
        <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white font-display leading-none">
          {value}
        </h2>
        <div className="flex items-center gap-1.5 mt-2">
          <span className={cn('text-[11px] font-mono font-bold px-1.5 py-0.5 rounded-full',
            isPositive ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'
          )}>
            {isPositive ? '+' : ''}{change}
          </span>
          <span className="text-[10px] text-slate-400 font-mono">vs previous cycle</span>
        </div>
      </div>
    </Card>
  );
}

// INFORMATION CARD
interface InformationCardProps {
  title: string;
  description: string | ReactNode;
  variant?: 'info' | 'warning' | 'danger';
  className?: string;
}

export function InformationCard({
  title,
  description,
  variant = 'info',
  className
}: InformationCardProps) {
  const borderColors = {
    info: 'border-blue-200 dark:border-blue-500/20 bg-blue-50/20 dark:bg-blue-500/5 text-blue-800 dark:text-blue-300',
    warning: 'border-amber-200 dark:border-amber-500/20 bg-amber-50/20 dark:bg-amber-500/5 text-amber-800 dark:text-amber-300',
    danger: 'border-rose-200 dark:border-rose-500/20 bg-rose-50/20 dark:bg-rose-500/5 text-rose-800 dark:text-rose-300',
  };

  const icons = {
    info: <HelpCircle className="h-5 w-5 shrink-0" />,
    warning: <ShieldAlert className="h-5 w-5 shrink-0" />,
    danger: <ShieldAlert className="h-5 w-5 shrink-0" />,
  };

  return (
    <div className={cn('p-5 rounded-xl border text-left flex gap-3.5', borderColors[variant], className)}>
      <div className="mt-0.5">{icons[variant]}</div>
      <div className="space-y-1">
        <h4 className="text-xs font-bold uppercase tracking-wider font-mono">{title}</h4>
        <div className="text-xs leading-relaxed font-sans font-light opacity-90">
          {description}
        </div>
      </div>
    </div>
  );
}

// EMPTY STATE CARD
interface EmptyCardProps {
  title: string;
  description: string;
  actionText?: string;
  onAction?: () => void;
  className?: string;
}

export function EmptyCard({
  title,
  description,
  actionText,
  onAction,
  className
}: EmptyCardProps) {
  return (
    <Card className={cn('p-8 text-center flex flex-col items-center justify-center border-dashed border-2 border-slate-200 dark:border-white/10 dark:bg-transparent', className)}>
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 dark:bg-white/5 text-slate-400 dark:text-zinc-500 mb-4">
        <Archive className="h-6 w-6" />
      </div>
      
      <h3 className="text-sm font-bold text-slate-900 dark:text-white font-display mb-1">{title}</h3>
      <p className="text-xs text-slate-500 dark:text-zinc-400 max-w-sm mb-5 leading-relaxed font-sans font-light">{description}</p>
      
      {actionText && onAction && (
        <Button variant="outline" size="sm" onClick={onAction} className="text-xs font-semibold rounded-full">
          {actionText}
        </Button>
      )}
    </Card>
  );
}
