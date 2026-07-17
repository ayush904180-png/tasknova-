/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Cpu, Heart, Globe, ArrowUpRight } from 'lucide-react';
import { AppRoute } from '../../types';

interface FooterProps {
  setActiveRoute: (route: AppRoute) => void;
}

export function Footer({ setActiveRoute }: FooterProps) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full border-t border-slate-200 bg-white py-12 dark:border-white/5 dark:bg-[#030303] text-slate-500 transition-colors">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Brand bio block */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-3">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-900 text-white dark:bg-gradient-to-br dark:from-indigo-500 dark:via-purple-600 dark:to-pink-500">
                <Cpu className="h-3.5 w-3.5 text-brand-500 dark:text-white" />
              </div>
              <span className="font-display font-bold text-slate-900 dark:text-white tracking-tight uppercase">
                TaskNova AI
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-zinc-400 max-w-sm leading-relaxed mb-4">
              The professional intelligence layer for modern LLM development. We transform complex human intuition into structured datasets for global enterprises.
            </p>
            {/* Target Audience Coverage indicators */}
            <div className="flex flex-wrap items-center gap-2 mt-4">
              <span className="text-[10px] uppercase font-mono tracking-wider font-semibold text-slate-400 flex items-center gap-1 dark:text-zinc-500">
                <Globe className="h-3 w-3 text-slate-400 dark:text-zinc-500" /> Markets:
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-brand-50 text-brand-700 dark:bg-indigo-500/10 dark:text-indigo-400 border border-brand-100 dark:border-indigo-500/20 font-mono">
                India (Primary)
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-slate-100 text-slate-600 dark:bg-white/5 dark:text-zinc-400 border border-slate-200 dark:border-white/5 font-mono">
                USA
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-slate-100 text-slate-600 dark:bg-white/5 dark:text-zinc-400 border border-slate-200 dark:border-white/5 font-mono">
                UK
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-slate-100 text-slate-600 dark:bg-white/5 dark:text-zinc-400 border border-slate-200 dark:border-white/5 font-mono">
                CA
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-slate-100 text-slate-600 dark:bg-white/5 dark:text-zinc-400 border border-slate-200 dark:border-white/5 font-mono">
                AU
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-slate-100 text-slate-600 dark:bg-white/5 dark:text-zinc-400 border border-slate-200 dark:border-white/5 font-mono">
                DE
              </span>
            </div>
          </div>

          {/* Directory Navigation links */}
          <div>
            <h4 className="text-xs font-mono font-semibold text-slate-900 dark:text-slate-300 uppercase tracking-wider mb-4">
              Platform Sections
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <button
                  onClick={() => setActiveRoute(AppRoute.HOME)}
                  className="hover:text-slate-950 dark:hover:text-white transition-colors cursor-pointer flex items-center gap-1"
                >
                  Overview & Vision
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveRoute(AppRoute.SANDBOX)}
                  className="hover:text-slate-950 dark:hover:text-white transition-colors cursor-pointer flex items-center gap-1"
                >
                  Interactive Task Sandbox <ArrowUpRight className="h-3 w-3 opacity-65" />
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveRoute(AppRoute.BLUEPRINT)}
                  className="hover:text-slate-950 dark:hover:text-white transition-colors cursor-pointer flex items-center gap-1"
                >
                  Modular Architecture Hub
                </button>
              </li>
            </ul>
          </div>

          {/* Architectural specs links */}
          <div>
            <h4 className="text-xs font-mono font-semibold text-slate-900 dark:text-slate-300 uppercase tracking-wider mb-4">
              SaaS Guidelines
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li className="flex items-center gap-1">
                <span className="h-1 w-1 rounded-full bg-slate-400"></span>
                <span>SOLID Clean Architecture</span>
              </li>
              <li className="flex items-center gap-1">
                <span className="h-1 w-1 rounded-full bg-slate-400"></span>
                <span>Vite + React Core Foundations</span>
              </li>
              <li className="flex items-center gap-1">
                <span className="h-1 w-1 rounded-full bg-slate-400"></span>
                <span>Human-centric Alignments</span>
              </li>
              <li className="flex items-center gap-1">
                <span className="h-1 w-1 rounded-full bg-slate-400"></span>
                <span>India Dev Core Focus</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Legal and credits */}
        <div className="mt-12 pt-8 border-t border-slate-150 dark:border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <p>© {currentYear} TaskNova AI. Built for scalable human-feedback processing. MVP version 0.1.</p>
          <p className="flex items-center gap-1 text-slate-400 font-mono">
            Crafted with <Heart className="h-3.5 w-3.5 text-rose-500 fill-rose-500" /> according to elite engineering guidelines.
          </p>
        </div>
      </div>
    </footer>
  );
}
