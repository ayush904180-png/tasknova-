/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Mail, RefreshCw, CheckCircle, Clock, AlertCircle } from 'lucide-react';

interface EmailVerificationStepProps {
  email: string | null;
  isVerified: boolean;
  onSimulateVerify: () => void;
  onContinue: () => void;
  onBack: () => void;
}

export const EmailVerificationStep: React.FC<EmailVerificationStepProps> = ({
  email,
  isVerified,
  onSimulateVerify,
  onContinue,
  onBack,
}) => {
  const [resending, setResending] = useState(false);
  const [sentMessage, setSentMessage] = useState(false);

  const handleResend = () => {
    setResending(true);
    setSentMessage(false);
    setTimeout(() => {
      setResending(false);
      setSentMessage(true);
      // Automatically triggers simulation after brief delay to keep ux seamless
    }, 1200);
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-md mx-auto py-2 text-center" id="onboarding-verification-step">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold text-slate-100 tracking-tight sm:text-3xl">
          Email Verification
        </h2>
        <p className="text-sm text-slate-400">
          Verify your physical communications point to establish credentials ownership.
        </p>
      </div>

      <div className="p-6 rounded-2xl border border-slate-800 bg-slate-950/40 space-y-6 my-6">
        <div className="flex justify-center">
          {isVerified ? (
            <div className="p-4 bg-emerald-500/10 text-emerald-400 rounded-full border border-emerald-500/20">
              <CheckCircle className="w-12 h-12 animate-pulse" />
            </div>
          ) : (
            <div className="p-4 bg-amber-500/10 text-amber-400 rounded-full border border-amber-500/20">
              <Mail className="w-12 h-12 animate-bounce" />
            </div>
          )}
        </div>

        <div className="space-y-2">
          <p className="text-sm font-medium text-slate-300">
            Current Email Node:
          </p>
          <code className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-indigo-300 font-mono">
            {email || 'staging-user@tasknova.ai'}
          </code>
        </div>

        {/* Verification Status Cards */}
        {isVerified ? (
          <div className="p-4 bg-emerald-950/20 border border-emerald-500/20 rounded-xl space-y-1">
            <div className="flex items-center justify-center gap-2 text-emerald-400 font-semibold text-sm">
              <CheckCircle className="w-4 h-4" />
              <span>Identity Verified</span>
            </div>
            <p className="text-xs text-slate-400">
              Communication handshake successful. Security pass granted.
            </p>
          </div>
        ) : (
          <div className="p-4 bg-amber-950/10 border border-amber-500/10 rounded-xl space-y-1">
            <div className="flex items-center justify-center gap-2 text-amber-400 font-semibold text-sm">
              <Clock className="w-4 h-4" />
              <span>Verification Pending</span>
            </div>
            <p className="text-xs text-slate-400">
              A cryptographically signed link has been dispatched to your inbox.
            </p>
          </div>
        )}

        {/* Actions Row */}
        <div className="flex flex-col gap-2 pt-2">
          {!isVerified && (
            <button
              onClick={onSimulateVerify}
              className="w-full px-4 py-2 text-xs font-semibold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-lg transition-colors cursor-pointer"
              id="btn-simulate-verify"
            >
              Simulate Successful Verification Link Click
            </button>
          )}

          <div className="flex items-center justify-center gap-4">
            <button
              onClick={handleResend}
              disabled={resending || isVerified}
              className={`flex items-center gap-2 text-xs font-medium focus:outline-none transition-colors ${
                isVerified 
                  ? 'text-slate-600 cursor-not-allowed'
                  : 'text-indigo-400 hover:text-indigo-300 cursor-pointer'
              }`}
              id="btn-resend-verification"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${resending ? 'animate-spin' : ''}`} />
              {resending ? 'Dispatching Node...' : 'Resend Verification Mail'}
            </button>
          </div>
        </div>

        {sentMessage && (
          <p className="text-xs text-emerald-400 animate-fade-in" id="resend-success-text">
            ✓ New verification payload successfully dispatched. Check inbox.
          </p>
        )}
      </div>

      <div className="flex items-center justify-between pt-8 border-t border-slate-900">
        <button
          onClick={onBack}
          className="px-4 py-2.5 text-sm font-semibold text-slate-400 hover:text-slate-200 hover:bg-slate-900 rounded-lg transition-colors cursor-pointer"
          id="btn-verify-back"
        >
          Back
        </button>

        <button
          onClick={onContinue}
          disabled={!isVerified}
          className={`inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-slate-950 ${
            isVerified
              ? 'text-white bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 cursor-pointer'
              : 'text-slate-500 bg-slate-900 border border-slate-800 cursor-not-allowed'
          }`}
          id="btn-verify-continue"
        >
          Save & Continue
        </button>
      </div>
    </div>
  );
};
