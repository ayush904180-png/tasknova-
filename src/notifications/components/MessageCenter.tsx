/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef } from 'react';
import { useNotifications } from '../context/NotificationContext';
import { Conversation, Message } from '../types';
import { 
  MessageSquare, Pin, Search, Paperclip, Send, Mic, MoreVertical, 
  Image as ImageIcon, FileText, Check, CheckCheck, Smile
} from 'lucide-react';

export const MessageCenter: React.FC = () => {
  const {
    conversations,
    activeConversationId,
    setActiveConversationId,
    sendMessage,
    isOnline
  } = useNotifications();

  const [messageText, setMessageText] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const activeConversation = conversations.find(c => c.id === activeConversationId);

  const filteredConversations = conversations.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageText.trim() && !selectedFile && activeConversationId) return;

    if (activeConversationId) {
      await sendMessage(activeConversationId, messageText, selectedFile || undefined);
      setMessageText('');
      setSelectedFile(null);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 bg-slate-900 border border-white/5 rounded-2xl h-[640px] overflow-hidden shadow-2xl" id="message-center">
      {/* 1. Conversations list (cols 4) */}
      <div className="lg:col-span-4 border-r border-white/5 flex flex-col h-full bg-slate-950/40">
        {/* Search Header */}
        <div className="p-4 border-b border-white/5 space-y-3">
          <h3 className="text-sm font-bold text-slate-200">Personal & Team Channels</h3>
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
            <input
              type="text"
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-950 border border-white/10 rounded-lg pl-9 pr-4 py-2 text-xs text-slate-300 placeholder-slate-600 focus:outline-none"
            />
          </div>
        </div>

        {/* List items */}
        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {filteredConversations.map(c => {
            const isActive = c.id === activeConversationId;
            return (
              <button
                key={c.id}
                onClick={() => setActiveConversationId(c.id)}
                className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all border text-left ${
                  isActive 
                    ? 'bg-indigo-600/10 border-indigo-500/20' 
                    : 'bg-transparent border-transparent hover:bg-slate-900/60'
                }`}
              >
                {/* Avatar */}
                <div className="relative shrink-0">
                  {c.avatar ? (
                    <img src={c.avatar} alt={c.name} className="h-9 w-9 rounded-full object-cover border border-white/10" />
                  ) : (
                    <div className="h-9 w-9 rounded-full bg-slate-800 flex items-center justify-center border border-white/5">
                      <MessageSquare className="h-4 w-4 text-indigo-400" />
                    </div>
                  )}
                  {/* Status Indicator */}
                  {c.participants.some(p => p.id !== 'u-self' && p.online) && (
                    <span className="absolute bottom-0 right-0 h-2.5 w-2.5 bg-emerald-500 border-2 border-slate-900 rounded-full" />
                  )}
                </div>

                {/* Info summary */}
                <div className="flex-1 min-w-0 space-y-0.5">
                  <div className="flex justify-between items-baseline">
                    <h4 className="text-xs font-bold text-slate-200 truncate pr-2">{c.name}</h4>
                    <span className="text-[9px] text-slate-500 font-mono shrink-0">
                      {new Date(c.lastActive).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 truncate leading-relaxed">
                    {c.typingUserIds && c.typingUserIds.length > 0 ? (
                      <span className="text-indigo-400 animate-pulse font-medium">Elena is typing...</span>
                    ) : (
                      c.lastMessage
                    )}
                  </p>
                </div>

                {/* Pins and Unread Badge */}
                <div className="flex flex-col items-end gap-1 shrink-0">
                  {c.pinned && <Pin className="h-3 w-3 text-slate-500" />}
                  {c.unreadCount > 0 && (
                    <span className="bg-indigo-600 text-slate-200 text-[10px] font-bold h-4 min-w-4 px-1 rounded-full flex items-center justify-center">
                      {c.unreadCount}
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Messages conversation pane (cols 8) */}
      <div className="lg:col-span-8 flex flex-col h-full bg-slate-900/40">
        {activeConversation ? (
          <>
            {/* Thread Header */}
            <div className="px-5 py-4 border-b border-white/5 flex items-center justify-between bg-slate-950/20">
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-full bg-slate-800 flex items-center justify-center border border-white/5 shrink-0">
                  {activeConversation.avatar ? (
                    <img src={activeConversation.avatar} alt={activeConversation.name} className="h-9 w-9 rounded-full object-cover" />
                  ) : (
                    <MessageSquare className="h-4.5 w-4.5 text-indigo-400" />
                  )}
                </div>
                <div>
                  <h3 className="text-xs font-bold text-slate-200">{activeConversation.name}</h3>
                  <div className="flex items-center gap-1.5 text-[10px] text-slate-400">
                    <span className="h-1.5 w-1.5 bg-emerald-500 rounded-full" />
                    <span>Lobby Stream Active ({activeConversation.participants.length} members)</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button className="p-1.5 hover:bg-slate-800 rounded text-slate-400 hover:text-slate-200 transition-colors">
                  <MoreVertical className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Thread messages lists */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              {activeConversation.messages.map((m) => {
                const isSelf = m.senderId === 'u-self';
                return (
                  <div key={m.id} className={`flex items-start gap-3.5 ${isSelf ? 'justify-end' : ''}`}>
                    {/* Avatar */}
                    {!isSelf && (
                      <div className="h-8 w-8 rounded-full bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-[10px] text-indigo-400 font-bold uppercase shrink-0 mt-0.5">
                        {m.senderName.substring(0, 2)}
                      </div>
                    )}

                    {/* Speech bubble */}
                    <div className="space-y-1 max-w-[70%]">
                      {!isSelf && (
                        <span className="text-[10px] font-semibold text-slate-400">{m.senderName}</span>
                      )}

                      <div className={`p-3.5 rounded-2xl space-y-2 border ${
                        isSelf 
                          ? 'bg-indigo-600 border-indigo-500 text-slate-200 rounded-tr-none' 
                          : 'bg-slate-950/60 border-white/5 text-slate-300 rounded-tl-none'
                      }`}>
                        <p className="text-xs leading-relaxed break-all whitespace-pre-wrap">{m.content}</p>

                        {/* Attachments preview */}
                        {m.attachments && m.attachments.map((att) => (
                          <div key={att.id} className="pt-2">
                            {att.type === 'image' ? (
                              <div className="rounded-lg overflow-hidden border border-white/10 max-w-sm">
                                <img src={att.url} alt={att.name} className="w-full object-cover max-h-40" />
                                <div className="p-1.5 bg-slate-950 text-[10px] text-slate-400 truncate flex justify-between">
                                  <span>{att.name}</span>
                                  <span>{att.size}</span>
                                </div>
                              </div>
                            ) : (
                              <div className="flex items-center gap-2 p-2 bg-slate-950/60 rounded-lg border border-white/10 max-w-sm">
                                <FileText className="h-4 w-4 text-indigo-400 shrink-0" />
                                <div className="min-w-0 flex-1">
                                  <div className="text-[10px] font-bold text-slate-300 truncate">{att.name}</div>
                                  <div className="text-[9px] text-slate-500">{att.size}</div>
                                </div>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>

                      {/* Receipt Row */}
                      <div className={`flex items-center gap-1.5 text-[9px] text-slate-500 justify-end font-mono`}>
                        <span>{new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        {isSelf && (
                          m.delivered ? (
                            <CheckCheck className="h-3.5 w-3.5 text-indigo-400" />
                          ) : (
                            <Check className="h-3.5 w-3.5 text-slate-600" />
                          )
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}

              {/* Typing indicators */}
              {activeConversation.typingUserIds && activeConversation.typingUserIds.length > 0 && (
                <div className="flex items-center gap-2 text-[10px] text-indigo-400 bg-indigo-500/5 border border-indigo-500/10 px-3 py-1.5 rounded-full w-fit animate-pulse">
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-indigo-500"></span>
                  </span>
                  <span>Elena Rostova is typing a response...</span>
                </div>
              )}
            </div>

            {/* Input field Footer */}
            <form onSubmit={handleSend} className="p-4 border-t border-white/5 space-y-3 bg-slate-950/20">
              {/* Selected attachment block */}
              {selectedFile && (
                <div className="flex items-center justify-between p-2 bg-slate-950 border border-white/5 rounded-lg text-xs">
                  <div className="flex items-center gap-2 truncate text-slate-300">
                    <Paperclip className="h-4 w-4 text-indigo-400" />
                    <span className="font-semibold truncate">{selectedFile.name}</span>
                    <span className="text-[10px] text-slate-500">({Math.round(selectedFile.size / 1024)} KB)</span>
                  </div>
                  <button type="button" onClick={() => setSelectedFile(null)} className="text-xs text-rose-400 hover:text-rose-300 font-semibold">
                    Remove
                  </button>
                </div>
              )}

              <div className="flex items-center gap-2.5 bg-slate-950 px-3.5 py-2.5 rounded-xl border border-white/10">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="p-1 text-slate-500 hover:text-slate-300 transition-colors"
                  title="Attach file"
                >
                  <Paperclip className="h-4 w-4" />
                </button>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  className="hidden"
                />

                <input
                  type="text"
                  placeholder={isOnline ? "Type your message..." : "Offline queue mode active..."}
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  className="w-full bg-transparent border-none text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:ring-0"
                />

                <div className="flex items-center gap-1">
                  <button type="button" className="p-1 text-slate-500 hover:text-slate-300 transition-colors">
                    <Smile className="h-4 w-4" />
                  </button>
                  <button type="button" className="p-1 text-slate-500 hover:text-slate-300 transition-colors" title="Record Voice placeholder">
                    <Mic className="h-4 w-4" />
                  </button>
                </div>

                <button
                  type="submit"
                  className="bg-indigo-600 hover:bg-indigo-500 text-slate-100 p-2 rounded-lg transition-colors"
                >
                  <Send className="h-3.5 w-3.5" />
                </button>
              </div>
            </form>
          </>
        ) : (
          <div className="m-auto text-center text-slate-500 space-y-2">
            <MessageSquare className="h-10 w-10 text-slate-600 mx-auto" />
            <h4 className="text-xs font-semibold text-slate-300">Select Thread</h4>
            <p className="text-[11px] text-slate-500">Pick a communication channel from the sidebar to chat.</p>
          </div>
        )}
      </div>
    </div>
  );
};
