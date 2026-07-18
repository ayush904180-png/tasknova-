/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { 
  Award, TrendingUp, Coins, ShieldCheck, ShieldAlert, Sparkles, Check, 
  ExternalLink, Lock, Settings, Code, RefreshCw, AlertTriangle, ArrowRight, 
  ChevronRight, Calendar, Landmark, CheckCircle2, Star, HelpCircle, 
  Database, FileSpreadsheet, Eye, Play, Plus, Trash2, Key, BarChart3, Clock, Flame
} from 'lucide-react';
import { motion } from 'motion/react';
import { GlobalRewardService, RewardService } from '../services/RewardService';
import { TaskDifficulty } from '../../types/index';
import { Submission, ValidationStatus, SubmissionStatus, ReviewStatus } from '../../types/submission';
import { Badge } from '../../components/ui/Badge';
import { RewardTransactionType, RewardRule, CoinLedgerEntry } from '../../types/rewards';
import { formatCoins, formatCurrencyValue } from '../../utils';
import { WorkspaceExporters } from '../exporters/WorkspaceExporters';
import { RewardTelemetry } from '../telemetry/RewardTelemetry';
import { WalletDashboard } from './WalletDashboard';

export function RewardsConsole() {
  const rewardService = useMemo(() => GlobalRewardService, []);
  
  // Ledger and XP state
  const [transactions, setTransactions] = useState<CoinLedgerEntry[]>(() => rewardService.getLedger().getTransactions());
  const [xpProfile, setXpProfile] = useState(() => rewardService.getXpEngine().getXpProfile());
  const [achievements, setAchievements] = useState(() => rewardService.getXpEngine().getAchievements());
  
  // Active Rule list
  const [rules, setRules] = useState<RewardRule[]>(() => rewardService.getRulesEngine().getRules());
  
  // Simulation Inputs state
  const [simDifficulty, setSimDifficulty] = useState<TaskDifficulty>(TaskDifficulty.MEDIUM);
  const [simQuality, setSimQuality] = useState<number>(95);
  const [simStatus, setSimStatus] = useState<ValidationStatus>(ValidationStatus.PASSED);
  
  // Fraud Flags
  const [fraudSpam, setFraudSpam] = useState(false);
  const [fraudDuplicate, setFraudDuplicate] = useState(false);
  const [fraudVelocity, setFraudVelocity] = useState(false);
  const [fraudTampering, setFraudTampering] = useState(false);
  const [fraudSuspiciousDevice, setFraudSuspiciousDevice] = useState(false);
  const [fraudRiskScore, setFraudRiskScore] = useState<number>(15);

  // Multiplier Flags
  const [multWeekend, setMultWeekend] = useState(false);
  const [multFestival, setMultFestival] = useState(false);
  const [multPeak, setMultPeak] = useState(false);
  const [multFirst, setMultFirst] = useState(false);
  const [multStreakDays, setMultStreakDays] = useState<number>(5);

  // Dynamic Rule Builder Form
  const [newRuleId, setNewRuleId] = useState('RULE-005');
  const [newRuleName, setNewRuleName] = useState('');
  const [newRuleCondition, setNewRuleCondition] = useState('qualityScore >= 95');
  const [newRuleAction, setNewRuleAction] = useState('finalCoins * 1.5');
  const [newRuleVersion, setNewRuleVersion] = useState('1.3.0');
  const [newRulePriority, setNewRulePriority] = useState<number>(40);
  const [ruleMessage, setRuleMessage] = useState<string | null>(null);

  // Evaluation Output Tracing
  const [lastCalculationResult, setLastCalculationResult] = useState<any | null>(null);
  const [evaluationSteps, setEvaluationSteps] = useState<string[]>([]);
  const [isEvaluating, setIsEvaluating] = useState(false);

  // Integrity Check results
  const [integrityReport, setIntegrityReport] = useState<{ isValid: boolean; tamperedCount: number; tamperedIds: string[] } | null>(null);

  // Workspace exports simulation
  const [sheetExportSummary, setSheetExportSummary] = useState<any | null>(null);
  const [driveExportSummary, setDriveExportSummary] = useState<any | null>(null);
  const [isExporting, setIsExporting] = useState(false);

  // Active view tab inside rewards engine console
  const [activeTab, setActiveTab] = useState<'wallet' | 'simulator' | 'rules' | 'ledger' | 'xp' | 'telemetry' | 'workspace'>('wallet');

  // Trigger telemetry aggregation
  const telemetryKPIs = useMemo(() => {
    const totalAchievements = achievements.length;
    const unlockedAchievements = achievements.filter(a => a.unlockedAt).length;
    return RewardTelemetry.computeKPIs(transactions, totalAchievements, unlockedAchievements);
  }, [transactions, achievements]);

  const [payoutLoading, setPayoutLoading] = useState(false);
  const [payoutMessage, setPayoutMessage] = useState<string | null>(null);

  // Synchronize state
  const syncState = () => {
    setTransactions(rewardService.getLedger().getTransactions());
    setXpProfile({ ...rewardService.getXpEngine().getXpProfile() });
    setAchievements([...rewardService.getXpEngine().getAchievements()]);
    setRules([...rewardService.getRulesEngine().getRules()]);
  };

  /**
   * Run the calculation engine simulator
   */
  const handleRunSimulation = async () => {
    setIsEvaluating(true);
    setEvaluationSteps([]);
    setLastCalculationResult(null);

    const steps: string[] = [];
    steps.push('Initializing Reward Calculation Pipeline...');
    
    // Simulate submission structure
    const mockSubmission: Submission = {
      submissionId: `SUB-${Math.floor(Math.random() * 90000 + 10000)}`,
      submissionVersion: 1,
      taskId: `TASK-${simDifficulty.toUpperCase()}-${Math.floor(Math.random() * 900 + 100)}`,
      taskVersion: 1,
      playerSessionId: `SESS-${Math.floor(Math.random() * 90000)}`,
      userId: 'USER-CURRENT',
      role: 'contributor',
      answers: {},
      attachmentsMetadata: [],
      startedAt: new Date(Date.now() - 120000).toISOString(),
      completedAt: new Date().toISOString(),
      elapsedTime: 120,
      submissionStatus: simStatus === ValidationStatus.PASSED ? SubmissionStatus.APPROVED : SubmissionStatus.HUMAN_REVIEW,
      trustSnapshot: {
        currentScore: 85,
        accuracy: 90,
        speedIndex: 12,
        spamProbability: 5,
        flaggedAttemptsCount: 0
      },
      deviceSnapshot: {
        deviceType: 'Desktop',
        operatingSystem: 'Linux',
        browserName: 'Chrome',
        screenResolution: '1920x1080',
        userAgent: 'Mozilla/5.0'
      },
      browserSnapshot: 'Chrome 114.0.0',
      country: 'IN',
      language: 'en',
      offlineFlag: false,
      syncStatus: 'synced',
      validationStatus: simStatus,
      reviewStatus: simStatus === ValidationStatus.PASSED ? ReviewStatus.AI_COMPLETED : ReviewStatus.AI_PENDING,
      qualityScorePlaceholder: simQuality,
      rewardPlaceholder: null,
      metadata: {},
      aiMetadata: {},
      humanMetadata: {},
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    (mockSubmission as any).taskDifficulty = simDifficulty;

    await new Promise(resolve => setTimeout(resolve, 500));
    steps.push(`Analyzing eligibility parameters: Validation Status = "${simStatus}"`);

    // Anti fraud check steps
    steps.push('Running Anti-Fraud Cryptographic Inspection...');
    if (fraudSpam) steps.push('  [ALERT] AI Quality linguistic scanners flagged spam signatures.');
    if (fraudDuplicate) steps.push('  [ALERT] Consensus node identifies payload duplicate matches.');
    if (fraudVelocity) steps.push('  [ALERT] Velocity scanner caught rate anomaly.');
    if (fraudTampering) steps.push('  [ALERT] Checksum validation failed: Payload data tampered.');
    if (fraudSuspiciousDevice) steps.push('  [ALERT] Emulator / proxy signature matched.');
    if (fraudRiskScore > 75) steps.push(`  [ALERT] Aggregate risk score too high (${fraudRiskScore}%).`);

    const result = await rewardService.evaluateAndProcessReward(mockSubmission, {
      isDuplicate: fraudDuplicate,
      isSpam: fraudSpam,
      riskScore: fraudRiskScore,
      isPayloadTampered: fraudTampering,
      isVelocityAttack: fraudVelocity,
      isSuspiciousDevice: fraudSuspiciousDevice,
      streakDays: multStreakDays,
      isWeekend: multWeekend,
      isFestival: multFestival,
      isPeakHour: multPeak,
      isFirstTask: multFirst
    });

    await new Promise(resolve => setTimeout(resolve, 400));
    if (result.antiFraudPassed && result.isEligible) {
      steps.push('Security audit cleared successfully.');
      steps.push(`Applying multipliers based on context... cumulative coefficient: ${Object.values(result.multipliersApplied as Record<string, number>).reduce((a: number, b: number) => a * b, 1).toFixed(2)}x`);
      steps.push(`Evaluating rules schema. Match version successfully identified: "${result.ruleVersionMatched}"`);
      steps.push(`Calculation Output locked. Final Coin Yield: ${result.finalCoins} Coins. XP Allocation: +${result.xpAwarded} XP`);
      steps.push('Committing immutable transaction to Coin Ledger with cryptoseal signature...');
    } else {
      steps.push('Calculation Pipeline ABORTED. Blocked by Security Policies.');
      result.fraudAlerts.forEach(alert => {
        steps.push(`  [BLOCKER] ${alert}`);
      });
    }

    setEvaluationSteps(steps);
    setLastCalculationResult(result);
    setIsEvaluating(false);
    syncState();
  };

  /**
   * Tamper simulated action to show cybersecurity checks
   */
  const handleTamperLedger = (id: string) => {
    rewardService.getLedger().tamperTransaction(id, 9999);
    syncState();
    handleCheckIntegrity();
  };

  /**
   * Reset database/ledger metrics
   */
  const handleResetLedger = () => {
    rewardService.getXpEngine().resetAchievements();
    // reload the rules & ledger default state
    localStorage.removeItem('tasknova_reward_ledger');
    localStorage.removeItem('tasknova_reward_rules');
    // reinstantiate Service ledger
    const service = GlobalRewardService;
    service.getLedger().verifyLedgerIntegrity(); // self repairs or reloads
    // re-seed
    window.location.reload();
  };

  /**
   * Perform audit signature validation
   */
  const handleCheckIntegrity = () => {
    const audit = rewardService.getLedger().verifyLedgerIntegrity();
    setIntegrityReport(audit);
  };

  /**
   * Save rule via Form
   */
  const handleAddRule = () => {
    if (!newRuleName.trim()) {
      setRuleMessage('Error: Rule Name cannot be empty.');
      return;
    }

    const newRule: RewardRule = {
      id: newRuleId,
      name: newRuleName,
      version: newRuleVersion,
      priority: Number(newRulePriority),
      status: 'Active',
      effectiveDate: new Date().toISOString().split('T')[0],
      conditionFormula: newRuleCondition,
      actionFormula: newRuleAction
    };

    rewardService.getRulesEngine().saveRule(newRule);
    syncState();
    setRuleMessage('Rule successfully deployed to active memory configuration!');
    setNewRuleId(`RULE-00${rules.length + 2}`);
    setNewRuleName('');
  };

  /**
   * Simulate Sheets & Drive exports
   */
  const handleExportToWorkspace = async () => {
    setIsExporting(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const sheetsMeta = WorkspaceExporters.prepareSheetsExportSchema({
      exportType: 'RewardLedger',
      records: transactions
    });

    const driveMeta = WorkspaceExporters.prepareDriveFolderSchema({
      reportName: 'Consolidated Reward Ledger Summary',
      exportSummary: sheetsMeta
    });

    setSheetExportSummary(sheetsMeta);
    setDriveExportSummary(driveMeta);
    setIsExporting(false);
  };

  /**
   * Clear success messages
   */
  useEffect(() => {
    if (payoutMessage) {
      const timer = setTimeout(() => setPayoutMessage(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [payoutMessage]);

  useEffect(() => {
    if (ruleMessage) {
      const timer = setTimeout(() => setRuleMessage(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [ruleMessage]);

  const handlePayoutHoldings = () => {
    const unclaimedCoins = telemetryKPIs.totalRewardsDistributed - 100; // Simulating hold calculation
    if (unclaimedCoins < 100) {
      alert("Minimum threshold is 100 coins for disbursal.");
      return;
    }
    setPayoutLoading(true);
    setTimeout(() => {
      setPayoutLoading(false);
      setPayoutMessage(`Successfully dispatched ${formatCurrencyValue(unclaimedCoins, 'IN')} to UPI bank clearance node!`);
    }, 1500);
  };

  return (
    <div className="space-y-6 text-left text-white" id="rewards-console-master">
      {/* Top Welcome Title Banner */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-zinc-900 border border-zinc-800 p-6 rounded-2xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Coins className="h-6 w-6 text-indigo-500" />
            <h1 className="text-2xl font-bold font-display">Reward Intelligence Engine</h1>
            <span className="bg-indigo-950 text-indigo-400 text-[10px] font-semibold px-2 py-0.5 rounded border border-indigo-900 font-mono">MVP Node V1.5</span>
          </div>
          <p className="text-xs text-slate-400 font-sans max-w-2xl leading-normal">
            Real-time consensus based rewards compiler. Models high-fidelity modifiers, XP curve calibrations, dynamic IF-THEN-ELSE decision trees, and cryptographic blockchain-style ledger auditing.
          </p>
        </div>
        
        <div className="flex flex-wrap gap-1 bg-zinc-950 p-1.5 rounded-xl border border-zinc-800">
          <button
            onClick={() => setActiveTab('wallet')}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg cursor-pointer transition-all ${activeTab === 'wallet' ? 'bg-indigo-600 text-white font-semibold' : 'text-slate-400 hover:text-white'}`}
          >
            Wallet & Ledger
          </button>
          <button
            onClick={() => setActiveTab('simulator')}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg cursor-pointer transition-all ${activeTab === 'simulator' ? 'bg-indigo-600 text-white font-semibold' : 'text-slate-400 hover:text-white'}`}
          >
            Simulation Node
          </button>
          <button
            onClick={() => setActiveTab('rules')}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg cursor-pointer transition-all ${activeTab === 'rules' ? 'bg-indigo-600 text-white font-semibold' : 'text-slate-400 hover:text-white'}`}
          >
            Rules Setup
          </button>
          <button
            onClick={() => setActiveTab('ledger')}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg cursor-pointer transition-all ${activeTab === 'ledger' ? 'bg-indigo-600 text-white font-semibold' : 'text-slate-400 hover:text-white'}`}
          >
            Immutable Ledger
          </button>
          <button
            onClick={() => setActiveTab('xp')}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg cursor-pointer transition-all ${activeTab === 'xp' ? 'bg-indigo-600 text-white font-semibold' : 'text-slate-400 hover:text-white'}`}
          >
            Progression & XP
          </button>
          <button
            onClick={() => setActiveTab('telemetry')}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg cursor-pointer transition-all ${activeTab === 'telemetry' ? 'bg-indigo-600 text-white font-semibold' : 'text-slate-400 hover:text-white'}`}
          >
            Telemetry & KPIs
          </button>
          <button
            onClick={() => setActiveTab('workspace')}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg cursor-pointer transition-all ${activeTab === 'workspace' ? 'bg-indigo-600 text-white font-semibold' : 'text-slate-400 hover:text-white'}`}
          >
            Integrations
          </button>
        </div>
      </div>

      {/* Quick Stats overview cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-zinc-950 border border-zinc-850 p-4 rounded-xl">
          <span className="text-[10px] uppercase font-mono tracking-wider text-slate-500 block">Total Rewards Disbursed</span>
          <span className="text-xl font-bold font-display mt-1 block text-indigo-400">{telemetryKPIs.totalRewardsDistributed} Coins</span>
          <span className="text-[10px] text-slate-400 mt-1 block">In Indian Rupee value: {formatCurrencyValue(telemetryKPIs.totalRewardsDistributed, 'IN')}</span>
        </div>

        <div className="bg-zinc-950 border border-zinc-850 p-4 rounded-xl">
          <span className="text-[10px] uppercase font-mono tracking-wider text-slate-500 block">Active Rule Version</span>
          <span className="text-xl font-bold font-display mt-1 block text-indigo-400">V{rules[0]?.version || '1.2.0'} Locked</span>
          <span className="text-[10px] text-slate-400 mt-1 block">{rules.length} configured logic schemas</span>
        </div>

        <div className="bg-zinc-950 border border-zinc-850 p-4 rounded-xl">
          <span className="text-[10px] uppercase font-mono tracking-wider text-slate-500 block">Contributor Rank Level</span>
          <span className="text-xl font-bold font-display mt-1 block text-indigo-400">Lvl {xpProfile.currentLevel} • {xpProfile.contributorRank}</span>
          <span className="text-[10px] text-slate-400 mt-1 block">{xpProfile.currentXp} total Experience Points</span>
        </div>

        <div className="bg-zinc-950 border border-zinc-850 p-4 rounded-xl">
          <span className="text-[10px] uppercase font-mono tracking-wider text-slate-500 block">Ledger Integrity Status</span>
          <span className="text-xl font-bold font-display mt-1 flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-emerald-500" />
            <span className="text-emerald-400">Verifying</span>
          </span>
          <span className="text-[10px] text-slate-400 mt-1 block">All hash nodes signed cryptographically</span>
        </div>
      </div>

      {/* Main tab windows */}
      {activeTab === 'wallet' && (
        <WalletDashboard />
      )}
      {activeTab === 'simulator' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left panel: Simulator inputs */}
          <div className="lg:col-span-7 bg-zinc-900 border border-zinc-850 rounded-2xl p-6 space-y-6">
            <div className="space-y-1">
              <h3 className="text-sm font-bold font-display uppercase tracking-wider text-indigo-400">Interactive Validator Simulation</h3>
              <p className="text-xs text-slate-400 font-sans">
                Adjust human intelligence validation scores and simulated fraud parameters below to trace how the Reward calculation model behaves in real time.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Core Quality scores */}
              <div className="space-y-4 bg-zinc-950 p-4 rounded-xl border border-zinc-850">
                <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest block border-b border-zinc-850 pb-1">Task & QA Parameters</span>
                
                <div className="space-y-1">
                  <label className="text-xs text-slate-400 font-medium block">Difficulty Multiplier Matrix</label>
                  <select
                    value={simDifficulty}
                    onChange={(e) => setSimDifficulty(e.target.value as TaskDifficulty)}
                    className="w-full bg-zinc-900 border border-zinc-800 text-xs text-slate-200 rounded-lg p-2 focus:ring-1 focus:ring-indigo-500 outline-none"
                  >
                    <option value={TaskDifficulty.EASY}>Easy (1.0x Base Scale)</option>
                    <option value={TaskDifficulty.MEDIUM}>Medium (1.5x Base Scale)</option>
                    <option value={TaskDifficulty.HARD}>Hard (2.2x Base Scale)</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-slate-400">QA Quality Score:</span>
                    <span className="text-indigo-400 font-bold">{simQuality}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={simQuality}
                    onChange={(e) => setSimQuality(Number(e.target.value))}
                    className="w-full accent-indigo-600 bg-zinc-900"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs text-slate-400 font-medium block">Task Validation Verdict</label>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setSimStatus(ValidationStatus.PASSED)}
                      className={`flex-1 py-1.5 text-center text-xs font-semibold rounded-lg border transition ${simStatus === ValidationStatus.PASSED ? 'bg-emerald-950 text-emerald-400 border-emerald-800' : 'bg-zinc-900 text-slate-400 border-zinc-800 hover:text-white'}`}
                    >
                      Passed / Approve
                    </button>
                    <button
                      onClick={() => setSimStatus(ValidationStatus.FAILED)}
                      className={`flex-1 py-1.5 text-center text-xs font-semibold rounded-lg border transition ${simStatus === ValidationStatus.FAILED ? 'bg-rose-950 text-rose-400 border-rose-800' : 'bg-zinc-900 text-slate-400 border-zinc-800 hover:text-white'}`}
                    >
                      Failed / Reject
                    </button>
                  </div>
                </div>
              </div>

              {/* Multiplier Toggles */}
              <div className="space-y-4 bg-zinc-950 p-4 rounded-xl border border-zinc-850">
                <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest block border-b border-zinc-850 pb-1">Dynamic Modifiers</span>
                
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <label className="flex items-center gap-2 p-1.5 bg-zinc-900/60 rounded border border-zinc-850 cursor-pointer">
                    <input type="checkbox" checked={multWeekend} onChange={() => setMultWeekend(!multWeekend)} className="accent-indigo-600" />
                    <span>Weekend (1.1x)</span>
                  </label>
                  <label className="flex items-center gap-2 p-1.5 bg-zinc-900/60 rounded border border-zinc-850 cursor-pointer">
                    <input type="checkbox" checked={multFestival} onChange={() => setMultFestival(!multFestival)} className="accent-indigo-600" />
                    <span>Festival (1.25x)</span>
                  </label>
                  <label className="flex items-center gap-2 p-1.5 bg-zinc-900/60 rounded border border-zinc-850 cursor-pointer">
                    <input type="checkbox" checked={multPeak} onChange={() => setMultPeak(!multPeak)} className="accent-indigo-600" />
                    <span>Peak hour (1.15x)</span>
                  </label>
                  <label className="flex items-center gap-2 p-1.5 bg-zinc-900/60 rounded border border-zinc-850 cursor-pointer">
                    <input type="checkbox" checked={multFirst} onChange={() => setMultFirst(!multFirst)} className="accent-indigo-600" />
                    <span>First Task (2.0x)</span>
                  </label>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-slate-400">Daily Streak Progress:</span>
                    <span className="text-amber-500 font-bold flex items-center gap-1"><Flame className="h-3 w-3 fill-amber-500" /> {multStreakDays} Days</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="45"
                    value={multStreakDays}
                    onChange={(e) => setMultStreakDays(Number(e.target.value))}
                    className="w-full accent-amber-500 bg-zinc-900"
                  />
                </div>
              </div>
            </div>

            {/* Anti-fraud controls */}
            <div className="space-y-4 bg-zinc-950 p-4 rounded-xl border border-zinc-850">
              <span className="text-[10px] font-mono font-bold text-rose-400 uppercase tracking-widest block border-b border-zinc-850 pb-1">Anti-Fraud Security Shield</span>
              
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
                <label className="flex items-center gap-2 p-1.5 bg-rose-950/10 hover:bg-rose-950/20 rounded border border-rose-900/20 cursor-pointer text-slate-300">
                  <input type="checkbox" checked={fraudSpam} onChange={() => setFraudSpam(!fraudSpam)} className="accent-rose-600" />
                  <span>Flag as Spam</span>
                </label>
                <label className="flex items-center gap-2 p-1.5 bg-rose-950/10 hover:bg-rose-950/20 rounded border border-rose-900/20 cursor-pointer text-slate-300">
                  <input type="checkbox" checked={fraudDuplicate} onChange={() => setFraudDuplicate(!fraudDuplicate)} className="accent-rose-600" />
                  <span>Flag Duplicate</span>
                </label>
                <label className="flex items-center gap-2 p-1.5 bg-rose-950/10 hover:bg-rose-950/20 rounded border border-rose-900/20 cursor-pointer text-slate-300">
                  <input type="checkbox" checked={fraudVelocity} onChange={() => setFraudVelocity(!fraudVelocity)} className="accent-rose-600" />
                  <span>Velocity Attack</span>
                </label>
                <label className="flex items-center gap-2 p-1.5 bg-rose-950/10 hover:bg-rose-950/20 rounded border border-rose-900/20 cursor-pointer text-slate-300">
                  <input type="checkbox" checked={fraudTampering} onChange={() => setFraudTampering(!fraudTampering)} className="accent-rose-600" />
                  <span>Tampered Payload</span>
                </label>
                <label className="flex items-center gap-2 p-1.5 bg-rose-950/10 hover:bg-rose-950/20 rounded border border-rose-900/20 cursor-pointer text-slate-300">
                  <input type="checkbox" checked={fraudSuspiciousDevice} onChange={() => setFraudSuspiciousDevice(!fraudSuspiciousDevice)} className="accent-rose-600" />
                  <span>Suspicious Device</span>
                </label>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-slate-400">Composite Threat Risk Index:</span>
                  <span className={`font-bold ${fraudRiskScore > 75 ? 'text-rose-500' : 'text-slate-400'}`}>{fraudRiskScore}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={fraudRiskScore}
                  onChange={(e) => setFraudRiskScore(Number(e.target.value))}
                  className="w-full accent-rose-600 bg-zinc-900"
                />
              </div>
            </div>

            <button
              onClick={handleRunSimulation}
              disabled={isEvaluating}
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 font-semibold rounded-xl text-sm flex items-center justify-center gap-2 shadow-lg hover:shadow-indigo-500/15 cursor-pointer disabled:opacity-50"
            >
              {isEvaluating ? (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  <span>Evaluating System Node Calculations...</span>
                </>
              ) : (
                <>
                  <Play className="h-4 w-4 fill-white text-white" />
                  <span>Calculate & Disburse Reward</span>
                </>
              )}
            </button>
          </div>

          {/* Right panel: Tracing output */}
          <div className="lg:col-span-5 bg-zinc-900 border border-zinc-850 rounded-2xl p-6 space-y-6">
            <div className="space-y-1">
              <h3 className="text-sm font-bold font-display uppercase tracking-wider text-emerald-400">Reward Flow Execution Logs</h3>
              <p className="text-xs text-slate-400 font-sans">
                Real-time visibility into variables as they compile sequentially.
              </p>
            </div>

            {/* Tracing steps */}
            <div className="bg-zinc-950 p-4 rounded-xl border border-zinc-850 h-[320px] overflow-y-auto font-mono text-[11px] space-y-2 text-slate-300 leading-normal select-text">
              {evaluationSteps.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-2 text-slate-500">
                  <Database className="h-8 w-8 text-slate-700 animate-pulse" />
                  <p>Ready to compile reward cycle.</p>
                  <p className="text-[10px]">Click the disburse execution trigger to start trace.</p>
                </div>
              ) : (
                evaluationSteps.map((step, idx) => (
                  <div key={idx} className={step.startsWith('  [ALERT]') || step.startsWith('  [BLOCKER]') ? 'text-rose-400' : step.startsWith('Calculation Output') ? 'text-emerald-400 font-bold' : ''}>
                    {step}
                  </div>
                ))
              )}
            </div>

            {/* Summary block */}
            {lastCalculationResult && (
              <div className={`p-4 rounded-xl border ${lastCalculationResult.isEligible && lastCalculationResult.antiFraudPassed ? 'bg-emerald-950/20 border-emerald-900/30 text-emerald-400' : 'bg-rose-950/20 border-rose-900/30 text-rose-400'} space-y-3`}>
                <div className="flex items-center gap-2 font-display text-xs font-bold">
                  {lastCalculationResult.isEligible && lastCalculationResult.antiFraudPassed ? (
                    <>
                      <ShieldCheck className="h-4 w-4 text-emerald-500" />
                      <span>Ledger Credit Transaction Sealed!</span>
                    </>
                  ) : (
                    <>
                      <ShieldAlert className="h-4 w-4 text-rose-500" />
                      <span>Reward Process Aborted</span>
                    </>
                  )}
                </div>

                {lastCalculationResult.isEligible && lastCalculationResult.antiFraudPassed ? (
                  <div className="grid grid-cols-2 gap-4 text-xs">
                    <div>
                      <span className="text-[10px] text-slate-400 block font-mono">FINALLY CREDIT COINS</span>
                      <span className="text-xl font-bold font-display mt-0.5 inline-block text-white">+{lastCalculationResult.finalCoins} Coins</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block font-mono">XP CALCULATION</span>
                      <span className="text-xl font-bold font-display mt-0.5 inline-block text-indigo-400">+{lastCalculationResult.xpAwarded} XP</span>
                    </div>
                  </div>
                ) : (
                  <p className="text-xs text-slate-400 leading-normal">
                    This submission failed anti-fraud checks or task compliance evaluation. No reward coins or XP credits were issued to the immutable ledger.
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'rules' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Rules List */}
          <div className="lg:col-span-7 bg-zinc-900 border border-zinc-850 p-6 rounded-2xl space-y-4">
            <div className="flex justify-between items-center border-b border-zinc-800 pb-3">
              <div className="space-y-1">
                <h3 className="text-sm font-bold font-display uppercase tracking-wider text-indigo-400">Reward Rules Engine Configurator</h3>
                <p className="text-xs text-slate-400 font-sans">Active conditional evaluation maps deployed on TaskNova cluster.</p>
              </div>
              <Badge variant="primary">Rule Version V1.2.0</Badge>
            </div>

            <div className="space-y-3 max-h-[480px] overflow-y-auto">
              {rules.map((rule) => (
                <div key={rule.id} className={`p-4 rounded-xl border ${rule.status === 'Active' ? 'bg-zinc-950 border-zinc-850' : 'bg-zinc-950/40 border-zinc-900 opacity-60'} space-y-2 text-xs`}>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <span className="font-mono bg-zinc-900 px-1.5 py-0.5 rounded text-[10px] text-slate-400">{rule.id}</span>
                      <span className="font-bold font-display text-white">{rule.name}</span>
                    </div>
                    <span className="text-[10px] text-slate-500 font-mono">Priority {rule.priority} • Ver {rule.version}</span>
                  </div>

                  <div className="space-y-1.5 font-mono text-[10px] bg-zinc-900 p-2.5 rounded border border-zinc-850/50">
                    <p className="text-indigo-400"><span className="text-slate-500">IF </span> {rule.conditionFormula}</p>
                    <p className="text-emerald-400"><span className="text-slate-500">THEN </span> {rule.actionFormula}</p>
                    {rule.elseFormula && <p className="text-slate-400"><span className="text-slate-500">ELSE </span> {rule.elseFormula}</p>}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* New Rule creation simulating Business Console updates */}
          <div className="lg:col-span-5 bg-zinc-900 border border-zinc-850 p-6 rounded-2xl space-y-4">
            <div className="space-y-1 border-b border-zinc-800 pb-3">
              <h3 className="text-sm font-bold font-display uppercase tracking-wider text-amber-500">Business Rules Provisioner</h3>
              <p className="text-xs text-slate-400 font-sans">Simulate dynamic addition of rules without needing source code recompiles.</p>
            </div>

            <div className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="text-slate-400 block font-medium">Rule ID</label>
                <input
                  type="text"
                  value={newRuleId}
                  disabled
                  className="w-full bg-zinc-950 border border-zinc-800 p-2 rounded text-slate-500 font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-400 block font-medium">Friendly Rule Name</label>
                <input
                  type="text"
                  placeholder="e.g. Special Holiday Double Rewards"
                  value={newRuleName}
                  onChange={(e) => setNewRuleName(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 p-2 rounded text-slate-200 outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-slate-400 block font-medium">Evaluation Priority</label>
                  <input
                    type="number"
                    value={newRulePriority}
                    onChange={(e) => setNewRulePriority(Number(e.target.value))}
                    className="w-full bg-zinc-950 border border-zinc-800 p-2 rounded text-slate-200 font-mono outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-slate-400 block font-medium">Rule Version</label>
                  <input
                    type="text"
                    value={newRuleVersion}
                    onChange={(e) => setNewRuleVersion(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 p-2 rounded text-slate-200 font-mono outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-slate-400 block font-medium">IF Condition Formula</label>
                <input
                  type="text"
                  placeholder="e.g. qualityScore >= 95"
                  value={newRuleCondition}
                  onChange={(e) => setNewRuleCondition(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 p-2 rounded text-indigo-400 font-mono outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-400 block font-medium">THEN Action Formula</label>
                <input
                  type="text"
                  placeholder="e.g. finalCoins * 1.5"
                  value={newRuleAction}
                  onChange={(e) => setNewRuleAction(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 p-2 rounded text-emerald-400 font-mono outline-none"
                />
              </div>

              <button
                onClick={handleAddRule}
                className="w-full py-2 bg-amber-600 hover:bg-amber-700 font-bold rounded-lg text-white text-xs cursor-pointer flex items-center justify-center gap-1"
              >
                <Plus className="h-4 w-4" />
                <span>Deploy Rule To Memory</span>
              </button>

              {ruleMessage && (
                <div className="p-3 bg-emerald-950/20 border border-emerald-900 text-emerald-400 text-center rounded-lg font-mono text-[10px]">
                  {ruleMessage}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'ledger' && (
        <div className="bg-zinc-900 border border-zinc-850 p-6 rounded-2xl space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-zinc-800 pb-4">
            <div className="space-y-1">
              <h3 className="text-sm font-bold font-display uppercase tracking-wider text-indigo-400">Immutable Coin Transaction Ledger</h3>
              <p className="text-xs text-slate-400 font-sans">Every single credit, debit or bonus is cryptographically sealed inside the consensus sequence ledger block.</p>
            </div>

            <div className="flex gap-2">
              <button
                onClick={handleCheckIntegrity}
                className="px-3 py-1.5 bg-indigo-950 border border-indigo-900 text-indigo-400 text-xs font-semibold rounded-lg flex items-center gap-1 hover:text-white cursor-pointer"
              >
                <Key className="h-3.5 w-3.5" />
                <span>Audit Ledger Integrity</span>
              </button>
              <button
                onClick={handleResetLedger}
                className="px-3 py-1.5 bg-rose-950 border border-rose-900 text-rose-400 text-xs font-semibold rounded-lg flex items-center gap-1 hover:text-white cursor-pointer"
              >
                <RefreshCw className="h-3.5 w-3.5" />
                <span>Reset Ledger Nodes</span>
              </button>
            </div>
          </div>

          {integrityReport && (
            <div className={`p-4 rounded-xl border ${integrityReport.isValid ? 'bg-emerald-950/20 border-emerald-900/30 text-emerald-400' : 'bg-rose-950/20 border-rose-900/30 text-rose-400'} text-xs space-y-2`}>
              <div className="flex items-center gap-2 font-semibold">
                {integrityReport.isValid ? (
                  <>
                    <ShieldCheck className="h-5 w-5 text-emerald-400" />
                    <span>Cryptographic Audit Clear: 100% Integrity Sealed.</span>
                  </>
                ) : (
                  <>
                    <AlertTriangle className="h-5 w-5 text-rose-400 animate-pulse" />
                    <span>SECURITY WARNING: Ledger Tampering Detected!</span>
                  </>
                )}
              </div>
              <p className="text-slate-400 font-sans leading-normal">
                {integrityReport.isValid 
                  ? 'All transaction checksum signatures match. Recomputed hashes match original cryptographic block seals. Payout pipeline safe.'
                  : `Checksum mismatch identified on ${integrityReport.tamperedCount} record(s): ${integrityReport.tamperedIds.join(', ')}. Disbursal pipeline frozen immediately.`}
              </p>
            </div>
          )}

          {/* Transactions List */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-zinc-800 text-slate-400 uppercase font-mono text-[10px]">
                  <th className="py-3 px-4">Transaction Details</th>
                  <th className="py-3 px-4">Type</th>
                  <th className="py-3 px-4">Cryptoseal Signature Hash</th>
                  <th className="py-3 px-4 text-right">Credit / Debit</th>
                  <th className="py-3 px-4 text-center">Simulate Attack</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-850 font-sans">
                {transactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-zinc-950/40">
                    <td className="py-3 px-4 space-y-1">
                      <span className="font-semibold text-slate-200 block">{tx.reason}</span>
                      <span className="text-[10px] text-slate-400 block font-mono">ID: {tx.id} • {new Date(tx.timestamp).toLocaleString()}</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`text-[10px] font-mono px-2 py-0.5 rounded border uppercase ${
                        tx.type === RewardTransactionType.BONUS ? 'bg-amber-950 text-amber-400 border-amber-900' :
                        tx.type === RewardTransactionType.CREDIT ? 'bg-emerald-950 text-emerald-400 border-emerald-900' :
                        tx.type === RewardTransactionType.DEBIT ? 'bg-indigo-950 text-indigo-400 border-indigo-900' :
                        'bg-zinc-950 text-slate-400 border-zinc-800'
                      }`}>
                        {tx.type}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-mono text-[10px] text-indigo-400/80">
                      {tx.isTampered ? (
                        <span className="text-rose-500 font-bold flex items-center gap-1">
                          <AlertTriangle className="h-3 w-3" /> TAMPERED_HASH
                        </span>
                      ) : (
                        tx.cryptographicSignature
                      )}
                    </td>
                    <td className="py-3 px-4 text-right font-mono font-bold text-sm">
                      <span className={tx.amount > 0 ? 'text-emerald-400' : 'text-slate-400'}>
                        {tx.amount > 0 ? `+${tx.amount}` : tx.amount} Coins
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={() => handleTamperLedger(tx.id)}
                        className="p-1.5 bg-rose-950/20 hover:bg-rose-950/60 text-rose-400 rounded hover:text-white transition cursor-pointer"
                        title="Simulate injection attack to check security signature audit"
                      >
                        <AlertTriangle className="h-3.5 w-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'xp' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* XP Progress Card */}
          <div className="lg:col-span-4 bg-zinc-900 border border-zinc-850 p-6 rounded-2xl space-y-6">
            <div className="space-y-1">
              <h3 className="text-sm font-bold font-display uppercase tracking-wider text-indigo-400">Contributor Progression Profile</h3>
              <p className="text-xs text-slate-400 font-sans">XP measures quality, consistency, and alignment history independently of coins.</p>
            </div>

            {/* Level meter */}
            <div className="space-y-4 bg-zinc-950 p-5 rounded-xl border border-zinc-850 text-xs">
              <div className="flex justify-between font-mono">
                <span className="text-slate-400">Contributor Rank:</span>
                <span className="text-amber-400 font-bold">{xpProfile.contributorRank}</span>
              </div>
              
              <div className="flex justify-between items-end">
                <div>
                  <span className="text-[10px] text-slate-400 block font-mono">CURRENT LEVEL</span>
                  <span className="text-3xl font-black font-display text-white">Lvl {xpProfile.currentLevel}</span>
                </div>
                <span className="text-[10px] text-slate-400 font-mono">{xpProfile.currentXp} XP Cumulative</span>
              </div>

              {/* Progress bar */}
              <div className="space-y-1">
                <div className="h-2 w-full bg-zinc-900 rounded-full overflow-hidden border border-zinc-800">
                  <div 
                    className="h-full bg-indigo-500 rounded-full" 
                    style={{ width: `${Math.min(100, (xpProfile.currentXp / xpProfile.xpForNextLevel) * 100)}%` }}
                  />
                </div>
                <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                  <span>Level progress</span>
                  <span>{Math.min(100, Math.round((xpProfile.currentXp / xpProfile.xpForNextLevel) * 100))}% ({xpProfile.xpForNextLevel - xpProfile.currentXp} XP left)</span>
                </div>
              </div>
            </div>

            {/* Milestones timeline */}
            <div className="space-y-3">
              <span className="text-[10px] uppercase font-mono tracking-wider text-slate-500 block">Calibration Milestones Achieved</span>
              <div className="space-y-2 text-xs">
                {xpProfile.milestonesReached.map((milestone, idx) => (
                  <div key={idx} className="flex justify-between p-2 bg-zinc-950 rounded border border-zinc-850 font-mono">
                    <span className="text-slate-300">Milestone reached level {milestone.milestoneId.replace('MILESTONE-LVL', '')}</span>
                    <span className="text-slate-500">{milestone.dateReached}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Achievements Grid */}
          <div className="lg:col-span-8 bg-zinc-900 border border-zinc-850 p-6 rounded-2xl space-y-4">
            <div className="space-y-1 border-b border-zinc-800 pb-3">
              <h3 className="text-sm font-bold font-display uppercase tracking-wider text-indigo-400">Aesthetic Badges & Achievements Registry</h3>
              <p className="text-xs text-slate-400 font-sans">Dynamic system to award achievements. Extensible criteria plugin architecture.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {achievements.map((ach) => (
                <div key={ach.id} className={`p-4 bg-zinc-950 rounded-xl border ${ach.unlockedAt ? 'border-indigo-900 bg-indigo-950/10' : 'border-zinc-850 opacity-60'} flex gap-3.5 text-xs`}>
                  <div className={`h-11 w-11 rounded-lg flex items-center justify-center shrink-0 border ${ach.unlockedAt ? 'bg-indigo-950 border-indigo-800 text-indigo-400' : 'bg-zinc-900 border-zinc-800 text-slate-600'}`}>
                    <Award className="h-5 w-5" />
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between items-start gap-1">
                      <span className="font-bold font-display text-slate-200 block">{ach.name}</span>
                      {ach.unlockedAt ? (
                        <span className="text-[9px] font-mono font-semibold bg-indigo-950 text-indigo-400 px-1.5 py-0.5 rounded uppercase tracking-wider border border-indigo-900">Unlocked</span>
                      ) : (
                        <span className="text-[9px] font-mono text-slate-500 px-1.5 py-0.5 rounded uppercase tracking-wider border border-zinc-800">Locked</span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-400 font-sans leading-normal">{ach.description}</p>
                    <span className="text-[10px] text-slate-500 font-mono block">Required: {ach.criteriaDescription}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'telemetry' && (
        <div className="space-y-6">
          {/* Detailed metrics breakdown */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* KPI grid panel */}
            <div className="lg:col-span-5 bg-zinc-900 border border-zinc-850 p-6 rounded-2xl space-y-6">
              <div className="space-y-1">
                <h3 className="text-sm font-bold font-display uppercase tracking-wider text-indigo-400">Statistical Reward Telemetry</h3>
                <p className="text-xs text-slate-400 font-sans">Active feedback and stability monitoring nodes.</p>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-zinc-950 rounded-xl border border-zinc-850 text-xs">
                  <span className="text-slate-400">Average Payout Reward</span>
                  <span className="font-mono font-bold text-white text-sm">{telemetryKPIs.averageRewardCoins} Coins</span>
                </div>
                
                <div className="flex justify-between items-center p-3 bg-zinc-950 rounded-xl border border-zinc-850 text-xs">
                  <span className="text-slate-400">Highest Reward Record</span>
                  <span className="font-mono font-bold text-indigo-400 text-sm">{telemetryKPIs.highestRewardCoins} Coins</span>
                </div>

                <div className="flex justify-between items-center p-3 bg-zinc-950 rounded-xl border border-zinc-850 text-xs">
                  <span className="text-slate-400">Daily Bonus Usage Frequency</span>
                  <span className="font-mono font-bold text-amber-400 text-sm">{telemetryKPIs.bonusUsageCount} Events Triggered</span>
                </div>

                <div className="flex justify-between items-center p-3 bg-zinc-950 rounded-xl border border-zinc-850 text-xs">
                  <span className="text-slate-400">Gamified Achievement Unlock %</span>
                  <span className="font-mono font-bold text-indigo-400 text-sm">{telemetryKPIs.achievementUnlockPercentage}% unlocked</span>
                </div>

                <div className="flex justify-between items-center p-3 bg-zinc-950 rounded-xl border border-zinc-850 text-xs text-rose-400">
                  <span className="text-slate-400">Telemetry Rejection Rate</span>
                  <span className="font-mono font-bold text-sm">{telemetryKPIs.rejectedRewardRate}% blocked</span>
                </div>
              </div>
            </div>

            {/* Visual Charts layout */}
            <div className="lg:col-span-7 bg-zinc-900 border border-zinc-850 p-6 rounded-2xl space-y-4">
              <div className="space-y-1 border-b border-zinc-800 pb-3">
                <h3 className="text-sm font-bold font-display uppercase tracking-wider text-indigo-400">Ledger Reward Distribution Histogram</h3>
                <p className="text-xs text-slate-400 font-sans">Distribution curve tracking individual transaction points across rules.</p>
              </div>

              <div className="bg-zinc-950 p-4 rounded-xl border border-zinc-850 space-y-4 h-[280px] flex flex-col justify-between">
                <div className="flex-1 flex items-end justify-between gap-2 border-b border-zinc-800 pb-4 h-full">
                  {/* Styled pure CSS histogram bars for WCAG accessibility & compatibility */}
                  {transactions.slice(0, 7).reverse().map((tx, idx) => (
                    <div key={idx} className="flex-1 flex flex-col items-center group">
                      <span className="text-[9px] font-mono text-indigo-400 opacity-0 group-hover:opacity-100 transition duration-200 mb-1">
                        {tx.amount}
                      </span>
                      <div 
                        className="w-full bg-indigo-600 rounded-t hover:bg-indigo-500 transition-all duration-300 cursor-pointer min-h-[4px]"
                        style={{ height: `${Math.max(5, Math.min(100, (Math.abs(tx.amount) / 100) * 100))}px` }}
                      />
                      <span className="text-[8px] font-mono text-slate-500 mt-2 block tracking-tight truncate max-w-full">
                        {tx.id.replace('TX-COIN-', '').replace('TX-REWARD-', '')}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="flex justify-between text-[10px] text-slate-400 font-mono pt-1">
                  <span>← Historic Sequence Logs</span>
                  <span>Sequential Ledger Nodes (Newest) →</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'workspace' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left panel: exporters */}
          <div className="lg:col-span-6 bg-zinc-900 border border-zinc-850 p-6 rounded-2xl space-y-4">
            <div className="space-y-1">
              <h3 className="text-sm font-bold font-display uppercase tracking-wider text-indigo-400">Google Workspace Integrations</h3>
              <p className="text-xs text-slate-400 font-sans font-light">Prepare export reports and trigger background folder syncing schemas with Google Drive and Sheets.</p>
            </div>

            <div className="bg-zinc-950 p-4 rounded-xl border border-zinc-850 space-y-4 text-xs">
              <div className="flex items-center gap-2">
                <FileSpreadsheet className="h-5 w-5 text-indigo-500" />
                <span className="font-bold">Google Sheets & Drive Sync Engine</span>
              </div>
              <p className="text-slate-400 font-sans leading-relaxed">
                Compiles the latest audit trails, coin ledger summaries, XP profiles, and unlocks into structured workspace spreadsheets.
              </p>

              <button
                onClick={handleExportToWorkspace}
                disabled={isExporting}
                className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 font-bold rounded-lg text-white text-xs cursor-pointer flex items-center justify-center gap-1.5 disabled:opacity-50"
              >
                {isExporting ? (
                  <>
                    <RefreshCw className="h-4 w-4 animate-spin" />
                    <span>Syncing spreadsheets...</span>
                  </>
                ) : (
                  <>
                    <ExternalLink className="h-4 w-4" />
                    <span>Generate Workspace Export Draft</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Right panel: schema display */}
          <div className="lg:col-span-6 bg-zinc-900 border border-zinc-850 p-6 rounded-2xl space-y-4">
            <div className="space-y-1">
              <h3 className="text-sm font-bold font-display uppercase tracking-wider text-emerald-400">Metadata Export Payload Schema</h3>
              <p className="text-xs text-slate-400 font-sans font-light">Export blueprint schemas mapped directly to workspace accounts.</p>
            </div>

            <div className="bg-zinc-950 p-4 rounded-xl border border-zinc-850 h-[240px] overflow-y-auto font-mono text-[10px] space-y-3 text-slate-300">
              {sheetExportSummary ? (
                <>
                  <div className="space-y-1">
                    <span className="text-indigo-400 block">// GOOGLE SHEETS SCHEMATIC</span>
                    <p><span className="text-slate-500">SpreadsheetID:</span> <span className="text-white select-all">"{sheetExportSummary.spreadsheetId}"</span></p>
                    <p><span className="text-slate-500">RecordCount:</span> <span className="text-white">{sheetExportSummary.recordCount} records</span></p>
                    <p><span className="text-slate-500">DigestChecksum:</span> <span className="text-slate-400">{sheetExportSummary.checksum}</span></p>
                  </div>

                  <div className="space-y-1 border-t border-zinc-850 pt-2">
                    <span className="text-emerald-400 block">// GOOGLE DRIVE SCHEMATIC</span>
                    <p><span className="text-slate-500">ArchivedFileID:</span> <span className="text-white select-all">"{driveExportSummary.fileId}"</span></p>
                    <p><span className="text-slate-500">FileName:</span> <span className="text-white">{driveExportSummary.fileName}</span></p>
                    <p><span className="text-slate-500">DirectoryPath:</span> <span className="text-indigo-400">"{driveExportSummary.parentDirectory}"</span></p>
                  </div>
                </>
              ) : (
                <div className="h-full flex items-center justify-center text-slate-500 text-center">
                  <p>No active workspace sync generated.<br/>Trigger export draft above to see metadata schemas.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Main consolidated balance card at bottom */}
      <div className="bg-gradient-to-r from-indigo-950/40 to-slate-900/60 border border-indigo-900/30 p-6 rounded-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-1.5 text-left">
          <span className="text-[10px] uppercase font-mono tracking-widest text-slate-400 block">Simulated UPI holding disburser</span>
          <h2 className="text-xl font-bold font-display text-white">Consolidated Payout Center</h2>
          <p className="text-xs text-slate-400 font-sans max-w-xl">
            Convert accumulated rewards to Indian Rupee (INR) instantly using standard conversion models. Minimum disbursal hold value threshold is 100 coins.
          </p>
        </div>

        <div className="flex flex-col xs:flex-row items-stretch md:items-center gap-4 bg-zinc-950 p-4 rounded-xl border border-zinc-850 shrink-0">
          <div className="space-y-0.5 pr-4 text-left border-b xs:border-b-0 xs:border-r border-zinc-850 pb-2 xs:pb-0">
            <span className="text-[9px] font-mono text-slate-500 block">CONVERTIBLE HOLDINGS</span>
            <span className="text-xl font-mono font-bold text-indigo-400 block">
              {telemetryKPIs.totalRewardsDistributed - 100 > 0 ? telemetryKPIs.totalRewardsDistributed - 100 : 0} Coins
            </span>
            <span className="text-[10px] text-slate-400 block">
              ≈ {formatCurrencyValue(telemetryKPIs.totalRewardsDistributed - 100 > 0 ? telemetryKPIs.totalRewardsDistributed - 100 : 0, 'IN')}
            </span>
          </div>

          <div className="space-y-2 shrink-0">
            <button
              onClick={handlePayoutHoldings}
              disabled={payoutLoading || (telemetryKPIs.totalRewardsDistributed - 100 < 100)}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-xs font-semibold rounded-lg text-white shadow hover:shadow-indigo-600/10 transition cursor-pointer disabled:opacity-50"
            >
              {payoutLoading ? 'Contacting UPI node...' : 'Disburse Coins'}
            </button>
            <span className="text-[9px] font-mono text-slate-500 block">Clearance via UPI instantly</span>
          </div>
        </div>
      </div>

      {payoutMessage && (
        <div className="p-4 bg-emerald-950/20 border border-emerald-900 text-emerald-400 text-xs font-medium rounded-xl flex items-center gap-3">
          <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0" />
          <span>{payoutMessage}</span>
        </div>
      )}
    </div>
  );
}
