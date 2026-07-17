/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { useAuth } from '../hooks/useAuth';
import { validatePasswordStrength, validateConfirmPassword } from '../utils/validation';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Lock, ShieldAlert, Loader2, KeyRound, Eye, EyeOff } from 'lucide-react';

interface ResetPasswordCardProps {
  onSuccess: () => void;
  onBackToLoginClick: () => void;
}

export const ResetPasswordCard: React.FC<ResetPasswordCardProps> = ({
  onSuccess,
  onBackToLoginClick,
}) => {
  const { confirmPasswordReset, error: authError, clearAuthError } = useAuth();

  const [code, setCode] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  // Errors
  const [codeError, setCodeError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmError, setConfirmError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearAuthError();

    const codeCheck = code.trim().length > 0 
      ? { isValid: true, message: '' } 
      : { isValid: false, message: 'Recovery coordinate token is strictly required.' };
    
    const passwordCheck = validatePasswordStrength(password);
    const confirmCheck = validateConfirmPassword(password, confirmPassword);

    setCodeError(codeCheck.message);
    setPasswordError(passwordCheck.message);
    setConfirmError(confirmCheck.message);

    if (!codeCheck.isValid || !passwordCheck.isValid || !confirmCheck.isValid) {
      return;
    }

    setIsSubmitting(true);
    try {
      await confirmPasswordReset(code, password);
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
          Establish New Password
        </h2>
        <p className="text-xs text-slate-400 font-sans font-light">
          Submit the recovery coordinate code along with your new password credentials.
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

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Verification Code */}
        <div className="space-y-1.5">
          <label 
            htmlFor="auth-reset-code" 
            className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400"
          >
            Coordinate Recovery Code
          </label>
          <div className="relative">
            <KeyRound className="absolute left-3 top-3.5 h-4 w-4 text-slate-400 pointer-events-none" />
            <input
              id="auth-reset-code"
              type="text"
              value={code}
              onChange={(e) => {
                setCode(e.target.value);
                if (codeError) setCodeError('');
              }}
              className={`w-full bg-slate-50 dark:bg-black/20 text-slate-900 dark:text-white border ${
                codeError ? 'border-rose-500/50 focus:ring-rose-500/20' : 'border-slate-200 dark:border-white/5 focus:ring-indigo-500/20'
              } rounded-xl pl-10 pr-4 py-3 text-xs outline-hidden focus:ring-4 transition-all`}
              placeholder="e.g. 123456"
              aria-required="true"
              aria-invalid={!!codeError}
              aria-describedby={codeError ? 'auth-reset-code-error' : undefined}
            />
          </div>
          {codeError && (
            <span id="auth-reset-code-error" className="text-[10px] text-rose-500 block font-sans">
              {codeError}
            </span>
          )}
        </div>

        {/* New Password */}
        <div className="space-y-1.5">
          <label 
            htmlFor="auth-reset-password" 
            className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400"
          >
            New Security Password
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-3.5 h-4 w-4 text-slate-400 pointer-events-none" />
            <input
              id="auth-reset-password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (passwordError) setPasswordError('');
              }}
              className={`w-full bg-slate-50 dark:bg-black/20 text-slate-900 dark:text-white border ${
                passwordError ? 'border-rose-500/50 focus:ring-rose-500/20' : 'border-slate-200 dark:border-white/5 focus:ring-indigo-500/20'
              } rounded-xl pl-10 pr-10 py-3 text-xs outline-hidden focus:ring-4 transition-all`}
              placeholder="Min 8 characters, uppercase, number"
              aria-required="true"
              aria-invalid={!!passwordError}
              aria-describedby={passwordError ? 'auth-reset-password-error' : undefined}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-3.5 text-slate-400 hover:text-slate-200"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          {passwordError && (
            <span id="auth-reset-password-error" className="text-[10px] text-rose-500 block font-sans">
              {passwordError}
            </span>
          )}
        </div>

        {/* Re-type Password */}
        <div className="space-y-1.5">
          <label 
            htmlFor="auth-reset-confirm" 
            className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400"
          >
            Confirm New Security Password
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-3.5 h-4 w-4 text-slate-400 pointer-events-none" />
            <input
              id="auth-reset-confirm"
              type={showConfirm ? 'text' : 'password'}
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                if (confirmError) setConfirmError('');
              }}
              className={`w-full bg-slate-50 dark:bg-black/20 text-slate-900 dark:text-white border ${
                confirmError ? 'border-rose-500/50 focus:ring-rose-500/20' : 'border-slate-200 dark:border-white/5 focus:ring-indigo-500/20'
              } rounded-xl pl-10 pr-10 py-3 text-xs outline-hidden focus:ring-4 transition-all`}
              placeholder="Confirm password"
              aria-required="true"
              aria-invalid={!!confirmError}
              aria-describedby={confirmError ? 'auth-reset-confirm-error' : undefined}
            />
            <button
              type="button"
              onClick={() => setShowConfirm(!showConfirm)}
              className="absolute right-3 top-3.5 text-slate-400 hover:text-slate-200"
              aria-label={showConfirm ? 'Hide confirm password' : 'Show confirm password'}
            >
              {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          {confirmError && (
            <span id="auth-reset-confirm-error" className="text-[10px] text-rose-500 block font-sans">
              {confirmError}
            </span>
          )}
        </div>

        {/* Buttons */}
        <Button
          type="submit"
          variant="primary"
          disabled={isSubmitting}
          className="w-full justify-center py-3 font-semibold text-xs shadow-lg shadow-indigo-500/10 cursor-pointer"
        >
          {isSubmitting ? (
            <div className="flex items-center gap-1.5">
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
              <span>Updating credentials...</span>
            </div>
          ) : (
            <span>Update Credentials</span>
          )}
        </Button>
      </form>

      <div className="mt-6 text-center text-xs">
        <button
          onClick={onBackToLoginClick}
          className="font-semibold text-indigo-500 hover:text-indigo-600 hover:underline cursor-pointer"
        >
          Back to Login Console
        </button>
      </div>
    </Card>
  );
};

export default ResetPasswordCard;
