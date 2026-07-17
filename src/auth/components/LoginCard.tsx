/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { useAuth } from '../hooks/useAuth';
import { validateEmail } from '../utils/validation';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Mail, Lock, ShieldAlert, Chrome, Eye, EyeOff, Loader2 } from 'lucide-react';
import { UserRole } from '../types';

interface LoginCardProps {
  onRegisterClick: () => void;
  onForgotPasswordClick: () => void;
  onSuccess: () => void;
}

export const LoginCard: React.FC<LoginCardProps> = ({
  onRegisterClick,
  onForgotPasswordClick,
  onSuccess,
}) => {
  const { signInWithEmail, signInWithGoogle, error: authError, clearAuthError } = useAuth();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearAuthError();
    
    // Perform validators checks
    const emailCheck = validateEmail(email);
    const passwordCheck = password.length > 0 
      ? { isValid: true, message: '' } 
      : { isValid: false, message: 'Password is required to proceed.' };
    
    setEmailError(emailCheck.message);
    setPasswordError(passwordCheck.message);
    
    if (!emailCheck.isValid || !passwordCheck.isValid) {
      return;
    }
    
    setIsSubmitting(true);
    try {
      await signInWithEmail(email, password, rememberMe);
      setIsSubmitting(false);
      onSuccess();
    } catch (err) {
      setIsSubmitting(false);
    }
  };

  const handleGoogleSignIn = async () => {
    clearAuthError();
    setIsSubmitting(true);
    try {
      await signInWithGoogle();
      setIsSubmitting(false);
      onSuccess();
    } catch (err) {
      setIsSubmitting(false);
    }
  };

  // Developer instant profiles mock
  const handleDeveloperShortcuts = async (role: UserRole) => {
    clearAuthError();
    setIsSubmitting(true);
    let mockEmail = 'contributor@tasknova.ai';
    if (role === UserRole.ADMIN) mockEmail = 'ayush904180@gmail.com';
    if (role === UserRole.CREATOR) mockEmail = 'creator@tasknova.ai';
    if (role === UserRole.BUSINESS) mockEmail = 'business@tasknova.ai';
    
    setEmail(mockEmail);
    setPassword('P@ssword123!');
    
    try {
      await signInWithEmail(mockEmail, 'P@ssword123!', true);
      setIsSubmitting(false);
      onSuccess();
    } catch (err) {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="p-6 md:p-8 border-slate-200 dark:border-white/5 bg-white dark:bg-[#09090b] shadow-2xl relative overflow-hidden max-w-md mx-auto text-left">
      <div className="space-y-2 mb-6 text-center">
        <h2 className="text-2xl font-bold font-display tracking-tight text-slate-900 dark:text-white">
          Access Console
        </h2>
        <p className="text-xs text-slate-400 font-sans font-light">
          Verify your organizational node parameters to authenticate.
        </p>
      </div>

      {/* Global Error Announcer */}
      {authError && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-3.5 mb-5 rounded-xl border border-rose-500/20 bg-rose-500/5 dark:bg-rose-500/10 text-xs text-rose-500 flex items-start gap-2"
          role="alert"
          aria-live="assertive"
        >
          <ShieldAlert className="h-4.5 w-4.5 shrink-0 mt-0.5" />
          <span className="font-sans leading-relaxed">{authError}</span>
        </motion.div>
      )}

      {/* Primary Google Auth Provider integration point */}
      <div className="space-y-3">
        <Button
          variant="secondary"
          onClick={handleGoogleSignIn}
          disabled={isSubmitting}
          className="w-full flex items-center justify-center gap-2 font-semibold text-xs border border-slate-200 dark:border-white/5 bg-slate-50 hover:bg-slate-100 dark:bg-white/2 dark:hover:bg-white/5"
          aria-label="Sign in using secure Google Authentication credentials"
        >
          <Chrome className="h-4 w-4" />
          <span>Authenticate with Google</span>
        </Button>

        <div className="relative flex py-2 items-center">
          <div className="flex-grow border-t border-slate-200 dark:border-white/5"></div>
          <span className="flex-shrink mx-3 text-[10px] font-mono uppercase tracking-widest text-slate-400">Or corporate credentials</span>
          <div className="flex-grow border-t border-slate-200 dark:border-white/5"></div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 pt-1">
        {/* Email Address block */}
        <div className="space-y-1.5">
          <label 
            htmlFor="auth-login-email" 
            className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400"
          >
            Sovereign Email Address
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-3.5 h-4 w-4 text-slate-400 pointer-events-none" />
            <input
              id="auth-login-email"
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (emailError) setEmailError('');
              }}
              className={`w-full bg-slate-50 dark:bg-black/20 text-slate-900 dark:text-white border ${
                emailError ? 'border-rose-500/50 focus:ring-rose-500/20' : 'border-slate-200 dark:border-white/5 focus:ring-indigo-500/20'
              } rounded-xl pl-10 pr-4 py-3 text-xs outline-hidden focus:ring-4 transition-all`}
              placeholder="name@company.com"
              aria-required="true"
              aria-invalid={!!emailError}
              aria-describedby={emailError ? 'auth-login-email-error' : undefined}
            />
          </div>
          {emailError && (
            <span id="auth-login-email-error" className="text-[10px] text-rose-500 block font-sans">
              {emailError}
            </span>
          )}
        </div>

        {/* Password block */}
        <div className="space-y-1.5">
          <div className="flex justify-between items-center">
            <label 
              htmlFor="auth-login-password" 
              className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400"
            >
              Cryptographic Password
            </label>
            <button
              type="button"
              onClick={onForgotPasswordClick}
              className="text-[10px] font-mono font-bold text-indigo-500 hover:text-indigo-600 outline-hidden focus:underline transition-colors cursor-pointer"
            >
              Forgot Password?
            </button>
          </div>
          <div className="relative">
            <Lock className="absolute left-3 top-3.5 h-4 w-4 text-slate-400 pointer-events-none" />
            <input
              id="auth-login-password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (passwordError) setPasswordError('');
              }}
              className={`w-full bg-slate-50 dark:bg-black/20 text-slate-900 dark:text-white border ${
                passwordError ? 'border-rose-500/50 focus:ring-rose-500/20' : 'border-slate-200 dark:border-white/5 focus:ring-indigo-500/20'
              } rounded-xl pl-10 pr-10 py-3 text-xs outline-hidden focus:ring-4 transition-all`}
              placeholder="••••••••••••"
              aria-required="true"
              aria-invalid={!!passwordError}
              aria-describedby={passwordError ? 'auth-login-password-error' : undefined}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-3.5 text-slate-400 hover:text-slate-200"
              aria-label={showPassword ? 'Hide password text' : 'Show password text'}
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          {passwordError && (
            <span id="auth-login-password-error" className="text-[10px] text-rose-500 block font-sans">
              {passwordError}
            </span>
          )}
        </div>

        {/* Remember Me & Persistent Session */}
        <div className="flex items-center justify-between pt-1">
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="h-4 w-4 rounded-sm border-slate-300 dark:border-white/10 bg-slate-50 dark:bg-black/20 text-indigo-600 focus:ring-indigo-500"
              aria-label="Remember this computer session parameters"
            />
            <span className="text-[11px] font-sans text-slate-500 dark:text-zinc-400">Remember session parameters</span>
          </label>
        </div>

        {/* Submission Button */}
        <Button
          type="submit"
          variant="primary"
          disabled={isSubmitting}
          className="w-full justify-center py-3 font-semibold text-xs shadow-lg shadow-indigo-500/10 cursor-pointer"
        >
          {isSubmitting ? (
            <div className="flex items-center gap-1.5">
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
              <span>Calibrating Alignment...</span>
            </div>
          ) : (
            <span>Handshake & Authenticate</span>
          )}
        </Button>
      </form>

      {/* Switch trigger link */}
      <div className="mt-6 text-center text-xs text-slate-500 dark:text-zinc-400 font-sans">
        New to TaskNova AI?{' '}
        <button
          onClick={onRegisterClick}
          className="font-semibold text-indigo-500 hover:text-indigo-600 hover:underline cursor-pointer"
        >
          Align New Node (Sign Up)
        </button>
      </div>

      {/* Developer Instant Simulator Shortcuts */}
      <div className="mt-6 pt-5 border-t border-slate-200 dark:border-white/5 space-y-2">
        <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-slate-400 block">
          ⚡ Instant Node Simulation Shortcuts
        </span>
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => handleDeveloperShortcuts(UserRole.CONTRIBUTOR)}
            className="p-1.5 rounded-lg border border-slate-100 dark:border-white/5 bg-slate-50 dark:bg-black/10 text-slate-700 dark:text-zinc-300 font-sans text-[10px] font-semibold text-center hover:bg-slate-100 dark:hover:bg-white/5 cursor-pointer"
          >
            Contributor Profile
          </button>
          <button
            type="button"
            onClick={() => handleDeveloperShortcuts(UserRole.CREATOR)}
            className="p-1.5 rounded-lg border border-slate-100 dark:border-white/5 bg-slate-50 dark:bg-black/10 text-slate-700 dark:text-zinc-300 font-sans text-[10px] font-semibold text-center hover:bg-slate-100 dark:hover:bg-white/5 cursor-pointer"
          >
            Creator Profile
          </button>
          <button
            type="button"
            onClick={() => handleDeveloperShortcuts(UserRole.BUSINESS)}
            className="p-1.5 rounded-lg border border-slate-100 dark:border-white/5 bg-slate-50 dark:bg-black/10 text-slate-700 dark:text-zinc-300 font-sans text-[10px] font-semibold text-center hover:bg-slate-100 dark:hover:bg-white/5 cursor-pointer"
          >
            Business Node
          </button>
          <button
            type="button"
            onClick={() => handleDeveloperShortcuts(UserRole.ADMIN)}
            className="p-1.5 rounded-lg border border-emerald-500/20 bg-emerald-500/5 text-emerald-500 font-sans text-[10px] font-bold text-center hover:bg-emerald-500/10 cursor-pointer"
          >
            Sovereign Admin
          </button>
        </div>
      </div>
    </Card>
  );
};

export default LoginCard;
