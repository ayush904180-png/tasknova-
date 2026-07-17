/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AppRoute } from '../types';

interface AppContextType {
  isDeveloperMode: boolean;
  setDeveloperMode: (val: boolean) => void;
  searchOpen: boolean;
  setSearchOpen: (val: boolean) => void;
  topProgress: number;
  setTopProgress: (val: number) => void;
  simulateRouteTransition: (callback: () => void) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [isDeveloperMode, setDeveloperModeState] = useState<boolean>(() => {
    const cached = localStorage.getItem('tasknova-dev-mode');
    // Default to true for MVP sandbox review, but fully toggleable and production-ready
    return cached !== null ? cached === 'true' : true;
  });

  const [searchOpen, setSearchOpen] = useState(false);
  const [topProgress, setTopProgress] = useState(0);

  const setDeveloperMode = (val: boolean) => {
    setDeveloperModeState(val);
    localStorage.setItem('tasknova-dev-mode', String(val));
  };

  // Listen to global Command+K keyboard accessibility for search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setSearchOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Animates the top progress bar when a route changes
  const simulateRouteTransition = (callback: () => void) => {
    setTopProgress(10);
    const interval = setInterval(() => {
      setTopProgress(prev => {
        if (prev >= 90) {
          clearInterval(interval);
          return 90;
        }
        return prev + 15;
      });
    }, 80);

    setTimeout(() => {
      clearInterval(interval);
      callback();
      setTopProgress(100);
      setTimeout(() => {
        setTopProgress(0);
      }, 200);
    }, 400);
  };

  return (
    <AppContext.Provider value={{
      isDeveloperMode,
      setDeveloperMode,
      searchOpen,
      setSearchOpen,
      topProgress,
      setTopProgress,
      simulateRouteTransition
    }} id="app-context-provider">
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
