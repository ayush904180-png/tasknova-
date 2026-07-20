/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  NotificationItem,
  DeliveryChannel,
  Conversation,
  Announcement,
  AutomationRule,
  AutomationLog,
  NotificationCampaign,
  NotificationTemplate,
  InboxType,
  NotificationRbacRole,
  TriggerType,
  ActionType,
  Attachment
} from '../types';
import {
  INITIAL_NOTIFICATIONS,
  INITIAL_CHANNELS,
  INITIAL_CONVERSATIONS,
  INITIAL_ANNOUNCEMENTS,
  INITIAL_AUTOMATION_RULES,
  INITIAL_AUTOMATION_LOGS,
  INITIAL_CAMPAIGNS,
  INITIAL_TEMPLATES
} from '../constants';
import { GoogleCloudAdapters } from '../adapters/GoogleCloudAdapters';

interface NotificationContextProps {
  // Authentication & RBAC
  rbacRole: NotificationRbacRole;
  setRbacRole: (role: NotificationRbacRole) => void;
  hasPermission: (permission: string) => boolean;

  // Active views & filters
  inboxType: InboxType;
  setInboxType: (type: InboxType) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;

  // Primary states
  notifications: NotificationItem[];
  channels: DeliveryChannel[];
  conversations: Conversation[];
  announcements: Announcement[];
  rules: AutomationRule[];
  logs: AutomationLog[];
  campaigns: NotificationCampaign[];
  templates: NotificationTemplate[];

  // Selected details
  activeConversationId: string | null;
  setActiveConversationId: (id: string | null) => void;

  // Actions
  toggleNotificationStatus: (id: string, status: NotificationItem['status']) => void;
  deleteNotification: (id: string) => void;
  markAllAsRead: () => void;
  toggleChannelEnabled: (id: string) => void;
  sendMessage: (conversationId: string, content: string, file?: File) => Promise<void>;
  createAutomationRule: (rule: Omit<AutomationRule, 'id'>) => void;
  toggleRuleActive: (id: string) => void;
  deleteRule: (id: string) => void;
  triggerAutomationRule: (trigger: TriggerType, payload: any) => Promise<void>;
  createCampaign: (campaign: Omit<NotificationCampaign, 'id' | 'sentCount' | 'openCount' | 'createdDate'>) => void;
  toggleCampaignStatus: (id: string, status: NotificationCampaign['status']) => void;
  updateTemplate: (id: string, fields: Partial<NotificationTemplate>) => void;
  dismissAnnouncement: (id: string) => void;
  pinAnnouncement: (id: string) => void;

  // Real-time Presence
  isOnline: boolean;
  setIsOnline: (online: boolean) => void;
  latencyMs: number;
  onlineUserCount: number;

  // Offline queue support
  offlineQueue: { id: string; action: string; payload: any }[];
  clearOfflineQueue: () => void;

  // GCP Sync state
  syncingGcp: boolean;
  triggerGcpSync: () => Promise<void>;

  // Global search Ctrl+K
  searchModalOpen: boolean;
  setSearchModalOpen: (open: boolean) => void;
  globalSearchQuery: string;
  setGlobalSearchQuery: (q: string) => void;
}

const NotificationContext = createContext<NotificationContextProps | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // RBAC Setup
  const [rbacRole, setRbacRole] = useState<NotificationRbacRole>('Owner');

  // Interactive filters
  const [inboxType, setInboxType] = useState<InboxType>('personal');
  const [activeTab, setActiveTab] = useState<string>('notifications');

  // Master lists
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);
  const [channels, setChannels] = useState<DeliveryChannel[]>(INITIAL_CHANNELS);
  const [conversations, setConversations] = useState<Conversation[]>(INITIAL_CONVERSATIONS);
  const [announcements, setAnnouncements] = useState<Announcement[]>(INITIAL_ANNOUNCEMENTS);
  const [rules, setRules] = useState<AutomationRule[]>(INITIAL_AUTOMATION_RULES);
  const [logs, setLogs] = useState<AutomationLog[]>(INITIAL_AUTOMATION_LOGS);
  const [campaigns, setCampaigns] = useState<NotificationCampaign[]>(INITIAL_CAMPAIGNS);
  const [templates, setTemplates] = useState<NotificationTemplate[]>(INITIAL_TEMPLATES);

  const [activeConversationId, setActiveConversationId] = useState<string | null>('c-1');

  // Real-time & Offline Core States
  const [isOnline, setIsOnline] = useState<boolean>(true);
  const [latencyMs, setLatencyMs] = useState<number>(34);
  const [onlineUserCount, setOnlineUserCount] = useState<number>(142);
  const [offlineQueue, setOfflineQueue] = useState<{ id: string; action: string; payload: any }[]>([]);
  const [syncingGcp, setSyncingGcp] = useState<boolean>(false);

  // Ctrl + K Modal
  const [searchModalOpen, setSearchModalOpen] = useState<boolean>(false);
  const [globalSearchQuery, setGlobalSearchQuery] = useState<string>('');

  // RBAC permission check mapper
  const hasPermission = (permission: string): boolean => {
    switch (rbacRole) {
      case 'Owner':
      case 'Super Admin':
        return true;
      case 'Business':
        return ['read', 'campaigns', 'billing', 'templates'].includes(permission);
      case 'Moderator':
        return ['read', 'announcements', 'support'].includes(permission);
      case 'Support':
        return ['read', 'messages', 'support'].includes(permission);
      case 'Finance':
        return ['read', 'billing', 'rules'].includes(permission);
      case 'Developer':
        return ['read', 'rules', 'templates', 'gcp'].includes(permission);
      case 'Auditor':
        return ['read', 'gcp', 'rules'].includes(permission);
      case 'Read Only':
        return permission === 'read';
      default:
        return false;
    }
  };

  // Keep latency and online users active & dynamic (Real-time simulation)
  useEffect(() => {
    if (!isOnline) {
      setLatencyMs(0);
      return;
    }
    const interval = setInterval(() => {
      setLatencyMs(prev => Math.max(12, Math.min(120, prev + (Math.random() > 0.5 ? 5 : -5))));
      setOnlineUserCount(prev => Math.max(110, Math.min(220, prev + (Math.random() > 0.6 ? 2 : -2))));
    }, 4000);
    return () => clearInterval(interval);
  }, [isOnline]);

  // Simulating incoming messages or typing activities
  useEffect(() => {
    if (!isOnline) return;
    const typingInterval = setInterval(() => {
      // Pick random conversation and toggle active typing simulation
      const randomConvIdx = Math.floor(Math.random() * conversations.length);
      const targetConv = conversations[randomConvIdx];
      if (!targetConv) return;

      setConversations(prev => prev.map(c => {
        if (c.id === targetConv.id) {
          const isCurrentlyTyping = c.typingUserIds && c.typingUserIds.length > 0;
          return {
            ...c,
            typingUserIds: isCurrentlyTyping 
              ? [] 
              : [c.participants.find(p => p.id !== 'u-self')?.id || 'u-1']
          };
        }
        return c;
      }));
    }, 15000);

    return () => clearInterval(typingInterval);
  }, [isOnline, conversations]);

  // Handle Ctrl+K shortcut keybinds
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setSearchModalOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Primary handlers
  const toggleNotificationStatus = (id: string, status: NotificationItem['status']) => {
    setNotifications(prev =>
      prev.map(n => (n.id === id ? { ...n, status } : n))
    );
    if (!isOnline) {
      setOfflineQueue(q => [...q, { id: `act-${Date.now()}`, action: 'TOGGLE_NOTIFICATION', payload: { id, status } }]);
    } else {
      GoogleCloudAdapters.syncToFirestore('notifications', id, { status });
    }
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
    if (!isOnline) {
      setOfflineQueue(q => [...q, { id: `act-${Date.now()}`, action: 'DELETE_NOTIFICATION', payload: { id } }]);
    } else {
      GoogleCloudAdapters.syncToFirestore('notifications', id, { deleted: true });
    }
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, status: 'read' as const })));
    GoogleCloudAdapters.triggerCloudFunction('mark_all_notifications_read', { userId: 'u-self' });
  };

  const toggleChannelEnabled = (id: string) => {
    setChannels(prev =>
      prev.map(c => (c.id === id ? { ...c, enabled: !c.enabled } : c))
    );
    GoogleCloudAdapters.syncToFirestore('channels', id, { updated: true });
  };

  // Simulates sending and getting a message (Slack & Notion UI standards)
  const sendMessage = async (conversationId: string, content: string, file?: File) => {
    if (!content.trim() && !file) return;

    let attachments: Attachment[] = [];
    if (file) {
      attachments.push({
        id: `att-${Date.now()}`,
        name: file.name,
        type: file.type.startsWith('image/') ? 'image' : 'file',
        url: '#dummy-url',
        size: `${Math.round(file.size / 1024)} KB`
      });
    }

    const newMsg = {
      id: `msg-${Date.now()}`,
      senderId: 'u-self',
      senderName: 'Current User',
      content,
      timestamp: new Date().toISOString(),
      delivered: isOnline,
      attachments,
      readBy: []
    };

    // Update locally
    setConversations(prev =>
      prev.map(c => {
        if (c.id === conversationId) {
          return {
            ...c,
            lastMessage: content || 'Sent an attachment',
            lastActive: new Date().toISOString(),
            messages: [...c.messages, newMsg]
          };
        }
        return c;
      })
    );

    // If offline, queue it!
    if (!isOnline) {
      setOfflineQueue(q => [...q, { id: `act-${Date.now()}`, action: 'SEND_MESSAGE', payload: { conversationId, newMsg } }]);
      return;
    }

    // Trigger FCM Log adapter
    GoogleCloudAdapters.addLog('FCM', 'Message Sync', 'SUCCESS', `Dispatched secure message to channel ${conversationId}`);

    // Simulate Agent/Support Rep Typing & auto-response
    setTimeout(() => {
      setConversations(prev =>
        prev.map(c => {
          if (c.id === conversationId) {
            return {
              ...c,
              typingUserIds: [c.participants.find(p => p.id !== 'u-self')?.id || 'u-1']
            };
          }
          return c;
        })
      );
    }, 1200);

    setTimeout(() => {
      const responseMsg = {
        id: `msg-rep-${Date.now()}`,
        senderId: 'u-rep',
        senderName: 'Elena Rostova',
        content: `Acknowledged: "${content.substring(0, 20)}...". I have logged this into our support pipeline.`,
        timestamp: new Date().toISOString(),
        delivered: true,
        readBy: ['u-self']
      };

      setConversations(prev =>
        prev.map(c => {
          if (c.id === conversationId) {
            return {
              ...c,
              lastMessage: responseMsg.content,
              lastActive: new Date().toISOString(),
              typingUserIds: [],
              messages: [...c.messages, responseMsg]
            };
          }
          return c;
        })
      );
    }, 3000);
  };

  const createAutomationRule = (rule: Omit<AutomationRule, 'id'>) => {
    const newRule: AutomationRule = {
      ...rule,
      id: `r-${Date.now()}`
    };
    setRules(prev => [newRule, ...prev]);
    GoogleCloudAdapters.syncToFirestore('automation_rules', newRule.id, newRule);
  };

  const toggleRuleActive = (id: string) => {
    setRules(prev =>
      prev.map(r => (r.id === id ? { ...r, active: !r.active } : r))
    );
  };

  const deleteRule = (id: string) => {
    setRules(prev => prev.filter(r => r.id !== id));
  };

  // Evaluate and Trigger automation flows!
  const triggerAutomationRule = async (trigger: TriggerType, payload: any) => {
    // 1. Log incoming trigger
    GoogleCloudAdapters.addLog('Pub/Sub', 'Trigger Pipeline', 'SUCCESS', `Trigger received: ${trigger}`);

    // 2. Scan for matching active rules
    const matches = rules.filter(r => r.trigger === trigger && r.active);
    
    for (const rule of matches) {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const newLog: AutomationLog = {
        id: `log-${Date.now()}-${rule.id}`,
        ruleId: rule.id,
        ruleName: rule.name,
        trigger: rule.trigger,
        timestamp: new Date().toISOString(),
        status: 'success',
        details: `Rule logic matched. Dispatched action: ${rule.action}`
      };

      setLogs(prev => [newLog, ...prev]);

      // If action is creating in-app notification, add one directly!
      if (rule.action === 'create_in_app_notification') {
        const item: NotificationItem = {
          id: `n-${Date.now()}`,
          title: `Automated: ${rule.name}`,
          message: `Pipeline automated event for ${trigger}. Scope parameters: ${JSON.stringify(payload)}`,
          category: 'system',
          priority: 'medium',
          status: 'unread',
          timestamp: new Date().toISOString(),
          sender: 'Automation Engine'
        };
        setNotifications(prev => [item, ...prev]);
      }

      // Add GCP Adapter Logs
      GoogleCloudAdapters.addLog('Cloud Functions', 'Rule Dispatcher', 'SUCCESS', `Executed automated pipeline for rule: ${rule.name}`);
    }
  };

  const createCampaign = (campaign: Omit<NotificationCampaign, 'id' | 'sentCount' | 'openCount' | 'createdDate'>) => {
    const newCamp: NotificationCampaign = {
      ...campaign,
      id: `camp-${Date.now()}`,
      sentCount: campaign.status === 'published' ? campaign.targetCount : 0,
      openCount: campaign.status === 'published' ? Math.round(campaign.targetCount * 0.65) : 0,
      createdDate: new Date().toISOString().split('T')[0]
    };
    setCampaigns(prev => [newCamp, ...prev]);

    if (campaign.status === 'published') {
      // Simulate sheet and cloud function logging
      GoogleCloudAdapters.writeToGoogleSheets('1Spreadsheet_Notification_KPIs', 'Campaign_Metrics', [
        newCamp.id, newCamp.title, newCamp.status, newCamp.targetCount
      ]);
      GoogleCloudAdapters.addLog('Cloud Scheduler', 'Schedule Campaign Dispatch', 'SUCCESS', `Published direct FCM message campaign to ${newCamp.targetCount} targets`);
    }
  };

  const toggleCampaignStatus = (id: string, status: NotificationCampaign['status']) => {
    setCampaigns(prev =>
      prev.map(c => {
        if (c.id === id) {
          const isPublishing = status === 'published';
          return {
            ...c,
            status,
            sentCount: isPublishing ? c.targetCount : c.sentCount,
            openCount: isPublishing ? Math.round(c.targetCount * 0.65) : c.openCount
          };
        }
        return c;
      })
    );
  };

  const updateTemplate = (id: string, fields: Partial<NotificationTemplate>) => {
    setTemplates(prev =>
      prev.map(t => (t.id === id ? { ...t, ...fields, lastModified: new Date().toISOString().split('T')[0] } : t))
    );
  };

  const dismissAnnouncement = (id: string) => {
    setAnnouncements(prev =>
      prev.map(a => (a.id === id ? { ...a, dismissed: true } : a))
    );
  };

  const pinAnnouncement = (id: string) => {
    setAnnouncements(prev =>
      prev.map(a => (a.id === id ? { ...a, pinned: !a.pinned } : a))
    );
  };

  const clearOfflineQueue = () => {
    setOfflineQueue([]);
  };

  // Google Cloud backup synchronizer
  const triggerGcpSync = async () => {
    setSyncingGcp(true);
    GoogleCloudAdapters.addLog('Firestore', 'Batch Flush', 'PENDING', `Syncing ${offlineQueue.length} queued offline mutations.`);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setOfflineQueue([]);
    setSyncingGcp(false);
    GoogleCloudAdapters.addLog('Firestore', 'Batch Flush', 'SUCCESS', `All offline events synced successfully. Cloud node state matches ledger.`);
  };

  return (
    <NotificationContext.Provider
      value={{
        rbacRole,
        setRbacRole,
        hasPermission,
        inboxType,
        setInboxType,
        activeTab,
        setActiveTab,
        notifications,
        channels,
        conversations,
        announcements,
        rules,
        logs,
        campaigns,
        templates,
        activeConversationId,
        setActiveConversationId,
        toggleNotificationStatus,
        deleteNotification,
        markAllAsRead,
        toggleChannelEnabled,
        sendMessage,
        createAutomationRule,
        toggleRuleActive,
        deleteRule,
        triggerAutomationRule,
        createCampaign,
        toggleCampaignStatus,
        updateTemplate,
        dismissAnnouncement,
        pinAnnouncement,
        isOnline,
        setIsOnline,
        latencyMs,
        onlineUserCount,
        offlineQueue,
        clearOfflineQueue,
        syncingGcp,
        triggerGcpSync,
        searchModalOpen,
        setSearchModalOpen,
        globalSearchQuery,
        setGlobalSearchQuery
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};
