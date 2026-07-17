/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import { useAuth } from '../hooks/useAuth';
import { UserRole, AuthPermission } from '../types';
import { ShieldAlert, ArrowRight, Sparkles } from 'lucide-react';
import { Button } from '../../components/ui/Button';

interface RouteProps {
  children: React.ReactNode;
  fallbackView?: React.ReactNode;
}

/**
 * GuestRoute restricts access to non-authenticated users only (e.g. Login, Signup, Forgot Password screens).
 * If the user is already authenticated, it displays a neat redirect or active session notification.
 */
export const GuestRoute: React.FC<RouteProps> = ({ children, fallbackView }) => {
  const { isAuthenticated, user, signOut } = useAuth();

  if (isAuthenticated && user) {
    return fallbackView ? (
      <>{fallbackView}</>
    ) : (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="max-w-md mx-auto p-6 rounded-2xl border border-slate-200 dark:border-white/5 bg-white dark:bg-[#09090b] text-center space-y-4"
      >
        <div className="flex justify-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-500">
            <Sparkles className="h-6 w-6" />
          </div>
        </div>
        <h3 className="text-lg font-bold font-display text-slate-900 dark:text-white">Already Authenticated</h3>
        <p className="text-xs text-slate-500 dark:text-zinc-400 leading-relaxed font-sans font-light">
          You are signed in as <span className="font-semibold text-slate-700 dark:text-zinc-200">{user.email}</span> with role <span className="font-mono text-indigo-500 uppercase font-bold text-[10px] tracking-wider">{user.role}</span>.
        </p>
        <div className="flex gap-2 justify-center pt-2">
          <Button variant="secondary" onClick={signOut} className="w-full">
            Disconnect
          </Button>
        </div>
      </motion.div>
    );
  }

  return <>{children}</>;
};

/**
 * ProtectedRoute blocks guest users from accessing authenticated content.
 * Instead of redirecting away completely, it mounts a pristine Login overlay/portal so users can authenticate in-context.
 */
export const ProtectedRoute: React.FC<RouteProps & { onRedirectToLogin?: () => void }> = ({ 
  children, 
  fallbackView,
  onRedirectToLogin 
}) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-16 space-y-3">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-indigo-500 border-t-transparent" />
        <span className="text-xs font-mono text-slate-400">Verifying session token context...</span>
      </div>
    );
  }

  if (!isAuthenticated) {
    return fallbackView ? (
      <>{fallbackView}</>
    ) : (
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="max-w-md mx-auto p-8 rounded-2xl border border-rose-500/20 bg-white dark:bg-[#09090b] text-center space-y-5 shadow-xl"
      >
        <div className="flex justify-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-rose-500/10 text-rose-500">
            <ShieldAlert className="h-6 w-6" />
          </div>
        </div>
        <div>
          <h3 className="text-lg font-bold font-display text-slate-900 dark:text-white">Authentication Required</h3>
          <p className="text-xs text-slate-500 dark:text-zinc-400 mt-1.5 leading-relaxed font-sans font-light">
            SLA security guidelines require an active, validated session to explore this sandbox coordinate.
          </p>
        </div>
        <Button variant="primary" onClick={onRedirectToLogin} className="w-full justify-center flex items-center gap-1.5 group">
          <span>Authenticate Session</span>
          <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
        </Button>
      </motion.div>
    );
  }

  return <>{children}</>;
};

interface RoleRouteProps extends RouteProps {
  allowedRoles: UserRole[];
  onRedirectToLogin?: () => void;
}

/**
 * RoleProtectedRoute limits route access to specific organizational roles.
 */
export const RoleProtectedRoute: React.FC<RoleRouteProps> = ({ 
  children, 
  allowedRoles, 
  fallbackView,
  onRedirectToLogin 
}) => {
  const { isAuthenticated, user, hasRole, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-16 space-y-3">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-indigo-500 border-t-transparent" />
        <span className="text-xs font-mono text-slate-400">Verifying credential roles...</span>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <ProtectedRoute onRedirectToLogin={onRedirectToLogin}>
        {children}
      </ProtectedRoute>
    );
  }

  if (!user || !hasRole(allowedRoles)) {
    return fallbackView ? (
      <>{fallbackView}</>
    ) : (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="max-w-md mx-auto p-8 rounded-2xl border border-rose-500/20 bg-white dark:bg-[#09090b] text-center space-y-4"
      >
        <div className="flex justify-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-rose-500/10 text-rose-500">
            <ShieldAlert className="h-6 w-6" />
          </div>
        </div>
        <h3 className="text-lg font-bold font-display text-slate-900 dark:text-white">Access Violation</h3>
        <p className="text-xs text-slate-500 dark:text-zinc-400 leading-relaxed font-sans font-light">
          Your active role profile (<span className="font-mono text-rose-500 uppercase font-bold">{user?.role}</span>) is not cleared for this secure terminal. This resource requires:
        </p>
        <div className="flex flex-wrap justify-center gap-1.5 pt-1">
          {allowedRoles.map((role) => (
            <span key={role} className="text-[10px] font-mono font-bold tracking-wider text-indigo-500 dark:text-indigo-400 uppercase bg-indigo-500/5 px-2 py-0.5 rounded border border-indigo-500/10">
              {role}
            </span>
          ))}
        </div>
      </motion.div>
    );
  }

  return <>{children}</>;
};

interface PermissionRouteProps extends RouteProps {
  requiredPermission: AuthPermission;
  onRedirectToLogin?: () => void;
}

/**
 * PermissionProtectedRoute checks precise capability permissions before mounting subcomponents.
 */
export const PermissionProtectedRoute: React.FC<PermissionRouteProps> = ({
  children,
  requiredPermission,
  fallbackView,
  onRedirectToLogin
}) => {
  const { isAuthenticated, checkPermission, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-16 space-y-3">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-indigo-500 border-t-transparent" />
        <span className="text-xs font-mono text-slate-400">Auditing permission scopes...</span>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <ProtectedRoute onRedirectToLogin={onRedirectToLogin}>
        {children}
      </ProtectedRoute>
    );
  }

  if (!checkPermission(requiredPermission)) {
    return fallbackView ? (
      <>{fallbackView}</>
    ) : (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="max-w-md mx-auto p-8 rounded-2xl border border-rose-500/20 bg-white dark:bg-[#09090b] text-center space-y-4"
      >
        <div className="flex justify-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-rose-500/10 text-rose-500">
            <ShieldAlert className="h-6 w-6" />
          </div>
        </div>
        <h3 className="text-lg font-bold font-display text-slate-900 dark:text-white">Capability Restricted</h3>
        <p className="text-xs text-slate-500 dark:text-zinc-400 leading-relaxed font-sans font-light">
          Your active profile is missing the required secure permission node:
        </p>
        <div className="pt-1">
          <span className="text-[10px] font-mono font-bold tracking-wider text-rose-500 uppercase bg-rose-500/5 px-2 py-1 rounded border border-rose-500/10">
            {requiredPermission}
          </span>
        </div>
      </motion.div>
    );
  }

  return <>{children}</>;
};
