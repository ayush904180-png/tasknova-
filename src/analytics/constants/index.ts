/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { DashboardWidget, GlobalFilters, AnalyticsRole } from '../types';

export const DEFAULT_FILTERS: GlobalFilters = {
  dateRange: {
    startDate: '2026-06-20',
    endDate: '2026-07-20'
  },
  country: 'ALL',
  language: 'ALL',
  campaign: 'ALL',
  business: 'ALL',
  contributor: 'ALL',
  validationStatus: 'ALL',
  rewardType: 'ALL',
  marketplace: 'ALL'
};

export const COUNTRIES = [
  { code: 'ALL', name: 'Global (All Countries)' },
  { code: 'US', name: 'United States' },
  { code: 'IN', name: 'India' },
  { code: 'DE', name: 'Germany' },
  { code: 'GB', name: 'United Kingdom' },
  { code: 'BR', name: 'Brazil' },
  { code: 'JP', name: 'Japan' }
];

export const LANGUAGES = [
  { code: 'ALL', name: 'All Languages' },
  { code: 'EN', name: 'English' },
  { code: 'ES', name: 'Spanish' },
  { code: 'HI', name: 'Hindi' },
  { code: 'DE', name: 'German' },
  { code: 'JA', name: 'Japanese' }
];

export const CAMPAIGNS = [
  { id: 'ALL', name: 'All Campaigns' },
  { id: 'cmp_chat_rlhf_v2', name: 'Chatbot Alignment RLHF v2' },
  { id: 'cmp_trans_de_en', name: 'DE-EN Technical Translation' },
  { id: 'cmp_img_tagging', name: 'B2B Vision Tagging Consensus' },
  { id: 'cmp_prompt_eval', name: 'Creative Prompt Scoring Model' }
];

export const BUSINESSES = [
  { id: 'ALL', name: 'All Enterprise Clients' },
  { id: 'org_google', name: 'Google Workspace Corp' },
  { id: 'org_stripe', name: 'Stripe Global Inc' },
  { id: 'org_openai', name: 'OpenAI Labs Corp' },
  { id: 'org_tesla', name: 'Tesla Autopilot Div' }
];

export const DEFAULT_WIDGETS: DashboardWidget[] = [
  { id: 'w_revenue_trend', title: 'Revenue Streams (SaaS + Metered)', type: 'area', category: 'revenue', size: 'lg', visible: true },
  { id: 'w_user_funnel', title: 'Registration & Onboarding Funnel', type: 'bar', category: 'users', size: 'md', visible: true },
  { id: 'w_tasks_volume', title: 'Task Execution Volume Rate', type: 'line', category: 'tasks', size: 'md', visible: true },
  { id: 'w_validation_acc', title: 'Validation Accuracy & AI/Human Split', type: 'donut', category: 'validation', size: 'sm', visible: true },
  { id: 'w_cloud_costs', title: 'Google Cloud Platform Metered Costs', type: 'bar', category: 'cloud', size: 'md', visible: true },
  { id: 'w_security_threats', title: 'Threat Vector Incidents Overview', type: 'radar', category: 'security', size: 'sm', visible: true }
];

// Rich, complex mock datasets for our charts
export const REVENUE_HISTORICAL_DATA = [
  { date: '2026-07-01', Subscription: 8200, Metered: 3500, EnterpriseSpend: 12000, BudgetBurn: 15000 },
  { date: '2026-07-02', Subscription: 8200, Metered: 3800, EnterpriseSpend: 14000, BudgetBurn: 13500 },
  { date: '2026-07-03', Subscription: 8400, Metered: 4100, EnterpriseSpend: 11000, BudgetBurn: 16200 },
  { date: '2026-07-04', Subscription: 8400, Metered: 2900, EnterpriseSpend: 9000, BudgetBurn: 12000 },
  { date: '2026-07-05', Subscription: 8400, Metered: 3100, EnterpriseSpend: 8500, BudgetBurn: 11000 },
  { date: '2026-07-06', Subscription: 8900, Metered: 4500, EnterpriseSpend: 16000, BudgetBurn: 18000 },
  { date: '2026-07-07', Subscription: 8900, Metered: 4900, EnterpriseSpend: 17500, BudgetBurn: 19500 },
  { date: '2026-07-08', Subscription: 8900, Metered: 4700, EnterpriseSpend: 15000, BudgetBurn: 17000 },
  { date: '2026-07-09', Subscription: 9100, Metered: 5100, EnterpriseSpend: 18000, BudgetBurn: 21000 },
  { date: '2026-07-10', Subscription: 9100, Metered: 5400, EnterpriseSpend: 19000, BudgetBurn: 22000 },
  { date: '2026-07-11', Subscription: 9100, Metered: 3600, EnterpriseSpend: 11000, BudgetBurn: 14000 },
  { date: '2026-07-12', Subscription: 9300, Metered: 3800, EnterpriseSpend: 10500, BudgetBurn: 13000 },
  { date: '2026-07-13', Subscription: 9600, Metered: 5800, EnterpriseSpend: 21000, BudgetBurn: 24500 },
  { date: '2026-07-14', Subscription: 9600, Metered: 6200, EnterpriseSpend: 23000, BudgetBurn: 26000 },
  { date: '2026-07-15', Subscription: 9600, Metered: 6000, EnterpriseSpend: 22000, BudgetBurn: 25000 },
  { date: '2026-07-16', Subscription: 10200, Metered: 6400, EnterpriseSpend: 24500, BudgetBurn: 28000 },
  { date: '2026-07-17', Subscription: 10200, Metered: 6800, EnterpriseSpend: 26000, BudgetBurn: 29500 },
  { date: '2026-07-18', Subscription: 10200, Metered: 4400, EnterpriseSpend: 13000, BudgetBurn: 16000 },
  { date: '2026-07-19', Subscription: 10500, Metered: 4700, EnterpriseSpend: 12500, BudgetBurn: 15500 },
  { date: '2026-07-20', Subscription: 10500, Metered: 7100, EnterpriseSpend: 28200, BudgetBurn: 32000 }
];

export const USER_FUNNEL_DATA = [
  { name: 'Ad Impression', value: 125000 },
  { name: 'Landing Visit', value: 85000 },
  { name: 'Signup Initiated', value: 34000 },
  { name: 'Email Verified', value: 28000 },
  { name: 'Onboarding Passed', value: 18230 },
  { name: 'First HIT Completed', value: 15400 },
  { name: 'First Payout Settled', value: 9200 }
];

export const USER_GEOGRAPHIC_DATA = [
  { name: 'United States', value: 5200, color: '#4f46e5' },
  { name: 'India', value: 6800, color: '#06b6d4' },
  { name: 'Germany', value: 2300, color: '#10b981' },
  { name: 'United Kingdom', value: 1800, color: '#f59e0b' },
  { name: 'Brazil', value: 1200, color: '#ec4899' },
  { name: 'Japan', value: 930, color: '#8b5cf6' }
];

export const USER_DEVICE_DATA = [
  { name: 'Desktop/Mac', value: 62 },
  { name: 'Mobile (Android)', value: 24 },
  { name: 'Mobile (iOS)', value: 12 },
  { name: 'Tablet/Others', value: 2 }
];

export const USER_BROWSER_DATA = [
  { name: 'Chrome', value: 68 },
  { name: 'Safari', value: 18 },
  { name: 'Firefox', value: 9 },
  { name: 'Edge/Others', value: 5 }
];

export const TASK_STATS_DATA = [
  { name: 'RLHF Align', Started: 14500, Completed: 13200, Approved: 12400, Rejected: 800 },
  { name: 'Semantic Tagging', Started: 25000, Completed: 24100, Approved: 22800, Rejected: 1300 },
  { name: 'Translation', Started: 8900, Completed: 8400, Approved: 7900, Rejected: 500 },
  { name: 'Prompt Score', Started: 12000, Completed: 11500, Approved: 10900, Rejected: 600 }
];

export const SECURITY_THREAT_RADAR_DATA = [
  { subject: 'Failed Logins', A: 120, B: 80, fullMark: 150 },
  { subject: 'Suspicious Devices', A: 45, B: 30, fullMark: 150 },
  { subject: 'VPN/Proxy Ingress', A: 98, B: 110, fullMark: 150 },
  { subject: 'Bot Detections', A: 140, B: 40, fullMark: 150 },
  { subject: 'Fraud Attempts', A: 15, B: 10, fullMark: 150 },
  { subject: 'Tamper Alerts', A: 5, B: 2, fullMark: 150 }
];

export const CLOUD_METRICS_HISTORY = [
  { date: '07-14', FirestoreReads: 850, FirestoreWrites: 240, Functions: 1400, StorageGb: 340 },
  { date: '07-15', FirestoreReads: 920, FirestoreWrites: 290, Functions: 1650, StorageGb: 345 },
  { date: '07-16', FirestoreReads: 1100, FirestoreWrites: 320, Functions: 1800, StorageGb: 350 },
  { date: '07-17', FirestoreReads: 1240, FirestoreWrites: 380, Functions: 2100, StorageGb: 358 },
  { date: '07-18', FirestoreReads: 950, FirestoreWrites: 210, Functions: 1500, StorageGb: 360 },
  { date: '07-19', FirestoreReads: 880, FirestoreWrites: 195, Functions: 1300, StorageGb: 362 },
  { date: '07-20', FirestoreReads: 1350, FirestoreWrites: 420, Functions: 2400, StorageGb: 370 }
];

export const LEADERBOARD_RANKING = [
  { rank: 1, name: 'rahul_sharma_99', xp: 24500, coins: 4890, trust: 99.8, country: 'IN' },
  { rank: 2, name: 'elizabeth_p', xp: 22800, coins: 3950, trust: 99.4, country: 'US' },
  { rank: 3, name: 'maximilian_d', xp: 21400, coins: 3420, trust: 98.9, country: 'DE' },
  { rank: 4, name: 'yuki_sato', xp: 19800, coins: 3100, trust: 99.2, country: 'JP' },
  { rank: 5, name: 'alessandro_r', xp: 18500, coins: 2850, trust: 97.5, country: 'IT' }
];

// RBAC Permissions Mapping Matrix for Analytics View Access
export const ROLE_ANALYTICS_PERMISSIONS: Record<AnalyticsRole, string[]> = {
  [AnalyticsRole.OWNER]: ['financial', 'users', 'tasks', 'validation', 'marketplace', 'billing', 'security', 'cloud', 'forecasting', 'custom_dashboard_builder'],
  [AnalyticsRole.SUPER_ADMIN]: ['financial', 'users', 'tasks', 'validation', 'marketplace', 'billing', 'security', 'cloud', 'forecasting', 'custom_dashboard_builder'],
  [AnalyticsRole.BUSINESS_ADMIN]: ['users', 'tasks', 'validation', 'marketplace', 'billing'],
  [AnalyticsRole.FINANCE]: ['financial', 'billing', 'marketplace'],
  [AnalyticsRole.MODERATOR]: ['validation', 'tasks', 'users'],
  [AnalyticsRole.DEVELOPER]: ['tasks', 'validation', 'cloud', 'security'],
  [AnalyticsRole.SUPPORT]: ['users', 'tasks', 'validation'],
  [AnalyticsRole.AUDITOR]: ['financial', 'users', 'tasks', 'validation', 'marketplace', 'billing', 'security', 'cloud'],
  [AnalyticsRole.READ_ONLY]: ['users', 'tasks', 'validation']
};
