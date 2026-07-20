/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { useAdmin } from '../context/AdminContext';
import { ModerationItem, ContentCategory } from '../types';
import {
  CheckCircle,
  XCircle,
  Shield,
  FileText,
  Image,
  MessageSquare,
  Sparkles,
  AlertTriangle,
  Archive,
  ArrowUpRight,
  User,
  ExternalLink
} from 'lucide-react';

export function ContentModerationTab() {
  const { moderationItems, moderateContent } = useAdmin();
  const [selectedItem, setSelectedItem] = useState<ModerationItem | null>(null);
  const [filterCategory, setFilterCategory] = useState<'ALL' | ContentCategory>('ALL');
  const [reasonVal, setReasonVal] = useState('');

  const filteredItems = moderationItems.filter((item) => {
    const matchesCategory = filterCategory === 'ALL' || item.category === filterCategory;
    return matchesCategory && item.status === 'Pending';
  });

  const getCategoryIcon = (category: ContentCategory) => {
    switch (category) {
      case ContentCategory.TASK:
      case ContentCategory.CAMPAIGN:
        return <FileText className="h-4 w-4 text-indigo-500" />;
      case ContentCategory.IMAGE:
      case ContentCategory.VIDEO:
        return <Image className="h-4 w-4 text-emerald-500" />;
      case ContentCategory.TEXT:
      case ContentCategory.PROMPT:
        return <Sparkles className="h-4 w-4 text-purple-500" />;
      case ContentCategory.REVIEW:
      case ContentCategory.MARKETPLACE_LISTING:
      default:
        return <MessageSquare className="h-4 w-4 text-blue-500" />;
    }
  };

  const handleModerate = (status: 'Approved' | 'Rejected' | 'Archived' | 'Escalated') => {
    if (!selectedItem) return;
    if (!reasonVal) {
      alert('An administrative auditing reason must be specified.');
      return;
    }

    moderateContent(selectedItem.id, status, reasonVal);
    alert(`Moderation complete. ${selectedItem.category} has been set to: ${status}`);
    setReasonVal('');
    setSelectedItem(null);
  };

  return (
    <div className="space-y-6" id="content-moderation-panel">
      {/* Category filter pills */}
      <div className="bg-white dark:bg-slate-950 border border-slate-100 dark:border-white/5 rounded-2xl p-4 flex items-center gap-2 overflow-x-auto scrollbar-none">
        <button
          onClick={() => setFilterCategory('ALL')}
          className={`text-[10px] font-bold px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
            filterCategory === 'ALL'
              ? 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-950/50'
              : 'text-slate-400 hover:text-slate-950 dark:hover:text-white border border-transparent'
          }`}
        >
          All Pending ({moderationItems.filter(i => i.status === 'Pending').length})
        </button>
        {Object.values(ContentCategory).map((cat) => (
          <button
            key={cat}
            onClick={() => setFilterCategory(cat)}
            className={`text-[10px] font-bold px-3 py-1.5 rounded-lg transition-all cursor-pointer whitespace-nowrap ${
              filterCategory === cat
                ? 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-950/50'
                : 'text-slate-400 hover:text-slate-950 dark:hover:text-white border border-transparent'
            }`}
          >
            {cat} ({moderationItems.filter(i => i.category === cat && i.status === 'Pending').length})
          </button>
        ))}
      </div>

      {/* Main layout: left list, right detail editor */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="space-y-3 lg:col-span-2">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              onClick={() => {
                setSelectedItem(item);
                setReasonVal('');
              }}
              className={`p-4 bg-white dark:bg-slate-950 border rounded-2xl cursor-pointer transition-all flex items-start justify-between gap-4 hover:shadow-xs ${
                selectedItem?.id === item.id
                  ? 'border-indigo-500 shadow-sm'
                  : 'border-slate-150 dark:border-white/5'
              }`}
            >
              <div className="flex gap-3">
                <div className="p-2.5 bg-slate-50 dark:bg-slate-900 rounded-xl shrink-0 h-10 w-10 flex items-center justify-center border border-slate-100 dark:border-white/5">
                  {getCategoryIcon(item.category)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono font-bold text-indigo-600 dark:text-indigo-400 uppercase">
                      {item.category}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">• Risk Score:</span>
                    <span className={`text-[10px] font-mono font-bold ${
                      item.riskScore > 80 ? 'text-rose-500' : item.riskScore > 50 ? 'text-amber-500' : 'text-slate-400'
                    }`}>
                      {item.riskScore}/100
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white mt-1 leading-snug">{item.title}</h4>
                  <p className="text-[10px] text-slate-400 font-mono mt-1">Submitted by: {item.ownerName} • ID: {item.id}</p>
                </div>
              </div>
              <div className="text-right shrink-0">
                <span className="text-[9px] font-mono text-slate-400">
                  {new Date(item.submittedAt).toLocaleTimeString()}
                </span>
                <p className="text-[9px] text-slate-400 mt-1 font-mono">{new Date(item.submittedAt).toLocaleDateString()}</p>
              </div>
            </div>
          ))}

          {filteredItems.length === 0 && (
            <div className="bg-white dark:bg-slate-950 border border-slate-150 dark:border-white/5 rounded-2xl p-12 text-center text-slate-400 text-xs">
              Excellent! No pending items requiring human moderation in this category.
            </div>
          )}
        </div>

        {/* Action Panel */}
        <div className="bg-white dark:bg-slate-950 border border-slate-150 dark:border-white/5 rounded-2xl p-6 shadow-xs h-fit space-y-6">
          {selectedItem ? (
            <div className="space-y-6">
              {/* Header */}
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white font-sans flex items-center gap-2">
                    <Shield className="h-4.5 w-4.5 text-indigo-500" /> Moderation Console
                  </h3>
                  <p className="text-[11px] text-slate-400 mt-0.5">ID: <span className="font-bold text-slate-900 dark:text-white">{selectedItem.id}</span></p>
                </div>
                <button
                  onClick={() => setSelectedItem(null)}
                  className="p-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 rounded-lg cursor-pointer text-slate-400"
                >
                  <Archive className="h-4 w-4" />
                </button>
              </div>

              {/* Submitter info */}
              <div className="p-3 bg-slate-50 dark:bg-slate-900/40 rounded-xl border border-slate-100 dark:border-white/5 flex items-center gap-3">
                <div className="h-8 w-8 rounded-full bg-slate-200 dark:bg-zinc-800 text-slate-500 flex items-center justify-center">
                  <User className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-[10px] text-slate-400">Content Submitter</p>
                  <p className="text-xs font-bold text-slate-800 dark:text-slate-200">{selectedItem.ownerName}</p>
                </div>
              </div>

              {/* Media Content display */}
              {selectedItem.mediaUrl && (
                <div className="space-y-1.5">
                  <span className="text-[9px] font-mono uppercase text-slate-400">Attached Media</span>
                  <div className="relative rounded-xl overflow-hidden border border-slate-200 dark:border-white/10 aspect-video bg-slate-100 flex items-center justify-center group">
                    <img
                      src={selectedItem.mediaUrl}
                      alt="Adversarial validation asset"
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                    <a
                      href={selectedItem.mediaUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="absolute bottom-2 right-2 p-1.5 bg-black/70 hover:bg-black text-white rounded-lg opacity-0 group-hover:opacity-100 transition-all cursor-pointer"
                    >
                      <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  </div>
                </div>
              )}

              {/* Text content display */}
              {selectedItem.textContent && (
                <div className="space-y-1.5">
                  <span className="text-[9px] font-mono uppercase text-slate-400">Text Content / Slang / Prompt Payload</span>
                  <div className="p-3 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-[#030303] text-xs font-mono text-slate-700 dark:text-zinc-300 max-h-48 overflow-y-auto leading-relaxed">
                    {selectedItem.textContent}
                  </div>
                </div>
              )}

              {/* Auditor Reason input */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-mono text-slate-400 uppercase tracking-wide">Audit Logging Reason *</label>
                <input
                  type="text"
                  required
                  value={reasonVal}
                  onChange={(e) => setReasonVal(e.target.value)}
                  placeholder="e.g. Cleared automated false-positive slang"
                  className="w-full text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-xl px-3 py-2 text-slate-900 dark:text-white"
                />
              </div>

              {/* Action Buttons */}
              <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-white/5">
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => handleModerate('Approved')}
                    className="py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 cursor-pointer hover:shadow-md transition-all"
                  >
                    <CheckCircle className="h-4 w-4" /> Approve
                  </button>
                  <button
                    onClick={() => handleModerate('Rejected')}
                    className="py-2.5 bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 cursor-pointer hover:shadow-md transition-all"
                  >
                    <XCircle className="h-4 w-4" /> Reject
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => handleModerate('Escalated')}
                    className="py-2 bg-amber-50 hover:bg-amber-100 text-amber-700 dark:bg-amber-950/20 dark:text-amber-400 text-[10px] font-bold rounded-xl flex items-center justify-center gap-1 cursor-pointer transition-all"
                  >
                    <AlertTriangle className="h-3.5 w-3.5" /> Escalate Admin
                  </button>
                  <button
                    onClick={() => handleModerate('Archived')}
                    className="py-2 bg-slate-100 hover:bg-slate-200 dark:bg-zinc-900 dark:hover:bg-zinc-800 text-slate-700 dark:text-slate-300 text-[10px] font-bold rounded-xl flex items-center justify-center gap-1 cursor-pointer transition-all"
                  >
                    <Archive className="h-3.5 w-3.5" /> Archive Entry
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-12 text-slate-400 space-y-3">
              <Shield className="h-8 w-8 mx-auto text-slate-300 dark:text-zinc-800" />
              <div>
                <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300">Content Moderation</h4>
                <p className="text-[10px] text-slate-400 mt-1">Select an item in the pending queue list to review associated textual prompts, attached images, risk scores, and dispatch judgments.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
export default ContentModerationTab;
