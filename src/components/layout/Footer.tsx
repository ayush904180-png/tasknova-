/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Cpu, Heart, Globe, ArrowUpRight, ArrowUp, Send, CheckCircle2, Twitter, Github, MessageSquare } from 'lucide-react';
import { AppRoute } from '../../types';
import { useApp } from '../../context/AppContext';

interface FooterProps {
  setActiveRoute: (route: AppRoute) => void;
}

export function Footer({ setActiveRoute }: FooterProps) {
  const currentYear = new Date().getFullYear();
  const { isDeveloperMode, simulateRouteTransition } = useApp();
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 300);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleRouteNavigation = (route: AppRoute) => {
    simulateRouteTransition(() => setActiveRoute(route));
  };

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setSubscribed(true);
      setEmail('');
    }, 1200);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="w-full border-t border-slate-200 bg-white py-12 dark:border-white/5 dark:bg-[#030303] text-slate-500 transition-colors relative" id="tasknova-saas-footer">
      
      {/* Scroll Progress and Back To Top triggers */}
      {showBackToTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-24 lg:bottom-8 right-6 z-40 flex h-10 w-10 items-center justify-center rounded-full border border-slate-200/80 bg-white shadow-xl text-slate-500 hover:text-slate-900 dark:border-white/10 dark:bg-[#0c0c0e] dark:text-zinc-400 dark:hover:text-white transition-all transform hover:scale-105 cursor-pointer focus:outline-none"
          title="Back to top"
        >
          <ArrowUp className="h-4.5 w-4.5" />
        </button>
      )}

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Brand bio block */}
          <div className="md:col-span-1 space-y-4">
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-900 text-white dark:bg-gradient-to-br dark:from-indigo-500 dark:to-purple-600">
                <Cpu className="h-3.5 w-3.5 text-white" />
              </div>
              <span className="font-display font-bold text-slate-900 dark:text-white tracking-tight uppercase">
                TaskNova AI
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-zinc-400 leading-relaxed font-sans font-light">
              The professional human intelligence layer for large-scale RLHF, model alignment, and multimodal validation datasets.
            </p>
            {/* Target Audience Coverage indicators */}
            <div className="flex flex-wrap items-center gap-1.5 mt-4">
              <span className="text-[10px] uppercase font-mono tracking-wider font-semibold text-slate-400 dark:text-zinc-500 flex items-center gap-1">
                <Globe className="h-3 w-3" /> Nodes:
              </span>
              <span className="text-[9px] px-1.5 py-0.5 rounded bg-slate-150 text-slate-600 dark:bg-white/5 dark:text-zinc-400 font-mono">
                IN (Core)
              </span>
              <span className="text-[9px] px-1.5 py-0.5 rounded bg-slate-150 text-slate-600 dark:bg-white/5 dark:text-zinc-400 font-mono">
                US
              </span>
              <span className="text-[9px] px-1.5 py-0.5 rounded bg-slate-150 text-slate-600 dark:bg-white/5 dark:text-zinc-400 font-mono">
                UK
              </span>
              <span className="text-[9px] px-1.5 py-0.5 rounded bg-slate-150 text-slate-600 dark:bg-white/5 dark:text-zinc-400 font-mono">
                CA
              </span>
            </div>
          </div>

          {/* Directory Navigation links */}
          <div className="space-y-3 text-left">
            <h4 className="text-[10px] font-mono font-bold text-slate-900 dark:text-slate-300 uppercase tracking-widest">
              Platform
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => handleRouteNavigation(AppRoute.HOME)}
                  className="hover:text-slate-950 dark:hover:text-white transition-colors cursor-pointer text-left"
                >
                  Overview & Vision
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleRouteNavigation(AppRoute.SANDBOX)}
                  className="hover:text-slate-950 dark:hover:text-white transition-colors cursor-pointer text-left"
                >
                  Task Sandbox
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleRouteNavigation(AppRoute.REWARDS)}
                  className="hover:text-slate-950 dark:hover:text-white transition-colors cursor-pointer text-left flex items-center gap-1"
                >
                  Rewards Ledger <ArrowUpRight className="h-3 w-3 opacity-60" />
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleRouteNavigation(AppRoute.LEADERBOARD)}
                  className="hover:text-slate-950 dark:hover:text-white transition-colors cursor-pointer text-left"
                >
                  Leaderboards
                </button>
              </li>
            </ul>
          </div>

          {/* Resources / Support links */}
          <div className="space-y-3 text-left">
            <h4 className="text-[10px] font-mono font-bold text-slate-900 dark:text-slate-300 uppercase tracking-widest">
              Resources & Node
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => handleRouteNavigation(AppRoute.ABOUT)}
                  className="hover:text-slate-950 dark:hover:text-white transition-colors cursor-pointer text-left"
                >
                  About Corporate
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleRouteNavigation(AppRoute.CONTACT)}
                  className="hover:text-slate-950 dark:hover:text-white transition-colors cursor-pointer text-left"
                >
                  Contact Inquiries
                </button>
              </li>
              {isDeveloperMode && (
                <li>
                  <button
                    onClick={() => handleRouteNavigation(AppRoute.BLUEPRINT)}
                    className="text-indigo-500 font-bold dark:text-indigo-400 hover:underline transition-colors cursor-pointer text-left animate-pulse"
                  >
                    Architecture Hub
                  </button>
                </li>
              )}
            </ul>
          </div>

          {/* Legal / Compliance links */}
          <div className="space-y-3 text-left">
            <h4 className="text-[10px] font-mono font-bold text-slate-900 dark:text-slate-300 uppercase tracking-widest">
              Legal & Privacy
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => handleRouteNavigation(AppRoute.MAINTENANCE)}
                  className="hover:text-slate-950 dark:hover:text-white transition-colors cursor-pointer text-left"
                >
                  Privacy Policy
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleRouteNavigation(AppRoute.MAINTENANCE)}
                  className="hover:text-slate-950 dark:hover:text-white transition-colors cursor-pointer text-left"
                >
                  Terms of Service
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleRouteNavigation(AppRoute.MAINTENANCE)}
                  className="hover:text-slate-950 dark:hover:text-white transition-colors cursor-pointer text-left"
                >
                  Security SLA
                </button>
              </li>
            </ul>
          </div>

          {/* Telemetry Updates & Social Nodes */}
          <div className="space-y-4 text-left">
            <div>
              <h4 className="text-[10px] font-mono font-bold text-slate-900 dark:text-slate-300 uppercase tracking-widest">
                Telemetry Updates
              </h4>
              <p className="text-xs text-slate-400 dark:text-zinc-500 leading-normal font-sans font-light mt-1.5">
                Subscribe to system updates and alignment task logs.
              </p>
              {!subscribed ? (
                <form onSubmit={handleSubscribe} className="flex gap-1.5 mt-2">
                  <input
                    type="email"
                    placeholder="name@corporation.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="flex-grow text-xs bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-lg px-3 py-2 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-zinc-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all font-sans"
                    required
                  />
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="h-8 w-8 bg-slate-950 text-white hover:bg-slate-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200 flex items-center justify-center rounded-lg cursor-pointer transition-all disabled:opacity-60"
                    title="Subscribe"
                  >
                    {isSubmitting ? (
                      <div className="h-3 w-3 border-2 border-slate-400 border-t-white dark:border-t-black rounded-full animate-spin" />
                    ) : (
                      <Send className="h-3.5 w-3.5" />
                    )}
                  </button>
                </form>
              ) : (
                <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-mono text-xs mt-2">
                  <CheckCircle2 className="h-4 w-4" />
                  <span>Subscription verified!</span>
                </div>
              )}
            </div>

            {/* Social network nodes */}
            <div className="pt-2">
              <span className="text-[9px] font-mono uppercase tracking-wider text-slate-400 dark:text-zinc-600 block mb-2">Social Nodes</span>
              <div className="flex items-center gap-3">
                <a href="#twitter" className="h-7 w-7 rounded-lg border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0c0c0e] hover:text-slate-900 dark:hover:text-white flex items-center justify-center transition-colors" title="TaskNova X (Twitter) Node">
                  <Twitter className="h-3.5 w-3.5" />
                </a>
                <a href="#github" className="h-7 w-7 rounded-lg border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0c0c0e] hover:text-slate-900 dark:hover:text-white flex items-center justify-center transition-colors" title="TaskNova GitHub Node">
                  <Github className="h-3.5 w-3.5" />
                </a>
                <a href="#discord" className="h-7 w-7 rounded-lg border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0c0c0e] hover:text-slate-900 dark:hover:text-white flex items-center justify-center transition-colors" title="TaskNova Community Node">
                  <MessageSquare className="h-3.5 w-3.5" />
                </a>
              </div>
            </div>
          </div>

        </div>

        {/* Legal and credits */}
        <div className="mt-12 pt-8 border-t border-slate-150 dark:border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-sans font-light">
          <p>© {currentYear} TaskNova AI. Built for scalable human-feedback processing. MVP version 0.1.</p>
          <p className="flex items-center gap-1 text-slate-400 dark:text-zinc-500 font-mono">
            Crafted with <Heart className="h-3.5 w-3.5 text-rose-500 fill-rose-500" /> according to elite engineering guidelines.
          </p>
        </div>
      </div>
    </footer>
  );
}
