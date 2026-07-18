/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import { WidgetShell } from './WidgetShell';
import { WidgetContextProps } from '../../types/widgets';
import { Bell, HelpCircle, AlertTriangle, ShieldCheck } from 'lucide-react';

interface NoticeItem {
  id: string;
  title: string;
  message: string;
  type: 'general' | 'reward' | 'business' | 'security' | 'system';
  createdAt: string;
}

export const NotificationWidget: React.FC<WidgetContextProps> = ({ size, isOffline, isRealtime }) => {
  const [notices, setNotices] = useState<NoticeItem[]>([]);

  useEffect(() => {
    // Standard baseline announcements
    setNotices([
      {
        id: 'note-1',
        title: 'System Upgrade: LLM Model v3.4 Inline',
        message: 'Reward multipliers on translation datasets raised by 1.25x for accuracy metrics.',
        type: 'system',
        createdAt: '4 hrs ago',
      },
      {
        id: 'note-2',
        title: 'Payout Dispatched: July Cycles',
        message: 'Your holding logs cleared KYC. Wallet debits successfully wired to corporate routing account.',
        type: 'reward',
        createdAt: '2 days ago',
      }
    ]);
  }, []);

  return (
    <WidgetShell
      id="notification-widget"
      title="Alerts & System Bulletins"
      subtitle="Administrative disclosures and updates"
      size={size}
      expectedRepository="NotificationRepository"
      expectedModel="FirestoreNotification"
      expectedFields={['id', 'userId', 'title', 'message', 'type', 'isRead', 'createdAt']}
      futureConnectionPoint="const notices = await useInfrastructure().notifications.getNotificationsByUser(userId);"
      loadingStateSim="Reading notification feed channel..."
      emptyStateSim="Zero bulletins currently active."
      errorStateSim="Failed to establish websocket handshake with Notification service."
    >
      <div className="space-y-3 mt-2">
        {notices.map((note) => (
          <div key={note.id} className="p-2.5 rounded-lg border border-slate-150 bg-slate-50/20 dark:border-white/5 dark:bg-white/1 flex gap-2.5">
            <div className="mt-0.5">
              {note.type === 'system' ? (
                <AlertTriangle className="h-3.5 w-3.5 text-indigo-500" />
              ) : (
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
              )}
            </div>
            <div>
              <h5 className="font-semibold text-[11px] text-slate-800 dark:text-zinc-200">
                {note.title}
              </h5>
              <p className="text-[10px] text-slate-400 mt-0.5 leading-relaxed">
                {note.message}
              </p>
              <span className="text-[8px] font-mono text-slate-400 dark:text-zinc-500 mt-1 block">
                {note.createdAt}
              </span>
            </div>
          </div>
        ))}
      </div>
    </WidgetShell>
  );
};
