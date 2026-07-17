/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '../hooks/useAuth';
import { UserRole } from '../types';
import LoginCard from './LoginCard';
import RegisterCard from './RegisterCard';
import ForgotPasswordCard from './ForgotPasswordCard';
import VerifyEmailCard from './VerifyEmailCard';
import ResetPasswordCard from './ResetPasswordCard';
import SuccessScreen from './SuccessScreen';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Shield, Sparkles, CheckSquare, Key, HelpCircle, FileText, Info } from 'lucide-react';

export const AuthGateway: React.FC = () => {
  const { 
    user, 
    isAuthenticated, 
    signOut, 
    refreshSession, 
    checkPermission, 
    isLoading 
  } = useAuth();

  const [view, setView] = useState<'login' | 'register' | 'forgot' | 'reset' | 'success'>('login');
  
  // Custom local state to handle email verified toggle locally for mock sandbox
  const [localEmailVerified, setLocalEmailVerified] = useState(false);

  const handleAuthSuccess = () => {
    setView('success');
  };

  const handleVerifiedSimulationBypass = () => {
    setLocalEmailVerified(true);
  };

  const isEmailVerified = user?.emailVerified || localEmailVerified;

  return (
    <div className="space-y-8 max-w-5xl mx-auto px-4 md:px-0 text-left">
      {/* Visual Header */}
      <div className="relative rounded-2xl overflow-hidden bg-gradient-to-r from-slate-950 via-[#0a0a0d] to-[#120f1c] text-white border border-white/5 p-6 md:p-8 shadow-2xl">
        <div className="absolute top-0 right-0 p-6 opacity-10 hidden md:block">
          <Shield className="h-40 w-40 text-indigo-500/20 animate-pulse" />
        </div>
        <div className="relative z-10 space-y-3">
          <div className="flex items-center gap-2">
            <Badge className="bg-indigo-500/15 text-indigo-300 border-indigo-500/20 font-bold font-mono tracking-widest text-[9px] uppercase px-2.5 py-1">Secure Gate v2.0</Badge>
            <Badge className="bg-purple-500/15 text-purple-300 border-purple-500/20 font-bold font-mono text-[9px] uppercase px-2.5 py-1">Identity Provider</Badge>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold font-display tracking-tight text-white">Authentication Architecture Foundation</h1>
          <p className="text-xs md:text-sm text-slate-400 max-w-3xl leading-relaxed font-sans font-light">
            An enterprise-ready, modular identity hub configured with complete role systems, protected routing boundaries, and accessible credential validation cards. Interconnects seamlessly with Firebase Auth SDK parameters.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Interactive Playroom Panel */}
        <div className="lg:col-span-7 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5 text-indigo-500" /> Dynamic Visual Playground
            </h3>
            <div className="flex gap-1.5 p-1 bg-slate-100 dark:bg-white/5 rounded-lg border border-slate-200/50 dark:border-white/5 text-[10px] font-mono">
              <button 
                onClick={() => setView('login')} 
                className={`px-2.5 py-1 rounded-md transition-colors ${view === 'login' ? 'bg-white text-slate-900 shadow-xs dark:bg-white/10 dark:text-white' : 'text-slate-400'}`}
              >
                Login
              </button>
              <button 
                onClick={() => setView('register')} 
                className={`px-2.5 py-1 rounded-md transition-colors ${view === 'register' ? 'bg-white text-slate-900 shadow-xs dark:bg-white/10 dark:text-white' : 'text-slate-400'}`}
              >
                Sign Up
              </button>
              <button 
                onClick={() => setView('forgot')} 
                className={`px-2.5 py-1 rounded-md transition-colors ${view === 'forgot' ? 'bg-white text-slate-900 shadow-xs dark:bg-white/10 dark:text-white' : 'text-slate-400'}`}
              >
                Forgot
              </button>
              <button 
                onClick={() => setView('reset')} 
                className={`px-2.5 py-1 rounded-md transition-colors ${view === 'reset' ? 'bg-white text-slate-900 shadow-xs dark:bg-white/10 dark:text-white' : 'text-slate-400'}`}
              >
                Reset
              </button>
            </div>
          </div>

          <div className="min-h-[450px] flex items-center justify-center p-4 bg-slate-50 dark:bg-[#030303]/40 rounded-2xl border border-slate-200/40 dark:border-white/5 relative overflow-hidden">
            {/* Background design accents */}
            <div className="absolute top-0 left-0 p-8 w-full h-full pointer-events-none opacity-5 grid grid-cols-6 gap-2">
              {Array.from({ length: 24 }).map((_, i) => (
                <div key={i} className="border-r border-b border-indigo-500 rounded-sm" />
              ))}
            </div>

            <AnimatePresence mode="wait">
              {isLoading ? (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col items-center gap-2"
                >
                  <div className="h-8 w-8 animate-spin rounded-full border-2 border-indigo-500 border-t-transparent" />
                  <span className="text-[11px] font-mono text-slate-400">Verifying security token context...</span>
                </motion.div>
              ) : isAuthenticated && user ? (
                // Authenticated user view
                <motion.div
                  key="authenticated"
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="w-full max-w-md"
                >
                  {!isEmailVerified ? (
                    <VerifyEmailCard onVerifiedSimulation={handleVerifiedSimulationBypass} />
                  ) : (
                    <SuccessScreen 
                      title="Authenticated Secure Node"
                      message={`Active credentials validated for ${user.email}. Clearances granted for designated portal operations.`}
                      actionLabel="Disconnect Session"
                      onAction={signOut}
                    />
                  )}
                </motion.div>
              ) : (
                // Guest Views
                <motion.div
                  key={view}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.2 }}
                  className="w-full"
                >
                  {view === 'login' && (
                    <LoginCard 
                      onRegisterClick={() => setView('register')} 
                      onForgotPasswordClick={() => setView('forgot')} 
                      onSuccess={handleAuthSuccess}
                    />
                  )}
                  {view === 'register' && (
                    <RegisterCard 
                      onLoginClick={() => setView('login')} 
                      onSuccess={handleAuthSuccess}
                    />
                  )}
                  {view === 'forgot' && (
                    <ForgotPasswordCard 
                      onBackToLoginClick={() => setView('login')} 
                    />
                  )}
                  {view === 'reset' && (
                    <ResetPasswordCard 
                      onSuccess={() => setView('login')} 
                      onBackToLoginClick={() => setView('login')} 
                    />
                  )}
                  {view === 'success' && (
                    <SuccessScreen 
                      actionLabel="Enter Console"
                      onAction={() => setView('login')}
                    />
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* System Metadata Ledger Panel */}
        <div className="lg:col-span-5 space-y-6">
          <div className="space-y-1.5">
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Info className="h-3.5 w-3.5 text-indigo-500" /> Active Session State
            </h3>
            <div className="p-5 rounded-2xl border border-slate-200 dark:border-white/5 bg-white dark:bg-[#09090b] space-y-4">
              <div className="flex justify-between items-center border-b border-slate-100 dark:border-white/5 pb-2.5">
                <span className="text-xs font-semibold text-slate-800 dark:text-zinc-200">Session Status</span>
                <Badge variant={isAuthenticated ? 'success' : 'neutral'}>
                  {isAuthenticated ? 'Authenticated' : 'Guest Mode'}
                </Badge>
              </div>

              {isAuthenticated && user ? (
                <div className="space-y-3.5 text-xs text-slate-600 dark:text-zinc-400">
                  <div className="flex justify-between border-b border-slate-100 dark:border-white/5 pb-2.5">
                    <span>Identity Node:</span>
                    <span className="font-semibold text-slate-900 dark:text-white">{user.displayName || 'Wizard'}</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-100 dark:border-white/5 pb-2.5">
                    <span>Coordinate Email:</span>
                    <span className="font-mono font-medium text-slate-900 dark:text-zinc-200">{user.email}</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-100 dark:border-white/5 pb-2.5">
                    <span>Active Role Profile:</span>
                    <span className="font-mono text-indigo-500 font-bold uppercase text-[10px] tracking-widest">{user.role}</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-100 dark:border-white/5 pb-2.5">
                    <span>SLA Verified Status:</span>
                    <Badge variant={isEmailVerified ? 'success' : 'warning'}>
                      {isEmailVerified ? 'SLA Approved' : 'Verification Pending'}
                    </Badge>
                  </div>
                  <div className="space-y-1.5">
                    <span className="font-mono text-[10px] uppercase font-bold text-slate-400 block">Capabilities & Permissions List</span>
                    <div className="flex flex-wrap gap-1">
                      {user.permissions.map((p) => (
                        <span 
                          key={p} 
                          className="text-[9px] font-mono font-bold uppercase px-1.5 py-0.5 rounded-sm bg-indigo-500/10 text-indigo-400 border border-indigo-500/10"
                        >
                          {p.replace(':', '_')}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="pt-2">
                    <Button 
                      variant="secondary" 
                      onClick={refreshSession} 
                      className="w-full flex items-center justify-center gap-1.5 text-xs py-2 font-semibold cursor-pointer"
                    >
                      <RefreshSessionIcon className="h-3.5 w-3.5" />
                      <span>Refresh Token Session</span>
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 space-y-2">
                  <div className="flex justify-center text-slate-300 dark:text-zinc-600">
                    <Key className="h-8 w-8" />
                  </div>
                  <p className="text-xs text-slate-400 font-sans font-light max-w-xs mx-auto">
                    Authenticate using Google account or corporate credentials to establish an active session state.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Quick Specifications list */}
          <div className="space-y-2">
            <span className="text-[10px] uppercase font-mono tracking-wider font-bold text-slate-400 block">
              Architectural Guardrails Enabled
            </span>
            <div className="p-4 rounded-xl border border-slate-200/50 dark:border-white/5 bg-slate-50/50 dark:bg-[#0c0c0e]/50 divide-y divide-slate-100 dark:divide-white/2 space-y-2.5 text-xs text-slate-500 dark:text-zinc-400">
              <div className="flex gap-2.5 pt-2.5">
                <CheckSquare className="h-4 w-4 shrink-0 text-indigo-500 mt-0.5" />
                <div className="text-left">
                  <span className="font-bold text-slate-900 dark:text-zinc-200 block">Secure Token Handling</span>
                  <p className="text-[11px] leading-normal font-sans font-light">Direct ID token validation using secure HTTP-Only session cookies or Firebase client state managers.</p>
                </div>
              </div>
              <div className="flex gap-2.5 pt-2.5">
                <CheckSquare className="h-4 w-4 shrink-0 text-indigo-500 mt-0.5" />
                <div className="text-left">
                  <span className="font-bold text-slate-900 dark:text-zinc-200 block">Anti-Injection Validators</span>
                  <p className="text-[11px] leading-normal font-sans font-light">Strong string filtering and format guards representing full safety parameters on both front and backend environments.</p>
                </div>
              </div>
              <div className="flex gap-2.5 pt-2.5">
                <CheckSquare className="h-4 w-4 shrink-0 text-indigo-500 mt-0.5" />
                <div className="text-left">
                  <span className="font-bold text-slate-900 dark:text-zinc-200 block">Zero-Trust Security Rules</span>
                  <p className="text-[11px] leading-normal font-sans font-light">ABAC system rules that guarantee secure resource allocations independent of the client interface state.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Help helper icon component
const RefreshSessionIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67"/>
  </svg>
);

export default AuthGateway;
