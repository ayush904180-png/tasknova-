/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type NotificationPriority = 'high' | 'medium' | 'low';

export type NotificationCategory =
  | 'system'
  | 'security'
  | 'task'
  | 'submission'
  | 'validation'
  | 'reward'
  | 'wallet'
  | 'marketplace'
  | 'billing'
  | 'business'
  | 'campaign'
  | 'dataset'
  | 'announcement'
  | 'maintenance'
  | 'developer'
  | 'admin';

export type NotificationStatus = 'unread' | 'read' | 'pinned' | 'archived' | 'deleted';

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  category: NotificationCategory;
  priority: NotificationPriority;
  status: NotificationStatus;
  timestamp: string;
  actionUrl?: string;
  sender?: string;
}

export type ChannelId = 'email' | 'sms' | 'push' | 'browser_push' | 'in_app' | 'webhook' | 'slack' | 'discord' | 'teams' | 'gchat';

export interface DeliveryChannel {
  id: ChannelId;
  name: string;
  enabled: boolean;
  connected: boolean;
  providerName: string;
}

export interface Attachment {
  id: string;
  name: string;
  type: 'image' | 'file' | 'voice';
  url: string;
  size?: string;
}

export interface Message {
  id: string;
  senderId: string;
  senderName: string;
  senderAvatar?: string;
  content: string;
  timestamp: string;
  attachments?: Attachment[];
  readBy: string[]; // User IDs who read this message
  delivered: boolean;
}

export interface Conversation {
  id: string;
  name: string;
  avatar?: string;
  isGroup: boolean;
  lastMessage?: string;
  lastActive: string;
  unreadCount: number;
  pinned: boolean;
  participants: { id: string; name: string; role: string; online: boolean }[];
  messages: Message[];
  typingUserIds?: string[];
}

export type AnnouncementType = 'platform' | 'maintenance' | 'update' | 'release' | 'feature' | 'emergency';

export interface Announcement {
  id: string;
  title: string;
  content: string;
  type: AnnouncementType;
  timestamp: string;
  pinned: boolean;
  dismissed: boolean;
  badge?: string;
}

export type TriggerType =
  | 'task_completed'
  | 'validation_failed'
  | 'wallet_approved'
  | 'campaign_published'
  | 'budget_exhausted';

export type ActionType =
  | 'send_email'
  | 'send_sms'
  | 'send_push'
  | 'trigger_webhook'
  | 'send_slack'
  | 'send_discord'
  | 'create_in_app_notification';

export interface AutomationRule {
  id: string;
  name: string;
  trigger: TriggerType;
  action: ActionType;
  active: boolean;
  conditions: { field: string; operator: 'equals' | 'greater_than' | 'less_than'; value: string }[];
}

export interface AutomationLog {
  id: string;
  ruleId: string;
  ruleName: string;
  trigger: TriggerType;
  timestamp: string;
  status: 'success' | 'failed';
  details: string;
}

export type CampaignStatus = 'draft' | 'published' | 'paused' | 'completed';

export interface CampaignFilters {
  country?: string;
  language?: string;
  role?: string;
  skills?: string[];
  trustLevel?: number; // 0 to 100
  businessType?: string;
  contributorLevel?: string;
}

export interface NotificationCampaign {
  id: string;
  title: string;
  content: string;
  status: CampaignStatus;
  filters: CampaignFilters;
  channels: ChannelId[];
  targetCount: number;
  sentCount: number;
  openCount: number;
  createdDate: string;
  scheduledDate?: string;
  recurring?: 'none' | 'daily' | 'weekly' | 'monthly';
}

export interface NotificationTemplate {
  id: string;
  name: string;
  type: 'email' | 'push';
  subject?: string;
  body: string;
  variables: string[];
  lastModified: string;
}

export type InboxType = 'personal' | 'business' | 'admin' | 'support';

export type NotificationRbacRole =
  | 'Owner'
  | 'Super Admin'
  | 'Business'
  | 'Moderator'
  | 'Support'
  | 'Finance'
  | 'Developer'
  | 'Auditor'
  | 'Read Only';
