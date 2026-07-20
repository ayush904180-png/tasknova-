/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Users, Sparkles, RefreshCw, AlertTriangle, ShieldCheck, 
  Trash2, Play, Zap, HelpCircle, HardDrive 
} from 'lucide-react';
import { useBusiness } from '../context/BusinessContext';
import { CampaignStatus, BusinessRole } from '../types';

export const DeveloperToolsConsole: React.FC = () => {
  const { 
    currentRole, setRole, createCampaign, uploadDataset, 
    resetWorkspace, purchaseCredits, addBonusBudget 
  } = useBusiness();

  const [isWiping, setIsWiping] = useState(false);
  const [isSeeding, setIsSeeding] = useState(false);
  const [stressProfile, setStressProfile] = useState<'nominal' | 'surge' | 'critical'>('nominal');

  const handleRoleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setRole(e.target.value as BusinessRole);
  };

  const handleWipe = async () => {
    if (confirm("Are you sure you want to restore the workspace database back to standard clean seed state? Any custom added campaigns/datasets will be reset.")) {
      setIsWiping(true);
      await resetWorkspace();
      setIsWiping(false);
    }
  };

  const handleSeedCampaign = async () => {
    setIsSeeding(true);
    
    const objectives = [
      "Jailbreak alignment safety evaluation with Red-Teaming scripts.",
      "Fine-tuning robotic tactile translation datasets with image annotation.",
      "Regional accent transcription audits for model pronunciation fluency.",
      "Logical reasoning validations for high-fidelity code generation algorithms."
    ];

    const types = ["RLHF", "Image", "Translation", "OCR", "Speech", "Safety", "Pairwise Comparison"];
    const names = [
      "Llama-4 Safety Audits (Surge)",
      "Bionic Finger Segments v3",
      "Klingon Accent Alignment Trial",
      "PhDs Logic Verification Queue"
    ];

    const idx = Math.floor(Math.random() * names.length);
    const randCoins = Math.floor(Math.random() * 5 + 1) * 200000;

    await createCampaign({
      name: names[idx],
      description: objectives[idx],
      companyName: "Generative Dynamics Inc.",
      projectName: `Project-GEN-${Math.floor(Math.random() * 900 + 100)}`,
      internalNotes: "Generated via synthetic Developer seeds module.",
      tags: ["synthetic", "developer-seed"],
      taskType: types[idx] || "RLHF",
      budget: {
        coins: randCoins,
        maxSpend: randCoins / 100,
        expectedCompletion: "48 hours",
        expectedContributors: 250,
        rewardRuleMultiplier: 1.2,
        priority: "medium"
      },
      targetAudience: {
        countries: ["Worldwide"],
        languages: ["English"],
        devices: ["Desktop", "Mobile"],
        experienceLevel: "intermediate",
        trustScoreMin: 80,
        accuracyMin: 85,
        role: ["All Users"],
        contributorTier: "silver"
      },
      datasetId: "ds-base-prompt",
      qualityRules: {
        requiredAccuracy: 90,
        minimumTimePerTask: 15,
        spamProtection: true,
        manualReviewPercent: 15,
        aiReviewPercent: 85,
        consensusThreshold: 3,
        duplicateDetection: true
      },
      status: CampaignStatus.PUBLISHED
    });

    setIsSeeding(false);
  };

  const handleStressTrigger = async () => {
    setIsSeeding(true);
    // Trigger sudden coin settlement deposits & supplemental dataset loads
    await purchaseCredits(2500);
    await addBonusBudget(150000);
    await uploadDataset("Synthetic Stress Frame Ingest.json", "json", "2.1 MB");
    setIsSeeding(false);
  };

  return (
    <div className="space-y-6">
      
      <div className="bg-slate-100 dark:bg-[#131316] border border-slate-200 dark:border-white/5 rounded-2xl p-5 md:p-6 space-y-6">
        <div>
          <h4 className="text-sm font-bold font-display text-slate-900 dark:text-white flex items-center gap-1.5">
            <Zap className="h-4 w-4 text-indigo-400" />
            Interactive Developer Workspace Sandbox
          </h4>
          <p className="text-[11px] text-slate-400 mt-0.5">Simulate different compliance roles, seed synthetic stress values, and test layout thresholds.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
          
          {/* Column 1: Live Role Switcher (RBAC) */}
          <div className="bg-[#030303]/30 p-4 rounded-xl border border-white/5 space-y-3">
            <div>
              <h5 className="font-bold text-indigo-400 uppercase font-mono tracking-wider">Role-Based Access Control</h5>
              <p className="text-[10px] text-slate-500 mt-0.5">Switch user role parameters live. Permission flags across the UI update instantly.</p>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] text-slate-400">Current Role Profile</label>
              <select
                value={currentRole}
                onChange={handleRoleChange}
                className="w-full bg-slate-100 dark:bg-[#09090b] border border-slate-200 dark:border-white/5 text-slate-900 dark:text-white p-2 rounded focus:outline-none"
              >
                <option value={BusinessRole.ADMIN}>Corporate Admin (Full Access)</option>
                <option value={BusinessRole.CAMPAIGN_MANAGER}>Campaign Manager (Limited Deletes)</option>
                <option value={BusinessRole.ANALYST}>Performance Analyst (Read Analytics)</option>
                <option value={BusinessRole.FINANCE}>Finance Specialist (Billing Config)</option>
                <option value={BusinessRole.VIEWER}>Guest Viewer (Read-Only Audit)</option>
              </select>
            </div>

            <div className="bg-indigo-500/5 p-2 rounded text-[10px] text-slate-400">
              <strong className="text-indigo-400">Currently active role:</strong> <span className="uppercase text-white font-mono">{currentRole}</span>
            </div>
          </div>

          {/* Column 2: Generator & stress testing */}
          <div className="bg-[#030303]/30 p-4 rounded-xl border border-white/5 space-y-3">
            <div>
              <h5 className="font-bold text-indigo-400 uppercase font-mono tracking-wider">Synthetic Stress Generator</h5>
              <p className="text-[10px] text-slate-500 mt-0.5">Generate mock workflows, simulate surge inflows, and test area graph scales.</p>
            </div>

            <div className="space-y-2">
              <button
                type="button"
                onClick={handleSeedCampaign}
                disabled={isSeeding}
                className="w-full py-1.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-bold rounded-lg cursor-pointer flex items-center justify-center gap-1"
              >
                <Sparkles className="h-3.5 w-3.5 animate-pulse" />
                {isSeeding ? 'Injecting...' : 'Inject synthetic Campaign'}
              </button>

              <button
                type="button"
                onClick={handleStressTrigger}
                disabled={isSeeding}
                className="w-full py-1.5 bg-white/5 hover:bg-white/10 border border-white/5 text-slate-300 font-bold rounded-lg cursor-pointer flex items-center justify-center gap-1"
              >
                <Zap className="h-3.5 w-3.5" />
                Simulate wire/budget surge
              </button>
            </div>
          </div>

          {/* Column 3: Wipe & reset data */}
          <div className="bg-rose-500/5 p-4 rounded-xl border border-rose-500/10 space-y-3">
            <div>
              <h5 className="font-bold text-rose-400 uppercase font-mono tracking-wider">Hard Database Reset</h5>
              <p className="text-[10px] text-slate-500 mt-0.5">Purge the current temporary memory cache and restore standard database states.</p>
            </div>

            <p className="text-[10px] text-slate-400 leading-relaxed">Wiping will reset the local cache buffers. Standard sample datasets, invoice logs, audit streams, and baseline campaigns will be reloaded.</p>

            <button
              type="button"
              onClick={handleWipe}
              disabled={isWiping}
              className="w-full py-1.5 bg-rose-950/30 hover:bg-rose-900/40 border border-rose-500/20 text-rose-400 font-bold rounded-lg cursor-pointer flex items-center justify-center gap-1"
            >
              <Trash2 className="h-3.5 w-3.5" />
              {isWiping ? 'Resetting...' : 'Restore initial seeds'}
            </button>
          </div>

        </div>
      </div>

    </div>
  );
};
