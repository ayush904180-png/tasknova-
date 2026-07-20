/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useAnalytics } from '../context/AnalyticsContext';
import { Download, FileSpreadsheet, Server, CloudUpload, CheckCircle, Database } from 'lucide-react';

export const ExportCenter: React.FC = () => {
  const { exportData, exportToSheets } = useAnalytics();

  const [sheetId, setSheetId] = useState('1A2B3C4D5E6F7G8H9I0J');
  const [sheetName, setSheetName] = useState('TaskNova_KPIs');
  const [syncingSheets, setSyncingSheets] = useState(false);
  const [sheetsSuccess, setSheetsSuccess] = useState(false);

  const [streamCount, setStreamCount] = useState(145);
  const [streamingBigQuery, setStreamingBigQuery] = useState(false);
  const [bqSuccess, setBqSuccess] = useState(false);

  const handleSheetsExport = async () => {
    setSyncingSheets(true);
    setSheetsSuccess(false);
    const ok = await exportToSheets(sheetId, sheetName);
    setSyncingSheets(false);
    if (ok) {
      setSheetsSuccess(true);
      setTimeout(() => setSheetsSuccess(false), 3000);
    }
  };

  const handleBQStream = () => {
    setStreamingBigQuery(true);
    setBqSuccess(false);
    setTimeout(() => {
      setStreamingBigQuery(false);
      setBqSuccess(true);
      setTimeout(() => setBqSuccess(false), 3000);
    }, 1500);
  };

  return (
    <div className="bg-slate-900 border border-white/5 rounded-xl p-5 space-y-6 shadow-lg" id="export-center-tab">
      <div className="space-y-1 border-b border-white/5 pb-4">
        <h3 className="text-base font-bold text-slate-200">Integration Export Dispatcher</h3>
        <p className="text-xs text-slate-400">Stream compiled operational telemetry data to Google Workspace or Google Cloud BigQuery warehouses.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Google sheets export */}
        <div className="space-y-4 p-4 bg-slate-950/60 border border-white/5 rounded-xl">
          <div className="flex items-center gap-2">
            <FileSpreadsheet className="h-4 w-4 text-emerald-400" />
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Google Sheets Integration</h4>
          </div>

          <div className="space-y-3">
            <div className="space-y-1">
              <label className="text-[10px] uppercase text-slate-400 font-semibold">Target Spreadsheet ID</label>
              <input
                type="text"
                value={sheetId}
                onChange={(e) => setSheetId(e.target.value)}
                className="w-full bg-slate-900 border border-white/10 rounded-lg px-3 py-2 text-xs text-slate-300"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] uppercase text-slate-400 font-semibold">Sheet Tab Name</label>
              <input
                type="text"
                value={sheetName}
                onChange={(e) => setSheetName(e.target.value)}
                className="w-full bg-slate-900 border border-white/10 rounded-lg px-3 py-2 text-xs text-slate-300"
              />
            </div>

            <div className="flex items-center justify-between pt-2">
              <button
                onClick={handleSheetsExport}
                disabled={syncingSheets}
                className="flex items-center gap-1.5 text-xs text-slate-200 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 px-3 py-2 rounded-lg font-medium transition-colors"
              >
                <CloudUpload className="h-3.5 w-3.5" />
                <span>{syncingSheets ? 'Exporting...' : 'Sync with Sheets'}</span>
              </button>

              {sheetsSuccess && (
                <div className="flex items-center gap-1 text-[10px] text-emerald-400 font-semibold">
                  <CheckCircle className="h-3.5 w-3.5" />
                  <span>Sync Successful!</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* BigQuery analytics streamer */}
        <div className="space-y-4 p-4 bg-slate-950/60 border border-white/5 rounded-xl">
          <div className="flex items-center gap-2">
            <Server className="h-4 w-4 text-sky-400" />
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">BigQuery Ingest Pipeline</h4>
          </div>

          <div className="space-y-3">
            <div className="space-y-1">
              <label className="text-[10px] uppercase text-slate-400 font-semibold">Stream Record Volume</label>
              <input
                type="number"
                value={streamCount}
                onChange={(e) => setStreamCount(parseInt(e.target.value) || 10)}
                className="w-full bg-slate-900 border border-white/10 rounded-lg px-3 py-2 text-xs text-slate-300"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] uppercase text-slate-400 font-semibold">Warehouse Path Reference</label>
              <div className="bg-slate-900 p-2 rounded-lg border border-white/5 font-mono text-[10px] text-slate-500">
                gcp-tasknova-core.analytics.billing_stream_history
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <button
                onClick={handleBQStream}
                disabled={streamingBigQuery}
                className="flex items-center gap-1.5 text-xs text-slate-200 bg-sky-600 hover:bg-sky-500 disabled:opacity-50 px-3 py-2 rounded-lg font-medium transition-colors"
              >
                <Database className="h-3.5 w-3.5" />
                <span>{streamingBigQuery ? 'Streaming...' : 'Stream BigQuery'}</span>
              </button>

              {bqSuccess && (
                <div className="flex items-center gap-1 text-[10px] text-sky-400 font-semibold">
                  <CheckCircle className="h-3.5 w-3.5" />
                  <span>Log Block Streamed!</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Manual file exports */}
      <div className="pt-4 border-t border-white/5 flex flex-wrap gap-3">
        <button
          onClick={() => exportData('CSV')}
          className="flex items-center gap-1.5 text-xs text-slate-300 bg-slate-950/60 border border-white/10 px-4 py-2 rounded-lg hover:bg-slate-800 transition-colors font-medium"
        >
          <Download className="h-4 w-4" />
          <span>Export Local CSV</span>
        </button>
        <button
          onClick={() => exportData('JSON')}
          className="flex items-center gap-1.5 text-xs text-slate-300 bg-slate-950/60 border border-white/10 px-4 py-2 rounded-lg hover:bg-slate-800 transition-colors font-medium"
        >
          <Download className="h-4 w-4" />
          <span>Export Raw JSON</span>
        </button>
      </div>
    </div>
  );
};
