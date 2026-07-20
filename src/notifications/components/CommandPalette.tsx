/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { useNotifications } from '../context/NotificationContext';
import { Search, FileText, Send, Sparkles, MessageSquare, Bell, X, AlertTriangle } from 'lucide-react';

export const CommandPalette: React.FC = () => {
  const {
    searchModalOpen,
    setSearchModalOpen,
    globalSearchQuery,
    setGlobalSearchQuery,
    notifications,
    conversations,
    campaigns,
    templates,
    announcements,
    setActiveTab,
    setActiveConversationId
  } = useNotifications();

  const [results, setResults] = useState<{
    id: string;
    title: string;
    subtitle: string;
    type: 'notification' | 'message' | 'campaign' | 'template' | 'announcement';
    action: () => void;
  }[]>([]);

  useEffect(() => {
    if (!globalSearchQuery.trim()) {
      setResults([]);
      return;
    }

    const q = globalSearchQuery.toLowerCase();
    const list: typeof results = [];

    // Search notifications
    notifications.forEach(n => {
      if (n.title.toLowerCase().includes(q) || n.message.toLowerCase().includes(q)) {
        list.push({
          id: n.id,
          title: n.title,
          subtitle: n.message,
          type: 'notification',
          action: () => {
            setActiveTab('notifications');
            setSearchModalOpen(false);
          }
        });
      }
    });

    // Search messages in conversations
    conversations.forEach(c => {
      c.messages.forEach(m => {
        if (m.content.toLowerCase().includes(q)) {
          list.push({
            id: m.id,
            title: `Message in ${c.name}`,
            subtitle: m.content,
            type: 'message',
            action: () => {
              setActiveTab('messages');
              setActiveConversationId(c.id);
              setSearchModalOpen(false);
            }
          });
        }
      });
    });

    // Search campaigns
    campaigns.forEach(camp => {
      if (camp.title.toLowerCase().includes(q) || camp.content.toLowerCase().includes(q)) {
        list.push({
          id: camp.id,
          title: camp.title,
          subtitle: `Campaign Filters: ${camp.filters.role || 'Any'} in ${camp.filters.language || 'Any'}`,
          type: 'campaign',
          action: () => {
            setActiveTab('campaigns');
            setSearchModalOpen(false);
          }
        });
      }
    });

    // Search templates
    templates.forEach(t => {
      if (t.name.toLowerCase().includes(q) || t.body.toLowerCase().includes(q)) {
        list.push({
          id: t.id,
          title: t.name,
          subtitle: `Variables: ${t.variables.join(', ')}`,
          type: 'template',
          action: () => {
            setActiveTab('templates');
            setSearchModalOpen(false);
          }
        });
      }
    });

    // Search announcements
    announcements.forEach(a => {
      if (a.title.toLowerCase().includes(q) || a.content.toLowerCase().includes(q)) {
        list.push({
          id: a.id,
          title: a.title,
          subtitle: a.content,
          type: 'announcement',
          action: () => {
            setActiveTab('announcements');
            setSearchModalOpen(false);
          }
        });
      }
    });

    setResults(list.slice(0, 10)); // max 10 results
  }, [globalSearchQuery, notifications, conversations, campaigns, templates, announcements]);

  if (!searchModalOpen) return null;

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'notification': return <Bell className="h-4 w-4 text-indigo-400" />;
      case 'message': return <MessageSquare className="h-4 w-4 text-sky-400" />;
      case 'campaign': return <Send className="h-4 w-4 text-emerald-400" />;
      case 'template': return <FileText className="h-4 w-4 text-violet-400" />;
      case 'announcement': return <Sparkles className="h-4 w-4 text-amber-400" />;
      default: return <Search className="h-4 w-4 text-slate-400" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh] px-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in" id="global-command-palette">
      <div className="w-full max-w-2xl bg-slate-900 border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[60vh] animate-scale-up">
        {/* Search Input */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-white/5 bg-slate-950">
          <Search className="h-5 w-5 text-slate-400 shrink-0" />
          <input
            type="text"
            placeholder="Type search queries (Ctrl + K)..."
            value={globalSearchQuery}
            onChange={(e) => setGlobalSearchQuery(e.target.value)}
            className="w-full bg-transparent border-none text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-0"
            autoFocus
          />
          <button
            onClick={() => setSearchModalOpen(false)}
            className="p-1 hover:bg-slate-800 rounded text-slate-400 hover:text-slate-200 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Results Stream */}
        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {!globalSearchQuery ? (
            <div className="py-12 text-center text-slate-500 flex flex-col items-center gap-2">
              <Search className="h-8 w-8 text-slate-600" />
              <p className="text-xs font-medium">Search anything across TaskNova BI Dispatchers</p>
              <span className="text-[10px] text-slate-600">Start typing to see matching notifications, campaigns, templates, and chats</span>
            </div>
          ) : results.length === 0 ? (
            <div className="py-12 text-center text-slate-500 flex flex-col items-center gap-2">
              <AlertTriangle className="h-8 w-8 text-amber-500/60" />
              <p className="text-xs font-medium">No results matched your search term</p>
            </div>
          ) : (
            results.map((res) => (
              <button
                key={`${res.type}-${res.id}`}
                onClick={res.action}
                className="w-full flex items-start gap-3.5 p-3 rounded-xl hover:bg-slate-950/60 border border-transparent hover:border-white/5 text-left transition-all"
              >
                <div className="p-2 bg-slate-950 border border-white/5 rounded-lg shrink-0 mt-0.5">
                  {getTypeIcon(res.type)}
                </div>
                <div className="space-y-0.5 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-200 truncate">{res.title}</span>
                    <span className="text-[9px] uppercase font-bold text-slate-500 bg-slate-950 px-1.5 py-0.5 rounded border border-white/5 shrink-0">
                      {res.type}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 line-clamp-1">{res.subtitle}</p>
                </div>
              </button>
            ))
          )}
        </div>

        {/* Footer shortcuts */}
        <div className="px-4 py-2 bg-slate-950 border-t border-white/5 flex items-center justify-between text-[10px] text-slate-500 font-medium">
          <div className="flex items-center gap-4">
            <span>Type <kbd className="bg-slate-900 px-1 py-0.5 rounded border border-white/10 font-sans text-[9px]">Esc</kbd> to exit</span>
          </div>
          <span>Deep Indexing Enabled</span>
        </div>
      </div>
    </div>
  );
};
