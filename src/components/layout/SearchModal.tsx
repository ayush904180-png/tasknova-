/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Compass, Target, Award, Users, BookOpen, Info, Mail, Terminal, Palette, X, LayoutGrid } from 'lucide-react';
import { AppRoute } from '../../types';
import { useApp } from '../../context/AppContext';

interface SearchItem {
  route: AppRoute;
  title: string;
  category: string;
  desc: string;
  icon: any;
}

export function SearchModal({ setActiveRoute }: { setActiveRoute: (route: AppRoute) => void }) {
  const { searchOpen, setSearchOpen, isDeveloperMode } = useApp();
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  // List of searchable sections based on permissions
  const items: SearchItem[] = [
    { route: AppRoute.HOME, title: 'Overview & Vision', category: 'Platform', desc: 'SaaS landing, metrics, and core human-in-the-loop insights.', icon: Compass },
    { route: AppRoute.DASHBOARD, title: 'Dashboard Console', category: 'Platform', desc: 'Realtime bento grid customizable widgets, state auditing, and developer flags.', icon: LayoutGrid },
    { route: AppRoute.SANDBOX, title: 'Interactive Task Sandbox', category: 'Platform', desc: 'Complete micro human evaluation tasks and earn rewards.', icon: Target },
    { route: AppRoute.REWARDS, title: 'Holdings & Disbursals', category: 'Platform', desc: 'Monitor coins balance, UPI routing logs, and claim payments.', icon: Award },
    { route: AppRoute.LEADERBOARD, title: 'Global Contributor Standings', category: 'Community', desc: 'Ranks of elite validators and weekly rewards index.', icon: Users },
    { route: AppRoute.COMMUNITY, title: 'Community Workspace', category: 'Community', desc: 'Join Discord channels, alignment roundtables, and forums.', icon: Users },
    { route: AppRoute.BLOG, title: 'TaskNova AI Chronicles', category: 'Resources', desc: 'Deep dive articles into RLHF alignment, dataset design, and UX.', icon: BookOpen },
    { route: AppRoute.ABOUT, title: 'About Mission & Vision', category: 'Resources', desc: 'Who we are, corporate stats, and our India-centric engineering team.', icon: Info },
    { route: AppRoute.CONTACT, title: 'Contact / Inquiries Node', category: 'Resources', desc: 'Submit corporate alignment proposals and SLA inquiries.', icon: Mail },
  ];

  // Developer items appended only if Developer Mode is enabled
  if (isDeveloperMode) {
    items.push(
      { route: AppRoute.BLUEPRINT, title: 'Modular Architecture Hub', category: 'Developer Utilities', desc: 'Explore file layouts, design rules, and SOLID specifications.', icon: Terminal },
      { route: AppRoute.DESIGN_SYSTEM, title: 'Design System Explorer', category: 'Developer Utilities', desc: 'Interact with design tokens, buttons, badges, inputs, and cards.', icon: Palette }
    );
  }

  const filtered = items.filter(item => 
    item.title.toLowerCase().includes(query.toLowerCase()) || 
    item.desc.toLowerCase().includes(query.toLowerCase()) ||
    item.category.toLowerCase().includes(query.toLowerCase())
  );

  useEffect(() => {
    if (searchOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [searchOpen]);

  // Key navigation handlers
  useEffect(() => {
    if (!searchOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        setSearchOpen(false);
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex(prev => (prev + 1) % Math.max(1, filtered.length));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex(prev => (prev - 1 + filtered.length) % Math.max(1, filtered.length));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (filtered[selectedIndex]) {
          setActiveRoute(filtered[selectedIndex].route);
          setSearchOpen(false);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [searchOpen, selectedIndex, filtered, setActiveRoute, setSearchOpen]);

  return (
    <AnimatePresence>
      {searchOpen && (
        <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh] px-4 overflow-hidden" id="spotlight-search-dialog">
          {/* Backdrop Blur overlay */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSearchOpen(false)}
            className="absolute inset-0 bg-slate-950/40 dark:bg-black/75 backdrop-blur-sm cursor-pointer"
          />

          {/* Search Box Card */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.96, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: -10 }}
            transition={{ duration: 0.15 }}
            className="w-full max-w-lg bg-white dark:bg-[#0c0c0e] border border-slate-200 dark:border-white/10 rounded-2xl shadow-2xl relative z-10 overflow-hidden flex flex-col"
          >
            {/* Input Header */}
            <div className="flex items-center gap-3 px-4 py-3.5 border-b border-slate-100 dark:border-white/5 relative">
              <Search className="h-5 w-5 text-slate-400 dark:text-zinc-500 flex-shrink-0" />
              <input 
                ref={inputRef}
                type="text" 
                placeholder="Type to search platform, resources, and developer mode..."
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setSelectedIndex(0);
                }}
                className="w-full bg-transparent text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-zinc-500 focus:outline-none"
              />
              <button 
                onClick={() => setSearchOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-900 dark:text-zinc-500 dark:hover:text-white rounded-lg hover:bg-slate-50 dark:hover:bg-white/5 transition-all cursor-pointer"
                title="Close search"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Results Body */}
            <div className="max-h-[350px] overflow-y-auto p-2 divide-y divide-transparent">
              {filtered.length > 0 ? (
                filtered.map((item, index) => {
                  const Icon = item.icon;
                  const isSelected = index === selectedIndex;
                  return (
                    <div
                      key={item.route}
                      onMouseEnter={() => setSelectedIndex(index)}
                      onClick={() => {
                        setActiveRoute(item.route);
                        setSearchOpen(false);
                      }}
                      className={`w-full p-3 flex gap-3 rounded-xl cursor-pointer transition-all ${
                        isSelected 
                          ? 'bg-slate-100/80 dark:bg-white/5 shadow-sm' 
                          : 'bg-transparent'
                      }`}
                    >
                      <div className={`h-8 w-8 flex-shrink-0 rounded-lg flex items-center justify-center border transition-colors ${
                        isSelected 
                          ? 'bg-white dark:bg-white/10 border-slate-200 dark:border-white/10 text-indigo-500 dark:text-indigo-400' 
                          : 'bg-slate-50 dark:bg-white/1 border-transparent text-slate-400'
                      }`}>
                        <Icon className="h-4 w-4" />
                      </div>
                      <div className="flex-1 text-left min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-xs text-slate-900 dark:text-white font-display block truncate">
                            {item.title}
                          </span>
                          <span className="text-[9px] px-1.5 py-0.5 rounded-md bg-slate-100 text-slate-500 dark:bg-white/5 dark:text-zinc-400 font-mono tracking-wide uppercase flex-shrink-0">
                            {item.category}
                          </span>
                        </div>
                        <span className="text-[10.5px] text-slate-400 dark:text-zinc-400 block truncate mt-0.5 font-light">
                          {item.desc}
                        </span>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="py-12 text-center text-slate-400 dark:text-zinc-500 space-y-2">
                  <Search className="h-8 w-8 mx-auto stroke-[1.5] text-slate-300 dark:text-zinc-700" />
                  <p className="text-xs font-light">No platform sections match your query.</p>
                </div>
              )}
            </div>

            {/* Keyboard shortcuts footer */}
            <div className="bg-slate-50 dark:bg-black/20 p-3 border-t border-slate-100 dark:border-white/5 flex justify-between items-center text-[10px] text-slate-400 dark:text-zinc-500 font-mono">
              <div className="flex gap-4">
                <span><kbd className="bg-white dark:bg-white/5 border border-slate-200 dark:border-white/5 px-1 rounded shadow-sm text-slate-700 dark:text-zinc-300 font-sans">↑↓</kbd> Navigate</span>
                <span><kbd className="bg-white dark:bg-white/5 border border-slate-200 dark:border-white/5 px-1.5 rounded shadow-sm text-slate-700 dark:text-zinc-300 font-sans">Enter</kbd> Select</span>
                <span><kbd className="bg-white dark:bg-white/5 border border-slate-200 dark:border-white/5 px-1.5 rounded shadow-sm text-slate-700 dark:text-zinc-300 font-sans">Esc</kbd> Close</span>
              </div>
              <div className="hidden sm:block">
                <span>TaskNova Spotlight Search</span>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
