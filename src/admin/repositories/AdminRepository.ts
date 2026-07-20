/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

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

export interface PlatformStats {
  platformHealth: number;
  onlineUsers: number;
  offlineUsers: number;
  tasksRunning: number;
  tasksWaiting: number;
  tasksFailed: number;
  revenueToday: number;
  revenueThisMonth: number;
  pendingWithdrawals: number;
  pendingReviews: number;
  validationQueue: number;
  businessClients: number;
  enterpriseCustomers: number;
  datasets: number;
  storageUsedGb: number;
  firestoreReads: number;
  firestoreWrites: number;
  cloudStorageUsageGb: number;
  cloudFunctionCalls: number;
  averageApiLatencyMs: number;
  averageTaskTimeMin: number;
  averageValidationTimeSec: number;
  systemErrorRatePercent: number;
  successRatePercent: number;
  cpuUsagePercent: number;
  ramUsagePercent: number;
  bandwidthUsageGb: number;
}

export interface IAdminRepository {
  getStats(): PlatformStats;
  getServiceHealth(): ServiceHealth[];
  getLiveEvents(): LiveEvent[];
  addLiveEvent(event: Omit<LiveEvent, 'id' | 'timestamp'>): void;
  getUsers(): AdminUser[];
  saveUser(user: AdminUser): void;
  getOrganizations(): AdminOrganization[];
  saveOrganization(org: AdminOrganization): void;
  getModerationItems(): ModerationItem[];
  saveModerationItem(item: ModerationItem): void;
  getSecurityAlerts(): SecurityAlert[];
  saveSecurityAlert(alert: SecurityAlert): void;
  getThreatFeed(): ThreatFeedItem[];
  getWithdrawals(): WithdrawalRequest[];
  saveWithdrawal(req: WithdrawalRequest): void;
  getAuditLogs(): AuditLog[];
  addAuditLog(log: Omit<AuditLog, 'id' | 'timestamp' | 'hash'>): void;
  getNotificationCampaigns(): AdminNotificationCampaign[];
  saveNotificationCampaign(camp: AdminNotificationCampaign): void;
  triggerSync(): Promise<boolean>;
  getPendingOfflineActionsCount(): number;
}

export class LocalAdminRepository implements IAdminRepository {
  private static STORAGE_KEYS = {
    STATS: 'tasknova_admin_stats',
    HEALTH: 'tasknova_admin_health',
    EVENTS: 'tasknova_admin_events',
    USERS: 'tasknova_admin_users',
    ORGS: 'tasknova_admin_orgs',
    MODERATION: 'tasknova_admin_moderation',
    SECURITY: 'tasknova_admin_security',
    THREATS: 'tasknova_admin_threats',
    WITHDRAWALS: 'tasknova_admin_withdrawals',
    AUDIT: 'tasknova_admin_audit',
    CAMPAIGNS: 'tasknova_admin_campaigns',
    OFFLINE_QUEUE: 'tasknova_admin_offline_queue'
  };

  constructor() {
    this.initializeDefaultData();
  }

  private initializeDefaultData() {
    // 1. Stats
    if (!localStorage.getItem(LocalAdminRepository.STORAGE_KEYS.STATS)) {
      const stats: PlatformStats = {
        platformHealth: 99.8,
        onlineUsers: 1424,
        offlineUsers: 18230,
        tasksRunning: 120,
        tasksWaiting: 450,
        tasksFailed: 8,
        revenueToday: 12500,
        revenueThisMonth: 382000,
        pendingWithdrawals: 14,
        pendingReviews: 45,
        validationQueue: 28,
        businessClients: 52,
        enterpriseCustomers: 18,
        datasets: 114,
        storageUsedGb: 812.4,
        firestoreReads: 148200,
        firestoreWrites: 32400,
        cloudStorageUsageGb: 1250,
        cloudFunctionCalls: 98400,
        averageApiLatencyMs: 42,
        averageTaskTimeMin: 14.5,
        averageValidationTimeSec: 8.2,
        systemErrorRatePercent: 0.04,
        successRatePercent: 99.96,
        cpuUsagePercent: 34,
        ramUsagePercent: 58,
        bandwidthUsageGb: 412.5
      };
      localStorage.setItem(LocalAdminRepository.STORAGE_KEYS.STATS, JSON.stringify(stats));
    }

    // 2. Service Health
    if (!localStorage.getItem(LocalAdminRepository.STORAGE_KEYS.HEALTH)) {
      const health: ServiceHealth[] = [
        { name: 'Database (Cloud SQL)', status: HealthStatus.HEALTHY, latencyMs: 4, uptimePercent: 99.99, lastChecked: new Date().toISOString() },
        { name: 'Storage (Cloud Storage)', status: HealthStatus.HEALTHY, latencyMs: 12, uptimePercent: 100, lastChecked: new Date().toISOString() },
        { name: 'Functions (Cloud Functions)', status: HealthStatus.HEALTHY, latencyMs: 85, uptimePercent: 99.95, lastChecked: new Date().toISOString() },
        { name: 'Google Sheets API', status: HealthStatus.HEALTHY, latencyMs: 140, uptimePercent: 99.8, lastChecked: new Date().toISOString() },
        { name: 'Google Drive API', status: HealthStatus.HEALTHY, latencyMs: 185, uptimePercent: 99.75, lastChecked: new Date().toISOString() },
        { name: 'BigQuery Analytics', status: HealthStatus.HEALTHY, latencyMs: 25, uptimePercent: 99.99, lastChecked: new Date().toISOString() },
        { name: 'Cloud Scheduler', status: HealthStatus.HEALTHY, latencyMs: 5, uptimePercent: 100, lastChecked: new Date().toISOString() },
        { name: 'Cloud Tasks Queue', status: HealthStatus.HEALTHY, latencyMs: 8, uptimePercent: 99.98, lastChecked: new Date().toISOString() },
        { name: 'Pub/Sub Event Bus', status: HealthStatus.HEALTHY, latencyMs: 3, uptimePercent: 100, lastChecked: new Date().toISOString() },
        { name: 'Authentication Service', status: HealthStatus.HEALTHY, latencyMs: 6, uptimePercent: 99.99, lastChecked: new Date().toISOString() }
      ];
      localStorage.setItem(LocalAdminRepository.STORAGE_KEYS.HEALTH, JSON.stringify(health));
    }

    // 3. Live Events
    if (!localStorage.getItem(LocalAdminRepository.STORAGE_KEYS.EVENTS)) {
      const events: LiveEvent[] = [
        { id: 'evt_1', type: AdminEventType.ADMIN_LOGIN, timestamp: new Date(Date.now() - 1000 * 60).toISOString(), severity: 'success', message: 'Admin login succeeded for root@tasknova.ai', details: { ip: '192.168.1.100', role: 'Owner' } },
        { id: 'evt_2', type: AdminEventType.SECURITY_ALERT, timestamp: new Date(Date.now() - 1000 * 180).toISOString(), severity: 'warning', message: 'Suspicious credential verification spike on IP 45.12.33.2', details: { count: 12, category: 'Velocity Spike' } },
        { id: 'evt_3', type: AdminEventType.WITHDRAWAL_REQUESTED, timestamp: new Date(Date.now() - 1000 * 300).toISOString(), severity: 'info', message: 'User contributor_zeta requested UPI payout of $150.00', details: { upiId: 'zeta@ybl', amount: 150 } },
        { id: 'evt_4', type: AdminEventType.BUSINESS_CAMPAIGN_CREATED, timestamp: new Date(Date.now() - 1000 * 600).toISOString(), severity: 'success', message: 'Organization Acme Corp created campaign "Autonomous Vehicle RLHF v4"', details: { orgId: 'org_acme', tasks: 1200 } },
        { id: 'evt_5', type: AdminEventType.VALIDATION_COMPLETED, timestamp: new Date(Date.now() - 1000 * 900).toISOString(), severity: 'success', message: 'Task task_772 validated successfully using server-side Gemini 1.5 LLM model', details: { taskId: 'task_772', status: 'Passed' } },
        { id: 'evt_6', type: AdminEventType.SYSTEM_ERROR, timestamp: new Date(Date.now() - 1000 * 1200).toISOString(), severity: 'error', message: 'Google Sheets sync delay warning (Latency 4800ms)', details: { latency: 4800, target: 'Spreadsheet_ID_9901' } }
      ];
      localStorage.setItem(LocalAdminRepository.STORAGE_KEYS.EVENTS, JSON.stringify(events));
    }

    // 4. Users
    if (!localStorage.getItem(LocalAdminRepository.STORAGE_KEYS.USERS)) {
      const users: AdminUser[] = [
        {
          id: 'usr_cont_01',
          username: 'contributor_zeta',
          email: 'zeta@tasknova.io',
          role: 'contributor',
          status: 'Active',
          trustScore: 94.5,
          reputation: 1250,
          joinedAt: '2026-01-10T12:00:00Z',
          mfaEnabled: true,
          sessions: [
            { id: 'sess_01', ip: '103.45.12.11', device: 'Chrome / macOS 14.2', lastActive: new Date().toISOString() },
            { id: 'sess_02', ip: '103.45.12.12', device: 'Safari / iOS 17.1', lastActive: new Date(Date.now() - 1000 * 3600 * 12).toISOString() }
          ],
          walletBalance: 245.50,
          rewardsEarned: 1840.00,
          validationHistory: [
            { taskId: 'task_01', result: 'Approved', date: '2026-07-15' },
            { taskId: 'task_02', result: 'Approved', date: '2026-07-16' },
            { taskId: 'task_03', result: 'Rejected', date: '2026-07-18' }
          ],
          marketplaceHistory: [
            { listingId: 'list_101', type: 'Reservation', date: '2026-07-19' }
          ],
          billingDetails: [],
          campaignsList: []
        },
        {
          id: 'usr_creator_01',
          username: 'creator_acme',
          email: 'creator@acme.robotics',
          role: 'creator',
          status: 'Active',
          trustScore: 98.0,
          reputation: 4500,
          joinedAt: '2026-02-15T09:30:00Z',
          mfaEnabled: true,
          sessions: [
            { id: 'sess_03', ip: '182.112.44.90', device: 'Firefox / Ubuntu 22.04', lastActive: new Date().toISOString() }
          ],
          walletBalance: 12500.00,
          rewardsEarned: 0,
          validationHistory: [],
          marketplaceHistory: [],
          billingDetails: [
            { invoiceId: 'inv_2001', amount: 450.00, status: 'Paid', date: '2026-06-01' },
            { invoiceId: 'inv_2002', amount: 450.00, status: 'Paid', date: '2026-07-01' }
          ],
          campaignsList: ['Autonomous Navigation RLHF', 'Speech Synthesis Evaluation']
        },
        {
          id: 'usr_cont_02',
          username: 'spammer_99',
          email: 'spam99@tempmail.com',
          role: 'contributor',
          status: 'Suspended',
          trustScore: 12.0,
          reputation: 5,
          joinedAt: '2026-07-01T23:10:00Z',
          mfaEnabled: false,
          sessions: [
            { id: 'sess_04', ip: '45.12.33.2', device: 'Puppeteer / Linux Server', lastActive: new Date(Date.now() - 1000 * 3600 * 3).toISOString() }
          ],
          walletBalance: 1.50,
          rewardsEarned: 1.50,
          validationHistory: [
            { taskId: 'task_04', result: 'Rejected', date: '2026-07-02' },
            { taskId: 'task_05', result: 'Rejected', date: '2026-07-03' }
          ],
          marketplaceHistory: [],
          billingDetails: [],
          campaignsList: []
        }
      ];
      localStorage.setItem(LocalAdminRepository.STORAGE_KEYS.USERS, JSON.stringify(users));
    }

    // 5. Organizations
    if (!localStorage.getItem(LocalAdminRepository.STORAGE_KEYS.ORGS)) {
      const orgs: AdminOrganization[] = [
        {
          id: 'org_acme',
          name: 'Acme Robotics Corp',
          domain: 'acme.robotics',
          status: 'Active',
          budgetLimit: 50000.00,
          budgetSpent: 12450.00,
          campaignsCount: 4,
          datasetsCount: 12,
          apiCallsCount: 42500,
          invoices: [
            { id: 'inv_ac_1', invoiceNo: 'INV-ACME-01', amount: 4200, status: 'Paid', date: '2026-06-30' },
            { id: 'inv_ac_2', invoiceNo: 'INV-ACME-02', amount: 8250, status: 'Paid', date: '2026-07-15' }
          ]
        },
        {
          id: 'org_cyberdyne',
          name: 'Cyberdyne Systems',
          domain: 'cyberdyne.jp',
          status: 'Active',
          budgetLimit: 120000.00,
          budgetSpent: 85000.00,
          campaignsCount: 8,
          datasetsCount: 24,
          apiCallsCount: 185000,
          invoices: [
            { id: 'inv_cy_1', invoiceNo: 'INV-CY-01', amount: 45000, status: 'Paid', date: '2026-06-15' },
            { id: 'inv_cy_2', invoiceNo: 'INV-CY-02', amount: 40000, status: 'Pending', date: '2026-07-18' }
          ]
        },
        {
          id: 'org_shady',
          name: 'Shady Web Scraping Co',
          domain: 'shady-scrap.net',
          status: 'Suspended',
          budgetLimit: 500.00,
          budgetSpent: 480.00,
          campaignsCount: 1,
          datasetsCount: 1,
          apiCallsCount: 1200,
          invoices: [
            { id: 'inv_sh_1', invoiceNo: 'INV-SHADY-01', amount: 480, status: 'Overdue', date: '2026-05-01' }
          ]
        }
      ];
      localStorage.setItem(LocalAdminRepository.STORAGE_KEYS.ORGS, JSON.stringify(orgs));
    }

    // 6. Moderation Items
    if (!localStorage.getItem(LocalAdminRepository.STORAGE_KEYS.MODERATION)) {
      const items: ModerationItem[] = [
        {
          id: 'mod_task_01',
          category: ContentCategory.TASK,
          title: 'Translate extreme slang corpus to German',
          ownerId: 'usr_creator_01',
          ownerName: 'creator_acme',
          submittedAt: new Date(Date.now() - 1000 * 3600 * 2).toISOString(),
          status: 'Pending',
          textContent: 'Input prompts contain raw vernacular terms, looking for semantic equivalence in German dialect without standard dictionary sanitization. Reward: 45 coins.',
          riskScore: 24
        },
        {
          id: 'mod_image_02',
          category: ContentCategory.IMAGE,
          title: 'Adversarial Image Tagging Set',
          ownerId: 'usr_creator_01',
          ownerName: 'creator_acme',
          submittedAt: new Date(Date.now() - 1000 * 3600 * 5).toISOString(),
          status: 'Pending',
          mediaUrl: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?q=80&w=300&auto=format&fit=crop',
          riskScore: 68
        },
        {
          id: 'mod_review_03',
          category: ContentCategory.REVIEW,
          title: 'User Review on Task_41',
          ownerId: 'usr_cont_02',
          ownerName: 'spammer_99',
          submittedAt: new Date(Date.now() - 1000 * 3600 * 24).toISOString(),
          status: 'Escalated',
          textContent: 'THIS PLATFORM IS FRAUD. COINS ARE WORTHLESS. BUY SHYBA-DOGE CRYPTO COIN INSTEAD, GO TO T.ME/SCAM_COIN NOW!',
          riskScore: 98
        }
      ];
      localStorage.setItem(LocalAdminRepository.STORAGE_KEYS.MODERATION, JSON.stringify(items));
    }

    // 7. Security Alerts
    if (!localStorage.getItem(LocalAdminRepository.STORAGE_KEYS.SECURITY)) {
      const alerts: SecurityAlert[] = [
        { id: 'sec_1', category: 'Failed_Login', timestamp: new Date(Date.now() - 1000 * 600).toISOString(), ip: '185.220.101.44', username: 'admin', riskScore: 85, details: '14 rapid authentication requests targeting admin endpoints via TOR exit node.', status: 'Unresolved' },
        { id: 'sec_2', category: 'Bot', timestamp: new Date(Date.now() - 1000 * 1800).toISOString(), ip: '45.12.33.2', username: 'spammer_99', riskScore: 92, details: 'Consistent 50ms submit-task latency. Automated script signature matching Chrome Headless headless mode.', status: 'Investigating' },
        { id: 'sec_3', category: 'Tamper', timestamp: new Date(Date.now() - 1000 * 3600 * 2).toISOString(), ip: '103.45.12.11', username: 'contributor_zeta', riskScore: 40, details: 'Client-side ledger post parameter "rewardEarned" set to 5000 in local memory, rejected by Server validation signature.', status: 'Resolved' }
      ];
      localStorage.setItem(LocalAdminRepository.STORAGE_KEYS.SECURITY, JSON.stringify(alerts));
    }

    // 8. Threats Feed
    if (!localStorage.getItem(LocalAdminRepository.STORAGE_KEYS.THREATS)) {
      const threats: ThreatFeedItem[] = [
        { id: 'thr_1', timestamp: new Date(Date.now() - 1000 * 30).toISOString(), vector: 'SQL Injection attempt on API v2', ip: '190.22.44.11', country: 'RU', actionTaken: 'IP Cloudflare Block' },
        { id: 'thr_2', timestamp: new Date(Date.now() - 1000 * 120).toISOString(), vector: 'Distributed SSH brute-forcing', ip: '80.44.92.5', country: 'CN', actionTaken: 'Fail2ban Port Block' },
        { id: 'thr_3', timestamp: new Date(Date.now() - 1000 * 300).toISOString(), vector: 'API Rate limit overflow (300 req/sec)', ip: '198.51.100.42', country: 'US', actionTaken: 'Temporary Rate Limit Throttle' }
      ];
      localStorage.setItem(LocalAdminRepository.STORAGE_KEYS.THREATS, JSON.stringify(threats));
    }

    // 9. Withdrawals
    if (!localStorage.getItem(LocalAdminRepository.STORAGE_KEYS.WITHDRAWALS)) {
      const withdrawals: WithdrawalRequest[] = [
        {
          id: 'wth_01',
          userId: 'usr_cont_01',
          username: 'contributor_zeta',
          amount: 150.00,
          channel: 'UPI',
          details: { upiId: 'zeta@oksbi' },
          status: 'Pending',
          requestDate: new Date(Date.now() - 1000 * 3600 * 4).toISOString(),
          auditTrail: ['Request generated by Contributor Wallet', 'Velocity check: PASSED', 'Reputation alignment check: PASSED']
        },
        {
          id: 'wth_02',
          userId: 'usr_cont_03',
          username: 'annotator_delta',
          amount: 420.00,
          channel: 'Bank',
          details: { accountNo: '44550091234', bankName: 'Federal Trust India' },
          status: 'Hold',
          requestDate: new Date(Date.now() - 1000 * 3600 * 24).toISOString(),
          auditTrail: ['Request generated', 'Held automatically: High value transaction trigger (> $400.00)']
        },
        {
          id: 'wth_03',
          userId: 'usr_cont_02',
          username: 'spammer_99',
          amount: 85.00,
          channel: 'International',
          details: { iban: 'CH780009912', swiftCode: 'BARCHCHXXX' },
          status: 'Rejected',
          requestDate: new Date(Date.now() - 1000 * 3600 * 48).toISOString(),
          auditTrail: ['Request generated', 'Held: Flagged user account status', 'Rejected by moderator: account suspended for automated bot activities']
        }
      ];
      localStorage.setItem(LocalAdminRepository.STORAGE_KEYS.WITHDRAWALS, JSON.stringify(withdrawals));
    }

    // 10. Audit Logs
    if (!localStorage.getItem(LocalAdminRepository.STORAGE_KEYS.AUDIT)) {
      const audits: AuditLog[] = [
        {
          id: 'aud_1',
          adminId: 'adm_01',
          adminRole: AdminRole.OWNER,
          timestamp: new Date(Date.now() - 1000 * 3600 * 12).toISOString(),
          ip: '192.168.1.100',
          device: 'Chrome v120 / macOS 14.2',
          action: 'Ban User',
          target: 'spammer_99',
          reason: 'Consistently failing validation checks and running automated scrapers',
          hash: '6a4fb9b2ec72cf93b821731671239841029412bf231c'
        }
      ];
      localStorage.setItem(LocalAdminRepository.STORAGE_KEYS.AUDIT, JSON.stringify(audits));
    }

    // 11. Notification Campaigns
    if (!localStorage.getItem(LocalAdminRepository.STORAGE_KEYS.CAMPAIGNS)) {
      const notificationCampaigns: AdminNotificationCampaign[] = [
        {
          id: 'not_c_1',
          title: 'Tax Compliance Update',
          channels: ['Email', 'In-App'],
          targets: { roles: ['creator'], countries: ['IN'], languages: ['EN'] },
          status: 'Draft',
          templateName: 'creator_gst_invoice_notice',
          sentCount: 0
        },
        {
          id: 'not_c_2',
          title: 'Urgent Maintenance Shutdown',
          channels: ['Email', 'Push', 'In-App'],
          targets: { roles: ['contributor', 'creator'], countries: ['ALL'], languages: ['ALL'] },
          scheduledTime: new Date(Date.now() + 1000 * 3600 * 24).toISOString(),
          status: 'Scheduled',
          templateName: 'platform_maintenance_alert',
          sentCount: 0
        }
      ];
      localStorage.setItem(LocalAdminRepository.STORAGE_KEYS.CAMPAIGNS, JSON.stringify(notificationCampaigns));
    }

    // 12. Offline sync queue
    if (!localStorage.getItem(LocalAdminRepository.STORAGE_KEYS.OFFLINE_QUEUE)) {
      localStorage.setItem(LocalAdminRepository.STORAGE_KEYS.OFFLINE_QUEUE, JSON.stringify([]));
    }
  }

  // -------------------------------------------------------------
  // REPOSITORY METHODS (CRUD WITH OFFLINE RETRY LAYER)
  // -------------------------------------------------------------

  private getFromStore<T>(key: string): T {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : ([] as unknown as T);
  }

  private saveToStore<T>(key: string, data: T) {
    localStorage.setItem(key, JSON.stringify(data));
    this.enqueueOfflineSync(key);
  }

  private enqueueOfflineSync(storeKey: string) {
    const queue = this.getFromStore<string[]>(LocalAdminRepository.STORAGE_KEYS.OFFLINE_QUEUE);
    if (!queue.includes(storeKey)) {
      queue.push(storeKey);
      localStorage.setItem(LocalAdminRepository.STORAGE_KEYS.OFFLINE_QUEUE, JSON.stringify(queue));
    }
  }

  public getStats(): PlatformStats {
    return this.getFromStore<PlatformStats>(LocalAdminRepository.STORAGE_KEYS.STATS);
  }

  public getServiceHealth(): ServiceHealth[] {
    return this.getFromStore<ServiceHealth[]>(LocalAdminRepository.STORAGE_KEYS.HEALTH);
  }

  public getLiveEvents(): LiveEvent[] {
    return this.getFromStore<LiveEvent[]>(LocalAdminRepository.STORAGE_KEYS.EVENTS);
  }

  public addLiveEvent(event: Omit<LiveEvent, 'id' | 'timestamp'>) {
    const events = this.getLiveEvents();
    const newEvent: LiveEvent = {
      ...event,
      id: 'evt_' + Math.floor(Math.random() * 1000000),
      timestamp: new Date().toISOString()
    };
    events.unshift(newEvent);
    // Keep last 100 events
    if (events.length > 100) events.pop();
    this.saveToStore(LocalAdminRepository.STORAGE_KEYS.EVENTS, events);
  }

  public getUsers(): AdminUser[] {
    return this.getFromStore<AdminUser[]>(LocalAdminRepository.STORAGE_KEYS.USERS);
  }

  public saveUser(user: AdminUser) {
    const users = this.getUsers();
    const idx = users.findIndex(u => u.id === user.id);
    if (idx !== -1) {
      users[idx] = user;
    } else {
      users.push(user);
    }
    this.saveToStore(LocalAdminRepository.STORAGE_KEYS.USERS, users);
  }

  public getOrganizations(): AdminOrganization[] {
    return this.getFromStore<AdminOrganization[]>(LocalAdminRepository.STORAGE_KEYS.ORGS);
  }

  public saveOrganization(org: AdminOrganization) {
    const orgs = this.getOrganizations();
    const idx = orgs.findIndex(o => o.id === org.id);
    if (idx !== -1) {
      orgs[idx] = org;
    } else {
      orgs.push(org);
    }
    this.saveToStore(LocalAdminRepository.STORAGE_KEYS.ORGS, orgs);
  }

  public getModerationItems(): ModerationItem[] {
    return this.getFromStore<ModerationItem[]>(LocalAdminRepository.STORAGE_KEYS.MODERATION);
  }

  public saveModerationItem(item: ModerationItem) {
    const items = this.getModerationItems();
    const idx = items.findIndex(i => i.id === item.id);
    if (idx !== -1) {
      items[idx] = item;
    } else {
      items.push(item);
    }
    this.saveToStore(LocalAdminRepository.STORAGE_KEYS.MODERATION, items);
  }

  public getSecurityAlerts(): SecurityAlert[] {
    return this.getFromStore<SecurityAlert[]>(LocalAdminRepository.STORAGE_KEYS.SECURITY);
  }

  public saveSecurityAlert(alert: SecurityAlert) {
    const alerts = this.getSecurityAlerts();
    const idx = alerts.findIndex(a => a.id === alert.id);
    if (idx !== -1) {
      alerts[idx] = alert;
    } else {
      alerts.push(alert);
    }
    this.saveToStore(LocalAdminRepository.STORAGE_KEYS.SECURITY, alerts);
  }

  public getThreatFeed(): ThreatFeedItem[] {
    return this.getFromStore<ThreatFeedItem[]>(LocalAdminRepository.STORAGE_KEYS.THREATS);
  }

  public getWithdrawals(): WithdrawalRequest[] {
    return this.getFromStore<WithdrawalRequest[]>(LocalAdminRepository.STORAGE_KEYS.WITHDRAWALS);
  }

  public saveWithdrawal(req: WithdrawalRequest) {
    const withdrawals = this.getWithdrawals();
    const idx = withdrawals.findIndex(w => w.id === req.id);
    if (idx !== -1) {
      withdrawals[idx] = req;
    } else {
      withdrawals.push(req);
    }
    this.saveToStore(LocalAdminRepository.STORAGE_KEYS.WITHDRAWALS, withdrawals);
  }

  public getAuditLogs(): AuditLog[] {
    return this.getFromStore<AuditLog[]>(LocalAdminRepository.STORAGE_KEYS.AUDIT);
  }

  public addAuditLog(log: Omit<AuditLog, 'id' | 'timestamp' | 'hash'>) {
    const logs = this.getAuditLogs();
    const id = 'aud_' + Math.floor(Math.random() * 1000000);
    const timestamp = new Date().toISOString();
    // Simulate SHA-1 immutable hash generator
    const hash = Array.from({ length: 40 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
    const newLog: AuditLog = {
      ...log,
      id,
      timestamp,
      hash
    };
    logs.unshift(newLog);
    this.saveToStore(LocalAdminRepository.STORAGE_KEYS.AUDIT, logs);
  }

  public getNotificationCampaigns(): AdminNotificationCampaign[] {
    return this.getFromStore<AdminNotificationCampaign[]>(LocalAdminRepository.STORAGE_KEYS.CAMPAIGNS);
  }

  public saveNotificationCampaign(camp: AdminNotificationCampaign) {
    const campaigns = this.getNotificationCampaigns();
    const idx = campaigns.findIndex(c => c.id === camp.id);
    if (idx !== -1) {
      campaigns[idx] = camp;
    } else {
      campaigns.push(camp);
    }
    this.saveToStore(LocalAdminRepository.STORAGE_KEYS.CAMPAIGNS, campaigns);
  }

  public getPendingOfflineActionsCount(): number {
    const queue = this.getFromStore<string[]>(LocalAdminRepository.STORAGE_KEYS.OFFLINE_QUEUE);
    return queue.length;
  }

  public async triggerSync(): Promise<boolean> {
    const queue = this.getFromStore<string[]>(LocalAdminRepository.STORAGE_KEYS.OFFLINE_QUEUE);
    if (queue.length === 0) return true;

    // Simulate Network Latency
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Clear the sync queue, assuming Google Cloud Firestore synced successfully
    localStorage.setItem(LocalAdminRepository.STORAGE_KEYS.OFFLINE_QUEUE, JSON.stringify([]));
    return true;
  }
}
