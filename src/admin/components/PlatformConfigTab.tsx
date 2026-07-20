/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import {
  Settings2,
  Sliders,
  ShieldCheck,
  Coins,
  Code,
  Zap,
  Globe,
  Bell,
  Lock,
  Unlock,
  AlertOctagon,
  RefreshCw,
  Award
} from 'lucide-react';

export function PlatformConfigTab() {
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  
  // XP & Rewards Config
  const [xpPerTaskEasy, setXpPerTaskEasy] = useState(10);
  const [xpPerTaskMed, setXpPerTaskMed] = useState(25);
  const [xpPerTaskHard, setXpPerTaskHard] = useState(50);
  const [multiplierVal, setMultiplierVal] = useState(1.0);

  // Validation Config
  const [geminiModel, setGeminiModel] = useState('gemini-1.5-flash');
  const [llmThreshold, setLlmThreshold] = useState(85);
  const [redundancyCount, setRedundancyCount] = useState(3);

  // Trust/Fraud Rules
  const [trustDecay, setTrustDecay] = useState(5);
  const [failedBans, setFailedBans] = useState(3);

  const handleSaveConfig = (sectionName: string) => {
    alert(`System config dispatch: "${sectionName}" calibration rules written and updated successfully.`);
  };

  const handleMaintenanceToggle = () => {
    const nextMode = !maintenanceMode;
    const confirmMsg = nextMode
      ? 'WARNING: Activating Maintenance Mode will block all non-admin ingress traffic. Active sandbox tasks will hold states. Proceed?'
      : 'Deactivate Maintenance Mode and restore global user ingress?';
    
    if (window.confirm(confirmMsg)) {
      setMaintenanceMode(nextMode);
      alert(`System notice: Maintenance Mode is now ${nextMode ? 'ON' : 'OFF'}.`);
    }
  };

  return (
    <div className="space-y-6" id="platform-config-panel">
      {/* Maintenance override banner */}
      <div className={`p-6 rounded-2xl border transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 ${
        maintenanceMode
          ? 'bg-rose-50 border-rose-250 text-rose-800 dark:bg-rose-950/10 dark:border-rose-900/30 dark:text-rose-400'
          : 'bg-white dark:bg-slate-950 border-slate-150 dark:border-white/5'
      }`}>
        <div className="flex items-center gap-4">
          <div className={`p-3 rounded-xl shrink-0 ${maintenanceMode ? 'bg-rose-500/10 text-rose-500' : 'bg-slate-100 dark:bg-zinc-900 text-slate-500'}`}>
            <AlertOctagon className="h-6 w-6" />
          </div>
          <div>
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider">System Maintenance Mode Toggle</h3>
            <p className="text-[11px] text-slate-400 mt-1 leading-relaxed max-w-2xl">
              Placing the platform in Maintenance Mode immediately redirects non-administrative HTTP requests to a standalone status screen while freezing wallet debits. Owner/Super Admin role authorization required.
            </p>
          </div>
        </div>
        <button
          onClick={handleMaintenanceToggle}
          className={`px-6 py-2.5 rounded-xl font-bold text-xs cursor-pointer transition-all ${
            maintenanceMode
              ? 'bg-rose-600 hover:bg-rose-500 text-white shadow-md'
              : 'bg-slate-950 hover:bg-slate-900 text-white dark:bg-white dark:text-slate-950 dark:hover:bg-slate-100'
          }`}
        >
          {maintenanceMode ? 'DEACTIVATE MAINTENANCE' : 'ACTIVATE MAINTENANCE'}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Card 1: XP threshold Rules */}
        <div className="bg-white dark:bg-slate-950 border border-slate-150 dark:border-white/5 rounded-2xl p-6 space-y-4">
          <h3 className="text-xs font-mono font-bold uppercase text-slate-400 tracking-wider flex items-center gap-2">
            <Award className="h-4.5 w-4.5 text-indigo-500" /> Reputation & Coins Parameters
          </h3>

          <div className="space-y-4">
            <div className="space-y-1">
              <div className="flex justify-between text-[10px] text-slate-400">
                <span>XP Gain - Easy Task</span>
                <span className="font-mono font-bold text-slate-900 dark:text-white">{xpPerTaskEasy} XP</span>
              </div>
              <input
                type="range"
                min="1"
                max="50"
                value={xpPerTaskEasy}
                onChange={(e) => setXpPerTaskEasy(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-indigo-500"
              />
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-[10px] text-slate-400">
                <span>XP Gain - Medium Task</span>
                <span className="font-mono font-bold text-slate-900 dark:text-white">{xpPerTaskMed} XP</span>
              </div>
              <input
                type="range"
                min="10"
                max="100"
                value={xpPerTaskMed}
                onChange={(e) => setXpPerTaskMed(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-indigo-500"
              />
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-[10px] text-slate-400">
                <span>XP Gain - Hard Task</span>
                <span className="font-mono font-bold text-slate-900 dark:text-white">{xpPerTaskHard} XP</span>
              </div>
              <input
                type="range"
                min="50"
                max="250"
                value={xpPerTaskHard}
                onChange={(e) => setXpPerTaskHard(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-indigo-500"
              />
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-[10px] text-slate-400">
                <span>Global Reward Multiplier Modifier</span>
                <span className="font-mono font-bold text-slate-900 dark:text-white">x{multiplierVal}</span>
              </div>
              <input
                type="range"
                min="0.5"
                max="3.0"
                step="0.1"
                value={multiplierVal}
                onChange={(e) => setMultiplierVal(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-indigo-500"
              />
            </div>
          </div>

          <button
            onClick={() => handleSaveConfig('XP Threshold Parameters')}
            className="w-full py-2 bg-slate-100 hover:bg-slate-200 dark:bg-zinc-900 dark:hover:bg-zinc-800 text-slate-800 dark:text-slate-200 text-xs font-bold rounded-xl cursor-pointer text-center"
          >
            Save XP Config rules
          </button>
        </div>

        {/* Card 2: AI Validation Config rules */}
        <div className="bg-white dark:bg-slate-950 border border-slate-150 dark:border-white/5 rounded-2xl p-6 space-y-4">
          <h3 className="text-xs font-mono font-bold uppercase text-slate-400 tracking-wider flex items-center gap-2">
            <Zap className="h-4.5 w-4.5 text-indigo-500" /> Server-side Validation Engine
          </h3>

          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-mono text-slate-400 uppercase">Primary LLM Model Evaluator</label>
              <select
                value={geminiModel}
                onChange={(e) => setGeminiModel(e.target.value)}
                className="w-full text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-xl px-3 py-2 text-slate-900 dark:text-white"
              >
                <option value="gemini-1.5-flash">Gemini 1.5 Flash (Default)</option>
                <option value="gemini-1.5-pro">Gemini 1.5 Pro (High Accuracy)</option>
                <option value="gemini-2.0-flash">Gemini 2.0 Flash (Next-gen)</option>
              </select>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-[10px] text-slate-400">
                <span>Minimum Match Semantic Threshold</span>
                <span className="font-mono font-bold text-slate-900 dark:text-white">{llmThreshold}%</span>
              </div>
              <input
                type="range"
                min="50"
                max="98"
                value={llmThreshold}
                onChange={(e) => setLlmThreshold(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-indigo-500"
              />
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-[10px] text-slate-400">
                <span>Consensus Redundancy (HIT count)</span>
                <span className="font-mono font-bold text-slate-900 dark:text-white">{redundancyCount} annotations</span>
              </div>
              <input
                type="range"
                min="1"
                max="10"
                value={redundancyCount}
                onChange={(e) => setRedundancyCount(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-indigo-500"
              />
            </div>
          </div>

          <button
            onClick={() => handleSaveConfig('AI Validation Parameters')}
            className="w-full py-2 bg-slate-100 hover:bg-slate-200 dark:bg-zinc-900 dark:hover:bg-zinc-800 text-slate-800 dark:text-slate-200 text-xs font-bold rounded-xl cursor-pointer text-center"
          >
            Save Engine rules
          </button>
        </div>

        {/* Card 3: Trust & Anti-fraud Calibration */}
        <div className="bg-white dark:bg-slate-950 border border-slate-150 dark:border-white/5 rounded-2xl p-6 space-y-4">
          <h3 className="text-xs font-mono font-bold uppercase text-slate-400 tracking-wider flex items-center gap-2">
            <Sliders className="h-4.5 w-4.5 text-indigo-500" /> Trust Decay & VPN Rules
          </h3>

          <div className="space-y-4">
            <div className="space-y-1">
              <div className="flex justify-between text-[10px] text-slate-400">
                <span>Trust Score decay on single reject validation</span>
                <span className="font-mono font-bold text-slate-900 dark:text-white">-{trustDecay}%</span>
              </div>
              <input
                type="range"
                min="1"
                max="25"
                value={trustDecay}
                onChange={(e) => setTrustDecay(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-indigo-500"
              />
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-[10px] text-slate-400">
                <span>Consecutive validation failures for auto suspend</span>
                <span className="font-mono font-bold text-slate-900 dark:text-white">{failedBans} fails</span>
              </div>
              <input
                type="range"
                min="2"
                max="10"
                value={failedBans}
                onChange={(e) => setFailedBans(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-indigo-500"
              />
            </div>
          </div>

          <button
            onClick={() => handleSaveConfig('Trust & Anti-fraud Calibration')}
            className="w-full py-2 bg-slate-100 hover:bg-slate-200 dark:bg-zinc-900 dark:hover:bg-zinc-800 text-slate-800 dark:text-slate-200 text-xs font-bold rounded-xl cursor-pointer text-center"
          >
            Save Security Rules
          </button>
        </div>

        {/* Card 4: Platform feature flags */}
        <div className="bg-white dark:bg-slate-950 border border-slate-150 dark:border-white/5 rounded-2xl p-6 space-y-4">
          <h3 className="text-xs font-mono font-bold uppercase text-slate-400 tracking-wider flex items-center gap-2">
            <Code className="h-4.5 w-4.5 text-indigo-500" /> Platform feature releases
          </h3>

          <div className="space-y-3 font-mono text-[11px] text-slate-600 dark:text-zinc-400">
            <div className="flex items-center justify-between p-2 rounded-xl border border-slate-100 dark:border-white/5">
              <span>USE_GEMINI_MODERATOR_AGENTS</span>
              <span className="font-bold text-emerald-500">ACTIVE</span>
            </div>
            <div className="flex items-center justify-between p-2 rounded-xl border border-slate-100 dark:border-white/5">
              <span>B2B_STRIPE_METERED_BILLING_CURVE</span>
              <span className="font-bold text-emerald-500">ACTIVE</span>
            </div>
            <div className="flex items-center justify-between p-2 rounded-xl border border-slate-100 dark:border-white/5">
              <span>MARKETPLACE_NFT_REWARD_CREDIT_BLOCKS</span>
              <span className="font-bold text-slate-400">DISABLED (V1)</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
export default PlatformConfigTab;
