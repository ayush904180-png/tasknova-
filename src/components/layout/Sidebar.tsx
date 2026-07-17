/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Compass, Target, Award, Users, BookOpen, Info, Mail, Terminal, Palette,
  ChevronLeft, ChevronRight, Lock, LayoutGrid, ShieldAlert, Cpu, Settings, Code, AlertCircle, Sparkles
} from 'lucide-react';
import { AppRoute } from '../../types';
import { useApp } from '../../context/AppContext';
import { Badge } from '../ui/Badge';

interface SidebarProps {
  activeRoute: AppRoute;
  setActiveRoute: (route: AppRoute) => void;
}

export function Sidebar({ activeRoute, setActiveRoute }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { isDeveloperMode, simulateRouteTransition } = useApp();

  const handleRouteNavigation = (route: AppRoute) => {
    if (activeRoute !== route) {
      simulateRouteTransition(() => setActiveRoute(route));
    }
  };

  const navGroups = [
    {
      title: 'Core Platform',
      items: [
        { route: AppRoute.HOME, label: 'Overview', icon: Compass },
        { route: AppRoute.SANDBOX, label: 'Task Sandbox', icon: Target },
        { route: AppRoute.IDENTITY, label: 'Secure Portal', icon: Lock },
        { route: AppRoute.ONBOARDING, label: 'Onboarding Loop', icon: Sparkles },
        { route: AppRoute.REWARDS, label: 'Rewards Index', icon: Award },
        { route: AppRoute.LEADERBOARD, label: 'Leaderboard', icon: Users },
      ]
    },
    {
      title: 'Community & Resources',
      items: [
        { route: AppRoute.COMMUNITY, label: 'Community Hub', icon: Users, isPlaceholder: true },
        { route: AppRoute.BLOG, label: 'Chronicles Blog', icon: BookOpen, isPlaceholder: true },
        { route: AppRoute.ABOUT, label: 'About Company', icon: Info },
        { route: AppRoute.CONTACT, label: 'Contact Node', icon: Mail },
      ]
    }
  ];

  // Locked portals for SaaS design
  const lockedPortals = [
    { label: 'Admin Terminal', icon: Settings },
    { label: 'Business Portal', icon: LayoutGrid },
    { label: 'Creator Panel', icon: Code },
  ];

  // Developer items shown dynamically
  const devGroup = {
    title: 'Developer Mode Utilities',
    items: [
      { route: AppRoute.BLUEPRINT, label: 'Architecture Hub', icon: Terminal },
      { route: AppRoute.DESIGN_SYSTEM, label: 'Design System', icon: Palette },
      { route: AppRoute.ERROR_404, label: 'Preview 404', icon: AlertCircle, errorMode: '404' },
      { route: AppRoute.ERROR_500, label: 'Preview 500', icon: ShieldAlert, errorMode: '500' },
      { route: AppRoute.OFFLINE, label: 'Preview Offline', icon: ShieldAlert, errorMode: 'offline' },
      { route: AppRoute.MAINTENANCE, label: 'Preview Maint.', icon: Lock, errorMode: 'maintenance' },
    ]
  };

  return (
    <aside 
      className={`hidden lg:flex flex-col border-r border-slate-200/85 bg-white dark:border-white/5 dark:bg-[#030303] h-screen sticky top-0 transition-all duration-300 z-40 overflow-hidden ${
        isCollapsed ? 'w-16' : 'w-64'
      }`}
      id="tasknova-sidebar-drawer"
    >
      {/* Brand space */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-[#09090b]/20">
        {!isCollapsed && (
          <div 
            onClick={() => handleRouteNavigation(AppRoute.HOME)} 
            className="flex items-center gap-2 cursor-pointer group"
          >
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-900 text-white dark:bg-gradient-to-br dark:from-indigo-500 dark:via-purple-600 dark:to-pink-500">
              <Cpu className="h-3.5 w-3.5 text-white" />
            </div>
            <span className="font-display font-bold text-sm tracking-tight text-slate-900 dark:text-white uppercase">
              TaskNova <span className="text-indigo-500">AI</span>
            </span>
          </div>
        )}
        {isCollapsed && (
          <div 
            onClick={() => handleRouteNavigation(AppRoute.HOME)}
            className="flex h-7 w-7 mx-auto items-center justify-center rounded-lg bg-slate-900 text-white dark:bg-gradient-to-br dark:from-indigo-500 dark:via-purple-600 dark:to-pink-500 cursor-pointer"
          >
            <Cpu className="h-3.5 w-3.5" />
          </div>
        )}
        <button 
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="h-6 w-6 flex items-center justify-center rounded-md border border-slate-200/80 bg-white text-slate-500 hover:text-slate-900 dark:border-white/5 dark:bg-white/5 dark:text-zinc-400 dark:hover:text-white transition-all cursor-pointer"
          title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
        >
          {isCollapsed ? <ChevronRight className="h-3.5 w-3.5" /> : <ChevronLeft className="h-3.5 w-3.5" />}
        </button>
      </div>

      {/* Nav List */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6 scrollbar-thin scrollbar-thumb-slate-200 dark:scrollbar-thumb-white/5">
        {navGroups.map((group, groupIdx) => (
          <div key={groupIdx} className="space-y-1.5">
            {!isCollapsed && (
              <h4 className="text-[10px] font-mono font-bold uppercase tracking-widest text-slate-400 dark:text-zinc-500 px-3">
                {group.title}
              </h4>
            )}
            <nav className="space-y-0.5">
              {group.items.map((item) => {
                const Icon = item.icon;
                const isActive = activeRoute === item.route;
                return (
                  <button
                    key={item.route}
                    onClick={() => handleRouteNavigation(item.route)}
                    className={`w-full flex items-center gap-3 px-3 py-2 text-xs rounded-lg transition-all duration-150 cursor-pointer text-left focus-visible:ring-2 focus-visible:ring-indigo-500 outline-none ${
                      isActive 
                        ? 'bg-slate-100 text-slate-900 font-bold dark:bg-white/5 dark:text-white' 
                        : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900 dark:text-zinc-400 dark:hover:bg-white/1 dark:hover:text-white'
                    }`}
                    title={isCollapsed ? item.label : undefined}
                    aria-label={item.label}
                  >
                    <Icon className={`h-4 w-4 flex-shrink-0 ${isActive ? 'text-indigo-500 dark:text-indigo-400' : 'text-slate-400'}`} />
                    {!isCollapsed && (
                      <span className="flex-1 truncate">{item.label}</span>
                    )}
                    {!isCollapsed && item.isPlaceholder && (
                      <Badge variant="neutral" className="text-[8px] scale-90 px-1 py-0">Draft</Badge>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>
        ))}

        {/* Portals Group (SaaS Architecture showcase) */}
        <div className="space-y-1.5">
          {!isCollapsed && (
            <h4 className="text-[10px] font-mono font-bold uppercase tracking-widest text-slate-400 dark:text-zinc-500 px-3">
              Locked Portals
            </h4>
          )}
          <div className="space-y-0.5">
            {lockedPortals.map((portal, idx) => {
              const Icon = portal.icon;
              return (
                <div
                  key={idx}
                  className="w-full flex items-center gap-3 px-3 py-2 text-xs text-slate-400 dark:text-zinc-600 rounded-lg select-none"
                  title={isCollapsed ? `${portal.label} (Enterprise Plan)` : undefined}
                >
                  <Icon className="h-4 w-4 text-slate-300 dark:text-zinc-700 flex-shrink-0" />
                  {!isCollapsed && (
                    <span className="flex-1 truncate font-light">{portal.label}</span>
                  )}
                  {!isCollapsed && <Lock className="h-3 w-3 text-slate-300 dark:text-zinc-700" />}
                </div>
              );
            })}
          </div>
        </div>

        {/* Developer Utilities (Dynamic with mode switch) */}
        {isDeveloperMode && (
          <div className="space-y-1.5 border-t border-slate-150 dark:border-white/5 pt-4">
            {!isCollapsed && (
              <h4 className="text-[10px] font-mono font-bold uppercase tracking-widest text-indigo-500 dark:text-indigo-400 px-3 flex items-center gap-1.5">
                <Code className="h-3 w-3" /> Dev Utilities
              </h4>
            )}
            <nav className="space-y-0.5">
              {devGroup.items.map((item) => {
                const Icon = item.icon;
                const isActive = activeRoute === item.route;
                return (
                  <button
                    key={item.route}
                    onClick={() => handleRouteNavigation(item.route)}
                    className={`w-full flex items-center gap-3 px-3 py-2 text-xs rounded-lg transition-all duration-150 cursor-pointer text-left focus-visible:ring-2 focus-visible:ring-indigo-500 outline-none ${
                      isActive 
                        ? 'bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-bold border-l-2 border-indigo-500' 
                        : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900 dark:text-zinc-400 dark:hover:bg-white/1 dark:hover:text-white'
                    }`}
                    title={isCollapsed ? item.label : undefined}
                  >
                    <Icon className="h-4 w-4 flex-shrink-0" />
                    {!isCollapsed && (
                      <span className="flex-1 truncate">{item.label}</span>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>
        )}
      </div>

      {/* Collapsed view settings indicator */}
      {!isCollapsed && (
        <div className="p-4 border-t border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-[#09090b]/20 text-[10px] font-mono text-slate-400 flex justify-between items-center">
          <span>Target Platform</span>
          <span className="text-slate-600 dark:text-zinc-400 font-bold uppercase">v0.1 MVP</span>
        </div>
      )}
    </aside>
  );
}
