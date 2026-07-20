/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Plus, Check, ArrowRight, ArrowLeft, Coins, Users, Shield, Target, 
  Database, AlertCircle, FileText, Globe, Sparkles, AlertOctagon, HelpCircle 
} from 'lucide-react';
import { useBusiness } from '../context/BusinessContext';
import { CampaignStatus } from '../types';

interface CampaignWizardProps {
  onClose: () => void;
}

export const CampaignWizard: React.FC<CampaignWizardProps> = ({ onClose }) => {
  const { createCampaign, datasets } = useBusiness();
  const [step, setStep] = useState(1);
  const [errors, setErrors] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form states matching target entities
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    companyName: 'TaskNova Enterprise',
    projectName: '',
    internalNotes: '',
    tags: [] as string[],
    newTag: '',
    taskType: 'RLHF',
    budget: {
      coins: 1000000,
      maxSpend: 10000,
      expectedCompletion: '72 hours',
      expectedContributors: 500,
      rewardRuleMultiplier: 1.0,
      priority: 'medium' as 'low' | 'medium' | 'high' | 'critical'
    },
    targetAudience: {
      countries: ['United States', 'India'],
      languages: ['English'],
      devices: ['Desktop'],
      experienceLevel: 'all' as 'all' | 'intermediate' | 'expert',
      trustScoreMin: 85,
      accuracyMin: 85,
      role: ['All Users'],
      contributorTier: 'bronze' as 'bronze' | 'silver' | 'gold' | 'platinum'
    },
    datasetId: '',
    qualityRules: {
      requiredAccuracy: 92,
      minimumTimePerTask: 20,
      spamProtection: true,
      manualReviewPercent: 10,
      aiReviewPercent: 90,
      consensusThreshold: 3,
      duplicateDetection: true
    }
  });

  const taskTypes = [
    { id: 'RLHF', label: 'RLHF Tuning', desc: 'Direct human feedback loops for alignment.' },
    { id: 'Image', label: 'Image Segments', desc: 'Computer vision bounding boxes and tagging.' },
    { id: 'Translation', label: 'Translation Validation', desc: 'Language fluency & regional bias audits.' },
    { id: 'OCR', label: 'OCR Extraction', desc: 'Scribbled and historic text transcriptions.' },
    { id: 'Speech', label: 'Speech Calibration', desc: 'Phonetic text matching and accent scores.' },
    { id: 'Safety', label: 'Red-Teaming Safety', desc: 'Model jailbreak, toxic prompt mitigation.' },
    { id: 'Pairwise Comparison', label: 'Pairwise Preference', desc: 'Choosing between competing outputs A vs B.' },
    { id: 'Annotation', label: 'Direct Text Annotation', desc: 'Semantic categorisation and entity mapping.' },
  ];

  const handleNext = () => {
    // Basic structural validation for early steps
    if (step === 1) {
      if (!formData.name.trim() || !formData.projectName.trim()) {
        setErrors(['Campaign Name and Project Name are required to proceed.']);
        return;
      }
    }
    if (step === 5) {
      if (!formData.datasetId) {
        setErrors(['Please select or attach a validated source dataset to proceed.']);
        return;
      }
    }
    setErrors([]);
    setStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setErrors([]);
    setStep((prev) => prev - 1);
  };

  const handleAddTag = () => {
    if (formData.newTag.trim() && !formData.tags.includes(formData.newTag.trim())) {
      setFormData({
        ...formData,
        tags: [...formData.tags, formData.newTag.trim()],
        newTag: ''
      });
    }
  };

  const handleRemoveTag = (indexToRemove: number) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter((_, idx) => idx !== indexToRemove)
    });
  };

  const handleSubmit = async (publish: boolean) => {
    setIsSubmitting(true);
    setErrors([]);
    
    const submissionData = {
      ...formData,
      status: publish ? CampaignStatus.PUBLISHED : CampaignStatus.DRAFT
    };

    const res = await createCampaign(submissionData);
    setIsSubmitting(false);

    if (res.success) {
      onClose();
    } else {
      setErrors(res.errors || ['Validation failed. Please review your entries.']);
    }
  };

  return (
    <div className="bg-slate-100 dark:bg-[#09090b] border border-slate-200 dark:border-white/5 rounded-2xl overflow-hidden p-6 shadow-2xl space-y-6">
      {/* Stepper Header */}
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-white/5 pb-4">
        <div>
          <h2 className="text-xl font-bold font-display text-slate-900 dark:text-white flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-indigo-500 animate-pulse" />
            Enterprise Campaign Architect
          </h2>
          <p className="text-xs text-slate-400 mt-1">Configure precision crowdsourced human training pipelines.</p>
        </div>
        <button 
          onClick={onClose}
          className="text-xs text-slate-400 hover:text-white cursor-pointer px-3 py-1 rounded bg-white/5 border border-white/5 hover:bg-white/10"
        >
          Cancel
        </button>
      </div>

      {/* Steps Visual Indicator */}
      <div className="flex items-center justify-between max-w-2xl mx-auto px-4 overflow-x-auto py-2">
        {[1, 2, 3, 4, 5, 6, 7].map((s) => (
          <div key={s} className="flex items-center gap-2">
            <div 
              className={`h-7 w-7 rounded-full flex items-center justify-center font-mono text-xs border transition-all duration-300 ${
                step === s 
                  ? 'bg-indigo-600 border-indigo-500 text-white shadow-[0_0_12px_rgba(99,102,241,0.4)]'
                  : step > s 
                    ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-500'
                    : 'bg-white/5 border-white/5 text-slate-500'
              }`}
            >
              {step > s ? <Check className="h-3.5 w-3.5" /> : s}
            </div>
            {s < 7 && <div className={`h-0.5 w-4 md:w-8 ${step > s ? 'bg-emerald-500/20' : 'bg-white/5'}`} />}
          </div>
        ))}
      </div>

      {errors.length > 0 && (
        <div className="bg-rose-500/10 border border-rose-500/20 p-3 rounded-lg flex items-start gap-2 text-rose-400 text-xs">
          <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
          <div className="space-y-1">
            <p className="font-semibold">Configuration Errors Found:</p>
            <ul className="list-disc pl-4 space-y-0.5">
              {errors.map((err, idx) => <li key={idx}>{err}</li>)}
            </ul>
          </div>
        </div>
      )}

      {/* Wizard Content Body */}
      <div className="min-h-[380px] bg-white/1 dark:bg-[#030303]/40 border border-slate-200 dark:border-white/5 rounded-xl p-5 md:p-6">
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              <div className="flex items-center gap-2 border-b border-white/5 pb-2">
                <FileText className="h-4 w-4 text-indigo-400" />
                <h3 className="text-sm font-semibold text-slate-900 dark:text-white uppercase font-mono">Step 1: Core Metadata & Industry Templates</h3>
              </div>

              {/* Campaign Templates Selector */}
              <div className="space-y-2">
                <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500">Industry Reusable Blueprints</span>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5">
                  {[
                    { id: 'rlhf', label: 'RLHF Preference', icon: '🎯', desc: 'Pairwise preferences' },
                    { id: 'translation', label: 'Translation Audit', icon: '🌐', desc: 'Multilingual verify' },
                    { id: 'ocr', label: 'OCR Extraction', icon: '📝', desc: 'Scan verification' },
                    { id: 'safety', label: 'Red-Team Safety', icon: '🛡️', desc: 'Adversarial hacks' }
                  ].map((temp) => (
                    <button
                      key={temp.id}
                      type="button"
                      onClick={() => {
                        if (temp.id === 'rlhf') {
                          setFormData({
                            ...formData,
                            name: 'GPT-5 Reasoning Alignment & Safety RLHF',
                            projectName: 'GPT-5-Safety-v2',
                            description: 'High-consensus Reinforcement Learning from Human Feedback pairwise evaluation to steer reasoning density.',
                            taskType: 'RLHF',
                            budget: { ...formData.budget, coins: 1500000, maxSpend: 15000, expectedContributors: 800 },
                            targetAudience: { ...formData.targetAudience, contributorTier: 'gold', experienceLevel: 'expert', trustScoreMin: 95, accuracyMin: 95 },
                            qualityRules: { ...formData.qualityRules, requiredAccuracy: 95, consensusThreshold: 3 }
                          });
                        } else if (temp.id === 'translation') {
                          setFormData({
                            ...formData,
                            name: 'Multilingual Translation Quality Audit',
                            projectName: 'Global-L10N-Verify',
                            description: 'High-fidelity target-translation preference evaluations for neural translation engine outputs.',
                            taskType: 'Translation',
                            budget: { ...formData.budget, coins: 800000, maxSpend: 8000, expectedContributors: 400 },
                            targetAudience: { ...formData.targetAudience, contributorTier: 'silver', experienceLevel: 'intermediate', trustScoreMin: 88, accuracyMin: 88 },
                            qualityRules: { ...formData.qualityRules, requiredAccuracy: 90, consensusThreshold: 2 }
                          });
                        } else if (temp.id === 'ocr') {
                          setFormData({
                            ...formData,
                            name: 'Historical Scan OCR Transcription Verification',
                            projectName: 'OCR-Digits-v1',
                            description: 'Verify and format scribbled numerical strings from financial archives.',
                            taskType: 'OCR',
                            budget: { ...formData.budget, coins: 400000, maxSpend: 4000, expectedContributors: 250 },
                            targetAudience: { ...formData.targetAudience, contributorTier: 'bronze', experienceLevel: 'all', trustScoreMin: 80, accuracyMin: 80 },
                            qualityRules: { ...formData.qualityRules, requiredAccuracy: 85, consensusThreshold: 3 }
                          });
                        } else if (temp.id === 'safety') {
                          setFormData({
                            ...formData,
                            name: 'Model Red-Teaming Jailbreak Evaluation',
                            projectName: 'RedTeam-Guard-4',
                            description: 'Attempt to inject, bypass, or jailbreak LLM prompt buffers to map adversarial risks.',
                            taskType: 'Safety',
                            budget: { ...formData.budget, coins: 3000000, maxSpend: 30000, expectedContributors: 1200 },
                            targetAudience: { ...formData.targetAudience, contributorTier: 'platinum', experienceLevel: 'expert', trustScoreMin: 98, accuracyMin: 98 },
                            qualityRules: { ...formData.qualityRules, requiredAccuracy: 98, consensusThreshold: 5 }
                          });
                        }
                      }}
                      className="p-2.5 rounded-xl border border-slate-200 dark:border-white/5 bg-white/5 hover:bg-indigo-500/10 hover:border-indigo-500/40 text-left transition-all cursor-pointer group"
                    >
                      <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900 dark:text-white font-display">
                        <span>{temp.icon}</span>
                        <span>{temp.label}</span>
                      </div>
                      <p className="text-[9px] text-slate-400 mt-0.5 group-hover:text-indigo-300">{temp.desc}</p>
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-slate-400">Campaign Name*</label>
                  <input 
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. GPT-5 Safety Jailbreak Guard"
                    className="w-full bg-white/5 border border-slate-200 dark:border-white/5 rounded-lg px-3 py-2 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500 transition-colors"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-slate-400">Project / Release Target*</label>
                  <input 
                    type="text"
                    value={formData.projectName}
                    onChange={(e) => setFormData({ ...formData, projectName: e.target.value })}
                    placeholder="e.g. GPT-5-Safety-v2"
                    className="w-full bg-white/5 border border-slate-200 dark:border-white/5 rounded-lg px-3 py-2 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500 transition-colors"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-400">Campaign Objective / Mission Description</label>
                <textarea 
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Describe what accuracy contributors need to achieve, context of the files, and expected outputs..."
                  className="w-full bg-white/5 border border-slate-200 dark:border-white/5 rounded-lg p-3 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500 transition-colors"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-slate-400">Internal Compliance Notes (Confidential)</label>
                  <input 
                    type="text"
                    value={formData.internalNotes}
                    onChange={(e) => setFormData({ ...formData, internalNotes: e.target.value })}
                    placeholder="For audit logs only..."
                    className="w-full bg-white/5 border border-slate-200 dark:border-white/5 rounded-lg px-3 py-2 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500 transition-colors"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-slate-400">Search Tags</label>
                  <div className="flex gap-2">
                    <input 
                      type="text"
                      value={formData.newTag}
                      onChange={(e) => setFormData({ ...formData, newTag: e.target.value })}
                      onKeyDown={(e) => e.key === 'Enter' && handleAddTag()}
                      placeholder="Press Enter to append"
                      className="flex-1 bg-white/5 border border-slate-200 dark:border-white/5 rounded-lg px-3 py-1.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500 transition-colors"
                    />
                    <button 
                      type="button"
                      onClick={handleAddTag}
                      className="bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg px-3 cursor-pointer"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-1 mt-1.5">
                    {formData.tags.map((t, idx) => (
                      <span key={idx} className="bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[10px] font-mono px-2 py-0.5 rounded-full flex items-center gap-1">
                        {t}
                        <button type="button" onClick={() => handleRemoveTag(idx)} className="text-rose-400 font-bold hover:text-white">×</button>
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              <div className="flex items-center gap-2 border-b border-white/5 pb-2">
                <Target className="h-4 w-4 text-indigo-400" />
                <h3 className="text-sm font-semibold text-slate-900 dark:text-white uppercase font-mono">Step 2: Core Task Plugin Choice</h3>
              </div>
              <p className="text-xs text-slate-400">Choose the optimal Human-In-The-Loop evaluation plugin to power the campaign interface.</p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 max-h-[280px] overflow-y-auto pr-1">
                {taskTypes.map((t) => {
                  const isSelected = formData.taskType === t.id;
                  return (
                    <div 
                      key={t.id}
                      onClick={() => setFormData({ ...formData, taskType: t.id })}
                      className={`p-3.5 rounded-xl border text-left cursor-pointer transition-all ${
                        isSelected 
                          ? 'bg-indigo-500/10 border-indigo-500 shadow-[0_0_12px_rgba(99,102,241,0.15)] text-white' 
                          : 'bg-white/5 border-slate-200 dark:border-white/5 hover:border-white/10 text-slate-300'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold font-display">{t.label}</span>
                        {isSelected && <div className="h-4 w-4 rounded-full bg-indigo-500 flex items-center justify-center text-white"><Check className="h-2.5 w-2.5" /></div>}
                      </div>
                      <p className="text-[10px] text-slate-500 mt-1.5 leading-relaxed">{t.desc}</p>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}

          {step === 3 && (() => {
            const baseCoins = formData.budget.coins || 1000000;
            const platformFee = Math.round(baseCoins * 0.085);
            const bufferBudget = Math.round(baseCoins * 0.05);
            const refundReserve = Math.round(baseCoins * 0.10);
            const volumeDiscountRate = baseCoins > 2000000 ? 0.125 : baseCoins > 1000000 ? 0.10 : baseCoins > 500000 ? 0.05 : 0;
            const volumeDiscount = Math.round(baseCoins * volumeDiscountRate);
            const taxableAmount = platformFee + bufferBudget;
            const taxes = Math.round(taxableAmount * 0.18);
            const finalInvoiceTotal = baseCoins + platformFee + bufferBudget + refundReserve + taxes - volumeDiscount;
            const usdValue = (finalInvoiceTotal / 100).toFixed(2);
            const costPerTask = (finalInvoiceTotal / (formData.budget.expectedContributors || 100)).toFixed(1);

            // AI Projections based on TaskType
            const isHard = formData.taskType === 'Safety' || formData.taskType === 'RLHF';
            const aiConsensus = formData.taskType === 'Safety' ? 5 : formData.taskType === 'RLHF' ? 3 : 2;
            const aiAccuracy = formData.taskType === 'Safety' ? 98 : formData.taskType === 'RLHF' ? 95 : 88;
            const aiRisk = formData.taskType === 'Safety' ? 45 : formData.taskType === 'RLHF' ? 22 : 8;
            const aiConfidence = formData.taskType === 'Safety' ? 99 : formData.taskType === 'RLHF' ? 92 : 86;
            const aiFraud = formData.taskType === 'Safety' ? '0.2%' : formData.taskType === 'RLHF' ? '0.9%' : '1.8%';
            const difficulty = formData.taskType === 'Safety' ? 'Hard' : formData.taskType === 'RLHF' ? 'Medium' : 'Easy';

            return (
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                <div className="flex items-center gap-2 border-b border-white/5 pb-2">
                  <Coins className="h-4 w-4 text-indigo-400" />
                  <h3 className="text-sm font-semibold text-slate-900 dark:text-white uppercase font-mono">Step 3: Budget and Payout Multipliers</h3>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                  {/* Left Column: Form Controls */}
                  <div className="lg:col-span-6 space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-xs font-medium text-slate-400">Disbursement Cap (Coins)*</label>
                        <div className="relative">
                          <input 
                            type="number"
                            value={formData.budget.coins}
                            onChange={(e) => setFormData({
                              ...formData,
                              budget: { ...formData.budget, coins: Number(e.target.value), maxSpend: Number(e.target.value) / 100 }
                            })}
                            className="w-full bg-white/5 border border-slate-200 dark:border-white/5 rounded-lg pl-9 pr-3 py-2 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
                          />
                          <Coins className="absolute left-3 top-2.5 h-4 w-4 text-amber-500" />
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-medium text-slate-400">Equivalent Dollar Budget ($USD)</label>
                        <div className="relative">
                          <input 
                            type="number"
                            disabled
                            value={formData.budget.maxSpend}
                            className="w-full bg-white/10 border border-slate-200 dark:border-white/5 rounded-lg pl-8 pr-3 py-2 text-sm text-slate-500 dark:text-slate-400"
                          />
                          <span className="absolute left-3 top-2 text-sm text-slate-500 font-mono">$</span>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-xs font-medium text-slate-400">Campaign Priority Queue</label>
                        <select 
                          value={formData.budget.priority}
                          onChange={(e) => setFormData({
                            ...formData,
                            budget: { ...formData.budget, priority: e.target.value as any }
                          })}
                          className="w-full bg-slate-100 dark:bg-[#131316] border border-slate-200 dark:border-white/5 rounded-lg px-3 py-2 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
                        >
                          <option value="low">Low Priority (1.0x Core Fee)</option>
                          <option value="medium">Standard Priority (1.2x Fee)</option>
                          <option value="high">High Velocity (1.5x Fee)</option>
                          <option value="critical">Critical Real-time (2.0x Fee)</option>
                        </select>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-medium text-slate-400">Target Contributors Count</label>
                        <input 
                          type="number"
                          value={formData.budget.expectedContributors}
                          onChange={(e) => setFormData({
                            ...formData,
                            budget: { ...formData.budget, expectedContributors: Number(e.target.value) }
                          })}
                          className="w-full bg-white/5 border border-slate-200 dark:border-white/5 rounded-lg px-3 py-2 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-xs font-medium text-slate-400">Expected Execution Window</label>
                        <input 
                          type="text"
                          value={formData.budget.expectedCompletion}
                          onChange={(e) => setFormData({
                            ...formData,
                            budget: { ...formData.budget, expectedCompletion: e.target.value }
                          })}
                          className="w-full bg-white/5 border border-slate-200 dark:border-white/5 rounded-lg px-3 py-2 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-medium text-slate-400">Multiplier (Reward Boost)</label>
                        <input 
                          type="number"
                          step="0.1"
                          min="1"
                          max="5"
                          value={formData.budget.rewardRuleMultiplier}
                          onChange={(e) => setFormData({
                            ...formData,
                            budget: { ...formData.budget, rewardRuleMultiplier: Number(e.target.value) }
                          })}
                          className="w-full bg-white/5 border border-slate-200 dark:border-white/5 rounded-lg px-3 py-2 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Cost Estimator Card & AI Recommendations */}
                  <div className="lg:col-span-6 space-y-4">
                    {/* Cost Estimator Card */}
                    <div className="bg-slate-100 dark:bg-[#131316] border border-slate-200 dark:border-white/5 rounded-2xl p-4 space-y-2.5">
                      <div className="flex items-center justify-between border-b border-white/5 pb-2">
                        <span className="text-xs font-bold font-display text-slate-900 dark:text-white flex items-center gap-1.5">
                          <Coins className="h-3.5 w-3.5 text-indigo-400" /> Real-time Cost Estimation Ledger
                        </span>
                        {volumeDiscount > 0 && (
                          <span className="text-[9px] bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-mono px-1.5 py-0.2 rounded font-bold uppercase animate-pulse">
                            -{Math.round(volumeDiscountRate * 100)}% Volume Discount
                          </span>
                        )}
                      </div>

                      <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-[11px] font-mono">
                        <span className="text-slate-400">Core Reward Budget:</span>
                        <span className="text-right text-slate-900 dark:text-white">{baseCoins.toLocaleString()} coins</span>

                        <span className="text-slate-400">Platform Fee (8.5%):</span>
                        <span className="text-right text-slate-900 dark:text-white">+{platformFee.toLocaleString()} coins</span>

                        <span className="text-slate-400">Buffer Budget (5.0%):</span>
                        <span className="text-right text-slate-900 dark:text-white">+{bufferBudget.toLocaleString()} coins</span>

                        <span className="text-slate-400">Refund Reserve (10.0%):</span>
                        <span className="text-right text-slate-900 dark:text-white">+{refundReserve.toLocaleString()} coins</span>

                        <span className="text-slate-400">GST Professional Services (18.0%):</span>
                        <span className="text-right text-slate-900 dark:text-white">+{taxes.toLocaleString()} coins</span>

                        {volumeDiscount > 0 && (
                          <>
                            <span className="text-emerald-400">Corporate Volume Discount:</span>
                            <span className="text-right text-emerald-400">-{volumeDiscount.toLocaleString()} coins</span>
                          </>
                        )}

                        <div className="col-span-2 border-t border-slate-200 dark:border-white/5 pt-2 flex justify-between items-center text-xs font-bold font-display mt-1">
                          <span className="text-slate-900 dark:text-white font-bold">Estimated Invoice Total:</span>
                          <div className="text-right">
                            <p className="text-indigo-400 font-mono">{finalInvoiceTotal.toLocaleString()} coins</p>
                            <p className="text-[10px] text-slate-400 font-mono">~${usdValue} USD</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* AI Recommendations Engine */}
                    <div className="bg-indigo-500/5 border border-indigo-500/10 rounded-2xl p-4 space-y-2">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900 dark:text-white">
                        <Sparkles className="h-3.5 w-3.5 text-indigo-400 animate-pulse" /> TaskNova AI Recommendations Engine
                      </div>
                      <p className="text-[10px] text-slate-400 leading-relaxed">
                        Analyzing baseline intelligence benchmarks for <strong className="text-indigo-300 font-mono">{formData.taskType}</strong> alignment.
                      </p>

                      <div className="grid grid-cols-3 gap-2 pt-1">
                        <div className="p-1.5 bg-white/5 rounded border border-white/5 text-center">
                          <p className="text-[8px] text-slate-400 uppercase font-mono">Consensus Overlap</p>
                          <p className="text-xs font-bold text-slate-900 dark:text-white font-mono">{aiConsensus}x redundant</p>
                        </div>
                        <div className="p-1.5 bg-white/5 rounded border border-white/5 text-center">
                          <p className="text-[8px] text-slate-400 uppercase font-mono">Difficulty Class</p>
                          <p className="text-xs font-bold text-indigo-400 font-mono">{difficulty}</p>
                        </div>
                        <div className="p-1.5 bg-white/5 rounded border border-white/5 text-center">
                          <p className="text-[8px] text-slate-400 uppercase font-mono">Target Accuracy</p>
                          <p className="text-xs font-bold text-emerald-400 font-mono">{aiAccuracy}% minimum</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-[10px] font-mono pt-1">
                        <div className="flex justify-between border-b border-white/5 pb-1">
                          <span className="text-slate-400">Expected Fraud:</span>
                          <span className="text-indigo-300 font-bold">{aiFraud}</span>
                        </div>
                        <div className="flex justify-between border-b border-white/5 pb-1">
                          <span className="text-slate-400">Risk Score:</span>
                          <span className="text-rose-400 font-bold">{aiRisk}%</span>
                        </div>
                        <div className="flex justify-between border-b border-white/5 pb-1">
                          <span className="text-slate-400">Confidence:</span>
                          <span className="text-emerald-400 font-bold">{aiConfidence}%</span>
                        </div>
                        <div className="flex justify-between border-b border-white/5 pb-1">
                          <span className="text-slate-400">Avg Cost/Task:</span>
                          <span className="text-amber-400 font-bold">{costPerTask} coins</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })()}

          {step === 4 && (
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              <div className="flex items-center gap-2 border-b border-white/5 pb-2">
                <Users className="h-4 w-4 text-indigo-400" />
                <h3 className="text-sm font-semibold text-slate-900 dark:text-white uppercase font-mono">Step 4: Target Demographic Audience</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-slate-400">Select Required Contributor Tier</label>
                  <select 
                    value={formData.targetAudience.contributorTier}
                    onChange={(e) => setFormData({
                      ...formData,
                      targetAudience: { ...formData.targetAudience, contributorTier: e.target.value as any }
                    })}
                    className="w-full bg-slate-100 dark:bg-[#131316] border border-slate-200 dark:border-white/5 rounded-lg px-3 py-2 text-sm text-slate-900 dark:text-white focus:outline-none"
                  >
                    <option value="bronze">Bronze (Broad community, standard validation)</option>
                    <option value="silver">Silver (Intermediate, higher baseline accuracy)</option>
                    <option value="gold">Gold (Proven experts, perfect alignment history)</option>
                    <option value="platinum">Platinum (Enterprise level validators / certified PhDs)</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-slate-400">Experience Profile Required</label>
                  <select 
                    value={formData.targetAudience.experienceLevel}
                    onChange={(e) => setFormData({
                      ...formData,
                      targetAudience: { ...formData.targetAudience, experienceLevel: e.target.value as any }
                    })}
                    className="w-full bg-slate-100 dark:bg-[#131316] border border-slate-200 dark:border-white/5 rounded-lg px-3 py-2 text-sm text-slate-900 dark:text-white focus:outline-none"
                  >
                    <option value="all">Unrestricted (Fastest acquisition)</option>
                    <option value="intermediate">Intermediate (Over 500 completed tasks)</option>
                    <option value="expert">Elite Expert (Over 2,000 tasks, 98% validity)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-slate-400">Minimum Trust Score Threshold (%)</label>
                  <input 
                    type="range"
                    min="50"
                    max="99"
                    value={formData.targetAudience.trustScoreMin}
                    onChange={(e) => setFormData({
                      ...formData,
                      targetAudience: { ...formData.targetAudience, trustScoreMin: Number(e.target.value) }
                    })}
                    className="w-full accent-indigo-500 h-1.5 rounded-lg bg-white/5"
                  />
                  <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                    <span>50% Threshold</span>
                    <span className="text-indigo-400 font-bold">{formData.targetAudience.trustScoreMin}% Trust Minimum</span>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-slate-400">Minimum Accuracy Threshold (%)</label>
                  <input 
                    type="range"
                    min="50"
                    max="99"
                    value={formData.targetAudience.accuracyMin}
                    onChange={(e) => setFormData({
                      ...formData,
                      targetAudience: { ...formData.targetAudience, accuracyMin: Number(e.target.value) }
                    })}
                    className="w-full accent-indigo-500 h-1.5 rounded-lg bg-white/5"
                  />
                  <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                    <span>50% Threshold</span>
                    <span className="text-indigo-400 font-bold">{formData.targetAudience.accuracyMin}% Accuracy Minimum</span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {step === 5 && (
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              <div className="flex items-center gap-2 border-b border-white/5 pb-2">
                <Database className="h-4 w-4 text-indigo-400" />
                <h3 className="text-sm font-semibold text-slate-900 dark:text-white uppercase font-mono">Step 5: Dataset Allocation</h3>
              </div>
              <p className="text-xs text-slate-400">Mount a validated JSON, CSV, or ZIP prompt library to feed the active task queues.</p>
              
              <div className="space-y-3">
                <label className="text-xs font-medium text-slate-400">Select Validated Dataset</label>
                <div className="grid grid-cols-1 gap-2 max-h-[160px] overflow-y-auto">
                  {datasets.length === 0 ? (
                    <div className="p-4 rounded-xl bg-white/5 text-center text-xs text-slate-500">
                      No datasets detected. Upload a dataset in the Dataset tab first or run Seed generator.
                    </div>
                  ) : (
                    datasets.map((ds) => {
                      const isSelected = formData.datasetId === ds.id;
                      return (
                        <div 
                          key={ds.id}
                          onClick={() => setFormData({ ...formData, datasetId: ds.id })}
                          className={`p-3 rounded-lg border text-left cursor-pointer flex items-center justify-between transition-all ${
                            isSelected 
                              ? 'bg-indigo-500/10 border-indigo-500 text-white' 
                              : 'bg-white/5 border-slate-200 dark:border-white/5 hover:bg-white/10 text-slate-300'
                          }`}
                        >
                          <div>
                            <p className="text-xs font-bold font-mono">{ds.name}</p>
                            <div className="flex items-center gap-2 text-[10px] text-slate-500 mt-1">
                              <span>Rows: {ds.rowCount.toLocaleString()}</span>
                              <span>•</span>
                              <span>Size: {ds.size}</span>
                              <span>•</span>
                              <span className={`px-1.5 py-0.2 rounded text-[8px] uppercase ${ds.status === 'valid' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'}`}>
                                {ds.status}
                              </span>
                            </div>
                          </div>
                          {isSelected && <div className="h-4 w-4 rounded-full bg-indigo-500 flex items-center justify-center text-white"><Check className="h-2.5 w-2.5" /></div>}
                        </div>
                      );
                    })
                  )}
                </div>
                
                {formData.datasetId && (
                  <div className="p-3 bg-indigo-500/5 rounded-lg border border-indigo-500/10 text-[11px] text-slate-400 flex items-center gap-2">
                    <AlertCircle className="h-3.5 w-3.5 text-indigo-400" />
                    <span>Selected dataset schema detected: <strong>{datasets.find(d => d.id === formData.datasetId)?.detectedSchema.join(', ')}</strong></span>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {step === 6 && (
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              <div className="flex items-center gap-2 border-b border-white/5 pb-2">
                <Shield className="h-4 w-4 text-indigo-400" />
                <h3 className="text-sm font-semibold text-slate-900 dark:text-white uppercase font-mono">Step 6: Quality Control Rules</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-slate-400">Required Ground-Truth Accuracy (%)</label>
                  <input 
                    type="number"
                    value={formData.qualityRules.requiredAccuracy}
                    onChange={(e) => setFormData({
                      ...formData,
                      qualityRules: { ...formData.qualityRules, requiredAccuracy: Number(e.target.value) }
                    })}
                    className="w-full bg-white/5 border border-slate-200 dark:border-white/5 rounded-lg px-3 py-2 text-sm text-slate-900 dark:text-white"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-slate-400">Consensus Overlap (N-redundant voters)</label>
                  <input 
                    type="number"
                    value={formData.qualityRules.consensusThreshold}
                    onChange={(e) => setFormData({
                      ...formData,
                      qualityRules: { ...formData.qualityRules, consensusThreshold: Number(e.target.value) }
                    })}
                    className="w-full bg-white/5 border border-slate-200 dark:border-white/5 rounded-lg px-3 py-2 text-sm text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-slate-400">Minimum Duration per Task (seconds)</label>
                  <input 
                    type="number"
                    value={formData.qualityRules.minimumTimePerTask}
                    onChange={(e) => setFormData({
                      ...formData,
                      qualityRules: { ...formData.qualityRules, minimumTimePerTask: Number(e.target.value) }
                    })}
                    className="w-full bg-white/5 border border-slate-200 dark:border-white/5 rounded-lg px-3 py-2 text-sm text-slate-900 dark:text-white"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-slate-400">Review Split (Manual vs AI)</label>
                  <div className="flex items-center gap-3 pt-2">
                    <span className="text-xs text-slate-500">AI: {formData.qualityRules.aiReviewPercent}%</span>
                    <input 
                      type="range"
                      min="0"
                      max="100"
                      value={formData.qualityRules.aiReviewPercent}
                      onChange={(e) => setFormData({
                        ...formData,
                        qualityRules: { 
                          ...formData.qualityRules, 
                          aiReviewPercent: Number(e.target.value),
                          manualReviewPercent: 100 - Number(e.target.value)
                        }
                      })}
                      className="flex-1 accent-indigo-500 h-1.5 bg-white/5 rounded-lg"
                    />
                    <span className="text-xs text-slate-500">Manual: {formData.qualityRules.manualReviewPercent}%</span>
                  </div>
                </div>
              </div>

              <div className="flex gap-4 pt-2">
                <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-400 select-none">
                  <input 
                    type="checkbox"
                    checked={formData.qualityRules.spamProtection}
                    onChange={(e) => setFormData({
                      ...formData,
                      qualityRules: { ...formData.qualityRules, spamProtection: e.target.checked }
                    })}
                    className="rounded text-indigo-500 bg-white/5 border-white/5 focus:ring-0"
                  />
                  Activate Anti-Spam Honey Pots
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-400 select-none">
                  <input 
                    type="checkbox"
                    checked={formData.qualityRules.duplicateDetection}
                    onChange={(e) => setFormData({
                      ...formData,
                      qualityRules: { ...formData.qualityRules, duplicateDetection: e.target.checked }
                    })}
                    className="rounded text-indigo-500 bg-white/5 border-white/5 focus:ring-0"
                  />
                  Deduplicate response vectors
                </label>
              </div>
            </motion.div>
          )}

          {step === 7 && (
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              <div className="flex items-center gap-2 border-b border-white/5 pb-2">
                <Sparkles className="h-4 w-4 text-emerald-400 animate-pulse" />
                <h3 className="text-sm font-semibold text-slate-900 dark:text-white uppercase font-mono">Step 7: Pre-Publish Review Summary</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="p-3 bg-white/5 rounded-xl border border-white/5 space-y-2">
                  <h4 className="font-bold text-indigo-400 uppercase font-mono">Target Campaign Details</h4>
                  <p className="text-slate-900 dark:text-white"><strong className="text-slate-400">Name:</strong> {formData.name}</p>
                  <p className="text-slate-900 dark:text-white"><strong className="text-slate-400">Objective:</strong> {formData.description.substring(0, 100)}...</p>
                  <p className="text-slate-900 dark:text-white"><strong className="text-slate-400">Task Interface:</strong> {formData.taskType}</p>
                  <p className="text-slate-900 dark:text-white"><strong className="text-slate-400">Tier Limit:</strong> {formData.targetAudience.contributorTier.toUpperCase()}</p>
                </div>

                <div className="p-3 bg-white/5 rounded-xl border border-white/5 space-y-2">
                  <h4 className="font-bold text-indigo-400 uppercase font-mono">Financial Commitment</h4>
                  <p className="text-slate-900 dark:text-white"><strong className="text-slate-400">Max Budget:</strong> {formData.budget.coins.toLocaleString()} Coins</p>
                  <p className="text-slate-900 dark:text-white"><strong className="text-slate-400">Fiduciary Equivalent:</strong> ${formData.budget.maxSpend.toLocaleString()} USD</p>
                  <p className="text-slate-900 dark:text-white"><strong className="text-slate-400">Audience Density:</strong> ~{formData.budget.expectedContributors} professional labelers</p>
                  <p className="text-slate-900 dark:text-white"><strong className="text-slate-400">Service Queue priority:</strong> {formData.budget.priority.toUpperCase()}</p>
                </div>
              </div>

              <div className="p-3 bg-amber-500/5 border border-amber-500/10 rounded-xl text-[11px] text-amber-400 flex items-start gap-2">
                <AlertOctagon className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <p><strong>Note on Publishing:</strong> Publishing will immediately lock the allocated budget of {formData.budget.coins.toLocaleString()} Coins from your corporate credit balance. Drafts can be edited later freely without balance deductions.</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Stepper Footer Controls */}
      <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-white/5">
        {step > 1 ? (
          <button 
            type="button"
            onClick={handleBack}
            className="flex items-center gap-1 text-xs text-slate-500 hover:text-slate-900 dark:text-zinc-400 dark:hover:text-white cursor-pointer px-3 py-1.5 rounded-lg border border-slate-200 dark:border-white/5 bg-white dark:bg-white/5 transition-all"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Back
          </button>
        ) : (
          <div />
        )}

        <div className="flex items-center gap-2">
          <button 
            type="button"
            onClick={() => handleSubmit(false)}
            disabled={isSubmitting}
            className="text-xs text-slate-500 hover:text-slate-900 dark:text-zinc-400 dark:hover:text-white cursor-pointer px-4 py-1.5 rounded-lg border border-slate-200 dark:border-white/5 bg-white dark:bg-white/5 transition-all"
          >
            Save Draft
          </button>
          
          {step < 7 ? (
            <button 
              type="button"
              onClick={handleNext}
              className="flex items-center gap-1 text-xs bg-indigo-600 hover:bg-indigo-500 text-white font-bold cursor-pointer px-4 py-1.5 rounded-lg shadow-md transition-all"
            >
              Continue <ArrowRight className="h-3.5 w-3.5" />
            </button>
          ) : (
            <button 
              type="button"
              onClick={() => handleSubmit(true)}
              disabled={isSubmitting}
              className="flex items-center gap-1 text-xs bg-emerald-600 hover:bg-emerald-500 text-white font-bold cursor-pointer px-5 py-1.5 rounded-lg shadow-md transition-all"
            >
              {isSubmitting ? 'Syncing...' : 'Publish Campaign'} <Check className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
