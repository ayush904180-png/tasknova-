/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ReactNode, useState } from 'react';
import { Header } from './Header';
import { Footer } from './Footer';
import { Sidebar } from './Sidebar';
import { BottomNavigation } from './BottomNavigation';
import { MobileDrawer } from './MobileDrawer';
import { SearchModal } from './SearchModal';
import { AppRoute } from '../../types';

interface LayoutShellProps {
  children: ReactNode;
  activeRoute: AppRoute;
  setActiveRoute: (route: AppRoute) => void;
}

export function LayoutShell({ children, activeRoute, setActiveRoute }: LayoutShellProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div 
      className="min-h-screen flex bg-slate-50 text-slate-800 dark:bg-[#030303] dark:text-zinc-100 transition-colors duration-300 relative overflow-x-hidden" 
      id="tasknova-global-shell"
    >
      {/* Decorative Background Glows (Sophisticated Dark theme elements) */}
      <div className="absolute top-[10%] left-[5%] w-[450px] h-[450px] bg-indigo-600/5 dark:bg-indigo-600/10 rounded-full blur-[140px] pointer-events-none opacity-80 z-0"></div>
      <div className="absolute bottom-[15%] right-[5%] w-[450px] h-[450px] bg-purple-600/5 dark:bg-purple-600/10 rounded-full blur-[140px] pointer-events-none opacity-80 z-0"></div>

      {/* 1. Desktop Sidebar (Sticky left) */}
      <Sidebar activeRoute={activeRoute} setActiveRoute={setActiveRoute} />

      {/* 2. Main Content Stream on the right */}
      <div className="flex-grow flex flex-col min-w-0 min-h-screen relative z-10">
        
        {/* Sticky Header with Hide on Scroll */}
        <Header 
          activeRoute={activeRoute} 
          setActiveRoute={setActiveRoute} 
          onMobileMenuToggle={() => setIsMobileMenuOpen(true)}
        />

        {/* Real-time Scroll Progress indicator line */}
        <ScrollProgressLine />

        {/* Main Content Area */}
        <main className="flex-grow w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 flex flex-col justify-start relative z-10 pb-28 lg:pb-12">
          {children}
        </main>

        {/* Global SaaS Footer */}
        <Footer setActiveRoute={setActiveRoute} />

        {/* 3. Floating Mobile Bottom Navigation (Hidden on desktop) */}
        <BottomNavigation 
          activeRoute={activeRoute} 
          setActiveRoute={setActiveRoute} 
          onMobileMenuToggle={() => setIsMobileMenuOpen(true)}
        />
      </div>

      {/* 4. Mobile slide-out drawer */}
      <MobileDrawer 
        isOpen={isMobileMenuOpen} 
        onClose={() => setIsMobileMenuOpen(false)} 
        activeRoute={activeRoute}
        setActiveRoute={setActiveRoute}
      />

      {/* 5. Global Command+K Spotlight Search Modal */}
      <SearchModal setActiveRoute={setActiveRoute} />
    </div>
  );
}

/**
 * Tiny auxiliary component to track viewport scroll progress
 */
function ScrollProgressLine() {
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
      if (totalScroll > 0) {
        setScrollProgress((window.scrollY / totalScroll) * 100);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div 
      className="sticky top-16 left-0 h-[1.5px] bg-indigo-500/80 dark:bg-indigo-400/80 transition-all duration-75 z-40" 
      style={{ width: `${scrollProgress}%` }}
    />
  );
}

import { useEffect } from 'react';
