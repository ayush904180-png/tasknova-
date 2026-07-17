/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Bell, Mail, ShieldAlert, Award, PlayCircle, ToggleLeft, ToggleRight, Sparkles } from 'lucide-react';

interface NotificationsStepProps {
  notifications: {
    email: boolean;
    taskAlerts: boolean;
    rewardUpdates: boolean;
    productNews: boolean;
    securityAlerts: boolean;
  };
  onChangeNotifications: (key: 'email' | 'taskAlerts' | 'rewardUpdates' | 'productNews' | 'securityAlerts', value: boolean) => void;
  onContinue: () => void;
  onBack: () => void;
}

export const NotificationsStep: React.FC<NotificationsStepProps> = ({
  notifications,
  onChangeNotifications,
  onContinue,
  onBack,
}) => {
  const preferencesList = [
    {
      key: 'email',
      title: 'Email Notifications',
      description: 'Receive security statements, logins notifications, and compliance audit summaries.',
      icon: Mail,
      iconColor: 'text-indigo-400',
      bgColor: 'bg-indigo-500/10 border-indigo-500/20'
    },
    {
      key: 'taskAlerts',
      title: 'Dynamic Task Alerts',
      description: 'Be notified when new high-yield evaluation campaigns matching your skill profiles launch.',
      icon: Sparkles,
      iconColor: 'text-purple-400',
      bgColor: 'bg-purple-500/10 border-purple-500/20'
    },
    {
      key: 'rewardUpdates',
      title: 'Reward & Token Updates',
      description: 'Instant notification on successful coin settlements and audit payload verification clears.',
      icon: Award,
      iconColor: 'text-emerald-400',
      bgColor: 'bg-emerald-500/10 border-emerald-500/20'
    },
    {
      key: 'productNews',
      title: 'Product Node Updates',
      description: 'Periodic newsletters introducing new model types, ledger updates, and platform capabilities.',
      icon: PlayCircle,
      iconColor: 'text-blue-400',
      bgColor: 'bg-blue-500/10 border-blue-500/20'
    },
    {
      key: 'securityAlerts',
      title: 'System Security Alerts',
      description: 'Crucial security warnings and multi-device connection exceptions. Recommended active.',
      icon: ShieldAlert,
      iconColor: 'text-rose-400',
      bgColor: 'bg-rose-500/10 border-rose-500/20',
      required: true
    }
  ];

  const handleToggle = (key: string) => {
    const propKey = key as 'email' | 'taskAlerts' | 'rewardUpdates' | 'productNews' | 'securityAlerts';
    // Let's toggle
    onChangeNotifications(propKey, !notifications[propKey]);
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-2xl mx-auto" id="onboarding-notifications-step">
      <div className="text-center space-y-2">
        <div className="inline-flex p-2.5 bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 rounded-xl mb-1">
          <Bell className="w-6 h-6" />
        </div>
        <h2 className="text-2xl font-bold text-slate-100 tracking-tight sm:text-3xl">
          Communication Preferences
        </h2>
        <p className="text-sm text-slate-400">
          Establish the telemetry level and alert dispatch settings for your active node.
        </p>
      </div>

      <div className="space-y-3 pt-4">
        {preferencesList.map((pref) => {
          const isEnabled = notifications[pref.key as 'email' | 'taskAlerts' | 'rewardUpdates' | 'productNews' | 'securityAlerts'];
          const IconComponent = pref.icon;

          return (
            <div
              key={pref.key}
              className={`flex items-start justify-between gap-4 p-4 rounded-xl border bg-slate-950/25 transition-all duration-200 hover:border-slate-800 ${
                isEnabled ? 'border-slate-800' : 'border-slate-900/60'
              }`}
            >
              <div className="flex gap-3">
                <div className={`p-2 rounded-lg border shrink-0 mt-0.5 ${pref.bgColor} ${pref.iconColor}`}>
                  <IconComponent className="w-4 h-4" />
                </div>
                <div className="space-y-1">
                  <span className="text-sm font-semibold text-slate-200 flex items-center gap-1.5">
                    {pref.title}
                    {pref.required && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/20 uppercase tracking-wide font-semibold">
                        Critical
                      </span>
                    )}
                  </span>
                  <p className="text-xs text-slate-400 leading-relaxed">{pref.description}</p>
                </div>
              </div>

              {/* Accessible Custom Switch Toggle */}
              <button
                type="button"
                onClick={() => handleToggle(pref.key)}
                className={`w-11 h-6 rounded-full p-0.5 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500/50 cursor-pointer ${
                  isEnabled ? 'bg-indigo-600' : 'bg-slate-800'
                }`}
                role="switch"
                aria-checked={isEnabled}
                aria-label={`Toggle ${pref.title}`}
                id={`notify-switch-${pref.key}`}
              >
                <div className={`w-5 h-5 rounded-full bg-slate-100 shadow transform transition-transform ${
                  isEnabled ? 'translate-x-5' : 'translate-x-0'
                }`} />
              </button>
            </div>
          );
        })}
      </div>

      <div className="flex items-center justify-between pt-8 border-t border-slate-900">
        <button
          onClick={onBack}
          className="px-4 py-2.5 text-sm font-semibold text-slate-400 hover:text-slate-200 hover:bg-slate-900 rounded-lg transition-colors cursor-pointer"
          id="btn-notify-back"
        >
          Back
        </button>

        <button
          onClick={onContinue}
          className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 rounded-lg shadow-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-slate-950 transition-all cursor-pointer"
          id="btn-notify-continue"
        >
          Save & Continue
        </button>
      </div>
    </div>
  );
};
