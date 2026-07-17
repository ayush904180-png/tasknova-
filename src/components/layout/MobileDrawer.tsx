/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion, AnimatePresence } from 'motion/react';
import { 
  Compass, Target, Award, Users, BookOpen, Info, Mail, Terminal, Palette,
  X, Lock, Cpu, Code, Settings, ShieldAlert, AlertCircle, Sparkles
} from 'lucide-react';
import { AppRoute } from '../../types';
import { useApp } from '../../context/AppContext';
import { Badge } from '../ui/Badge';

interface MobileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  activeRoute: AppRoute;
  setActiveRoute: (route: AppRoute) => void;
}

export function MobileDrawer({ isOpen, onClose, activeRoute, setActiveRoute }: MobileDrawerProps) {
  const { isDeveloperMode, setDeveloperMode, simulateRouteTransition } = useApp();

  const handleRouteNavigation = (route: AppRoute) => {
    onClose();
    if (activeRoute !== route) {
      simulateRouteTransition(() => setActiveRoute(route));
    }
  };

  const menuGroups = [
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

  const devGroup = [
    { route: AppRoute.BLUEPRINT, label: 'Architecture Hub', icon: Terminal },
    { route: AppRoute.DESIGN_SYSTEM, label: 'Design System', icon: Palette },
    { route: AppRoute.ERROR_404, label: 'Preview 404', icon: AlertCircle },
    { route: AppRoute.ERROR_500, label: 'Preview 500', icon: ShieldAlert },
    { route: AppRoute.OFFLINE, label: 'Preview Offline', icon: ShieldAlert },
    { route: AppRoute.MAINTENANCE, label: 'Preview Maint.', icon: Lock },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex" id="tasknova-mobile-drawer">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-950/45 dark:bg-black/75 backdrop-blur-xs cursor-pointer"
          />

          {/* Drawer Body */}
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 220 }}
            className="relative w-80 max-w-sm bg-white dark:bg-[#030303] h-full flex flex-col shadow-2xl overflow-hidden pt-safe border-r border-slate-200 dark:border-white/5"
          >
            {/* Drawer Header */}
            <div className="h-16 flex items-center justify-between px-5 border-b border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-[#09090b]/20">
              <div className="flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-900 text-white dark:bg-gradient-to-br dark:from-indigo-500 dark:to-purple-600">
                  <Cpu className="h-3.5 w-3.5 text-white" />
                </div>
                <span className="font-display font-bold text-sm tracking-tight text-slate-900 dark:text-white uppercase">
                  TaskNova <span className="text-indigo-500">AI</span>
                </span>
              </div>
              <button
                onClick={onClose}
                className="h-8 w-8 flex items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 hover:text-slate-950 dark:border-white/5 dark:bg-white/5 dark:text-zinc-400 dark:hover:text-white transition-all cursor-pointer"
                title="Close Drawer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Menu List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-6">
              {menuGroups.map((group, groupIdx) => (
                <div key={groupIdx} className="space-y-1.5">
                  <h4 className="text-[10px] font-mono font-bold uppercase tracking-widest text-slate-400 dark:text-zinc-500 px-3">
                    {group.title}
                  </h4>
                  <nav className="space-y-0.5">
                    {group.items.map((item) => {
                      const Icon = item.icon;
                      const isActive = activeRoute === item.route;
                      return (
                        <button
                          key={item.route}
                          onClick={() => handleRouteNavigation(item.route)}
                          className={`w-full flex items-center gap-3 px-3 py-2.5 text-xs rounded-lg transition-all duration-150 cursor-pointer text-left focus:outline-none ${
                            isActive 
                              ? 'bg-slate-100 text-slate-900 font-bold dark:bg-white/5 dark:text-white' 
                              : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900 dark:text-zinc-400 dark:hover:text-white'
                          }`}
                          style={{ minHeight: '44px' }}
                        >
                          <Icon className={`h-4 w-4 ${isActive ? 'text-indigo-500' : 'text-slate-400'}`} />
                          <span className="flex-1 truncate">{item.label}</span>
                          {item.isPlaceholder && (
                            <Badge variant="neutral" className="text-[8px] scale-90 px-1 py-0">Draft</Badge>
                          )}
                        </button>
                      );
                    })}
                  </nav>
                </div>
              ))}

              {/* Developer Utilities Toggle */}
              <div className="space-y-3 border-t border-slate-150 dark:border-white/5 pt-5">
                <div className="flex items-center justify-between px-3 py-1.5 text-xs font-sans text-slate-500 dark:text-zinc-400">
                  <span className="flex items-center gap-1.5">
                    <Code className="h-4 w-4" /> Developer Mode
                  </span>
                  <button
                    onClick={() => setDeveloperMode(!isDeveloperMode)}
                    className={`w-9 h-5 rounded-full p-0.5 transition-colors duration-200 cursor-pointer ${
                      isDeveloperMode ? 'bg-indigo-500' : 'bg-slate-200 dark:bg-zinc-800'
                    }`}
                  >
                    <div className={`bg-white h-4 w-4 rounded-full shadow transition-transform duration-200 ${
                      isDeveloperMode ? 'translate-x-4' : 'translate-x-0'
                    }`} />
                  </button>
                </div>

                {isDeveloperMode && (
                  <div className="space-y-1">
                    <h4 className="text-[10px] font-mono font-bold uppercase tracking-widest text-indigo-500 dark:text-indigo-400 px-3">
                      Dev Workspace
                    </h4>
                    <nav className="space-y-0.5">
                      {devGroup.map((item) => {
                        const Icon = item.icon;
                        const isActive = activeRoute === item.route;
                        return (
                          <button
                            key={item.route}
                            onClick={() => handleRouteNavigation(item.route)}
                            className={`w-full flex items-center gap-3 px-3 py-2 text-xs rounded-lg transition-all duration-150 cursor-pointer text-left focus:outline-none ${
                              isActive 
                                ? 'bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-bold' 
                                : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900 dark:text-zinc-400 dark:hover:bg-white/1 dark:hover:text-white'
                            }`}
                            style={{ minHeight: '44px' }}
                          >
                            <Icon className="h-4 w-4 flex-shrink-0" />
                            <span className="flex-1 truncate">{item.label}</span>
                          </button>
                        );
                      })}
                    </nav>
                  </div>
                )}
              </div>
            </div>

            {/* Account Info on Footer Drawer */}
            <div className="p-4 border-t border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-[#09090b]/30">
              <div className="flex items-center gap-2.5">
                <div className="h-8 w-8 rounded-full bg-slate-950 text-white dark:bg-gradient-to-tr dark:from-indigo-500 dark:to-purple-600 flex items-center justify-center font-bold text-xs uppercase font-mono shadow-sm">
                  AY
                </div>
                <div>
                  <span className="font-bold text-xs text-slate-900 dark:text-white block font-display">ayush904180</span>
                  <span className="text-[9px] text-slate-400 font-mono block">Accuracy SLA: 99.2% Gold</span>
                </div>
              </div>
            </div>

          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
