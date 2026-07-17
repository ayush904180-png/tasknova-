/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Compass, Target, Award, Search, Menu, Cpu } from 'lucide-react';
import { AppRoute } from '../../types';
import { useApp } from '../../context/AppContext';

interface BottomNavigationProps {
  activeRoute: AppRoute;
  setActiveRoute: (route: AppRoute) => void;
  onMobileMenuToggle: () => void;
}

export function BottomNavigation({ activeRoute, setActiveRoute, onMobileMenuToggle }: BottomNavigationProps) {
  const { setSearchOpen, simulateRouteTransition } = useApp();

  const handleRouteNavigation = (route: AppRoute) => {
    if (activeRoute !== route) {
      simulateRouteTransition(() => setActiveRoute(route));
    }
  };

  const menuItems = [
    { route: AppRoute.HOME, label: 'Overview', icon: Compass },
    { route: AppRoute.SANDBOX, label: 'Sandbox', icon: Target },
    { route: AppRoute.REWARDS, label: 'Rewards', icon: Award },
  ];

  return (
    <nav 
      className="lg:hidden fixed bottom-5 left-4 right-4 h-16 bg-white/90 dark:bg-[#0c0c0e]/95 border border-slate-200/80 dark:border-white/10 backdrop-blur-md rounded-2xl shadow-2xl z-40 flex items-center justify-around px-2 pb-safe"
      id="tasknova-mobile-bottom-nav"
    >
      {menuItems.map((item) => {
        const Icon = item.icon;
        const isActive = activeRoute === item.route;
        return (
          <button
            key={item.route}
            onClick={() => handleRouteNavigation(item.route)}
            className={`flex flex-col items-center justify-center h-12 w-14 rounded-xl transition-all duration-150 cursor-pointer focus:outline-none ${
              isActive 
                ? 'text-indigo-500 dark:text-indigo-400 font-bold' 
                : 'text-slate-400 hover:text-slate-900 dark:text-zinc-500 dark:hover:text-white'
            }`}
            style={{ minHeight: '44px', minWidth: '44px' }}
            aria-label={item.label}
          >
            <Icon className={`h-5 w-5 ${isActive ? 'scale-110' : ''}`} />
            <span className="text-[9px] mt-1 font-mono tracking-wide uppercase leading-none">{item.label}</span>
          </button>
        );
      })}

      {/* Global search quick action */}
      <button
        onClick={() => setSearchOpen(true)}
        className="flex flex-col items-center justify-center h-12 w-14 rounded-xl text-slate-400 hover:text-slate-900 dark:text-zinc-500 dark:hover:text-white cursor-pointer focus:outline-none"
        style={{ minHeight: '44px', minWidth: '44px' }}
        aria-label="Search platform"
      >
        <Search className="h-5 w-5" />
        <span className="text-[9px] mt-1 font-mono tracking-wide uppercase leading-none">Search</span>
      </button>

      {/* Mobile Drawer Menu Toggle */}
      <button
        onClick={onMobileMenuToggle}
        className="flex flex-col items-center justify-center h-12 w-14 rounded-xl text-slate-400 hover:text-slate-900 dark:text-zinc-500 dark:hover:text-white cursor-pointer focus:outline-none"
        style={{ minHeight: '44px', minWidth: '44px' }}
        aria-label="Toggle drawer menu"
      >
        <Menu className="h-5 w-5" />
        <span className="text-[9px] mt-1 font-mono tracking-wide uppercase leading-none">Menu</span>
      </button>
    </nav>
  );
}
