/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  NotificationItem,
  DeliveryChannel,
  Conversation,
  Announcement,
  AutomationRule,
  NotificationCampaign,
  NotificationTemplate,
  AutomationLog
} from '../types';

export const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'n-1',
    title: 'Consensus Achieved',
    message: 'Task submission evaluation on translation deck #827 has successfully cleared golden standard checks.',
    category: 'validation',
    priority: 'medium',
    status: 'unread',
    timestamp: '2026-07-20T01:50:00Z',
    actionUrl: '#validation',
    sender: 'AI Validation Service'
  },
  {
    id: 'n-2',
    title: 'High-Risk IP Access Attempt',
    message: 'An unauthorized attempt to query the administrator RPC node was blocked from subnet 183.24.90.1.',
    category: 'security',
    priority: 'high',
    status: 'unread',
    timestamp: '2026-07-20T01:48:00Z',
    actionUrl: '#security',
    sender: 'WAF Guard Node'
  },
  {
    id: 'n-3',
    title: 'Stripe Settlement Completed',
    message: 'A wire distribution of $18,500.00 was authorized and posted to your ledger balance.',
    category: 'billing',
    priority: 'high',
    status: 'read',
    timestamp: '2026-07-20T01:15:00Z',
    actionUrl: '#billing',
    sender: 'Finance Operations'
  },
  {
    id: 'n-4',
    title: 'New Campaign Invitation',
    message: 'TaskNova Enterprise has invited you to participate in the DE-EN technical translation sprint.',
    category: 'campaign',
    priority: 'medium',
    status: 'unread',
    timestamp: '2026-07-20T01:10:00Z',
    actionUrl: '#marketplace',
    sender: 'Business Workspace'
  },
  {
    id: 'n-5',
    title: 'System DB Maintenance Schedule',
    message: 'Primary cloud databases will undergo regional replica failover checks on Friday 02:00 UTC.',
    category: 'maintenance',
    priority: 'low',
    status: 'read',
    timestamp: '2026-07-19T22:30:00Z',
    actionUrl: '#maintenance',
    sender: 'Infra Architect'
  },
  {
    id: 'n-6',
    title: 'Weekly Reward Multiplier Active',
    message: 'Congratulations! Your trust rating of 99.4% has qualified you for a 1.25x reward booster on all prompt evaluations.',
    category: 'reward',
    priority: 'medium',
    status: 'pinned',
    timestamp: '2026-07-19T18:00:00Z',
    actionUrl: '#rewards',
    sender: 'Reward Intelligence Engine'
  },
  {
    id: 'n-7',
    title: 'Dataset Volume Quota Warning',
    message: 'The B2B client dataset "translation_corp_de_v3" has reached 92% of designated block capacity limits.',
    category: 'dataset',
    priority: 'high',
    status: 'unread',
    timestamp: '2026-07-19T14:20:00Z',
    actionUrl: '#datasets',
    sender: 'Storage Custodian'
  }
];

export const INITIAL_CHANNELS: DeliveryChannel[] = [
  { id: 'email', name: 'Email Dispatcher', enabled: true, connected: true, providerName: 'Google Cloud Mail / SMTP' },
  { id: 'sms', name: 'SMS Gateways', enabled: false, connected: true, providerName: 'Twilio Integrator' },
  { id: 'push', name: 'FCM Push Notifications', enabled: true, connected: true, providerName: 'Firebase Cloud Messaging' },
  { id: 'browser_push', name: 'W3C Browser Push', enabled: true, connected: true, providerName: 'Browser Service Worker' },
  { id: 'in_app', name: 'In-App Telemetry Feed', enabled: true, connected: true, providerName: 'TaskNova Live Link' },
  { id: 'webhook', name: 'Outgoing REST Webhooks', enabled: true, connected: false, providerName: 'Custom Dispatch Webhook' },
  { id: 'slack', name: 'Slack Integration Hub', enabled: true, connected: true, providerName: 'Slack Webhook Gateway' },
  { id: 'discord', name: 'Discord Bot Streamer', enabled: false, connected: false, providerName: 'Discord Webhook' },
  { id: 'teams', name: 'Microsoft Teams Webhooks', enabled: false, connected: false, providerName: 'Office 365 Connector' },
  { id: 'gchat', name: 'Google Chat Ingress', enabled: true, connected: true, providerName: 'Workspace Chat Webhook' }
];

export const INITIAL_CONVERSATIONS: Conversation[] = [
  {
    id: 'c-1',
    name: 'Platform Support Core',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80',
    isGroup: false,
    lastMessage: 'Let us confirm the ledger balance was updated on your withdrawal request.',
    lastActive: '2026-07-20T01:51:00Z',
    unreadCount: 2,
    pinned: true,
    participants: [
      { id: 'u-1', name: 'Elena Rostova', role: 'Support Representative', online: true },
      { id: 'u-self', name: 'Current User', role: 'Owner', online: true }
    ],
    messages: [
      {
        id: 'm-1-1',
        senderId: 'u-self',
        senderName: 'Current User',
        content: 'Hi Support, my wallet withdraw has been pending for 30 minutes. Is there any blocker?',
        timestamp: '2026-07-20T01:45:00Z',
        delivered: true,
        readBy: ['u-1']
      },
      {
        id: 'm-1-2',
        senderId: 'u-1',
        senderName: 'Elena Rostova',
        content: 'Checking this right now. Our finance hub reports your IBAN address is passing AML validation checks.',
        timestamp: '2026-07-20T01:48:00Z',
        delivered: true,
        readBy: ['u-self']
      },
      {
        id: 'm-1-3',
        senderId: 'u-1',
        senderName: 'Elena Rostova',
        content: 'Let us confirm the ledger balance was updated on your withdrawal request.',
        timestamp: '2026-07-20T01:51:00Z',
        delivered: true,
        attachments: [
          {
            id: 'att-1',
            name: 'ledger_settlement_receipt.pdf',
            type: 'file',
            url: '#download-pdf',
            size: '142 KB'
          }
        ],
        readBy: []
      }
    ],
    typingUserIds: []
  },
  {
    id: 'c-2',
    name: 'Translation Campaign Review Team',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=100&q=80',
    isGroup: true,
    lastMessage: 'The validation dataset has been updated to remove ambiguity in translations.',
    lastActive: '2026-07-20T01:10:00Z',
    unreadCount: 0,
    pinned: false,
    participants: [
      { id: 'u-2', name: 'Marcus Sterling', role: 'Campaign Manager', online: true },
      { id: 'u-3', name: 'Yuki Tanaka', role: 'Lead Linguist', online: false },
      { id: 'u-self', name: 'Current User', role: 'Owner', online: true }
    ],
    messages: [
      {
        id: 'm-2-1',
        senderId: 'u-3',
        senderName: 'Yuki Tanaka',
        content: 'Hello team, the validation dataset has been updated to remove ambiguity in translations.',
        timestamp: '2026-07-20T01:10:00Z',
        delivered: true,
        attachments: [
          {
            id: 'att-2',
            name: 'revised_guidelines_v4.png',
            type: 'image',
            url: 'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?auto=format&fit=crop&w=400&q=80',
            size: '890 KB'
          }
        ],
        readBy: ['u-2', 'u-self']
      }
    ]
  },
  {
    id: 'c-3',
    name: 'Platform Announcements Bot',
    isGroup: false,
    lastMessage: 'New multi-factor security locks have been successfully enabled for enterprise workspaces.',
    lastActive: '2026-07-19T10:00:00Z',
    unreadCount: 0,
    pinned: false,
    participants: [
      { id: 'u-bot', name: 'System Core Dispatcher', role: 'Admin Bot', online: true },
      { id: 'u-self', name: 'Current User', role: 'Owner', online: true }
    ],
    messages: [
      {
        id: 'm-3-1',
        senderId: 'u-bot',
        senderName: 'System Core Dispatcher',
        content: 'New multi-factor security locks have been successfully enabled for enterprise workspaces.',
        timestamp: '2026-07-19T10:00:00Z',
        delivered: true,
        readBy: ['u-self']
      }
    ]
  }
];

export const INITIAL_ANNOUNCEMENTS: Announcement[] = [
  {
    id: 'a-1',
    title: 'Platform Version 4.8 Released',
    content: 'We have updated our AI consensus verification engines to support real-time token confidence modeling. Contributor validation payouts are now settled 14% faster.',
    type: 'release',
    timestamp: '2026-07-20T01:00:00Z',
    pinned: true,
    dismissed: false,
    badge: 'v4.8.0'
  },
  {
    id: 'a-2',
    title: 'EMERGENCY: Cloud database routing latency spike',
    content: 'We are observing elevated latency within our GCP Firestore us-east1 replica streams. Our engineering node is adjusting ingress filters to route queries to us-central1 fallback instances.',
    type: 'emergency',
    timestamp: '2026-07-20T01:30:00Z',
    pinned: true,
    dismissed: false,
    badge: 'Active Alert'
  },
  {
    id: 'a-3',
    title: 'Upcoming Database Read Replicas Maintenance',
    content: 'Read-only telemetry tables will be rebooted on July 23 at 04:00 UTC for structural index compression. Analytics dashboards may experience momentary cold-boots.',
    type: 'maintenance',
    timestamp: '2026-07-19T12:00:00Z',
    pinned: false,
    dismissed: false
  }
];

export const INITIAL_AUTOMATION_RULES: AutomationRule[] = [
  {
    id: 'r-1',
    name: 'Task Completed -> Payout Trigger',
    trigger: 'task_completed',
    action: 'create_in_app_notification',
    active: true,
    conditions: [{ field: 'category', operator: 'equals', value: 'RLHF' }]
  },
  {
    id: 'r-2',
    name: 'Validation Error -> Notify Contributor',
    trigger: 'validation_failed',
    action: 'send_email',
    active: true,
    conditions: [{ field: 'retryCount', operator: 'less_than', value: '3' }]
  },
  {
    id: 'r-3',
    name: 'Wallet Withdraw Approved -> Slack Webhook',
    trigger: 'wallet_approved',
    action: 'send_slack',
    active: true,
    conditions: [{ field: 'payoutAmount', operator: 'greater_than', value: '1000' }]
  },
  {
    id: 'r-4',
    name: 'New Campaign -> Notify matching linguists',
    trigger: 'campaign_published',
    action: 'send_push',
    active: false,
    conditions: [{ field: 'languagePair', operator: 'equals', value: 'DE-EN' }]
  }
];

export const INITIAL_AUTOMATION_LOGS: AutomationLog[] = [
  {
    id: 'log-1',
    ruleId: 'r-1',
    ruleName: 'Task Completed -> Payout Trigger',
    trigger: 'task_completed',
    timestamp: '2026-07-20T01:45:00Z',
    status: 'success',
    details: 'In-app notification created for contributor 819'
  },
  {
    id: 'log-2',
    ruleId: 'r-3',
    ruleName: 'Wallet Withdraw Approved -> Slack Webhook',
    trigger: 'wallet_approved',
    timestamp: '2026-07-20T01:15:00Z',
    status: 'success',
    details: 'Slack notification dispatched to #finance-payouts webhook channel'
  }
];

export const INITIAL_CAMPAIGNS: NotificationCampaign[] = [
  {
    id: 'camp-1',
    title: 'Urgent: DE-EN German Linguistic Validation',
    content: 'High-priority translation batch is now open for Gold-level contributors with technical dictionary skills.',
    status: 'published',
    filters: {
      language: 'German',
      role: 'Contributor',
      skills: ['Technical Translation', 'Grammar Audit'],
      trustLevel: 95
    },
    channels: ['email', 'push', 'slack'],
    targetCount: 1420,
    sentCount: 1420,
    openCount: 980,
    createdDate: '2026-07-19'
  },
  {
    id: 'camp-2',
    title: 'Enterprise Billing Portal Switchover',
    content: 'Notice to all Business clients about the new consolidated invoicing structure coming next month.',
    status: 'draft',
    filters: {
      role: 'Business',
      businessType: 'Enterprise'
    },
    channels: ['email', 'gchat'],
    targetCount: 85,
    sentCount: 0,
    openCount: 0,
    createdDate: '2026-07-20'
  },
  {
    id: 'camp-3',
    title: 'Weekend Double Reward Frenzy Campaign',
    content: 'Complete 10 high-complexity evaluation tasks on Saturday to earn a permanent +20% bounty multiplier.',
    status: 'paused',
    filters: {
      role: 'Contributor',
      contributorLevel: 'Intermediate'
    },
    channels: ['push', 'browser_push', 'in_app'],
    targetCount: 5800,
    sentCount: 2200,
    openCount: 1540,
    createdDate: '2026-07-18'
  }
];

export const INITIAL_TEMPLATES: NotificationTemplate[] = [
  {
    id: 't-1',
    name: 'Enterprise Welcome Email',
    type: 'email',
    subject: 'Welcome to TaskNova AI Platform - Your Account is Live',
    body: `<!DOCTYPE html>
<html>
<body style="font-family: Arial, sans-serif; background-color: #0f172a; color: #cbd5e1; padding: 20px;">
  <h2 style="color: #6366f1;">Welcome to TaskNova, {{name}}!</h2>
  <p>Your enterprise sandbox node is fully provisioned. You can now import validation datasets and launch reward campaigns.</p>
  <p>Workspace ID: <strong>{{workspaceId}}</strong></p>
  <hr style="border-color: #334155;"/>
  <p style="font-size: 11px; color: #64748b;">This notification was dispatched automatically by Cloud Run Container Operations.</p>
</body>
</html>`,
    variables: ['name', 'workspaceId'],
    lastModified: '2026-07-18'
  },
  {
    id: 't-2',
    name: 'High-Priority Security Alert',
    type: 'email',
    subject: 'TaskNova AI - Security Action Required',
    body: `<!DOCTYPE html>
<html>
<body style="font-family: sans-serif; padding: 25px; color: #334155;">
  <div style="background-color: #fef2f2; border: 1px solid #fee2e2; padding: 15px; border-radius: 8px;">
    <h3 style="color: #991b1b; margin-top: 0;">Security Incident Alert</h3>
    <p>A new API key creation was executed from IP Address <strong>{{ip}}</strong> on device <strong>{{device}}</strong>.</p>
    <p>If you did not authorize this node creation, please lock your credentials immediately.</p>
  </div>
</body>
</html>`,
    variables: ['ip', 'device'],
    lastModified: '2026-07-20'
  },
  {
    id: 't-3',
    name: 'Reward Granted Push',
    type: 'push',
    body: 'Bounty Unlocked! You earned ${{amount}} for golden consensus validation on task {{taskId}}.',
    variables: ['amount', 'taskId'],
    lastModified: '2026-07-19'
  }
];
