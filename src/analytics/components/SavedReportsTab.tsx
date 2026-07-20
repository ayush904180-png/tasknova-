/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useAnalytics } from '../context/AnalyticsContext';
import { FileText, Save, Trash2, Calendar, CheckCircle2, ArrowRight } from 'lucide-react';

export const SavedReportsTab: React.FC = () => {
  const { savedReports, saveNewReport, deleteReportById, setFilters, setActiveReport, activeReport } = useAnalytics();

  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) return;
    const rep = saveNewReport(title, desc);
    setTitle('');
    setDesc('');
    setSuccess(true);
    setTimeout(() => setSuccess(false), 2000);
  };

  const loadReport = (rep: any) => {
    setFilters(rep.filters);
    setActiveReport(rep);
  };

  return (
    <div className="space-y-6" id="saved-reports-tab-container">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Saved list */}
        <div className="bg-slate-900 border border-white/5 rounded-xl p-5 space-y-4 lg:col-span-2 shadow-lg">
          <h3 className="text-sm font-semibold text-slate-200">Saved Platform Custom Reports</h3>
          <p className="text-xs text-slate-400">Load historic layouts, filters, or delete templates.</p>

          <div className="space-y-3 pt-2">
            {savedReports.map((rep) => {
              const isActive = activeReport?.id === rep.id;
              return (
                <div 
                  key={rep.id} 
                  className={`p-4 rounded-xl border flex items-center justify-between gap-4 transition-all ${
                    isActive ? 'bg-slate-950/80 border-indigo-500/40' : 'bg-slate-950/40 border-white/5'
                  }`}
                >
                  <div className="space-y-1">
                    <h4 className="text-xs font-bold text-slate-200">{rep.title}</h4>
                    <p className="text-[10px] text-slate-500">{rep.description}</p>
                    <div className="flex items-center gap-2 text-[9px] text-slate-500 font-medium">
                      <Calendar className="h-3 w-3" />
                      <span>Updated: {rep.updatedDate}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => loadReport(rep)}
                      className={`flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1.5 rounded-lg border transition-colors ${
                        isActive 
                          ? 'bg-indigo-600/10 border-indigo-500/30 text-indigo-400' 
                          : 'bg-slate-900 border-white/10 text-slate-300 hover:bg-slate-800'
                      }`}
                    >
                      <span>Load Preset</span>
                      <ArrowRight className="h-3 w-3" />
                    </button>

                    <button
                      onClick={() => deleteReportById(rep.id)}
                      className="p-2 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 rounded-lg border border-rose-500/20 transition-colors"
                      title="Delete Preset"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Save Current Layout Form */}
        <div className="bg-slate-900 border border-white/5 rounded-xl p-5 space-y-4 shadow-lg">
          <div className="flex items-center gap-2">
            <Save className="h-4 w-4 text-indigo-400" />
            <h3 className="text-sm font-semibold text-slate-200">Save Current Configuration</h3>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3 pt-2">
            <div className="space-y-1">
              <label className="text-[10px] uppercase text-slate-400 font-semibold">Report Title</label>
              <input
                type="text"
                placeholder="e.g. Q3 Growth Calibration Metrics"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-slate-950 border border-white/10 rounded-lg px-3 py-2 text-xs text-slate-300 placeholder-slate-600 focus:outline-none"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] uppercase text-slate-400 font-semibold">Short Description</label>
              <textarea
                placeholder="Details of applied filters and dimensions..."
                value={desc}
                onChange={(e) => setDesc(e.target.value)}
                rows={3}
                className="w-full bg-slate-950 border border-white/10 rounded-lg px-3 py-2 text-xs text-slate-300 placeholder-slate-600 focus:outline-none resize-none"
              />
            </div>

            <button
              type="submit"
              className="w-full flex items-center justify-center gap-1.5 text-xs text-slate-200 bg-indigo-600 hover:bg-indigo-500 px-4 py-2 rounded-lg font-medium transition-colors"
            >
              <Save className="h-4 w-4" />
              <span>Save Report Preset</span>
            </button>

            {success && (
              <div className="flex justify-center items-center gap-1 text-[10px] text-emerald-400 font-semibold pt-1">
                <CheckCircle2 className="h-4 w-4" />
                <span>Preset Added Successfully</span>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};
