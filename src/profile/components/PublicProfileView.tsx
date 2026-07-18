/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Share2, Globe, Lock, ExternalLink, Trophy, ClipboardCheck, Sparkles, BookOpen } from 'lucide-react';
import { UserProfile } from '../types';

interface PublicProfileViewProps {
  profile: UserProfile;
  onToggleVisibility: (enabled: boolean) => void;
}

export const PublicProfileView: React.FC<PublicProfileViewProps> = ({
  profile,
  onToggleVisibility
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopyLink = () => {
    try {
      navigator.clipboard.writeText(profile.portfolioUrlPlaceholder);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      console.warn('[PublicProfile] Clipboard write blocked inside Frame.');
    }
  };

  return (
    <div className="p-6 rounded-2xl border border-slate-800/80 bg-slate-900/20 backdrop-blur-md space-y-6">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-sm font-semibold text-white tracking-wide flex items-center gap-2">
            <Globe className="w-4 h-4 text-sky-400" />
            Public Node Share System
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Display your verified credentials, accuracy score, and performance level on the global leaderboard directory.
          </p>
        </div>

        {/* Public Status Toggle */}
        <div className="flex items-center gap-2.5">
          <span className="text-xs text-slate-400">Node Status:</span>
          <button
            onClick={() => onToggleVisibility(!profile.isPublicProfileEnabled)}
            className={`px-3 py-1 rounded-full text-xs font-semibold font-mono border transition-all ${
              profile.isPublicProfileEnabled
                ? 'bg-sky-500/10 text-sky-400 border-sky-500/30'
                : 'bg-slate-900 text-slate-500 border-slate-800'
            }`}
          >
            {profile.isPublicProfileEnabled ? '🌐 Public Node' : '🔒 Secure Stealth'}
          </button>
        </div>
      </div>

      {/* Grid: Public details & Future Showcase preview */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          {/* Public Link Generator */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300 flex items-center gap-2">
              <Share2 className="w-3.5 h-3.5 text-slate-400" />
              Cryptographic Portfolio URL
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                readOnly
                value={profile.portfolioUrlPlaceholder}
                className="flex-1 bg-slate-950/80 border border-slate-800 rounded-xl px-3.5 py-2 text-xs font-mono text-slate-400 focus:outline-none"
              />
              <button
                onClick={handleCopyLink}
                disabled={!profile.isPublicProfileEnabled}
                className={`px-3.5 rounded-xl border text-xs font-medium font-mono transition-colors flex items-center gap-1.5 ${
                  profile.isPublicProfileEnabled
                    ? 'bg-indigo-500/10 border-indigo-500/30 text-indigo-300 hover:bg-indigo-500/20'
                    : 'bg-slate-950/20 border-slate-800 text-slate-600 cursor-not-allowed'
                }`}
              >
                <ClipboardCheck className="w-3.5 h-3.5" />
                {copied ? 'Copied' : 'Copy'}
              </button>
            </div>
            {!profile.isPublicProfileEnabled && (
              <p className="text-[10px] text-amber-500/80 flex items-center gap-1">
                <Lock className="w-3 h-3" /> Enable Public Node visibility to activate share coordinates.
              </p>
            )}
          </div>

          {/* Reputation Indicator */}
          <div className="p-4 rounded-xl bg-slate-950/40 border border-slate-800/60 space-y-2">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-300">
              <span className="flex items-center gap-1.5">
                <Trophy className="w-3.5 h-3.5 text-amber-400" />
                Alignment Reputation Score
              </span>
              <span className="text-indigo-400 font-mono text-xs">{profile.reputationScorePlaceholder} RP</span>
            </div>
            <div className="relative h-2 w-full bg-slate-800 rounded-full overflow-hidden">
              <motion.div
                className="absolute left-0 top-0 h-full rounded-full bg-amber-500"
                initial={{ width: 0 }}
                animate={{ width: `${(profile.reputationScorePlaceholder / 1200) * 100}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
            <p className="text-[10px] text-slate-500 mt-1">
              RP accumulates through consistent, accurate task contributions. Active on global ladders.
            </p>
          </div>
        </div>

        {/* Future Showcase Preview Mockup */}
        <div className="p-4 rounded-xl bg-indigo-950/5 border border-indigo-500/10 flex flex-col justify-between space-y-4">
          <div className="space-y-1.5">
            <span className="text-[9px] font-bold text-indigo-400 uppercase tracking-widest font-mono flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              Dynamic Showcase Loop
            </span>
            <h4 className="text-xs font-bold text-slate-200">Portfolio & Contribution Showcase</h4>
            <p className="text-[10px] text-slate-400 leading-relaxed">
              Future releases will automatically catalog your top fine-tuning validation achievements, specialized skills, and alignment logs into an exportable resume for developer recruiters.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-2 text-[10px]">
            <div className="p-2 rounded bg-slate-900/40 border border-slate-800/60 flex items-center gap-2">
              <BookOpen className="w-3.5 h-3.5 text-indigo-400" />
              <span className="text-slate-400">Portfolio active</span>
            </div>
            <div className="p-2 rounded bg-slate-900/40 border border-slate-800/60 flex items-center gap-2">
              <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-indigo-400 font-medium">Preview live</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
