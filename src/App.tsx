/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { AppRoute } from './types';
import { LayoutShell } from './components/layout/LayoutShell';
import { Hero } from './components/features/Hero';
import { FeaturesGrid } from './components/features/FeaturesGrid';
import { SandboxTasks } from './components/features/SandboxTasks';
import { ArchitectureHub } from './components/features/ArchitectureHub';
import { DesignSystemExplorer } from './components/features/DesignSystemExplorer';

/**
 * Main TaskNova AI core entry shell.
 * Connects Theme contexts, local states, layout boundaries, and route parameters.
 */
function MainAppContent() {
  const [activeRoute, setActiveRoute] = useState<AppRoute>(AppRoute.HOME);

  return (
    <LayoutShell activeRoute={activeRoute} setActiveRoute={setActiveRoute}>
      
      {/* Dynamic Route Renderer */}
      <div className="space-y-16" id="route-render-wrapper">
        
        {activeRoute === AppRoute.HOME && (
          <div className="space-y-16 animate-fade-in">
            <Hero setActiveRoute={setActiveRoute} />
            <FeaturesGrid />
          </div>
        )}

        {activeRoute === AppRoute.SANDBOX && (
          <div className="space-y-8 animate-fade-in">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white font-display">
                Interactive Micro-Task Sandbox
              </h1>
              <p className="text-sm text-slate-500 mt-1.5 font-sans font-light">
                Complete micro human evaluations to help train and align Large Language Models. Watch reward credits log live in your local ledger.
              </p>
            </div>
            
            <SandboxTasks />
          </div>
        )}

        {activeRoute === AppRoute.BLUEPRINT && (
          <div className="space-y-8 animate-fade-in">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white font-display">
                Technical Architecture Specifications
              </h1>
              <p className="text-sm text-slate-500 mt-1.5 font-sans font-light">
                Explore the clean folder layouts, SOLID principles, and modular code separations prepared for the TaskNova AI production ecosystem.
              </p>
            </div>

            <ArchitectureHub />
          </div>
        )}

        {activeRoute === AppRoute.DESIGN_SYSTEM && (
          <div className="space-y-8 animate-fade-in">
            <DesignSystemExplorer />
          </div>
        )}

      </div>
    </LayoutShell>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <MainAppContent />
    </ThemeProvider>
  );
}
