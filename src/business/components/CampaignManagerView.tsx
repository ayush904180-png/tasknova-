/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Play, Pause, Archive, Copy, Trash2, History, Check, 
  ExternalLink, Sparkles, Filter, Edit, AlertTriangle, Plus, FileText 
} from 'lucide-react';
import { useBusiness } from '../context/BusinessContext';
import { Campaign, CampaignStatus } from '../types';
import { ROLE_PERMISSIONS } from '../utils/permissions';

interface CampaignManagerViewProps {
  onOpenWizard: () => void;
}

export const CampaignManagerView: React.FC<CampaignManagerViewProps> = ({ onOpenWizard }) => {
  const { 
    campaigns, currentRole, updateCampaign, pauseCampaign, resumeCampaign, 
    archiveCampaign, duplicateCampaign, deleteCampaignDraft, versionCampaign 
  } = useBusiness();

  const [activeFilter, setActiveFilter] = useState<'all' | CampaignStatus>('all');
  const [selectedCampaignId, setSelectedCampaignId] = useState<string | null>(null);
  const [changelogInput, setChangelogInput] = useState('');
  const [showVersionModal, setShowVersionModal] = useState(false);

  // Automated workflow transitions simulation
  React.useEffect(() => {
    const activeTimeouts: any[] = [];
    campaigns.forEach((camp) => {
      if (camp.status === CampaignStatus.SUBMITTED) {
        const t = setTimeout(() => {
          updateCampaign(camp.id, { status: CampaignStatus.AI_PRE_VALIDATION });
        }, 1500);
        activeTimeouts.push(t);
      } else if (camp.status === CampaignStatus.AI_PRE_VALIDATION) {
        const t = setTimeout(() => {
          updateCampaign(camp.id, { status: CampaignStatus.PENDING_ADMIN_REVIEW });
        }, 1800);
        activeTimeouts.push(t);
      }
    });
    return () => activeTimeouts.forEach(clearTimeout);
  }, [campaigns, updateCampaign]);

  // Check role-based capabilities
  const permissions = ROLE_PERMISSIONS[currentRole];

  const filteredCampaigns = campaigns.filter((c) => {
    return activeFilter === 'all' || c.status === activeFilter;
  });

  const selectedCampaign = campaigns.find((c) => c.id === selectedCampaignId);

  const handleOpenVersion = (id: string) => {
    setSelectedCampaignId(id);
    setShowVersionModal(true);
    setChangelogInput('');
  };

  const handleSaveVersion = async () => {
    if (selectedCampaignId && changelogInput.trim()) {
      await versionCampaign(selectedCampaignId, changelogInput.trim());
      setShowVersionModal(false);
      setChangelogInput('');
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Campaign List Filter Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 dark:border-white/5 pb-4">
        <div className="flex flex-wrap gap-1.5">
          {(['all', CampaignStatus.PUBLISHED, CampaignStatus.PAUSED, CampaignStatus.DRAFT, CampaignStatus.ARCHIVED] as const).map((status) => (
            <button
              key={status}
              onClick={() => setActiveFilter(status)}
              className={`px-3 py-1.5 text-xs font-mono uppercase rounded-lg border cursor-pointer transition-all ${
                activeFilter === status
                  ? 'bg-indigo-600/15 border-indigo-500/40 text-indigo-400 font-bold'
                  : 'bg-white/5 border-white/5 text-slate-500 hover:text-white'
              }`}
            >
              {status}
            </button>
          ))}
        </div>

        {permissions.canCreateCampaign && (
          <button
            onClick={onOpenWizard}
            className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold font-display rounded-xl cursor-pointer shadow-lg hover:shadow-indigo-500/10 transition-all self-start"
          >
            <Plus className="h-4 w-4" /> Create New Campaign
          </button>
        )}
      </div>

      {/* Campaigns list rendering */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredCampaigns.length === 0 ? (
          <div className="col-span-2 p-12 text-center bg-slate-100 dark:bg-[#131316] border border-white/5 rounded-2xl text-slate-500 text-xs">
            No campaigns found matching selected category.
          </div>
        ) : (
          filteredCampaigns.map((camp) => {
            const isDraft = camp.status === CampaignStatus.DRAFT;
            const isPublished = camp.status === CampaignStatus.PUBLISHED;
            const isPaused = camp.status === CampaignStatus.PAUSED;
            const isArchived = camp.status === CampaignStatus.ARCHIVED;

            return (
              <div 
                key={camp.id}
                className="bg-slate-100 dark:bg-[#131316] border border-slate-200 dark:border-white/5 rounded-2xl p-5 flex flex-col justify-between space-y-4 hover:border-white/10 transition-colors"
              >
                {/* Header info */}
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-[10px] font-mono text-indigo-400 uppercase tracking-wide">
                      {camp.taskType} • v{camp.version}
                    </span>

                    <span className={`text-[8px] font-mono uppercase px-2 py-0.5 rounded-full ${
                      isPublished ? 'bg-emerald-500/10 text-emerald-400' :
                      isPaused ? 'bg-amber-500/10 text-amber-400' :
                      isDraft ? 'bg-indigo-500/10 text-indigo-400' : 'bg-slate-800 text-slate-500'
                    }`}>
                      {camp.status}
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-slate-900 dark:text-white font-display leading-tight">{camp.name}</h3>
                  <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">{camp.description}</p>
                </div>

                {/* Meta details */}
                <div className="bg-[#030303]/30 p-2.5 rounded-xl border border-white/5 grid grid-cols-3 gap-2 text-[10px] text-slate-400 font-mono">
                  <div>
                    <span className="text-[8px] text-slate-500 uppercase block">Coins Cap</span>
                    <span className="font-bold text-slate-950 dark:text-slate-300">{camp.budget.coins.toLocaleString()}</span>
                  </div>
                  <div>
                    <span className="text-[8px] text-slate-500 uppercase block">Audience Tier</span>
                    <span className="font-bold text-slate-950 dark:text-slate-300 uppercase">{camp.targetAudience.contributorTier}</span>
                  </div>
                  <div>
                    <span className="text-[8px] text-slate-500 uppercase block">Required Acc</span>
                    <span className="font-bold text-slate-950 dark:text-slate-300">{camp.qualityRules.requiredAccuracy}%</span>
                  </div>
                </div>

                {/* Workflow State Machine Controls */}
                <div className="bg-slate-200/50 dark:bg-[#09090b]/40 border border-slate-200 dark:border-white/5 rounded-xl p-3.5 space-y-2 text-xs">
                  <div className="flex items-center justify-between text-[10px] font-mono uppercase tracking-wider text-slate-400 border-b border-slate-200 dark:border-white/5 pb-1">
                    <span>Workflow Engine Status</span>
                    <span className="text-indigo-400 font-bold">{camp.status.replace(/_/g, ' ')}</span>
                  </div>

                  {camp.status === CampaignStatus.DRAFT && (
                    <button
                      type="button"
                      onClick={() => updateCampaign(camp.id, { status: CampaignStatus.SUBMITTED })}
                      className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold font-display py-1.5 rounded-lg text-xs transition-all cursor-pointer text-center block shadow-md"
                    >
                      🚀 Submit for Campaign Approval
                    </button>
                  )}

                  {camp.status === CampaignStatus.SUBMITTED && (
                    <div className="flex items-center gap-2 text-amber-500 dark:text-amber-400 font-mono text-[11px] py-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-ping"></span>
                      <span>Submitting draft... parsing dataset schemas.</span>
                    </div>
                  )}

                  {camp.status === CampaignStatus.AI_PRE_VALIDATION && (
                    <div className="flex items-center gap-2 text-indigo-400 font-mono text-[11px] py-1 animate-pulse">
                      <Sparkles className="h-3.5 w-3.5 text-indigo-400 animate-spin" />
                      <span>AI validator modeling consensus... scanning safety risk.</span>
                    </div>
                  )}

                  {camp.status === CampaignStatus.PENDING_ADMIN_REVIEW && (
                    <div className="space-y-1.5">
                      <p className="text-[10px] text-slate-500 leading-relaxed font-mono">
                        AI pre-validation completed with <strong className="text-emerald-400">98% confidence score</strong>. Administrator review required.
                      </p>
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => updateCampaign(camp.id, { status: CampaignStatus.APPROVED })}
                          className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-1 px-2 rounded font-display text-[10px] transition-colors cursor-pointer text-center"
                        >
                          Approve Launch
                        </button>
                        <button
                          type="button"
                          onClick={() => updateCampaign(camp.id, { status: CampaignStatus.DRAFT })}
                          className="bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 font-bold py-1 px-2 rounded border border-rose-500/20 text-[10px] transition-colors cursor-pointer text-center"
                        >
                          Reject / Revise
                        </button>
                      </div>
                    </div>
                  )}

                  {camp.status === CampaignStatus.APPROVED && (
                    <button
                      type="button"
                      onClick={() => updateCampaign(camp.id, { status: CampaignStatus.PUBLISHED })}
                      className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold font-display py-1.5 rounded-lg text-xs transition-all cursor-pointer text-center block shadow-md"
                    >
                      🚀 Go Live (Publish Campaign)
                    </button>
                  )}

                  {camp.status === CampaignStatus.PUBLISHED && (
                    <p className="text-emerald-500 dark:text-emerald-400 font-mono text-[11px] flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span>
                      <span>Live stream active. Outbound tasks distributing.</span>
                    </p>
                  )}

                  {camp.status === CampaignStatus.PAUSED && (
                    <p className="text-amber-500 dark:text-amber-400 font-mono text-[11px]">
                      ⏸ Campaign paused. Task distribution on hold.
                    </p>
                  )}

                  {camp.status === CampaignStatus.ARCHIVED && (
                    <p className="text-slate-500 font-mono text-[11px]">
                      📁 Archived. Read-only historical telemetry.
                    </p>
                  )}
                </div>

                {/* Core operational actions */}
                <div className="flex items-center justify-between pt-2 border-t border-slate-200 dark:border-white/5">
                  <button
                    type="button"
                    onClick={() => handleOpenVersion(camp.id)}
                    className="flex items-center gap-1 text-[10px] font-mono text-slate-500 hover:text-white cursor-pointer"
                  >
                    <History className="h-3 w-3" /> Version Control
                  </button>

                  <div className="flex gap-2">
                    {/* Duplicate */}
                    <button
                      type="button"
                      onClick={() => duplicateCampaign(camp.id)}
                      className="p-1.5 text-slate-400 hover:text-white hover:bg-white/5 border border-white/5 rounded-lg cursor-pointer transition-colors"
                      title="Duplicate Campaign"
                    >
                      <Copy className="h-3.5 w-3.5" />
                    </button>

                    {/* Pause */}
                    {isPublished && permissions.canPauseCampaign && (
                      <button
                        type="button"
                        onClick={() => pauseCampaign(camp.id)}
                        className="p-1.5 text-amber-500 hover:text-white hover:bg-amber-500/10 border border-amber-500/20 rounded-lg cursor-pointer transition-colors"
                        title="Pause campaign intake"
                      >
                        <Pause className="h-3.5 w-3.5" />
                      </button>
                    )}

                    {/* Resume */}
                    {isPaused && permissions.canPublishCampaign && (
                      <button
                        type="button"
                        onClick={() => resumeCampaign(camp.id)}
                        className="p-1.5 text-emerald-500 hover:text-white hover:bg-emerald-500/10 border border-emerald-500/20 rounded-lg cursor-pointer transition-colors"
                        title="Resume campaign intake"
                      >
                        <Play className="h-3.5 w-3.5" />
                      </button>
                    )}

                    {/* Archive */}
                    {!isDraft && !isArchived && permissions.canPublishCampaign && (
                      <button
                        type="button"
                        onClick={() => archiveCampaign(camp.id)}
                        className="p-1.5 text-slate-500 hover:text-white hover:bg-white/5 border border-white/5 rounded-lg cursor-pointer transition-colors"
                        title="Archive Campaign"
                      >
                        <Archive className="h-3.5 w-3.5" />
                      </button>
                    )}

                    {/* Delete Draft */}
                    {isDraft && permissions.canDeleteCampaign && (
                      <button
                        type="button"
                        onClick={() => deleteCampaignDraft(camp.id)}
                        className="p-1.5 text-rose-500 hover:text-white hover:bg-rose-500/10 border border-rose-500/20 rounded-lg cursor-pointer transition-colors"
                        title="Delete draft"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    )}
                  </div>
                </div>

              </div>
            );
          })
        )}
      </div>

      {/* Versioning modal */}
      {showVersionModal && selectedCampaign && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-100 dark:bg-[#09090b] border border-slate-200 dark:border-white/5 rounded-2xl p-6 w-full max-w-md space-y-4 shadow-2xl">
            <div>
              <h4 className="text-sm font-bold font-display text-slate-900 dark:text-white">Campaign Version Sandbox</h4>
              <p className="text-xs text-slate-500 mt-0.5">Commit current state variables as a historical baseline snapshot for: <strong className="text-indigo-400">{selectedCampaign.name}</strong></p>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-400">Release Commit Changelog*</label>
              <textarea
                rows={3}
                placeholder="e.g. Adjusted minimum accuracy threshold to 92% and uploaded medical supplemental parameters."
                value={changelogInput}
                onChange={(e) => setChangelogInput(e.target.value)}
                className="w-full bg-white/5 border border-slate-200 dark:border-white/5 rounded-lg p-2.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="flex items-center justify-end gap-2 text-xs">
              <button
                type="button"
                onClick={() => setShowVersionModal(false)}
                className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-white/5 bg-white dark:bg-white/5 text-slate-500 hover:text-white cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveVersion}
                disabled={!changelogInput.trim()}
                className="px-4 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-bold cursor-pointer disabled:opacity-50"
              >
                Commit Snapshot (v{selectedCampaign.version + 1})
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
