/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useRef } from 'react';
import { 
  Cpu, Sun, Moon, HelpCircle, Compass, Terminal, Target, Palette, 
  Search, Bell, Laptop, Code, Check, ShieldAlert, Award, LogOut, Copy, Menu, X, ChevronDown, UserCheck
} from 'lucide-react';
import { useTheme, Theme } from '../../context/ThemeContext';
import { useApp } from '../../context/AppContext';
import { AppRoute } from '../../types';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';

interface HeaderProps {
  activeRoute: AppRoute;
  setActiveRoute: (route: AppRoute) => void;
  onMobileMenuToggle?: () => void;
}

export function Header({ activeRoute, setActiveRoute, onMobileMenuToggle }: HeaderProps) {
  const { theme, setTheme, toggleTheme } = useTheme();
  const { isDeveloperMode, setDeveloperMode, setSearchOpen, topProgress, simulateRouteTransition } = useApp();
  
  // Header scroll detection (Hide on scroll down, show on scroll up)
  const [isHeaderVisible, setIsHeaderVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  // Dropdown states
  const [profileOpen, setProfileOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [themeMenuOpen, setThemeMenuOpen] = useState(false);

  // Ref locks for clicking outside
  const profileRef = useRef<HTMLDivElement>(null);
  const notificationRef = useRef<HTMLDivElement>(null);
  const themeRef = useRef<HTMLDivElement>(null);

  // Fake Notification data
  const [notifications, setNotifications] = useState([
    { id: 1, text: 'UPI Ledger verified: +380 coins claimed.', time: '2m ago', read: false },
    { id: 2, text: 'New Semantic Tagging batch available in Sandbox.', time: '1h ago', read: false },
    { id: 3, text: 'Accuracy audit completed: Gold Level (99.2%) maintained.', time: '1d ago', read: true },
  ]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY && currentScrollY > 80) {
        setIsHeaderVisible(false); // scrolling down
      } else {
        setIsHeaderVisible(true); // scrolling up
      }
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  // Handle outside clicks
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (profileRef.current && !profileRef.current.contains(target)) setProfileOpen(false);
      if (notificationRef.current && !notificationRef.current.contains(target)) setNotificationsOpen(false);
      if (themeRef.current && !themeRef.current.contains(target)) setThemeMenuOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleRouteNavigation = (route: AppRoute) => {
    if (activeRoute !== route) {
      simulateRouteTransition(() => setActiveRoute(route));
    }
  };

  return (
    <>
      {/* Top progress bar (Animating on route change) */}
      <div 
        className="fixed top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-indigo-500 via-purple-600 to-pink-500 z-[60] transition-all duration-150"
        style={{ width: `${topProgress}%`, opacity: topProgress > 0 && topProgress < 100 ? 1 : 0 }}
      />

      <header 
        className={`sticky top-0 z-50 w-full border-b border-slate-200/80 bg-white/85 dark:border-white/5 dark:bg-[#030303]/80 backdrop-blur-md transition-transform duration-300 ${
          isHeaderVisible ? 'translate-y-0' : '-translate-y-full'
        }`}
        id="tasknova-global-header"
      >
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          
          {/* Left: Brand Logo & Hamburger */}
          <div className="flex items-center gap-4">
            <button
              onClick={onMobileMenuToggle}
              className="flex lg:hidden h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 hover:text-slate-900 dark:border-white/5 dark:bg-white/5 dark:text-zinc-400 dark:hover:text-white cursor-pointer"
              title="Toggle mobile menu"
              aria-label="Open navigation menu"
            >
              <Menu className="h-5 w-5" />
            </button>

            <div 
              onClick={() => handleRouteNavigation(AppRoute.HOME)} 
              className="flex items-center gap-2.5 cursor-pointer group"
              id="header-brand-container"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-900 text-white shadow-md dark:bg-gradient-to-br dark:from-indigo-500 dark:via-purple-600 dark:to-pink-500 dark:shadow-indigo-500/10 transition-all duration-300 group-hover:scale-105">
                <Cpu className="h-4.5 w-4.5 text-white" />
              </div>
              <div className="hidden sm:block">
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
          </div>

          {/* Center: Desktop Navigation Hub (only used if Sidebar is collapsed or secondary backup) */}
          <nav className="hidden lg:flex items-center gap-1 bg-slate-100/80 p-1 rounded-xl border border-slate-200/50 dark:bg-white/5 dark:border-white/5">
            <button
              onClick={() => handleRouteNavigation(AppRoute.HOME)}
              className={`px-3.5 py-1.5 text-xs font-medium rounded-lg transition-all duration-200 cursor-pointer ${
                activeRoute === AppRoute.HOME
                  ? 'bg-white text-slate-900 shadow-sm font-semibold dark:bg-white/10 dark:text-white'
                  : 'text-slate-500 hover:text-slate-900 dark:text-zinc-400 dark:hover:text-white'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => handleRouteNavigation(AppRoute.SANDBOX)}
              className={`px-3.5 py-1.5 text-xs font-medium rounded-lg transition-all duration-200 cursor-pointer ${
                activeRoute === AppRoute.SANDBOX
                  ? 'bg-white text-slate-900 shadow-sm font-semibold dark:bg-white/10 dark:text-white'
                  : 'text-slate-500 hover:text-slate-900 dark:text-zinc-400 dark:hover:text-white'
              }`}
            >
              Task Sandbox
            </button>
            <button
              onClick={() => handleRouteNavigation(AppRoute.REWARDS)}
              className={`px-3.5 py-1.5 text-xs font-medium rounded-lg transition-all duration-200 cursor-pointer ${
                activeRoute === AppRoute.REWARDS
                  ? 'bg-white text-slate-900 shadow-sm font-semibold dark:bg-white/10 dark:text-white'
                  : 'text-slate-500 hover:text-slate-900 dark:text-zinc-400 dark:hover:text-white'
              }`}
            >
              Rewards
            </button>

            {isDeveloperMode && (
              <button
                onClick={() => handleRouteNavigation(AppRoute.BLUEPRINT)}
                className={`px-3.5 py-1.5 text-xs font-medium rounded-lg transition-all duration-200 cursor-pointer ${
                  activeRoute === AppRoute.BLUEPRINT
                    ? 'bg-white text-slate-900 shadow-sm font-semibold dark:bg-white/10 dark:text-white'
                    : 'text-slate-500 hover:text-slate-900 dark:text-zinc-400 dark:hover:text-white'
                }`}
              >
                Architecture Hub
              </button>
            )}
          </nav>

          {/* Right: Interactive Actions */}
          <div className="flex items-center gap-2.5">
            
            {/* Command Search button (Ctrl+K placeholder) */}
            <button
              onClick={() => setSearchOpen(true)}
              className="flex h-9 items-center gap-2 px-3 rounded-lg border border-slate-200 bg-white text-slate-400 hover:border-slate-300 dark:border-white/5 dark:bg-white/5 dark:text-zinc-400 dark:hover:bg-white/10 dark:hover:text-white transition-all cursor-pointer"
              title="Search platform (Ctrl+K)"
              id="global-search-trigger"
            >
              <Search className="h-4 w-4" />
              <span className="hidden md:inline text-xs font-sans font-light">Search...</span>
              <span className="hidden md:inline text-[9px] font-mono bg-slate-100 dark:bg-white/5 px-1.5 py-0.5 rounded border border-slate-200/50 dark:border-white/5 text-slate-500 dark:text-zinc-400 leading-none">⌘K</span>
            </button>

            {/* Notification Hub Dropdown */}
            <div ref={notificationRef} className="relative">
              <button
                onClick={() => setNotificationsOpen(!notificationsOpen)}
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 hover:bg-slate-50 hover:text-slate-900 dark:border-white/5 dark:bg-white/5 dark:text-zinc-400 dark:hover:bg-white/10 dark:hover:text-white transition-all cursor-pointer relative"
                title="Notifications Ledger"
                id="notification-hub-trigger"
              >
                <Bell className="h-4 w-4" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-indigo-500 ring-2 ring-white dark:ring-[#030303]" />
                )}
              </button>

              {notificationsOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-[#0c0c0e] border border-slate-200 dark:border-white/10 rounded-xl shadow-2xl overflow-hidden z-50 animate-fade-in text-left">
                  <div className="p-3 border-b border-slate-100 dark:border-white/5 flex justify-between items-center bg-slate-50/50 dark:bg-black/20">
                    <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-700 dark:text-zinc-200">System Logs ({unreadCount})</span>
                    {unreadCount > 0 && (
                      <button onClick={markAllAsRead} className="text-[10px] text-indigo-500 font-bold hover:underline cursor-pointer">Mark read</button>
                    )}
                  </div>
                  <div className="divide-y divide-slate-100 dark:divide-white/5 max-h-60 overflow-y-auto">
                    {notifications.map(n => (
                      <div key={n.id} className={`p-3 text-xs leading-normal transition-colors ${n.read ? 'opacity-65' : 'bg-slate-50/40 dark:bg-white/2'}`}>
                        <p className="text-slate-800 dark:text-zinc-300 font-light font-sans">{n.text}</p>
                        <span className="text-[9px] text-slate-400 font-mono block mt-1">{n.time}</span>
                      </div>
                    ))}
                  </div>
                  <div className="p-2 border-t border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-black/10 text-center">
                    <span className="text-[10px] font-mono text-slate-400">TaskNova Log Clearance Node</span>
                  </div>
                </div>
              )}
            </div>

            {/* Theme System Selector */}
            <div ref={themeRef} className="relative">
              <button
                onClick={() => setThemeMenuOpen(!themeMenuOpen)}
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 hover:bg-slate-50 hover:text-slate-900 dark:border-white/5 dark:bg-white/5 dark:text-zinc-400 dark:hover:bg-white/10 dark:hover:text-white transition-all cursor-pointer"
                title="Change theme preference"
                id="theme-hub-trigger"
              >
                {theme === 'light' && <Sun className="h-4 w-4" />}
                {theme === 'dark' && <Moon className="h-4 w-4" />}
                {theme === 'system' && <Laptop className="h-4 w-4" />}
              </button>

              {themeMenuOpen && (
                <div className="absolute right-0 mt-2 w-40 bg-white dark:bg-[#0c0c0e] border border-slate-200 dark:border-white/10 rounded-xl shadow-2xl overflow-hidden z-50 animate-fade-in py-1 text-left">
                  {(['light', 'dark', 'system'] as Theme[]).map((t) => (
                    <button
                      key={t}
                      onClick={() => {
                        setTheme(t);
                        setThemeMenuOpen(false);
                      }}
                      className={`w-full px-3.5 py-2 text-xs font-sans text-left flex items-center justify-between cursor-pointer ${
                        theme === t 
                          ? 'bg-slate-50 text-indigo-500 font-bold dark:bg-white/5 dark:text-indigo-400' 
                          : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900 dark:text-zinc-400 dark:hover:bg-white/5 dark:hover:text-white'
                      }`}
                    >
                      <span className="capitalize">{t} Theme</span>
                      {theme === t && <Check className="h-3.5 w-3.5" />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Profile Avatar & Metadata Hub */}
            <div ref={profileRef} className="relative">
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center gap-1.5 p-1 rounded-full border border-slate-200 bg-white hover:border-slate-300 dark:border-white/10 dark:bg-white/5 transition-all cursor-pointer"
                title="Account Ledger"
                id="profile-dropdown-trigger"
              >
                <div className="h-7 w-7 rounded-full bg-slate-950 text-white dark:bg-gradient-to-tr dark:from-indigo-500 dark:to-purple-600 flex items-center justify-center font-bold text-xs uppercase font-mono shadow-sm">
                  AY
                </div>
                <ChevronDown className="h-3.5 w-3.5 text-slate-400 dark:text-zinc-500 pr-1" />
              </button>

              {profileOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-[#0c0c0e] border border-slate-200 dark:border-white/10 rounded-xl shadow-2xl overflow-hidden z-50 animate-fade-in text-left">
                  {/* Account Header */}
                  <div className="p-4 border-b border-slate-100 dark:border-white/5 space-y-1">
                    <span className="font-bold text-xs text-slate-900 dark:text-white block font-display">ayush904180</span>
                    <span className="text-[10px] text-slate-400 font-mono uppercase tracking-widest block">Level 1 Contributor</span>
                    <div className="flex items-center gap-1 bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 px-2 py-0.5 rounded text-[9px] font-mono font-bold mt-1.5 w-fit">
                      <UserCheck className="h-3 w-3" /> Ledger Active
                    </div>
                  </div>

                  {/* Account stats */}
                  <div className="p-3 bg-slate-50/50 dark:bg-black/10 divide-y divide-slate-100 dark:divide-white/5 space-y-2 text-[11px] font-mono text-slate-500 dark:text-zinc-400">
                    <div className="flex justify-between items-center py-1">
                      <span>Total Balance:</span>
                      <span className="font-bold text-slate-800 dark:text-zinc-200">380 Coins</span>
                    </div>
                    <div className="flex justify-between items-center py-1">
                      <span>Accuracy SLA:</span>
                      <span className="font-bold text-emerald-500">99.2% Gold</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="p-2 space-y-1">
                    {/* Developer mode quick toggle inside account dropdown */}
                    <div className="flex items-center justify-between px-2 py-2 rounded-lg hover:bg-slate-50 dark:hover:bg-white/5 transition-all text-xs font-sans text-slate-600 dark:text-zinc-400">
                      <span className="flex items-center gap-1.5">
                        <Code className="h-4 w-4" /> Developer Mode
                      </span>
                      <button
                        onClick={() => setDeveloperMode(!isDeveloperMode)}
                        className={`w-9 h-5 rounded-full p-0.5 transition-colors duration-200 cursor-pointer ${
                          isDeveloperMode ? 'bg-indigo-500' : 'bg-slate-200 dark:bg-zinc-800'
                        }`}
                        title="Toggle dev mode"
                      >
                        <div className={`bg-white h-4 w-4 rounded-full shadow transition-transform duration-200 ${
                          isDeveloperMode ? 'translate-x-4' : 'translate-x-0'
                        }`} />
                      </button>
                    </div>

                    <button
                      onClick={() => {
                        navigator.clipboard.writeText('usr_ayush904180_hits');
                        alert('Account UUID copied to ledger clip!');
                        setProfileOpen(false);
                      }}
                      className="w-full px-2 py-2 text-xs font-sans text-slate-600 hover:bg-slate-50 hover:text-slate-900 dark:text-zinc-400 dark:hover:bg-white/5 dark:hover:text-white rounded-lg flex items-center gap-2 cursor-pointer text-left"
                    >
                      <Copy className="h-4 w-4" /> Copy Contributor ID
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Help Hub Link */}
            <button
              onClick={() => handleRouteNavigation(AppRoute.BLUEPRINT)}
              className="hidden sm:flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 hover:bg-slate-50 hover:text-slate-900 dark:border-white/5 dark:bg-white/5 dark:text-zinc-400 dark:hover:bg-white/10 dark:hover:text-white transition-all cursor-pointer"
              title="View Architecture Specs"
            >
              <HelpCircle className="h-4 w-4" />
            </button>

          </div>
        </div>
      </header>
    </>
  );
}
