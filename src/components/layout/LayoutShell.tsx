/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ReactNode } from 'react';
import { Header } from './Header';
import { Footer } from './Footer';
import { AppRoute } from '../../types';

interface LayoutShellProps {
  children: ReactNode;
  activeRoute: AppRoute;
  setActiveRoute: (route: AppRoute) => void;
}

export function LayoutShell({ children, activeRoute, setActiveRoute }: LayoutShellProps) {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800 dark:bg-[#030303] dark:text-zinc-100 transition-colors duration-300 relative overflow-hidden" id="tasknova-global-shell">
      {/* Decorative Background Glows (Sophisticated Dark theme elements) */}
      <div className="absolute top-[15%] left-[5%] w-[450px] h-[450px] bg-indigo-600/10 dark:bg-indigo-600/10 rounded-full blur-[140px] pointer-events-none opacity-80 z-0"></div>
      <div className="absolute bottom-[15%] right-[5%] w-[450px] h-[450px] bg-purple-600/10 dark:bg-purple-600/10 rounded-full blur-[140px] pointer-events-none opacity-80 z-0"></div>

      {/* Global SaaS Header */}
      <Header activeRoute={activeRoute} setActiveRoute={setActiveRoute} />

      {/* Main Content Area */}
      <main className="flex-grow w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 flex flex-col justify-start relative z-10">
        {children}
      </main>

      {/* Global SaaS Footer */}
      <Footer setActiveRoute={setActiveRoute} />
    </div>
  );
}
