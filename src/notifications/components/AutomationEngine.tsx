/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useNotifications } from '../context/NotificationContext';
import { TriggerType, ActionType, AutomationRule } from '../types';
import { Play, ToggleLeft, ToggleRight, Trash2, Cpu, CheckCircle2, Sliders, ListFilter } from 'lucide-react';

export const AutomationEngine: React.FC = () => {
  const {
    rules,
    logs,
    createAutomationRule,
    toggleRuleActive,
    deleteRule,
    triggerAutomationRule
  } = useNotifications();

  // New Rule Form
  const [ruleName, setRuleName] = useState('');
  const [trigger, setTrigger] = useState<TriggerType>('task_completed');
  const [action, setAction] = useState<ActionType>('create_in_app_notification');
  const [showSuccess, setShowSuccess] = useState(false);

  // Manual trigger tester
  const [testTrigger, setTestTrigger] = useState<TriggerType>('task_completed');
  const [testPayload, setTestPayload] = useState('{"taskId": "t-827", "bounty": "12.50", "userId": "u-402"}');
  const [testing, setTesting] = useState(false);

  const handleCreateRule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ruleName.trim()) return;

    createAutomationRule({
      name: ruleName,
      trigger,
      action,
      active: true,
      conditions: []
    });

    setRuleName('');
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 2000);
  };

  const handleTestTrigger = async () => {
    setTesting(true);
    let parsed = {};
    try {
      parsed = JSON.parse(testPayload);
    } catch (e) {
      parsed = { raw: testPayload };
    }

    await triggerAutomationRule(testTrigger, parsed);
    setTesting(false);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6" id="automation-engine">
      {/* Rules Builder form (cols 5) */}
      <div className="lg:col-span-5 bg-slate-900 border border-white/5 rounded-xl p-5 space-y-5 shadow-lg">
        <div className="flex items-center gap-2 border-b border-white/5 pb-3">
          <Cpu className="h-4.5 w-4.5 text-indigo-400" />
          <h3 className="text-sm font-semibold text-slate-200">Rule Logic Builder</h3>
        </div>

        <form onSubmit={handleCreateRule} className="space-y-4">
          <div className="space-y-1">
            <label className="text-[10px] uppercase text-slate-400 font-semibold">Rule Identifier</label>
            <input
              type="text"
              placeholder="e.g. Budget Cap -> Mail Owner"
              value={ruleName}
              onChange={(e) => setRuleName(e.target.value)}
              className="w-full bg-slate-950 border border-white/10 rounded-lg px-3 py-2 text-xs text-slate-300 placeholder-slate-600 focus:outline-none"
              required
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] uppercase text-slate-400 font-semibold">Event Trigger (IF)</label>
            <select
              value={trigger}
              onChange={(e) => setTrigger(e.target.value as TriggerType)}
              className="w-full bg-slate-950 border border-white/10 rounded-lg px-3 py-2 text-xs text-slate-300 focus:outline-none"
            >
              <option value="task_completed">Task Completed Evaluation</option>
              <option value="validation_failed">Validation Failed Filter</option>
              <option value="wallet_approved">Wallet Withdraw Approved</option>
              <option value="campaign_published">B2B Campaign Published</option>
              <option value="budget_exhausted">B2B Budget Exhausted</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] uppercase text-slate-400 font-semibold">Dispatch Action (THEN)</label>
            <select
              value={action}
              onChange={(e) => setAction(e.target.value as ActionType)}
              className="w-full bg-slate-950 border border-white/10 rounded-lg px-3 py-2 text-xs text-slate-300 focus:outline-none"
            >
              <option value="create_in_app_notification">Create In-App Alert Feed</option>
              <option value="send_email">Dispatch SMTP System Mail</option>
              <option value="send_push">Trigger FCM Device Push</option>
              <option value="send_slack">Forward Slack Webhook Payload</option>
              <option value="trigger_webhook">Trigger REST API Webhook</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full flex items-center justify-center gap-1.5 text-xs text-slate-200 bg-indigo-600 hover:bg-indigo-500 px-4 py-2.5 rounded-lg font-medium transition-colors"
          >
            <span>Instantiate Automation Rule</span>
          </button>

          {showSuccess && (
            <div className="flex items-center justify-center gap-1 text-[10px] text-emerald-400 font-semibold">
              <CheckCircle2 className="h-4 w-4" />
              <span>Rule Registered on Pub/Sub Router</span>
            </div>
          )}
        </form>

        {/* Rule testing sandbox */}
        <div className="border-t border-white/5 pt-4 space-y-3">
          <h4 className="text-[11px] uppercase text-slate-400 font-bold tracking-wider">Automated Event Trigger Sandbox</h4>
          <div className="space-y-2">
            <select
              value={testTrigger}
              onChange={(e) => setTestTrigger(e.target.value as TriggerType)}
              className="w-full bg-slate-950 border border-white/10 rounded-lg px-3 py-2 text-xs text-slate-300 focus:outline-none"
            >
              <option value="task_completed">task_completed</option>
              <option value="validation_failed">validation_failed</option>
              <option value="wallet_approved">wallet_approved</option>
              <option value="campaign_published">campaign_published</option>
              <option value="budget_exhausted">budget_exhausted</option>
            </select>

            <textarea
              value={testPayload}
              onChange={(e) => setTestPayload(e.target.value)}
              rows={2}
              className="w-full bg-slate-950 border border-white/10 rounded-lg px-3 py-2 text-[10px] font-mono text-slate-400 focus:outline-none resize-none"
            />

            <button
              onClick={handleTestTrigger}
              disabled={testing}
              className="w-full flex items-center justify-center gap-1.5 text-xs text-slate-300 bg-slate-950 border border-white/10 hover:bg-slate-800 px-3 py-1.5 rounded-lg font-semibold transition-colors disabled:opacity-50"
            >
              <Play className="h-3 w-3 text-emerald-400" />
              <span>{testing ? 'Firing trigger...' : 'Fire Event Trigger'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Rules & Logs display (cols 7) */}
      <div className="lg:col-span-7 space-y-6">
        {/* Active Rules List */}
        <div className="bg-slate-900 border border-white/5 rounded-xl p-5 space-y-4 shadow-lg">
          <h3 className="text-sm font-semibold text-slate-200">Active Rule Engines</h3>
          
          <div className="space-y-2.5">
            {rules.map((rule) => (
              <div 
                key={rule.id} 
                className={`p-3 bg-slate-950/60 border rounded-xl flex items-center justify-between gap-4 transition-all ${
                  rule.active ? 'border-indigo-500/20' : 'border-white/5 opacity-60'
                }`}
              >
                <div className="space-y-1">
                  <h4 className="text-xs font-bold text-slate-200">{rule.name}</h4>
                  <p className="text-[10px] text-slate-400">
                    IF <span className="text-indigo-400 font-mono">{rule.trigger}</span> THEN <span className="text-sky-400 font-mono">{rule.action}</span>
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => toggleRuleActive(rule.id)}
                    className="p-1 text-slate-400 hover:text-slate-200 transition-colors"
                  >
                    {rule.active ? (
                      <ToggleRight className="h-6 w-6 text-indigo-400" />
                    ) : (
                      <ToggleLeft className="h-6 w-6 text-slate-600" />
                    )}
                  </button>

                  <button
                    onClick={() => deleteRule(rule.id)}
                    className="p-1.5 hover:bg-rose-500/10 rounded text-slate-500 hover:text-rose-400 transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Real-Time Rule execution log */}
        <div className="bg-slate-900 border border-white/5 rounded-xl p-5 space-y-4 shadow-lg">
          <h3 className="text-sm font-semibold text-slate-200">System Automation Execution Logs</h3>
          
          <div className="h-[200px] overflow-y-auto space-y-2 pr-1 scrollbar-thin font-mono text-[11px]">
            {logs.map((log) => (
              <div key={log.id} className="p-3 bg-slate-950/60 border border-white/5 rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-white/10 transition-colors">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="text-slate-300 font-bold">{log.ruleName}</span>
                    <span className="text-[9px] uppercase font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-1.5 py-0.5 rounded">
                      {log.status}
                    </span>
                  </div>
                  <p className="text-slate-500 text-[10px]">{log.details}</p>
                </div>

                <span className="text-[10px] text-slate-600 shrink-0 self-end sm:self-center">
                  {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
