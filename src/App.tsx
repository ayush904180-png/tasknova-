/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { AppProvider } from './context/AppContext';
import { AuthProvider } from './auth/providers/AuthProvider';
import { WalletProvider } from './context/WalletContext';
import { AppRoute } from './types';
import { LayoutShell } from './components/layout/LayoutShell';
import { LandingPage } from './components/features/LandingPage';
import { SandboxTasks } from './components/features/SandboxTasks';
import { ArchitectureHub } from './components/features/ArchitectureHub';
import { DesignSystemExplorer } from './components/features/DesignSystemExplorer';
import { AuthGateway } from './auth/components/AuthGateway';
import { OnboardingShell } from './onboarding/components/OnboardingShell';
import { DashboardShell } from './dashboard/components/DashboardShell';
import { 
  RewardsView, LeaderboardView, CommunityView, BlogView, AboutView, ContactView, ErrorViews 
} from './components/features/AdditionalViews';
import { SubmissionProvider } from './submissions/context/SubmissionContext';
import { SubmissionShell } from './submissions/components/SubmissionShell';
import { ValidationProvider } from './validation/context/ValidationContext';
import { InfrastructureProvider } from './infrastructure/providers/InfrastructureProvider';
import { TaskGenerationPage } from './task-generation/pages/TaskGenerationPage';

/**
 * Main TaskNova AI core entry shell.
 * Connects Theme contexts, local states, layout boundaries, and route parameters.
 */
function MainAppContent() {
  const [activeRoute, setActiveRoute] = useState<AppRoute>(AppRoute.HOME);

  // Dynamic SEO Metadata, OpenGraph & Structured Data injection
  useEffect(() => {
    const titles: Record<AppRoute, string> = {
      [AppRoute.HOME]: 'TaskNova AI - Professional Human Intelligence Platform',
      [AppRoute.DASHBOARD]: 'Control Console - Decoupled Bento Widgets | TaskNova AI',
      [AppRoute.SANDBOX]: 'Micro-Task Sandbox - Train LLMs | TaskNova AI',
      [AppRoute.SUBMISSIONS]: 'Submission Ledger Console | TaskNova AI',
      [AppRoute.REWARDS]: 'Rewards & Holdings Ledger | TaskNova AI',
      [AppRoute.LEADERBOARD]: 'Global Validator Leaderboard | TaskNova AI',
      [AppRoute.COMMUNITY]: 'Community Roundtable | TaskNova AI',
      [AppRoute.BLOG]: 'Chron Chronicles Blog - RLHF Alignment | TaskNova AI',
      [AppRoute.ABOUT]: 'Mission & Team - About Us | TaskNova AI',
      [AppRoute.CONTACT]: 'Corporate Inquiries Node | TaskNova AI',
      [AppRoute.BLUEPRINT]: 'Architecture Hub Specifications | TaskNova AI',
      [AppRoute.IDENTITY]: 'Identity Secure Gate | TaskNova AI',
      [AppRoute.ONBOARDING]: 'User Onboarding Calibration | TaskNova AI',
      [AppRoute.TASK_GENERATOR]: 'Enterprise Task Generation Engine | TaskNova AI',
      [AppRoute.DESIGN_SYSTEM]: 'TaskNova Global Design System | TaskNova AI',
      [AppRoute.BUSINESS_PORTAL]: 'Enterprise Campaign Workspace | TaskNova AI',
      [AppRoute.ERROR_404]: '404 - Not Found | TaskNova AI',
      [AppRoute.ERROR_500]: '500 - Server Panic | TaskNova AI',
      [AppRoute.OFFLINE]: 'Offline Mode | TaskNova AI',
      [AppRoute.MAINTENANCE]: 'Maintenance Mode | TaskNova AI',
    };

    const title = titles[activeRoute] || 'TaskNova AI';
    document.title = title;

    // Build OpenGraph and structured schema dynamic metadata
    const structuredData = {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      "name": "TaskNova AI Platform",
      "url": window.location.origin,
      "description": "Premium human intelligence alignment system.",
      "applicationCategory": "AI Alignments",
      "version": "0.1 MVP"
    };

    let script = document.getElementById('tasknova-seo-jsonld') as HTMLScriptElement;
    if (!script) {
      script = document.createElement('script');
      script.id = 'tasknova-seo-jsonld';
      script.type = 'application/ld+json';
      document.head.appendChild(script);
    }
    script.textContent = JSON.stringify(structuredData, null, 2);
  }, [activeRoute]);

  return (
    <LayoutShell activeRoute={activeRoute} setActiveRoute={setActiveRoute}>
      
      {/* Dynamic Route Renderer with Framer Motion transitions */}
      <div className="space-y-16" id="route-render-wrapper">
        
        {activeRoute === AppRoute.HOME && (
          <div className="space-y-16 animate-fade-in">
            <LandingPage setActiveRoute={setActiveRoute} />
          </div>
        )}

        {activeRoute === AppRoute.DASHBOARD && (
          <div className="space-y-8 animate-fade-in">
            <DashboardShell />
          </div>
        )}

        {activeRoute === AppRoute.SANDBOX && (
          <div className="space-y-8 animate-fade-in">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white font-display text-left">
                Interactive Micro-Task Sandbox
              </h1>
              <p className="text-sm text-slate-500 mt-1.5 font-sans font-light text-left">
                Complete micro human evaluations to help train and align Large Language Models. Watch reward credits log live in your local ledger.
              </p>
            </div>
            
            <SandboxTasks />
          </div>
        )}

        {activeRoute === AppRoute.SUBMISSIONS && (
          <div className="space-y-8 animate-fade-in">
            <SubmissionShell />
          </div>
        )}

        {activeRoute === AppRoute.TASK_GENERATOR && (
          <div className="space-y-8 animate-fade-in">
            <TaskGenerationPage />
          </div>
        )}

        {/* New auxiliary screens requested by core navigation spec */}
        {activeRoute === AppRoute.REWARDS && (
          <RewardsView />
        )}

        {activeRoute === AppRoute.LEADERBOARD && (
          <LeaderboardView />
        )}

        {activeRoute === AppRoute.COMMUNITY && (
          <CommunityView />
        )}

        {activeRoute === AppRoute.BLOG && (
          <BlogView />
        )}

        {activeRoute === AppRoute.ABOUT && (
          <AboutView />
        )}

        {activeRoute === AppRoute.CONTACT && (
          <ContactView />
        )}

        {/* System Alert & Error states */}
        {activeRoute === AppRoute.ERROR_404 && (
          <ErrorViews mode="404" setActiveRoute={setActiveRoute} />
        )}

        {activeRoute === AppRoute.ERROR_500 && (
          <ErrorViews mode="500" setActiveRoute={setActiveRoute} />
        )}

        {activeRoute === AppRoute.OFFLINE && (
          <ErrorViews mode="offline" setActiveRoute={setActiveRoute} />
        )}

        {activeRoute === AppRoute.MAINTENANCE && (
          <ErrorViews mode="maintenance" setActiveRoute={setActiveRoute} />
        )}

        {/* Developer Utilities (Architecture Hub & Design System) */}
        {activeRoute === AppRoute.BLUEPRINT && (
          <div className="space-y-8 animate-fade-in">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white font-display text-left">
                Technical Architecture Specifications
              </h1>
              <p className="text-sm text-slate-500 mt-1.5 font-sans font-light text-left">
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

        {activeRoute === AppRoute.IDENTITY && (
          <div className="space-y-8 animate-fade-in">
            <AuthGateway />
          </div>
        )}

        {activeRoute === AppRoute.ONBOARDING && (
          <div className="space-y-8 animate-fade-in">
            <OnboardingShell onComplete={() => setActiveRoute(AppRoute.HOME)} />
          </div>
        )}

      </div>
    </LayoutShell>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <InfrastructureProvider>
        <AuthProvider>
          <AppProvider>
            <SubmissionProvider>
              <ValidationProvider>
                <WalletProvider>
                  <MainAppContent />
                </WalletProvider>
              </ValidationProvider>
            </SubmissionProvider>
          </AppProvider>
        </AuthProvider>
      </InfrastructureProvider>
    </ThemeProvider>
  );
}
