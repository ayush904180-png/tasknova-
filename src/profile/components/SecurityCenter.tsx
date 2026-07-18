/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import { ShieldCheck, ToggleLeft, ToggleRight, Key, Laptop, Smartphone, AlertTriangle, Fingerprint, Mail, Clock } from 'lucide-react';
import { UserProfile } from '../types';

interface SecurityCenterProps {
  profile: UserProfile;
  onToggleTwoFactor: () => void;
}

export const SecurityCenter: React.FC<SecurityCenterProps> = ({
  profile,
  onToggleTwoFactor
}) => {
  const { security, recentSessions, trustedDevices } = profile;

  const getHealthColor = (score: number) => {
    if (score < 50) return 'text-rose-400 border-rose-500/20 bg-rose-500/5';
    if (score < 80) return 'text-amber-400 border-amber-500/20 bg-amber-500/5';
    return 'text-emerald-400 border-emerald-500/20 bg-emerald-500/5';
  };

  const getHealthBg = (score: number) => {
    if (score < 50) return 'bg-rose-500';
    if (score < 80) return 'bg-amber-500';
    return 'bg-emerald-500';
  };

  return (
    <div className="p-6 rounded-2xl border border-slate-800/80 bg-slate-900/20 backdrop-blur-md space-y-6">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-sm font-semibold text-white tracking-wide flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            Security Audit Center
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Manage cryptographic keys, active sessions, and multi-factor node verification.
          </p>
        </div>

        {/* Health Score Indicator */}
        <div className={`p-3 rounded-xl border flex items-center gap-3 ${getHealthColor(security.score)}`}>
          <div className="text-right">
            <div className="text-[10px] font-bold uppercase tracking-wider font-mono">Security Health</div>
            <div className="text-xs text-slate-300 mt-0.5">Rating: {security.score}/100</div>
          </div>
          <div className="relative w-10 h-10 flex items-center justify-center font-mono font-bold text-sm text-white">
            <svg className="absolute w-full h-full transform -rotate-90">
              <circle cx="20" cy="20" r="16" stroke="currentColor" strokeWidth="3" className="text-slate-800" fill="transparent" />
              <circle
                cx="20"
                cy="20"
                r="16"
                stroke="currentColor"
                strokeWidth="3"
                className={security.score < 85 ? 'text-amber-400' : 'text-emerald-400'}
                fill="transparent"
                strokeDasharray={`${2 * Math.PI * 16}`}
                strokeDashoffset={`${2 * Math.PI * 16 * (1 - security.score / 100)}`}
              />
            </svg>
            <span className="z-10">{security.score}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Core Settings: 2FA & Password */}
        <div className="space-y-4">
          <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Multi-Factor Auths</h4>

          {/* 2FA Toggle Card */}
          <div className="p-4 rounded-xl bg-slate-950/40 border border-slate-800/60 flex items-center justify-between">
            <div className="space-y-0.5">
              <div className="text-xs font-bold text-white flex items-center gap-1.5">
                Two-Factor Auth (2FA)
                {security.hasTwoFactorEnabled ? (
                  <span className="text-[9px] bg-emerald-500/20 text-emerald-400 px-1 rounded">Active</span>
                ) : (
                  <span className="text-[9px] bg-rose-500/20 text-rose-400 px-1 rounded">Vulnerable</span>
                )}
              </div>
              <p className="text-[10px] text-slate-400">Secure coin transfers and wallet access</p>
            </div>
            <button
              onClick={onToggleTwoFactor}
              className="text-slate-400 hover:text-white transition-colors"
            >
              {security.hasTwoFactorEnabled ? (
                <ToggleRight className="w-9 h-9 text-indigo-500" />
              ) : (
                <ToggleLeft className="w-9 h-9 text-slate-600" />
              )}
            </button>
          </div>

          {/* Passkey Setup Mock */}
          <div className="p-4 rounded-xl bg-slate-950/20 border border-slate-800/40 flex items-center justify-between opacity-70">
            <div className="space-y-0.5">
              <div className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                <Fingerprint className="w-3.5 h-3.5 text-slate-400" />
                Passkeys (FIDO2)
                <span className="text-[9px] bg-indigo-500/10 text-indigo-400 px-1 rounded font-mono">Future</span>
              </div>
              <p className="text-[10px] text-slate-500">Enable biometric hardware security keys</p>
            </div>
            <span className="text-[10px] text-slate-500 font-mono">Unsupported</span>
          </div>

          {/* Magic Link Setup Mock */}
          <div className="p-4 rounded-xl bg-slate-950/20 border border-slate-800/40 flex items-center justify-between opacity-70">
            <div className="space-y-0.5">
              <div className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-slate-400" />
                Magic Link Access
                <span className="text-[9px] bg-indigo-500/10 text-indigo-400 px-1 rounded font-mono">Future</span>
              </div>
              <p className="text-[10px] text-slate-500">Sign in with custom passwordless links</p>
            </div>
            <span className="text-[10px] text-indigo-400 font-mono">Mock Enabled</span>
          </div>

          {/* Password Audit Status */}
          <div className="p-4 rounded-xl bg-slate-950/40 border border-slate-800/60 space-y-3">
            <div className="flex items-center justify-between">
              <h5 className="text-xs font-bold text-white flex items-center gap-2">
                <Key className="w-4 h-4 text-indigo-400" />
                Security Password
              </h5>
              <button
                type="button"
                className="text-[10px] text-indigo-400 hover:underline"
                onClick={() => alert('Change password modal will connect with Firebase Auth in Prompt #11.')}
              >
                Reset Password
              </button>
            </div>
            <div className="flex items-center gap-2 text-[10px] text-slate-400">
              <Clock className="w-3.5 h-3.5" />
              <span>Last changed: {new Date(security.passwordLastChanged || Date.now()).toLocaleDateString()}</span>
            </div>
          </div>
        </div>

        {/* Sessions & Trusted Devices */}
        <div className="space-y-5">
          {/* Active Sessions */}
          <div className="space-y-2">
            <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Active Calibration Sessions</h4>
            <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
              {recentSessions.map((session) => (
                <div
                  key={session.id}
                  className="p-3 rounded-lg bg-slate-950/50 border border-slate-800/60 flex items-start gap-3 text-xs"
                >
                  <Laptop className="w-4 h-4 text-slate-400 mt-0.5 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-semibold text-slate-200 truncate">{session.device}</span>
                      {session.active && (
                        <span className="px-1.5 py-0.5 text-[8px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded font-mono">
                          This Node
                        </span>
                      )}
                    </div>
                    <div className="text-[10px] text-slate-400 mt-0.5">
                      IP: {session.ip} • Loc: {session.location}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Trusted Devices list */}
          <div className="space-y-2">
            <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Trusted Hardware Locks</h4>
            <div className="space-y-2">
              {trustedDevices.map((dev) => (
                <div
                  key={dev.id}
                  className="p-3 rounded-lg bg-slate-950/30 border border-slate-800/40 flex items-start gap-3 text-xs"
                >
                  <Smartphone className="w-4 h-4 text-slate-500 mt-0.5 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-slate-300 truncate">{dev.name}</div>
                    <div className="text-[9px] text-slate-500 mt-0.5 font-mono">
                      Secured: {new Date(dev.trustedSince).toLocaleDateString()} • Last Active:{' '}
                      {new Date(dev.lastUsed).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
