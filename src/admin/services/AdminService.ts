/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { LocalAdminRepository, PlatformStats } from '../repositories/AdminRepository';
import {
  AdminRole,
  HealthStatus,
  ServiceHealth,
  AdminEventType,
  LiveEvent,
  AdminUser,
  AdminOrganization,
  ContentCategory,
  ModerationItem,
  SecurityAlert,
  ThreatFeedItem,
  WithdrawalRequest,
  AuditLog,
  AdminNotificationCampaign
} from '../types';

export class AdminService {
  private repository: LocalAdminRepository;

  constructor() {
    this.repository = new LocalAdminRepository();
  }

  // General Accessors
  public getStats(): PlatformStats {
    return this.repository.getStats();
  }

  public getServiceHealth(): ServiceHealth[] {
    return this.repository.getServiceHealth();
  }

  public getLiveEvents(): LiveEvent[] {
    return this.repository.getLiveEvents();
  }

  public getUsers(): AdminUser[] {
    return this.repository.getUsers();
  }

  public getOrganizations(): AdminOrganization[] {
    return this.repository.getOrganizations();
  }

  public getModerationItems(): ModerationItem[] {
    return this.repository.getModerationItems();
  }

  public getSecurityAlerts(): SecurityAlert[] {
    return this.repository.getSecurityAlerts();
  }

  public getThreatFeed(): ThreatFeedItem[] {
    return this.repository.getThreatFeed();
  }

  public getWithdrawals(): WithdrawalRequest[] {
    return this.repository.getWithdrawals();
  }

  public getAuditLogs(): AuditLog[] {
    return this.repository.getAuditLogs();
  }

  public getNotificationCampaigns(): AdminNotificationCampaign[] {
    return this.repository.getNotificationCampaigns();
  }

  public getPendingOfflineActionsCount(): number {
    return this.repository.getPendingOfflineActionsCount();
  }

  public async triggerSync(): Promise<boolean> {
    return this.repository.triggerSync();
  }

  // Operations and Auditing Wrapper
  private logAdminAction(adminId: string, role: AdminRole, action: string, target: string, reason: string) {
    this.repository.addAuditLog({
      adminId,
      adminRole: role,
      ip: '192.168.1.102', // Simulated current session
      device: 'Chrome v120 / Ubuntu 22.04',
      action,
      target,
      reason
    });
  }

  // --- USER CONTROLS ---
  public updateUserStatus(adminId: string, role: AdminRole, userId: string, status: 'Active' | 'Suspended' | 'Banned', reason: string) {
    const users = this.repository.getUsers();
    const user = users.find(u => u.id === userId);
    if (user) {
      user.status = status;
      this.repository.saveUser(user);
      this.logAdminAction(adminId, role, `${status} User`, user.username, reason);

      this.repository.addLiveEvent({
        type: AdminEventType.SECURITY_ALERT,
        severity: status === 'Active' ? 'success' : 'error',
        message: `Admin modified status of user ${user.username} to ${status}`,
        details: { userId, status, reason }
      });
    }
  }

  public resetUserReputation(adminId: string, role: AdminRole, userId: string, reputation: number, trustScore: number, reason: string) {
    const users = this.repository.getUsers();
    const user = users.find(u => u.id === userId);
    if (user) {
      user.reputation = reputation;
      user.trustScore = trustScore;
      this.repository.saveUser(user);
      this.logAdminAction(adminId, role, `Reset Trust & Reputation`, user.username, reason);
    }
  }

  public resetUserCredentials(adminId: string, role: AdminRole, userId: string, type: '2FA' | 'Password', reason: string) {
    const users = this.repository.getUsers();
    const user = users.find(u => u.id === userId);
    if (user) {
      if (type === '2FA') {
        user.mfaEnabled = false;
      }
      this.repository.saveUser(user);
      this.logAdminAction(adminId, role, `Reset Credentials (${type})`, user.username, reason);
    }
  }

  // --- BUSINESS CONTROLS ---
  public updateCompanyStatus(adminId: string, role: AdminRole, orgId: string, status: 'Active' | 'Suspended' | 'Billing_Frozen', reason: string) {
    const orgs = this.repository.getOrganizations();
    const org = orgs.find(o => o.id === orgId);
    if (org) {
      org.status = status;
      this.repository.saveOrganization(org);
      this.logAdminAction(adminId, role, `Modify Company Status (${status})`, org.name, reason);

      this.repository.addLiveEvent({
        type: AdminEventType.SECURITY_ALERT,
        severity: status === 'Active' ? 'success' : 'error',
        message: `Company ${org.name} status updated to ${status}`,
        details: { orgId, status, reason }
      });
    }
  }

  public updateCompanyBudget(adminId: string, role: AdminRole, orgId: string, limit: number, reason: string) {
    const orgs = this.repository.getOrganizations();
    const org = orgs.find(o => o.id === orgId);
    if (org) {
      const oldLimit = org.budgetLimit;
      org.budgetLimit = limit;
      this.repository.saveOrganization(org);
      this.logAdminAction(adminId, role, `Update Budget Limit`, org.name, `Budget updated from $${oldLimit} to $${limit}. Reason: ${reason}`);
    }
  }

  // --- MODERATION ACTIONS ---
  public moderateContent(adminId: string, role: AdminRole, itemId: string, status: 'Approved' | 'Rejected' | 'Archived' | 'Escalated', reason: string) {
    const items = this.repository.getModerationItems();
    const item = items.find(i => i.id === itemId);
    if (item) {
      item.status = status;
      this.repository.saveModerationItem(item);
      this.logAdminAction(adminId, role, `Moderate ${item.category}`, item.title, `Result: ${status}. Reason: ${reason}`);

      const eventSeverityMap = {
        Approved: 'success' as const,
        Rejected: 'error' as const,
        Archived: 'info' as const,
        Escalated: 'warning' as const
      };

      this.repository.addLiveEvent({
        type: AdminEventType.VALIDATION_COMPLETED,
        severity: eventSeverityMap[status],
        message: `Moderation queue evaluated ${item.category}: status set to ${status}`,
        details: { itemId, status, category: item.category }
      });
    }
  }

  // --- WITHDRAWAL SETTLEMENTS ---
  public processWithdrawal(adminId: string, role: AdminRole, reqId: string, status: 'Approved' | 'Rejected' | 'Hold' | 'Pending', reason: string) {
    const reqs = this.repository.getWithdrawals();
    const req = reqs.find(r => r.id === reqId);
    if (req) {
      req.status = status;
      req.auditTrail.push(`[${new Date().toISOString()}] Status updated to ${status} by admin ${adminId}. Reason: ${reason}`);
      this.repository.saveWithdrawal(req);
      this.logAdminAction(adminId, role, `Settle Payout (${status})`, req.username, `Amount: $${req.amount}. Reason: ${reason}`);

      this.repository.addLiveEvent({
        type: AdminEventType.WALLET_UPDATED,
        severity: status === 'Approved' ? 'success' : status === 'Rejected' ? 'error' : 'warning',
        message: `Payout request for ${req.username} set to ${status}`,
        details: { reqId, amount: req.amount, channel: req.channel }
      });
    }
  }

  // --- SECURITY INCIDENTS ---
  public resolveSecurityAlert(adminId: string, role: AdminRole, alertId: string, status: 'Resolved' | 'Whitelisted', reason: string) {
    const alerts = this.repository.getSecurityAlerts();
    const alert = alerts.find(a => a.id === alertId);
    if (alert) {
      alert.status = status;
      this.repository.saveSecurityAlert(alert);
      this.logAdminAction(adminId, role, `Resolve Security Threat`, alert.category, `Resolved as ${status}. Reason: ${reason}`);
    }
  }

  // --- BROADCAST NOTIFICATION ---
  public launchNotificationCampaign(adminId: string, role: AdminRole, campaign: Omit<AdminNotificationCampaign, 'id' | 'sentCount'>) {
    const id = 'not_c_' + Math.floor(Math.random() * 100000);
    const sentCount = campaign.status === 'Sent' ? Math.floor(Math.random() * 800) + 100 : 0;
    const newCamp: AdminNotificationCampaign = {
      ...campaign,
      id,
      sentCount
    };
    this.repository.saveNotificationCampaign(newCamp);
    this.logAdminAction(adminId, role, `Launch Broadcast Campaign`, campaign.title, `Channels: ${campaign.channels.join(', ')}`);

    if (campaign.status === 'Sent') {
      this.repository.addLiveEvent({
        type: AdminEventType.REWARD_GRANTED, // Using as broadcast placeholder
        severity: 'success',
        message: `Broadcast Campaign "${campaign.title}" successfully dispatched to target pool.`,
        details: { campaignId: id, sentCount }
      });
    }
  }

  // --- EVENT SIMULATOR (DASHBOARD REALISM) ---
  public simulateRandomTelemetryEvent() {
    const eventTypes = [
      { type: AdminEventType.USER_REGISTERED, severity: 'success' as const, message: 'New contributor registered: user_', prefix: 'usr_' },
      { type: AdminEventType.TASK_CREATED, severity: 'info' as const, message: 'Task task_ published to sandbox environment', prefix: 'tsk_' },
      { type: AdminEventType.SUBMISSION_RECEIVED, severity: 'info' as const, message: 'User completed training microtask submission: ', prefix: 'sub_' },
      { type: AdminEventType.VALIDATION_COMPLETED, severity: 'success' as const, message: 'Automated Gemini AI alignment validation passed for ', prefix: 'val_' },
      { type: AdminEventType.INVOICE_PAID, severity: 'success' as const, message: 'SaaS Invoice payment received from company: ', prefix: 'inv_' }
    ];

    const random = eventTypes[Math.floor(Math.random() * eventTypes.length)];
    const randomId = Math.floor(Math.random() * 9000) + 1000;
    const mockDetails: Record<string, any> = {};

    let text = random.message;
    if (random.type === AdminEventType.USER_REGISTERED) {
      text += `anon_${randomId}`;
      mockDetails.username = `anon_${randomId}`;
    } else if (random.type === AdminEventType.INVOICE_PAID) {
      const cos = ['Acme Robotics', 'Cyberdyne Inc', 'Weyland-Yutani', 'Tyrell Corp'];
      const chosen = cos[Math.floor(Math.random() * cos.length)];
      text += chosen;
      mockDetails.company = chosen;
      mockDetails.amount = Math.floor(Math.random() * 450) + 50;
    } else {
      text += `${random.prefix}${randomId}`;
      mockDetails.id = `${random.prefix}${randomId}`;
    }

    this.repository.addLiveEvent({
      type: random.type,
      severity: random.severity,
      message: text,
      details: mockDetails
    });
  }
}
