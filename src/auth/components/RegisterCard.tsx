/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { useAuth } from '../hooks/useAuth';
import { validateEmail, validatePasswordStrength, validateConfirmPassword, validateUsername } from '../utils/validation';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Mail, Lock, ShieldAlert, Chrome, Eye, EyeOff, Loader2, User, UserCheck } from 'lucide-react';
import { UserRole } from '../types';

interface RegisterCardProps {
  onLoginClick: () => void;
  onSuccess: () => void;
}

export const RegisterCard: React.FC<RegisterCardProps> = ({
  onLoginClick,
  onSuccess,
}) => {
  const { signUpWithEmail, signInWithGoogle, error: authError, clearAuthError } = useAuth();

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState<UserRole>(UserRole.CONTRIBUTOR);
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  // Error States
  const [usernameError, setUsernameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmError, setConfirmError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearAuthError();

    const usernameCheck = validateUsername(username);
    const emailCheck = validateEmail(email);
    const passwordCheck = validatePasswordStrength(password);
    const confirmCheck = validateConfirmPassword(password, confirmPassword);

    setUsernameError(usernameCheck.message);
    setEmailError(emailCheck.message);
    setPasswordError(passwordCheck.message);
    setConfirmError(confirmCheck.message);

    if (
      !usernameCheck.isValid ||
      !emailCheck.isValid ||
      !passwordCheck.isValid ||
      !confirmCheck.isValid
    ) {
      return;
    }

    setIsSubmitting(true);
    try {
      await signUpWithEmail(email, password, username, role);
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

  return (
    <Card className="p-6 md:p-8 border-slate-200 dark:border-white/5 bg-white dark:bg-[#09090b] shadow-2xl relative overflow-hidden max-w-md mx-auto text-left">
      <div className="space-y-2 mb-6 text-center">
        <h2 className="text-2xl font-bold font-display tracking-tight text-slate-900 dark:text-white">
          Align New Node
        </h2>
        <p className="text-xs text-slate-400 font-sans font-light">
          Establish your identity profile in the TaskNova model alignment grid.
        </p>
      </div>

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

      {/* Google Integration Trigger */}
      <div className="space-y-3">
        <Button
          variant="secondary"
          onClick={handleGoogleSignIn}
          disabled={isSubmitting}
          className="w-full flex items-center justify-center gap-2 font-semibold text-xs border border-slate-200 dark:border-white/5 bg-slate-50 hover:bg-slate-100 dark:bg-white/2 dark:hover:bg-white/5"
          aria-label="Register using Google Authentication credentials"
        >
          <Chrome className="h-4 w-4" />
          <span>Register with Google Account</span>
        </Button>

        <div className="relative flex py-2 items-center">
          <div className="flex-grow border-t border-slate-200 dark:border-white/5"></div>
          <span className="flex-shrink mx-3 text-[10px] font-mono uppercase tracking-widest text-slate-400">Or custom credentials</span>
          <div className="flex-grow border-t border-slate-200 dark:border-white/5"></div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3 pt-1">
        {/* Username field */}
        <div className="space-y-1.5">
          <label 
            htmlFor="auth-signup-username" 
            className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400"
          >
            Node Username
          </label>
          <div className="relative">
            <User className="absolute left-3 top-3 h-4 w-4 text-slate-400 pointer-events-none" />
            <input
              id="auth-signup-username"
              type="text"
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
                if (usernameError) setUsernameError('');
              }}
              className={`w-full bg-slate-50 dark:bg-black/20 text-slate-900 dark:text-white border ${
                usernameError ? 'border-rose-500/50 focus:ring-rose-500/20' : 'border-slate-200 dark:border-white/5 focus:ring-indigo-500/20'
              } rounded-xl pl-10 pr-4 py-2.5 text-xs outline-hidden focus:ring-4 transition-all`}
              placeholder="e.g. alignment_wizard"
              aria-required="true"
              aria-invalid={!!usernameError}
              aria-describedby={usernameError ? 'auth-signup-username-error' : undefined}
            />
          </div>
          {usernameError && (
            <span id="auth-signup-username-error" className="text-[10px] text-rose-500 block font-sans">
              {usernameError}
            </span>
          )}
        </div>

        {/* Email Address block */}
        <div className="space-y-1.5">
          <label 
            htmlFor="auth-signup-email" 
            className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400"
          >
            Email Address
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-400 pointer-events-none" />
            <input
              id="auth-signup-email"
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (emailError) setEmailError('');
              }}
              className={`w-full bg-slate-50 dark:bg-black/20 text-slate-900 dark:text-white border ${
                emailError ? 'border-rose-500/50 focus:ring-rose-500/20' : 'border-slate-200 dark:border-white/5 focus:ring-indigo-500/20'
              } rounded-xl pl-10 pr-4 py-2.5 text-xs outline-hidden focus:ring-4 transition-all`}
              placeholder="name@company.com"
              aria-required="true"
              aria-invalid={!!emailError}
              aria-describedby={emailError ? 'auth-signup-email-error' : undefined}
            />
          </div>
          {emailError && (
            <span id="auth-signup-email-error" className="text-[10px] text-rose-500 block font-sans">
              {emailError}
            </span>
          )}
        </div>

        {/* Role Select Dropdown */}
        <div className="space-y-1.5">
          <label 
            htmlFor="auth-signup-role" 
            className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400"
          >
            Target Node Role Profile
          </label>
          <div className="relative">
            <UserCheck className="absolute left-3 top-3 h-4 w-4 text-slate-400 pointer-events-none" />
            <select
              id="auth-signup-role"
              value={role}
              onChange={(e) => setRole(e.target.value as UserRole)}
              className="w-full bg-slate-50 dark:bg-black/20 text-slate-900 dark:text-white border border-slate-200 dark:border-white/5 rounded-xl pl-10 pr-4 py-2.5 text-xs outline-hidden focus:ring-4 focus:ring-indigo-500/20 transition-all appearance-none cursor-pointer"
            >
              <option value={UserRole.CONTRIBUTOR}>Model Alignment Contributor</option>
              <option value={UserRole.CREATOR}>Campaign Creator / Evaluator</option>
              <option value={UserRole.BUSINESS}>Enterprise Partner Node</option>
            </select>
          </div>
        </div>

        {/* Password block */}
        <div className="space-y-1.5">
          <label 
            htmlFor="auth-signup-password" 
            className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400"
          >
            Security Password
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400 pointer-events-none" />
            <input
              id="auth-signup-password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (passwordError) setPasswordError('');
              }}
              className={`w-full bg-slate-50 dark:bg-black/20 text-slate-900 dark:text-white border ${
                passwordError ? 'border-rose-500/50 focus:ring-rose-500/20' : 'border-slate-200 dark:border-white/5 focus:ring-indigo-500/20'
              } rounded-xl pl-10 pr-10 py-2.5 text-xs outline-hidden focus:ring-4 transition-all`}
              placeholder="Min 8 characters, uppercase, number"
              aria-required="true"
              aria-invalid={!!passwordError}
              aria-describedby={passwordError ? 'auth-signup-password-error' : undefined}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-3 text-slate-400 hover:text-slate-200"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          {passwordError && (
            <span id="auth-signup-password-error" className="text-[10px] text-rose-500 block font-sans leading-relaxed">
              {passwordError}
            </span>
          )}
        </div>

        {/* Confirm Password block */}
        <div className="space-y-1.5 pb-2">
          <label 
            htmlFor="auth-signup-confirm" 
            className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400"
          >
            Re-type Security Password
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400 pointer-events-none" />
            <input
              id="auth-signup-confirm"
              type={showConfirm ? 'text' : 'password'}
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                if (confirmError) setConfirmError('');
              }}
              className={`w-full bg-slate-50 dark:bg-black/20 text-slate-900 dark:text-white border ${
                confirmError ? 'border-rose-500/50 focus:ring-rose-500/20' : 'border-slate-200 dark:border-white/5 focus:ring-indigo-500/20'
              } rounded-xl pl-10 pr-10 py-2.5 text-xs outline-hidden focus:ring-4 transition-all`}
              placeholder="Confirm password"
              aria-required="true"
              aria-invalid={!!confirmError}
              aria-describedby={confirmError ? 'auth-signup-confirm-error' : undefined}
            />
            <button
              type="button"
              onClick={() => setShowConfirm(!showConfirm)}
              className="absolute right-3 top-3 text-slate-400 hover:text-slate-200"
              aria-label={showConfirm ? 'Hide verify password' : 'Show verify password'}
            >
              {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          {confirmError && (
            <span id="auth-signup-confirm-error" className="text-[10px] text-rose-500 block font-sans">
              {confirmError}
            </span>
          )}
        </div>

        {/* Submit */}
        <Button
          type="submit"
          variant="primary"
          disabled={isSubmitting}
          className="w-full justify-center py-3 font-semibold text-xs shadow-lg shadow-indigo-500/10 cursor-pointer"
        >
          {isSubmitting ? (
            <div className="flex items-center gap-1.5">
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
              <span>Registering Node...</span>
            </div>
          ) : (
            <span>Provision & Initialize Node</span>
          )}
        </Button>
      </form>

      {/* Switch trigger link */}
      <div className="mt-6 text-center text-xs text-slate-500 dark:text-zinc-400 font-sans">
        Already registered in our grid?{' '}
        <button
          onClick={onLoginClick}
          className="font-semibold text-indigo-500 hover:text-indigo-600 hover:underline cursor-pointer"
        >
          Access Console (Sign In)
        </button>
      </div>
    </Card>
  );
};

export default RegisterCard;
