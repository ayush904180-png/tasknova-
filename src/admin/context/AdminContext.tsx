/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { AdminRole, LiveEvent, AdminUser, AdminOrganization, ModerationItem, SecurityAlert, WithdrawalRequest, AuditLog, AdminNotificationCampaign, ServiceHealth } from '../types';
import { AdminService } from '../services/AdminService';
import { PlatformStats } from '../repositories/AdminRepository';

interface AdminContextType {
  role: AdminRole;
  setRole: (role: AdminRole) => void;
  stats: PlatformStats;
  serviceHealth: ServiceHealth[];
  liveEvents: LiveEvent[];
  users: AdminUser[];
  organizations: AdminOrganization[];
  moderationItems: ModerationItem[];
  securityAlerts: SecurityAlert[];
  threatFeed: any[];
  withdrawals: WithdrawalRequest[];
  auditLogs: AuditLog[];
  campaigns: AdminNotificationCampaign[];
  pendingOfflineCount: number;
  isSyncing: boolean;
  syncOfflineData: () => Promise<void>;
  
  // Actions
  suspendUser: (userId: string, reason: string) => void;
  unsuspendUser: (userId: string, reason: string) => void;
  banUser: (userId: string, reason: string) => void;
  adjustReputation: (userId: string, reputation: number, trustScore: number, reason: string) => void;
  resetCredentials: (userId: string, type: '2FA' | 'Password', reason: string) => void;
  
  suspendCompany: (orgId: string, reason: string) => void;
  resumeCompany: (orgId: string, reason: string) => void;
  freezeBilling: (orgId: string, reason: string) => void;
  updateBudgetLimit: (orgId: string, limit: number, reason: string) => void;
  
  moderateContent: (itemId: string, status: 'Approved' | 'Rejected' | 'Archived' | 'Escalated', reason: string) => void;
  processWithdrawal: (reqId: string, status: 'Approved' | 'Rejected' | 'Hold' | 'Pending', reason: string) => void;
  resolveSecurityAlert: (alertId: string, status: 'Resolved' | 'Whitelisted', reason: string) => void;
  launchBroadcast: (campaign: Omit<AdminNotificationCampaign, 'id' | 'sentCount'>) => void;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export const AdminProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const serviceRef = useRef<AdminService>(new AdminService());
  const [role, setRole] = useState<AdminRole>(AdminRole.OWNER); // Default to Owner for full controls demo
  const [stats, setStats] = useState<PlatformStats>(serviceRef.current.getStats());
  const [serviceHealth, setServiceHealth] = useState<ServiceHealth[]>(serviceRef.current.getServiceHealth());
  const [liveEvents, setLiveEvents] = useState<LiveEvent[]>(serviceRef.current.getLiveEvents());
  const [users, setUsers] = useState<AdminUser[]>(serviceRef.current.getUsers());
  const [organizations, setOrganizations] = useState<AdminOrganization[]>(serviceRef.current.getOrganizations());
  const [moderationItems, setModerationItems] = useState<ModerationItem[]>(serviceRef.current.getModerationItems());
  const [securityAlerts, setSecurityAlerts] = useState<SecurityAlert[]>(serviceRef.current.getSecurityAlerts());
  const [threatFeed, setThreatFeed] = useState<any[]>(serviceRef.current.getThreatFeed());
  const [withdrawals, setWithdrawals] = useState<WithdrawalRequest[]>(serviceRef.current.getWithdrawals());
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(serviceRef.current.getAuditLogs());
  const [campaigns, setCampaigns] = useState<AdminNotificationCampaign[]>(serviceRef.current.getNotificationCampaigns());
  const [pendingOfflineCount, setPendingOfflineCount] = useState<number>(serviceRef.current.getPendingOfflineActionsCount());
  const [isSyncing, setIsSyncing] = useState(false);

  // Sync state from Service
  const refreshState = () => {
    const service = serviceRef.current;
    setStats(service.getStats());
    setServiceHealth(service.getServiceHealth());
    setLiveEvents(service.getLiveEvents());
    setUsers(service.getUsers());
    setOrganizations(service.getOrganizations());
    setModerationItems(service.getModerationItems());
    setSecurityAlerts(service.getSecurityAlerts());
    setThreatFeed(service.getThreatFeed());
    setWithdrawals(service.getWithdrawals());
    setAuditLogs(service.getAuditLogs());
    setCampaigns(service.getNotificationCampaigns());
    setPendingOfflineCount(service.getPendingOfflineActionsCount());
  };

  // Sync offline actions
  const syncOfflineData = async () => {
    setIsSyncing(true);
    await serviceRef.current.triggerSync();
    setIsSyncing(false);
    refreshState();
  };

  // Setup Live Telemetry Events Simulator (Every 10 seconds, adds realism to Dashboard)
  useEffect(() => {
    const interval = setInterval(() => {
      serviceRef.current.simulateRandomTelemetryEvent();
      refreshState();
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  // --- ACTIONS INJECTED ---
  const suspendUser = (userId: string, reason: string) => {
    serviceRef.current.updateUserStatus('adm_active', role, userId, 'Suspended', reason);
    refreshState();
  };

  const unsuspendUser = (userId: string, reason: string) => {
    serviceRef.current.updateUserStatus('adm_active', role, userId, 'Active', reason);
    refreshState();
  };

  const banUser = (userId: string, reason: string) => {
    serviceRef.current.updateUserStatus('adm_active', role, userId, 'Banned', reason);
    refreshState();
  };

  const adjustReputation = (userId: string, reputation: number, trustScore: number, reason: string) => {
    serviceRef.current.resetUserReputation('adm_active', role, userId, reputation, trustScore, reason);
    refreshState();
  };

  const resetCredentials = (userId: string, type: '2FA' | 'Password', reason: string) => {
    serviceRef.current.resetUserCredentials('adm_active', role, userId, type, reason);
    refreshState();
  };

  const suspendCompany = (orgId: string, reason: string) => {
    serviceRef.current.updateCompanyStatus('adm_active', role, orgId, 'Suspended', reason);
    refreshState();
  };

  const resumeCompany = (orgId: string, reason: string) => {
    serviceRef.current.updateCompanyStatus('adm_active', role, orgId, 'Active', reason);
    refreshState();
  };

  const freezeBilling = (orgId: string, reason: string) => {
    serviceRef.current.updateCompanyStatus('adm_active', role, orgId, 'Billing_Frozen', reason);
    refreshState();
  };

  const updateBudgetLimit = (orgId: string, limit: number, reason: string) => {
    serviceRef.current.updateCompanyBudget('adm_active', role, orgId, limit, reason);
    refreshState();
  };

  const moderateContent = (itemId: string, status: 'Approved' | 'Rejected' | 'Archived' | 'Escalated', reason: string) => {
    serviceRef.current.moderateContent('adm_active', role, itemId, status, reason);
    refreshState();
  };

  const processWithdrawal = (reqId: string, status: 'Approved' | 'Rejected' | 'Hold' | 'Pending', reason: string) => {
    serviceRef.current.processWithdrawal('adm_active', role, reqId, status, reason);
    refreshState();
  };

  const resolveSecurityAlert = (alertId: string, status: 'Resolved' | 'Whitelisted', reason: string) => {
    serviceRef.current.resolveSecurityAlert('adm_active', role, alertId, status, reason);
    refreshState();
  };

  const launchBroadcast = (campaign: Omit<AdminNotificationCampaign, 'id' | 'sentCount'>) => {
    serviceRef.current.launchNotificationCampaign('adm_active', role, campaign);
    refreshState();
  };

  return (
    <AdminContext.Provider value={{
      role,
      setRole,
      stats,
      serviceHealth,
      liveEvents,
      users,
      organizations,
      moderationItems,
      securityAlerts,
      threatFeed,
      withdrawals,
      auditLogs,
      campaigns,
      pendingOfflineCount,
      isSyncing,
      syncOfflineData,
      
      suspendUser,
      unsuspendUser,
      banUser,
      adjustReputation,
      resetCredentials,
      
      suspendCompany,
      resumeCompany,
      freezeBilling,
      updateBudgetLimit,
      
      moderateContent,
      processWithdrawal,
      resolveSecurityAlert,
      launchBroadcast
    }}>
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
};
