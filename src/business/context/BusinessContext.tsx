/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  BusinessRole, Campaign, CampaignStatus, Dataset, BusinessBillingSummary, 
  BusinessInvoice, BusinessTransaction, ContributorMonitorStats, AuditLogEntry, CampaignVersion 
} from '../types';
import { CampaignRepository } from '../repositories/CampaignRepository';
import { DatasetRepository } from '../repositories/DatasetRepository';
import { BillingRepository } from '../repositories/BillingRepository';
import { AuditLogRepository } from '../repositories/AuditLogRepository';
import { CampaignMapper } from '../mappers/CampaignMapper';
import { CampaignValidator } from '../validators/CampaignValidator';
import { MemoryDatabase } from '../../infrastructure/repositories/FirestoreRepository';

interface BusinessContextType {
  currentRole: BusinessRole;
  setRole: (role: BusinessRole) => void;
  campaigns: Campaign[];
  datasets: Dataset[];
  billingSummary: BusinessBillingSummary | null;
  invoices: BusinessInvoice[];
  transactions: BusinessTransaction[];
  auditLogs: AuditLogEntry[];
  contributors: ContributorMonitorStats[];
  activeCampaignId: string | null;
  setActiveCampaignId: (id: string | null) => void;
  createCampaign: (campaignData: any) => Promise<{ success: boolean; errors?: string[] }>;
  updateCampaign: (id: string, data: Partial<Campaign>) => Promise<void>;
  pauseCampaign: (id: string) => Promise<void>;
  resumeCampaign: (id: string) => Promise<void>;
  archiveCampaign: (id: string) => Promise<void>;
  duplicateCampaign: (id: string) => Promise<void>;
  deleteCampaignDraft: (id: string) => Promise<void>;
  versionCampaign: (id: string, changeLog: string) => Promise<void>;
  uploadDataset: (name: string, type: string, size: string) => Promise<Dataset>;
  triggerEmergencyStop: () => Promise<void>;
  addBonusBudget: (amountCoins: number) => Promise<void>;
  purchaseCredits: (usdAmount: number) => Promise<void>;
  generateFakeCampaigns: () => Promise<void>;
  runStressTest: () => Promise<{ rps: number; latency: number; loadCompleted: boolean }>;
  seedDataset: () => Promise<void>;
  resetWorkspace: () => Promise<void>;
}

const BusinessContext = createContext<BusinessContextType | undefined>(undefined);

const campaignRepo = new CampaignRepository();
const datasetRepo = new DatasetRepository();
const billingRepo = new BillingRepository();
const auditRepo = new AuditLogRepository();

export const BusinessProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentRole, setRoleState] = useState<BusinessRole>(BusinessRole.ADMIN);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [datasets, setDatasets] = useState<Dataset[]>([]);
  const [billingSummary, setBillingSummary] = useState<BusinessBillingSummary | null>(null);
  const [invoices, setInvoices] = useState<BusinessInvoice[]>([]);
  const [transactions, setTransactions] = useState<BusinessTransaction[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>([]);
  const [activeCampaignId, setActiveCampaignId] = useState<string | null>(null);
  const [contributors, setContributors] = useState<ContributorMonitorStats[]>([]);

  // Synchronize state with repositories
  const syncWithDatabase = async () => {
    const camps = await campaignRepo.list();
    const dss = await datasetRepo.list();
    const bill = await billingRepo.getSummary();
    const invs = await billingRepo.getInvoices();
    const txs = await billingRepo.getTransactions();
    const logs = await auditRepo.getLogs();

    setCampaigns(camps);
    setDatasets(dss);
    setBillingSummary(bill);
    setInvoices(invs);
    setTransactions(txs);
    setAuditLogs(logs);

    if (camps.length > 0 && !activeCampaignId) {
      setActiveCampaignId(camps[0].id);
    }
  };

  useEffect(() => {
    syncWithDatabase();

    // Generate dynamic mock live contributors
    const mockContributors: ContributorMonitorStats[] = [
      { id: 'cnt_01', name: 'Alex Rivera', accuracy: 98.4, trustScore: 99.1, speed: 120, country: 'United States', language: 'English', activeTask: 'GPT-5 Safety RLHF', rejectedTasks: 1, completedCount: 840, status: 'active' },
      { id: 'cnt_02', name: 'Aarav Mehta', accuracy: 96.5, trustScore: 95.8, speed: 145, country: 'India', language: 'English, Hindi', activeTask: 'Gemini Multimodal Bounding Box', rejectedTasks: 4, completedCount: 1250, status: 'active' },
      { id: 'cnt_03', name: 'Sarah Connor', accuracy: 99.1, trustScore: 99.8, speed: 90, country: 'Canada', language: 'English', activeTask: 'GPT-5 Scientific Reasoning', rejectedTasks: 0, completedCount: 420, status: 'active' },
      { id: 'cnt_04', name: 'Yuki Tanaka', accuracy: 94.2, trustScore: 90.5, speed: 110, country: 'Japan', language: 'Japanese, English', activeTask: 'Idle', rejectedTasks: 8, completedCount: 610, status: 'idle' },
      { id: 'cnt_05', name: 'Hans Schmidt', accuracy: 82.4, trustScore: 65.0, speed: 180, country: 'Germany', language: 'German', activeTask: 'None', rejectedTasks: 35, completedCount: 220, status: 'suspended' }, // Fraud sample
    ];
    setContributors(mockContributors);
  }, []);

  const setRole = async (role: BusinessRole) => {
    setRoleState(role);
    await auditRepo.createLog({
      userId: 'usr_admin_01',
      userEmail: 'ayush904180@gmail.com',
      action: 'ROLE_SWITCHED',
      details: `Administrative profile role changed dynamically to: ${role.toUpperCase()}`,
      ipAddress: '127.0.0.1'
    });
    const logs = await auditRepo.getLogs();
    setAuditLogs(logs);
  };

  const createCampaign = async (campaignData: any) => {
    const campaign = CampaignMapper.toDomain(campaignData);
    const errors = CampaignValidator.validate(campaign);

    if (errors.length > 0) {
      return { success: false, errors: errors.map((e) => `${e.field}: ${e.message}`) };
    }

    // Set default initial values
    campaign.id = `camp_${Math.random().toString(36).substr(2, 9)}`;
    campaign.version = 1;
    campaign.createdAt = new Date().toISOString();
    campaign.updatedAt = new Date().toISOString();

    await campaignRepo.create(campaign.id, campaign);

    // Save initial campaign version snapshot
    const version: CampaignVersion = {
      id: `ver_${campaign.id}_1`,
      campaignId: campaign.id,
      version: 1,
      snapshot: { ...campaign },
      updatedAt: campaign.createdAt,
      updatedBy: 'ayush904180@gmail.com',
      changeLog: 'Initial campaign definition created.'
    };
    await campaignRepo.saveVersion(version);

    // Record audit log
    await auditRepo.createLog({
      userId: 'usr_admin_01',
      userEmail: 'ayush904180@gmail.com',
      action: 'CAMPAIGN_CREATED',
      details: `Created new campaign "${campaign.name}" as DRAFT.`,
      ipAddress: '127.0.0.1'
    });

    // Sync financial reserves
    if (campaign.status === CampaignStatus.PUBLISHED && billingSummary) {
      await billingRepo.updateSummary({
        reservedBudget: billingSummary.reservedBudget + campaign.budget.coins,
        creditBalance: billingSummary.creditBalance - campaign.budget.coins
      });
    }

    await syncWithDatabase();
    setActiveCampaignId(campaign.id);

    return { success: true };
  };

  const updateCampaign = async (id: string, data: Partial<Campaign>) => {
    const existing = await campaignRepo.getById(id);
    if (!existing) return;

    const merged = { ...existing, ...data, updatedAt: new Date().toISOString() };
    await campaignRepo.update(id, merged);

    await auditRepo.createLog({
      userId: 'usr_admin_01',
      userEmail: 'ayush904180@gmail.com',
      action: 'CAMPAIGN_UPDATED',
      details: `Updated parameters for campaign "${existing.name}".`,
      ipAddress: '127.0.0.1'
    });

    await syncWithDatabase();
  };

  const pauseCampaign = async (id: string) => {
    await updateCampaign(id, { status: CampaignStatus.PAUSED });
    const existing = await campaignRepo.getById(id);
    await auditRepo.createLog({
      userId: 'usr_admin_01',
      userEmail: 'ayush904180@gmail.com',
      action: 'CAMPAIGN_PAUSED',
      details: `Emergency paused execution on campaign "${existing?.name}". Outbound coin distributions lock activated.`,
      ipAddress: '127.0.0.1'
    });
    await syncWithDatabase();
  };

  const resumeCampaign = async (id: string) => {
    await updateCampaign(id, { status: CampaignStatus.PUBLISHED });
    const existing = await campaignRepo.getById(id);
    await auditRepo.createLog({
      userId: 'usr_admin_01',
      userEmail: 'ayush904180@gmail.com',
      action: 'CAMPAIGN_RESUMED',
      details: `Resumed active data label acquisitions for campaign "${existing?.name}".`,
      ipAddress: '127.0.0.1'
    });
    await syncWithDatabase();
  };

  const archiveCampaign = async (id: string) => {
    await updateCampaign(id, { status: CampaignStatus.ARCHIVED });
    const existing = await campaignRepo.getById(id);
    await auditRepo.createLog({
      userId: 'usr_admin_01',
      userEmail: 'ayush904180@gmail.com',
      action: 'CAMPAIGN_ARCHIVED',
      details: `Archived campaign "${existing?.name}". Data models marked as Read-Only.`,
      ipAddress: '127.0.0.1'
    });
    await syncWithDatabase();
  };

  const duplicateCampaign = async (id: string) => {
    const source = await campaignRepo.getById(id);
    if (!source) return;

    const dup: Campaign = {
      ...source,
      id: `camp_${Math.random().toString(36).substr(2, 9)}`,
      name: `${source.name} (Copy)`,
      status: CampaignStatus.DRAFT,
      version: 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    await campaignRepo.create(dup.id, dup);
    await auditRepo.createLog({
      userId: 'usr_admin_01',
      userEmail: 'ayush904180@gmail.com',
      action: 'CAMPAIGN_DUPLICATED',
      details: `Duplicated campaign "${source.name}" into new DRAFT "${dup.name}".`,
      ipAddress: '127.0.0.1'
    });

    await syncWithDatabase();
    setActiveCampaignId(dup.id);
  };

  const deleteCampaignDraft = async (id: string) => {
    const existing = await campaignRepo.getById(id);
    if (existing && existing.status === CampaignStatus.DRAFT) {
      await campaignRepo.delete(id);
      await auditRepo.createLog({
        userId: 'usr_admin_01',
        userEmail: 'ayush904180@gmail.com',
        action: 'CAMPAIGN_DELETED',
        details: `Deleted campaign draft "${existing.name}".`,
        ipAddress: '127.0.0.1'
      });
      await syncWithDatabase();
      if (activeCampaignId === id) {
        setActiveCampaignId(null);
      }
    }
  };

  const versionCampaign = async (id: string, changeLog: string) => {
    const existing = await campaignRepo.getById(id);
    if (!existing) return;

    const newVersion = existing.version + 1;
    const updated = { ...existing, version: newVersion, updatedAt: new Date().toISOString() };
    
    await campaignRepo.update(id, updated);

    // Save version snapshot
    const version: CampaignVersion = {
      id: `ver_${id}_${newVersion}`,
      campaignId: id,
      version: newVersion,
      snapshot: { ...updated },
      updatedAt: updated.updatedAt,
      updatedBy: 'ayush904180@gmail.com',
      changeLog
    };
    await campaignRepo.saveVersion(version);

    await auditRepo.createLog({
      userId: 'usr_admin_01',
      userEmail: 'ayush904180@gmail.com',
      action: 'CAMPAIGN_VERSIONED',
      details: `Incremented campaign version of "${existing.name}" to v${newVersion}. Changelog: "${changeLog}"`,
      ipAddress: '127.0.0.1'
    });

    await syncWithDatabase();
  };

  const uploadDataset = async (name: string, type: string, size: string) => {
    const id = `ds_${Math.random().toString(36).substr(2, 9)}`;
    const rowCount = Math.floor(Math.random() * 50000) + 5000;
    
    // Simulate schemas detection
    const detectedSchema = ['prompt_id', 'input_text', 'ideal_completion', 'system_instructions', 'metadata_scope'];
    
    const newDs: Dataset = {
      id,
      name,
      type: type as any,
      size,
      rowCount,
      status: 'validating',
      brokenFilesCount: 0,
      missingColumnsCount: 0,
      detectedSchema,
      createdAt: new Date().toISOString()
    };

    await datasetRepo.create(id, newDs);
    await syncWithDatabase();

    // Trigger asynchronous validation effect simulation
    setTimeout(async () => {
      const isBroken = name.toLowerCase().includes('corrupted') || name.toLowerCase().includes('broken');
      const updatedDs: Dataset = {
        ...newDs,
        status: isBroken ? 'invalid' : 'valid',
        brokenFilesCount: isBroken ? 12 : 0,
        missingColumnsCount: isBroken ? 2 : 0
      };
      await datasetRepo.create(id, updatedDs);
      
      await auditRepo.createLog({
        userId: 'usr_admin_01',
        userEmail: 'ayush904180@gmail.com',
        action: 'DATASET_VALIDATED',
        details: `Automated schema analysis completed for "${name}". Detected rows: ${rowCount}. Status: ${updatedDs.status.toUpperCase()}`,
        ipAddress: '127.0.0.1'
      });
      
      await syncWithDatabase();
    }, 2000);

    return newDs;
  };

  const triggerEmergencyStop = async () => {
    // Fast pause of ALL active campaigns
    const camps = await campaignRepo.list();
    const activeCamps = camps.filter((c) => c.status === CampaignStatus.PUBLISHED);
    
    for (const c of activeCamps) {
      await campaignRepo.update(c.id, { ...c, status: CampaignStatus.PAUSED, updatedAt: new Date().toISOString() });
    }

    await auditRepo.createLog({
      userId: 'usr_admin_01',
      userEmail: 'ayush904180@gmail.com',
      action: 'EMERGENCY_STOP_TRIGGERED',
      details: 'CRITICAL EMERGENCY STOP TRIGGERED. All published campaign integrations locked instantly.',
      ipAddress: '127.0.0.1'
    });

    await syncWithDatabase();
  };

  const addBonusBudget = async (amountCoins: number) => {
    if (!billingSummary) return;
    const updatedSummary = {
      ...billingSummary,
      bonusBudget: billingSummary.bonusBudget + amountCoins,
      creditBalance: billingSummary.creditBalance + amountCoins,
    };
    MemoryDatabase.set('billing', 'summary_current', updatedSummary);

    await billingRepo.appendTransaction({
      id: `tx_bonus_${Math.random().toString(36).substr(2, 9)}`,
      amount: amountCoins,
      type: 'bonus',
      description: 'Discretionary administrative bonus budget top-up.',
      timestamp: new Date().toISOString(),
      referenceId: `ref_bonus_${Math.random().toString(36).substr(2, 6)}`
    });

    await auditRepo.createLog({
      userId: 'usr_admin_01',
      userEmail: 'ayush904180@gmail.com',
      action: 'BONUS_BUDGET_GRANTED',
      details: `Injected administrative discretionary bonus: +${amountCoins.toLocaleString()} Coins.`,
      ipAddress: '127.0.0.1'
    });

    await syncWithDatabase();
  };

  const purchaseCredits = async (usdAmount: number) => {
    if (!billingSummary) return;
    const coins = usdAmount * 100; // 1 USD = 100 Coins ratio
    const invoiceId = `inv_${Math.random().toString(36).substr(2, 9)}`;
    const invoiceNum = `TKNV-2026-${Math.floor(Math.random() * 90000) + 10000}`;

    const newInvoice: BusinessInvoice = {
      id: invoiceId,
      invoiceNumber: invoiceNum,
      date: new Date().toISOString(),
      coinsPurchased: coins,
      amountUsd: usdAmount,
      status: 'paid',
      gstNumber: 'GSTIN27AABCT8431R1ZP',
      taxAmountUsd: usdAmount * 0.18, // 18% GST ready
    };

    await billingRepo.createInvoice(newInvoice);

    await billingRepo.appendTransaction({
      id: `tx_purchase_${Math.random().toString(36).substr(2, 9)}`,
      amount: coins,
      type: 'deposit',
      description: `Purchased campaign credits via Invoice ${invoiceNum}`,
      timestamp: new Date().toISOString(),
      referenceId: `ref_settle_${Math.random().toString(36).substr(2, 6)}`
    });

    await auditRepo.createLog({
      userId: 'usr_admin_01',
      userEmail: 'ayush904180@gmail.com',
      action: 'CREDITS_PURCHASED',
      details: `Purchased ${coins.toLocaleString()} Coins for $${usdAmount.toLocaleString()} USD. Invoice: ${invoiceNum}`,
      ipAddress: '127.0.0.1'
    });

    await syncWithDatabase();
  };

  const generateFakeCampaigns = async () => {
    // Developer helper: generates high volume fake campaigns
    const companies = ['Anthropic', 'Meta AI', 'OpenAI', 'Cohere', 'Mistral AI'];
    const projects = ['Scale-Run', 'Llama-Finely', 'Claude-Next', 'RAG-Core'];
    const types = ['RLHF', 'Translation', 'Image', 'Safety', 'Pairwise Comparison'];
    
    for (let i = 0; i < 5; i++) {
      const compName = companies[Math.floor(Math.random() * companies.length)];
      const projName = projects[Math.floor(Math.random() * projects.length)];
      const type = types[Math.floor(Math.random() * types.length)];
      const coinBudget = (Math.floor(Math.random() * 10) + 1) * 200000;

      const fCamp = {
        name: `Automated Stress ${type} Evaluation - ${compName}`,
        description: `Synthetic system stress testing campaign simulating ${type} workload for ${projName} model.`,
        companyName: compName,
        projectName: projName,
        tags: ['StressTest', 'Synthetic'],
        taskType: type,
        budget: {
          coins: coinBudget,
          maxSpend: coinBudget / 100,
          expectedCompletion: '48 hours',
          expectedContributors: Math.floor(coinBudget / 1000),
          rewardRuleMultiplier: 1.0,
          priority: 'medium'
        },
        targetAudience: {
          countries: ['All'],
          languages: ['English'],
          devices: ['Desktop'],
          experienceLevel: 'all',
          trustScoreMin: 80,
          accuracyMin: 80,
          role: ['All Users'],
          contributorTier: 'bronze'
        },
        qualityRules: {
          requiredAccuracy: 85,
          minimumTimePerTask: 15,
          spamProtection: true,
          manualReviewPercent: 0,
          aiReviewPercent: 100,
          consensusThreshold: 1,
          duplicateDetection: true
        },
        status: CampaignStatus.PUBLISHED
      };

      await createCampaign(fCamp);
    }
    
    await auditRepo.createLog({
      userId: 'usr_admin_01',
      userEmail: 'ayush904180@gmail.com',
      action: 'FAKE_CAMPAIGNS_GENERATED',
      details: 'Developer tool triggered: Generated 5 synthetic load campaigns.',
      ipAddress: '127.0.0.1'
    });
    
    await syncWithDatabase();
  };

  const runStressTest = async () => {
    // Simulate high frequency consensus validation transactions
    await auditRepo.createLog({
      userId: 'usr_admin_01',
      userEmail: 'ayush904180@gmail.com',
      action: 'STRESS_TEST_STARTED',
      details: 'System performance profiler started: Simulating 2,500 active parallel web socket threads.',
      ipAddress: '127.0.0.1'
    });

    return new Promise<{ rps: number; latency: number; loadCompleted: boolean }>((resolve) => {
      setTimeout(async () => {
        await auditRepo.createLog({
          userId: 'usr_admin_01',
          userEmail: 'ayush904180@gmail.com',
          action: 'STRESS_TEST_COMPLETED',
          details: 'Stress test finished successfully. 100,000 requests processed in 4,500ms. Max RPS: 22,222. Avg latency: 1.2ms. Packet loss: 0.00%.',
          ipAddress: '127.0.0.1'
        });
        await syncWithDatabase();
        resolve({ rps: 22222, latency: 1.2, loadCompleted: true });
      }, 1500);
    });
  };

  const seedDataset = async () => {
    const defaultDatasets = [
      {
        id: 'ds_seed_openai_medical',
        name: 'OpenAI Clinical Medical RLHF Prompts.json',
        type: 'json' as const,
        size: '128.4 MB',
        rowCount: 85000,
        status: 'valid' as const,
        brokenFilesCount: 0,
        missingColumnsCount: 0,
        detectedSchema: ['patient_complaint', 'diagnostics', 'physician_advice', 'clinical_grade'],
        createdAt: new Date().toISOString()
      },
      {
        id: 'ds_seed_deepmind_audio',
        name: 'DeepMind Multi-Speaker Conversational Audio.zip',
        type: 'zip' as const,
        size: '412.0 MB',
        rowCount: 32000,
        status: 'valid' as const,
        brokenFilesCount: 0,
        missingColumnsCount: 0,
        detectedSchema: ['audio_sha', 'speaker_id', 'audio_duration_seconds', 'whisper_raw_transcription'],
        createdAt: new Date().toISOString()
      }
    ];

    for (const ds of defaultDatasets) {
      await datasetRepo.create(ds.id, ds);
    }

    await auditRepo.createLog({
      userId: 'usr_admin_01',
      userEmail: 'ayush904180@gmail.com',
      action: 'SEED_DATASETS_DEPLOYED',
      details: 'Developer tool triggered: Deployed medical and speech baseline seed datasets.',
      ipAddress: '127.0.0.1'
    });

    await syncWithDatabase();
  };

  const resetWorkspace = async () => {
    // Flush local storage and reload baseline
    localStorage.removeItem('tasknova_mock_firestore');
    // Clear custom caches
    const keys = Object.keys(localStorage);
    keys.forEach((key) => {
      if (key.startsWith('tasknova_business_cache_') || key.startsWith('tasknova_mock_firestore')) {
        localStorage.removeItem(key);
      }
    });

    await auditRepo.createLog({
      userId: 'usr_admin_01',
      userEmail: 'ayush904180@gmail.com',
      action: 'WORKSPACE_RESET',
      details: 'Developer tool triggered: Flushed mock databases and reset workspace telemetry to factory values.',
      ipAddress: '127.0.0.1'
    });

    window.location.reload();
  };

  return (
    <BusinessContext.Provider value={{
      currentRole,
      setRole,
      campaigns,
      datasets,
      billingSummary,
      invoices,
      transactions,
      auditLogs,
      contributors,
      activeCampaignId,
      setActiveCampaignId,
      createCampaign,
      updateCampaign,
      pauseCampaign,
      resumeCampaign,
      archiveCampaign,
      duplicateCampaign,
      deleteCampaignDraft,
      versionCampaign,
      uploadDataset,
      triggerEmergencyStop,
      addBonusBudget,
      purchaseCredits,
      generateFakeCampaigns,
      runStressTest,
      seedDataset,
      resetWorkspace
    }}>
      {children}
    </BusinessContext.Provider>
  );
};

export const useBusiness = () => {
  const context = useContext(BusinessContext);
  if (context === undefined) {
    throw new Error('useBusiness must be used within a BusinessProvider');
  }
  return context;
};
