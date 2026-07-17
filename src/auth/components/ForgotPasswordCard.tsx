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
import { Mail, ShieldAlert, Loader2, ArrowLeft, CheckCircle2 } from 'lucide-react';

interface ForgotPasswordCardProps {
  onBackToLoginClick: () => void;
}

export const ForgotPasswordCard: React.FC<ForgotPasswordCardProps> = ({
  onBackToLoginClick,
}) => {
  const { resetPassword, error: authError, clearAuthError } = useAuth();

  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearAuthError();

    const emailCheck = validateEmail(email);
    setEmailError(emailCheck.message);

    if (!emailCheck.isValid) {
      return;
    }

    setIsSubmitting(true);
    try {
      await resetPassword(email);
      setIsSubmitting(false);
      setIsSuccess(true);
    } catch (err) {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="p-6 md:p-8 border-slate-200 dark:border-white/5 bg-white dark:bg-[#09090b] shadow-2xl relative overflow-hidden max-w-md mx-auto text-left">
      <button
        onClick={onBackToLoginClick}
        className="flex items-center gap-1.5 text-xs font-mono text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors mb-4 outline-hidden focus:underline cursor-pointer"
        aria-label="Back to credential entry"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        <span>Return to Login</span>
      </button>

      {!isSuccess ? (
        <>
          <div className="space-y-2 mb-6 text-center">
            <h2 className="text-2xl font-bold font-display tracking-tight text-slate-900 dark:text-white">
              Reset Security Key
            </h2>
            <p className="text-xs text-slate-400 font-sans font-light">
              Submit your corporate email coordinate. An OTP/key reset package will be dispatched.
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
            <div className="space-y-1.5">
              <label 
                htmlFor="auth-forgot-email" 
                className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400"
              >
                Registered Email Coordinate
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-3.5 h-4 w-4 text-slate-400 pointer-events-none" />
                <input
                  id="auth-forgot-email"
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
                  aria-describedby={emailError ? 'auth-forgot-email-error' : undefined}
                />
              </div>
              {emailError && (
                <span id="auth-forgot-email-error" className="text-[10px] text-rose-500 block font-sans">
                  {emailError}
                </span>
              )}
            </div>

            <Button
              type="submit"
              variant="primary"
              disabled={isSubmitting}
              className="w-full justify-center py-3 font-semibold text-xs shadow-lg shadow-indigo-500/10 cursor-pointer"
            >
              {isSubmitting ? (
                <div className="flex items-center gap-1.5">
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  <span>Dispatching Link...</span>
                </div>
              ) : (
                <span>Request Recovery Alignment</span>
              )}
            </Button>
          </form>
        </>
      ) : (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-6 space-y-4"
        >
          <div className="flex justify-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-500">
              <CheckCircle2 className="h-6 w-6" />
            </div>
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-bold font-display text-slate-900 dark:text-white">Recovery Package Dispatched</h3>
            <p className="text-xs text-slate-500 dark:text-zinc-400 leading-relaxed font-sans font-light">
              We have dispatched alignment reset instructions to <span className="font-semibold text-slate-700 dark:text-zinc-200">{email}</span>. Please check your spam or inbox folders.
            </p>
          </div>
          <Button
            variant="secondary"
            onClick={onBackToLoginClick}
            className="w-full justify-center font-semibold text-xs mt-4 cursor-pointer"
          >
            Back to Login Console
          </Button>
        </motion.div>
      )}
    </Card>
  );
};

export default ForgotPasswordCard;
