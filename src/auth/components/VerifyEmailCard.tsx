/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { useAuth } from '../hooks/useAuth';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { MailCheck, ShieldAlert, Loader2, RefreshCw, LogOut } from 'lucide-react';

interface VerifyEmailCardProps {
  onVerifiedSimulation: () => void;
}

export const VerifyEmailCard: React.FC<VerifyEmailCardProps> = ({
  onVerifiedSimulation,
}) => {
  const { sendVerificationEmail, refreshSession, signOut, user, error: authError, clearAuthError } = useAuth();

  const [isSending, setIsSending] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [sendSuccess, setSendSuccess] = useState(false);

  const handleSendVerification = async () => {
    clearAuthError();
    setIsSending(true);
    try {
      await sendVerificationEmail();
      setIsSending(false);
      setSendSuccess(true);
    } catch (err) {
      setIsSending(false);
    }
  };

  const handleRefreshCheck = async () => {
    clearAuthError();
    setIsRefreshing(true);
    try {
      await refreshSession();
      setIsRefreshing(false);
    } catch (err) {
      setIsRefreshing(false);
    }
  };

  return (
    <Card className="p-6 md:p-8 border-amber-500/20 bg-amber-500/5 dark:bg-[#16120b] shadow-2xl relative overflow-hidden max-w-md mx-auto text-left">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-amber-500/10 text-amber-500 mb-4">
        <MailCheck className="h-6 w-6" />
      </div>

      <div className="space-y-2 mb-6">
        <h2 className="text-xl font-bold font-display tracking-tight text-slate-900 dark:text-white">
          SLA Verification Required
        </h2>
        <p className="text-xs text-slate-500 dark:text-zinc-400 leading-relaxed font-sans font-light">
          Your account <span className="font-semibold text-slate-700 dark:text-zinc-200">{user?.email}</span> is currently pending email validation. To comply with anti-bot consensus guidelines and protect rewards payouts, you must verify your coordinate address.
        </p>
      </div>

      {authError && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-3 mb-5 rounded-xl border border-rose-500/20 bg-rose-500/5 dark:bg-rose-500/10 text-[11px] text-rose-500 flex items-start gap-2"
          role="alert"
          aria-live="assertive"
        >
          <ShieldAlert className="h-4 w-4 shrink-0 mt-0.5" />
          <span className="font-sans leading-relaxed">{authError}</span>
        </motion.div>
      )}

      {sendSuccess && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-3 mb-5 rounded-xl border border-emerald-500/20 bg-emerald-500/5 text-[11px] text-emerald-600 dark:text-emerald-400 leading-relaxed"
        >
          Verification link dispatched successfully! Please monitor your inbox.
        </motion.div>
      )}

      <div className="space-y-3">
        <Button
          variant="primary"
          onClick={handleSendVerification}
          disabled={isSending}
          className="w-full justify-center py-2.5 font-semibold text-xs cursor-pointer"
        >
          {isSending ? (
            <div className="flex items-center gap-1.5">
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
              <span>Dispatching Link...</span>
            </div>
          ) : (
            <span>Send Verification Link</span>
          )}
        </Button>

        <div className="grid grid-cols-2 gap-2">
          <Button
            variant="secondary"
            onClick={handleRefreshCheck}
            disabled={isRefreshing}
            className="justify-center py-2.5 font-semibold text-xs flex items-center gap-1.5 cursor-pointer"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span>Check Status</span>
          </Button>

          <Button
            variant="secondary"
            onClick={signOut}
            className="justify-center py-2.5 font-semibold text-xs text-rose-500 hover:text-rose-600 flex items-center gap-1.5 border border-rose-500/10 hover:bg-rose-500/5 cursor-pointer"
          >
            <LogOut className="h-3.5 w-3.5" />
            <span>Disconnect</span>
          </Button>
        </div>

        {/* Developer Instant Email Bypass simulation */}
        <div className="pt-4 border-t border-slate-200 dark:border-white/5 text-center">
          <button
            type="button"
            onClick={onVerifiedSimulation}
            className="text-[10px] font-mono font-bold text-amber-500 hover:text-amber-600 hover:underline cursor-pointer"
          >
            ⚡ Bypass & Simulate Verfied State (Local Dev Override)
          </button>
        </div>
      </div>
    </Card>
  );
};

export default VerifyEmailCard;
