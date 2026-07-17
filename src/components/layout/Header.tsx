/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Cpu, Sun, Moon, HelpCircle, Compass, Terminal, Target, Palette } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { AppRoute } from '../../types';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';

interface HeaderProps {
  activeRoute: AppRoute;
  setActiveRoute: (route: AppRoute) => void;
}

export function Header({ activeRoute, setActiveRoute }: HeaderProps) {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200/80 bg-white/85 dark:border-white/5 dark:bg-[#030303]/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Brand Logo & Tagline */}
        <div 
          onClick={() => setActiveRoute(AppRoute.HOME)} 
          className="flex items-center gap-2.5 cursor-pointer group"
          id="header-brand-container"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-900 text-white shadow-md dark:bg-gradient-to-br dark:from-indigo-500 dark:via-purple-600 dark:to-pink-500 dark:shadow-indigo-500/10 transition-all duration-300 group-hover:scale-105">
            <Cpu className="h-4.5 w-4.5 animate-pulse text-brand-500 dark:text-white" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-display text-lg font-bold tracking-tight text-slate-900 dark:text-white uppercase">
                TaskNova
              </span>
              <span className="font-display text-lg font-bold tracking-tight text-indigo-500 dark:text-indigo-400">
                AI
              </span>
              <Badge variant="success" className="text-[10px] px-1.5 py-0 dark:bg-indigo-500/10 dark:text-indigo-400 dark:border-indigo-500/20">v0.1 MVP</Badge>
            </div>
            <p className="text-[10px] text-slate-400 dark:text-zinc-500 font-mono tracking-tight font-medium leading-none mt-0.5 uppercase">
              Human-in-the-Loop Feedback
            </p>
          </div>
        </div>

        {/* Global Navigation Hub */}
        <nav className="hidden md:flex items-center gap-1 bg-slate-100/80 p-1 rounded-xl border border-slate-200/50 dark:bg-white/5 dark:border-white/5">
          <button
            onClick={() => setActiveRoute(AppRoute.HOME)}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-medium rounded-lg transition-all duration-200 cursor-pointer ${
              activeRoute === AppRoute.HOME
                ? 'bg-white text-slate-900 shadow-sm font-semibold dark:bg-white/10 dark:text-white'
                : 'text-slate-500 hover:text-slate-900 dark:text-zinc-400 dark:hover:text-white'
            }`}
          >
            <Compass className="h-3.5 w-3.5" />
            <span>Overview</span>
          </button>
          
          <button
            onClick={() => setActiveRoute(AppRoute.SANDBOX)}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-medium rounded-lg transition-all duration-200 cursor-pointer ${
              activeRoute === AppRoute.SANDBOX
                ? 'bg-white text-slate-900 shadow-sm font-semibold dark:bg-white/10 dark:text-white'
                : 'text-slate-500 hover:text-slate-900 dark:text-zinc-400 dark:hover:text-white'
            }`}
          >
            <Target className="h-3.5 w-3.5" />
            <span>Task Sandbox</span>
          </button>

          <button
            onClick={() => setActiveRoute(AppRoute.BLUEPRINT)}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-medium rounded-lg transition-all duration-200 cursor-pointer ${
              activeRoute === AppRoute.BLUEPRINT
                ? 'bg-white text-slate-900 shadow-sm font-semibold dark:bg-white/10 dark:text-white'
                : 'text-slate-500 hover:text-slate-900 dark:text-zinc-400 dark:hover:text-white'
            }`}
          >
            <Terminal className="h-3.5 w-3.5" />
            <span>Architecture Hub</span>
          </button>

          <button
            onClick={() => setActiveRoute(AppRoute.DESIGN_SYSTEM)}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-medium rounded-lg transition-all duration-200 cursor-pointer ${
              activeRoute === AppRoute.DESIGN_SYSTEM
                ? 'bg-white text-slate-900 shadow-sm font-semibold dark:bg-white/10 dark:text-white'
                : 'text-slate-500 hover:text-slate-900 dark:text-zinc-400 dark:hover:text-white'
            }`}
          >
            <Palette className="h-3.5 w-3.5" />
            <span>Design System</span>
          </button>
        </nav>

        {/* Interactive Header Actions */}
        <div className="flex items-center gap-2.5">
          {/* Theme Toggler */}
          <button
            onClick={toggleTheme}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 hover:bg-slate-50 hover:text-slate-900 dark:border-white/5 dark:bg-white/5 dark:text-zinc-400 dark:hover:bg-white/10 dark:hover:text-white transition-all cursor-pointer"
            title="Toggle color theme"
            id="theme-toggler"
          >
            {theme === 'light' ? (
              <Moon className="h-4 w-4" />
            ) : (
              <Sun className="h-4 w-4" />
            )}
          </button>

          {/* Docs / Help link */}
          <button
            onClick={() => setActiveRoute(AppRoute.BLUEPRINT)}
            className="hidden sm:flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 hover:bg-slate-50 hover:text-slate-900 dark:border-white/5 dark:bg-white/5 dark:text-zinc-400 dark:hover:bg-white/10 dark:hover:text-white transition-all cursor-pointer"
            title="View Blueprint"
          >
            <HelpCircle className="h-4 w-4" />
          </button>

          <Button
            variant="primary"
            size="sm"
            onClick={() => setActiveRoute(AppRoute.SANDBOX)}
            className="font-semibold text-xs py-2 dark:bg-white dark:text-black dark:hover:bg-zinc-200 rounded-full"
          >
            Launch Sandbox
          </Button>
        </div>
      </div>
    </header>
  );
}
