/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useAnalytics } from '../context/AnalyticsContext';
import { LayoutGrid, Eye, EyeOff, CheckCircle2, RotateCcw } from 'lucide-react';

export const CustomDashboardBuilder: React.FC = () => {
  const { widgets, saveLayout, restoreDefaultLayout } = useAnalytics();
  const [success, setSuccess] = useState(false);

  const toggleWidget = (id: string) => {
    const updated = widgets.map(w => {
      if (w.id === id) {
        return { ...w, visible: !w.visible };
      }
      return w;
    });
    saveLayout(updated);
    setSuccess(true);
    setTimeout(() => setSuccess(false), 2000);
  };

  const shiftWidgetSize = (id: string, size: 'sm' | 'md' | 'lg' | 'full') => {
    const updated = widgets.map(w => {
      if (w.id === id) {
        return { ...w, size };
      }
      return w;
    });
    saveLayout(updated);
    setSuccess(true);
    setTimeout(() => setSuccess(false), 2000);
  };

  return (
    <div className="bg-slate-900 border border-white/5 rounded-xl p-5 space-y-6 shadow-lg" id="custom-dashboard-builder">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/5 pb-4">
        <div>
          <h3 className="text-base font-bold text-slate-200">Custom Widget Console Builder</h3>
          <p className="text-xs text-slate-400">Toggle metric widgets, resize viewport footprints, and sync grid parameters globally.</p>
        </div>

        <div className="flex items-center gap-2">
          {success && (
            <span className="text-[10px] text-indigo-400 font-semibold flex items-center gap-1">
              <CheckCircle2 className="h-3.5 w-3.5" />
              Layout Cached Locally
            </span>
          )}
          <button
            onClick={restoreDefaultLayout}
            className="flex items-center gap-1 text-xs text-slate-400 hover:text-slate-200 bg-slate-950/60 border border-white/10 px-3 py-1.5 rounded-lg transition-colors font-semibold"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Reset Layout</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {widgets.map((widget) => (
          <div 
            key={widget.id} 
            className={`p-4 bg-slate-950/60 border rounded-xl flex items-center justify-between gap-4 transition-all ${
              widget.visible ? 'border-indigo-500/30' : 'border-white/5 opacity-65'
            }`}
          >
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <LayoutGrid className={`h-4 w-4 ${widget.visible ? 'text-indigo-400' : 'text-slate-500'}`} />
                <h4 className="text-xs font-bold text-slate-200">{widget.title}</h4>
              </div>
              <p className="text-[10px] text-slate-500 capitalize">Category: {widget.category} • Viewport: {widget.size}</p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              {/* Size selectors */}
              {widget.visible && (
                <div className="flex gap-1 bg-slate-900 p-0.5 rounded border border-white/5">
                  {(['sm', 'md', 'lg'] as const).map((sz) => (
                    <button
                      key={sz}
                      onClick={() => shiftWidgetSize(widget.id, sz)}
                      className={`text-[9px] font-bold px-1.5 py-0.5 rounded uppercase ${
                        widget.size === sz ? 'bg-indigo-600 text-slate-200' : 'text-slate-500 hover:text-slate-300'
                      }`}
                    >
                      {sz}
                    </button>
                  ))}
                </div>
              )}

              {/* Toggle switch visual */}
              <button
                onClick={() => toggleWidget(widget.id)}
                className={`p-1.5 rounded-lg border transition-colors ${
                  widget.visible 
                    ? 'bg-indigo-600/15 border-indigo-500/30 text-indigo-400' 
                    : 'bg-slate-900 border-white/10 text-slate-500'
                }`}
                title={widget.visible ? 'Hide Widget' : 'Show Widget'}
              >
                {widget.visible ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
