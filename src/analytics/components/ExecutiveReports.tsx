/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useAnalytics } from '../context/AnalyticsContext';
import { FileText, Calendar, Sparkles, Send, Download, CheckCircle } from 'lucide-react';

export const ExecutiveReports: React.FC = () => {
  const [activeReportTab, setActiveReportTab] = useState<'daily' | 'weekly' | 'monthly'>('weekly');
  const [sendingWebhook, setSendingWebhook] = useState(false);
  const [webhookSuccess, setWebhookSuccess] = useState(false);

  const handleSendWebhook = () => {
    setSendingWebhook(true);
    setTimeout(() => {
      setSendingWebhook(false);
      setWebhookSuccess(true);
      setTimeout(() => setWebhookSuccess(false), 3000);
    }, 1200);
  };

  const getReportContent = () => {
    switch (activeReportTab) {
      case 'daily':
        return {
          title: 'Daily Platform Velocity Digest',
          date: 'July 20, 2026',
          stats: [
            { label: 'Revenue Generated', val: '$28,200', change: '+8.4%' },
            { label: 'Submissions Resolved', val: '4,850', change: '+11.2%' },
            { label: 'Golden Consensus Matches', val: '99.1%', change: 'Optimal' }
          ],
          bullets: [
            'RLHF alignment validation stream is running at optimal peak load. High-quality metrics returned on creative chatbot evaluations.',
            'B2B Campaign budget burns are operating within safety bounds with Stripe settlements operating cleanly.',
            'Bot mitigation flags rose slightly on US East subnets; automated proxy mitigation successfully blocked 120 nodes.'
          ]
        };
      case 'weekly':
        return {
          title: 'Weekly Operational & BI Health Check',
          date: 'July 13 - July 20, 2026',
          stats: [
            { label: 'Weekly Gross Billing', val: '$185,400', change: '+14.2%' },
            { label: 'New Worker Onboarded', val: '1,820', change: '+8.2%' },
            { label: 'API Edge Latency Med', val: '38 ms', change: '-12.4%' }
          ],
          bullets: [
            'Monthly Recurring Revenue escalated to $245K as two premium enterprise client trials matured into full commitments.',
            'Ecosystem trust index leveled up to 98.4% average after golden validation filter adjustments.',
            'Successfully processed IBAN/UPI withdrawals totaling $18,500. Average withdrawal queue lag remains low.'
          ]
        };
      case 'monthly':
        return {
          title: 'Monthly Executive Platform Analysis',
          date: 'June 20 - July 20, 2026',
          stats: [
            { label: 'Monthly Cumulative Sales', val: '$382,000', change: '+12.4%' },
            { label: 'Active Crowd Nodes', val: '18,230', change: '+14.2%' },
            { label: 'GCP Firestore Storage', val: '370 GB', change: '+14.5%' }
          ],
          bullets: [
            'Completed translation corpus for DE-EN Technical translation validation. Total data yield crossed 84,000 processed samples.',
            'Platform Annual Run Rate is trending cleanly towards $2.94M, surpassing Q2 target parameters by 4.8%.',
            'Cybersecurity WAF logs report zero bypass events during regional DDoS velocity attacks on API ingress endpoints.'
          ]
        };
    }
  };

  const report = getReportContent();

  return (
    <div className="bg-slate-900 border border-white/5 rounded-xl p-5 space-y-6 shadow-lg" id="executive-reports-tab">
      {/* Selector Tabs */}
      <div className="flex items-center justify-between border-b border-white/5 pb-4">
        <div className="flex gap-2">
          {['daily', 'weekly', 'monthly'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveReportTab(tab as any)}
              className={`text-xs font-semibold px-3 py-1.5 rounded-lg border transition-colors capitalize ${
                activeReportTab === tab 
                  ? 'bg-indigo-600/15 border-indigo-500/30 text-indigo-300' 
                  : 'bg-slate-950/40 border-white/5 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              {tab} Digest
            </button>
          ))}
        </div>

        {/* Slack Sender Webhook Trigger */}
        <div className="flex items-center gap-2">
          {webhookSuccess && (
            <span className="text-[10px] text-emerald-400 font-medium">Slack notification dispatched!</span>
          )}
          <button
            onClick={handleSendWebhook}
            disabled={sendingWebhook}
            className="flex items-center gap-1 text-xs text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-3 py-1.5 rounded-lg hover:bg-indigo-600/20 disabled:opacity-50 transition-colors font-medium"
          >
            <Send className="h-3 w-3" />
            <span>{sendingWebhook ? 'Sending...' : 'Slack Hook'}</span>
          </button>
        </div>
      </div>

      {/* Main Report Body */}
      <div className="space-y-4">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <h3 className="text-base font-bold text-slate-200">{report.title}</h3>
            <p className="text-[11px] text-slate-400 flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5" />
              <span>Interval Scope: {report.date}</span>
            </p>
          </div>
          <button className="flex items-center gap-1 text-xs text-slate-300 bg-slate-950/60 border border-white/10 px-3 py-1.5 rounded-lg hover:bg-slate-800 transition-colors">
            <Download className="h-3.5 w-3.5" />
            <span>Compile PDF</span>
          </button>
        </div>

        {/* Stats Summary Grid inside report */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
          {report.stats.map((stat, idx) => (
            <div key={idx} className="bg-slate-950 p-3 rounded-lg border border-white/5 space-y-1 text-center">
              <span className="text-[10px] text-slate-400 font-semibold">{stat.label}</span>
              <div className="flex justify-center items-baseline gap-1.5">
                <span className="text-sm font-bold text-slate-200">{stat.val}</span>
                <span className="text-[10px] text-emerald-400 font-medium">{stat.change}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Detailed Executive Bullets */}
        <div className="space-y-3 pt-3 border-t border-white/5">
          <h4 className="text-xs font-semibold text-slate-300 flex items-center gap-1">
            <Sparkles className="h-3.5 w-3.5 text-indigo-400" />
            <span>Key Executive Action Points</span>
          </h4>
          <ul className="space-y-2 list-none p-0 m-0">
            {report.bullets.map((bullet, idx) => (
              <li key={idx} className="text-xs text-slate-400 flex gap-2 items-start leading-relaxed">
                <span className="text-indigo-400 font-semibold shrink-0 mt-0.5">•</span>
                <span>{bullet}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};
