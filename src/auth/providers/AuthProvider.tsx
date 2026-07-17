/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import { AuthUser, AuthSessionState, UserRole, AuthPermission } from '../types';
import { authService } from '../services/authService';
import { AUTH_ROLES_CONFIG } from '../constants';

export interface AuthContextType extends AuthSessionState {
  signInWithGoogle: () => Promise<void>;
  signUpWithEmail: (email: string, password: string, username: string, role: UserRole) => Promise<void>;
  signInWithEmail: (email: string, password: string, rememberMe: boolean) => Promise<void>;
  signOut: () => Promise<void>;
  sendVerificationEmail: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  confirmPasswordReset: (code: string, newPassword: string) => Promise<void>;
  checkPermission: (permission: AuthPermission) => boolean;
  hasRole: (roles: UserRole[]) => boolean;
  refreshSession: () => Promise<void>;
  clearAuthError: () => void;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY = 'tasknova_auth_session';
const REMEMBER_ME_KEY = 'tasknova_auth_remember';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<AuthSessionState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
    rememberMe: false,
  });
  const [error, setError] = useState<string | null>(null);

  // Auto load persistent session on mount
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const rememberMeStr = localStorage.getItem(REMEMBER_ME_KEY);
        const rememberMe = rememberMeStr === 'true';
        
        if (rememberMe) {
          const storedSession = localStorage.getItem(LOCAL_STORAGE_KEY);
          if (storedSession) {
            const parsedUser = JSON.parse(storedSession) as AuthUser;
            setSession({
              user: parsedUser,
              isAuthenticated: true,
              isLoading: false,
              rememberMe: true,
            });
            return;
          }
        }
        
        // Default guest session
        setSession({
          user: null,
          isAuthenticated: false,
          isLoading: false,
          rememberMe: false,
        });
      } catch (err) {
        console.error('Failed to initialize session from storage:', err);
        setSession({
          user: null,
          isAuthenticated: false,
          isLoading: false,
          rememberMe: false,
        });
      }
    };
    
    initializeAuth();
  }, []);

  const clearAuthError = () => setError(null);

  const signInWithGoogle = async () => {
    setSession((prev) => ({ ...prev, isLoading: true }));
    setError(null);
    try {
      const user = await authService.signInWithGoogle();
      setSession({
        user,
        isAuthenticated: true,
        isLoading: false,
        rememberMe: true, // Google login is persistent by default
      });
      localStorage.setItem(REMEMBER_ME_KEY, 'true');
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(user));
    } catch (err: any) {
      setError(err?.message || 'Failed to authenticate via Google Account.');
      setSession((prev) => ({ ...prev, isLoading: false }));
      throw err;
    }
  };

  const signUpWithEmail = async (email: string, password: string, username: string, role: UserRole) => {
    setSession((prev) => ({ ...prev, isLoading: true }));
    setError(null);
    try {
      const user = await authService.signUpWithEmail(email, password, username, role);
      setSession({
        user,
        isAuthenticated: true,
        isLoading: false,
        rememberMe: false,
      });
      localStorage.setItem(REMEMBER_ME_KEY, 'false');
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(user));
    } catch (err: any) {
      setError(err?.message || 'Failed to construct new credentials profile.');
      setSession((prev) => ({ ...prev, isLoading: false }));
      throw err;
    }
  };

  const signInWithEmail = async (email: string, password: string, rememberMe: boolean) => {
    setSession((prev) => ({ ...prev, isLoading: true }));
    setError(null);
    try {
      const user = await authService.signInWithEmail(email, password);
      setSession({
        user,
        isAuthenticated: true,
        isLoading: false,
        rememberMe,
      });
      if (rememberMe) {
        localStorage.setItem(REMEMBER_ME_KEY, 'true');
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(user));
      } else {
        localStorage.setItem(REMEMBER_ME_KEY, 'false');
        localStorage.removeItem(LOCAL_STORAGE_KEY);
      }
    } catch (err: any) {
      setError(err?.message || 'Invalid email or password parameter specified.');
      setSession((prev) => ({ ...prev, isLoading: false }));
      throw err;
    }
  };

  const signOut = async () => {
    setSession((prev) => ({ ...prev, isLoading: true }));
    try {
      await authService.signOut();
      setSession({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        rememberMe: false,
      });
      localStorage.removeItem(LOCAL_STORAGE_KEY);
      localStorage.removeItem(REMEMBER_ME_KEY);
    } catch (err: any) {
      setError(err?.message || 'Sign out handshake failed.');
      setSession((prev) => ({ ...prev, isLoading: false }));
      throw err;
    }
  };

  const sendVerificationEmail = async () => {
    try {
      await authService.sendVerificationEmail();
    } catch (err: any) {
      setError(err?.message || 'Verification email dispatch failed.');
      throw err;
    }
  };

  const resetPassword = async (email: string) => {
    try {
      await authService.resetPassword(email);
    } catch (err: any) {
      setError(err?.message || 'Password reset request failed.');
      throw err;
    }
  };

  const confirmPasswordReset = async (code: string, newPassword: string) => {
    try {
      await authService.confirmPasswordReset(code, newPassword);
    } catch (err: any) {
      setError(err?.message || 'Confirmation of new credentials parameter failed.');
      throw err;
    }
  };

  const checkPermission = (permission: AuthPermission): boolean => {
    if (!session.user) return false;
    return session.user.permissions.includes(permission) || session.user.role === UserRole.ADMIN;
  };

  const hasRole = (roles: UserRole[]): boolean => {
    if (!session.user) return false;
    return roles.includes(session.user.role);
  };

  const refreshSession = async () => {
    setSession((prev) => ({ ...prev, isLoading: true }));
    try {
      await new Promise((resolve) => setTimeout(resolve, 600)); // Simulated validation check with security rules
      if (session.user) {
        // Enforce state synchronization check
        const updatedUser: AuthUser = {
          ...session.user,
          lastLoginAt: new Date().toISOString(),
        };
        setSession((prev) => ({ ...prev, user: updatedUser, isLoading: false }));
        if (session.rememberMe) {
          localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedUser));
        }
      } else {
        setSession((prev) => ({ ...prev, isLoading: false }));
      }
    } catch (err: any) {
      setError('Failed to refresh dynamic auth token session.');
      setSession((prev) => ({ ...prev, isLoading: false }));
    }
  };

  return (
    <AuthContext.Provider
      value={{
        ...session,
        signInWithGoogle,
        signUpWithEmail,
        signInWithEmail,
        signOut,
        sendVerificationEmail,
        resetPassword,
        confirmPasswordReset,
        checkPermission,
        hasRole,
        refreshSession,
        clearAuthError,
        error,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be consumed within a valid AuthProvider tree.');
  }
  return context;
};
export default AuthProvider;
