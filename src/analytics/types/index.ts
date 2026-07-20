/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export enum AnalyticsRole {
  OWNER = 'Owner',
  SUPER_ADMIN = 'Super Admin',
  BUSINESS_ADMIN = 'Business Admin',
  FINANCE = 'Finance',
  MODERATOR = 'Moderator',
  DEVELOPER = 'Developer',
  SUPPORT = 'Support',
  AUDITOR = 'Auditor',
  READ_ONLY = 'Read Only'
}

export interface DateRange {
  startDate: string;
  endDate: string;
}

export interface GlobalFilters {
  dateRange: DateRange;
  country: string;
  language: string;
  campaign: string;
  business: string;
  contributor: string;
  validationStatus: string;
  rewardType: string;
  marketplace: string;
}

export interface KPICardData {
  id: string;
  title: string;
  value: string | number;
  change: number; // percentage change
  trend: 'up' | 'down' | 'neutral';
  category: 'financial' | 'users' | 'tasks' | 'validation' | 'cloud' | 'security';
  description: string;
  history: number[];
}

export interface ChartDataPoint {
  name: string;
  [key: string]: string | number;
}

export interface ForecastDataPoint {
  date: string;
  historical?: number;
  projected?: number;
  lowerBound?: number;
  upperBound?: number;
}

export interface DashboardWidget {
  id: string;
  title: string;
  type: 'kpi' | 'line' | 'bar' | 'area' | 'donut' | 'radar' | 'stream';
  category: 'revenue' | 'users' | 'contributors' | 'tasks' | 'validation' | 'marketplace' | 'billing' | 'security' | 'cloud';
  size: 'sm' | 'md' | 'lg' | 'full';
  visible: boolean;
}

export interface SavedReport {
  id: string;
  title: string;
  description: string;
  createdDate: string;
  updatedDate: string;
  isArchived: boolean;
  filters: GlobalFilters;
  widgets: DashboardWidget[];
}

export interface LiveStreamEvent {
  id: string;
  type: 'revenue' | 'task' | 'submission' | 'validation' | 'reward' | 'wallet' | 'marketplace' | 'billing' | 'admin';
  message: string;
  amount?: number;
  user?: string;
  meta: Record<string, any>;
  timestamp: string;
}

export interface CloudMetrics {
  firestoreReads: number;
  firestoreWrites: number;
  firestoreStorageGb: number;
  cloudStorageGb: number;
  bigQueryQueryGb: number;
  cloudFunctionsInvocations: number;
  cloudSchedulerJobs: number;
  pubSubMessages: number;
  cloudTasksQueued: number;
  egressBandwidthGb: number;
}

export interface SecurityThreatMetrics {
  failedLogins: number;
  suspiciousDevices: number;
  vpnConnections: number;
  proxyConnections: number;
  botDetectionCount: number;
  fraudAttempts: number;
  tamperAlerts: number;
  velocitySpikes: number;
  replayAttempts: number;
}
