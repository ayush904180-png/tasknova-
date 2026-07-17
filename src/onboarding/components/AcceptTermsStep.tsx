/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { ExternalLink, Check, Info, ShieldCheck } from 'lucide-react';

interface AcceptTermsStepProps {
  termsAccepted: {
    tos: boolean;
    privacy: boolean;
    community: boolean;
    dataUsage: boolean;
  };
  onChangeTerms: (key: 'tos' | 'privacy' | 'community' | 'dataUsage', value: boolean) => void;
  onContinue: () => void;
  onBack: () => void;
}

export const AcceptTermsStep: React.FC<AcceptTermsStepProps> = ({
  termsAccepted,
  onChangeTerms,
  onContinue,
  onBack,
}) => {
  const allAccepted = termsAccepted.tos && termsAccepted.privacy && termsAccepted.community && termsAccepted.dataUsage;

  const handleAcceptAll = () => {
    onChangeTerms('tos', true);
    onChangeTerms('privacy', true);
    onChangeTerms('community', true);
    onChangeTerms('dataUsage', true);
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-2xl mx-auto" id="onboarding-terms-step">
      <div className="text-center space-y-2">
        <div className="inline-flex p-2.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-xl mb-1">
          <ShieldCheck className="w-6 h-6" />
        </div>
        <h2 className="text-2xl font-bold text-slate-100 tracking-tight sm:text-3xl">
          Legal & Compliance Agreement
        </h2>
        <p className="text-sm text-slate-400">
          Please review and accept our foundation documents. All links are encrypted placeholders for Sandbox staging.
        </p>
      </div>

      <div className="space-y-4 pt-4">
        {/* Bulk Accept All Button */}
        {!allAccepted && (
          <div className="flex justify-end">
            <button
              type="button"
              onClick={handleAcceptAll}
              className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 focus:outline-none transition-colors cursor-pointer"
              id="btn-terms-accept-all"
            >
              Accept All Framework Agreements
            </button>
          </div>
        )}

        {/* Checkbox Rows */}
        <div className="space-y-3">
          {[
            { key: 'tos', label: 'Terms of Service', desc: 'Enforces platform usage guidelines, node access limitations, and cryptographic asset agreements.', link: '#terms-of-service' },
            { key: 'privacy', label: 'Privacy Policy', desc: 'Explains secure cookie storage, zero-telemetry trackers, and client-side credential persistence schemas.', link: '#privacy-policy' },
            { key: 'community', label: 'Community Guidelines', desc: 'Establishes proper alignment evaluation principles, anti-bias behaviors, and quality assurance targets.', link: '#community-guidelines' },
            { key: 'dataUsage', label: 'Data Usage Notice', desc: 'Acknowledges that alignment payloads will be compiled for foundational model instruction fine-tuning.', link: '#data-usage' },
          ].map((item) => {
            const isChecked = termsAccepted[item.key as 'tos' | 'privacy' | 'community' | 'dataUsage'];
            return (
              <label
                key={item.key}
                className={`flex items-start gap-4 p-4 rounded-xl border transition-all duration-200 cursor-pointer select-none ${
                  isChecked
                    ? 'border-emerald-500/30 bg-emerald-950/5'
                    : 'border-slate-800 bg-slate-950/20 hover:border-slate-700'
                }`}
                id={`terms-label-${item.key}`}
              >
                <div className="flex items-center h-5 mt-0.5">
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={(e) => onChangeTerms(item.key as 'tos' | 'privacy' | 'community' | 'dataUsage', e.target.checked)}
                    className="sr-only"
                    id={`terms-checkbox-${item.key}`}
                  />
                  <div className={`w-5 h-5 rounded border flex items-center justify-center transition-all ${
                    isChecked
                      ? 'border-emerald-500 bg-emerald-600 text-slate-950'
                      : 'border-slate-700 bg-slate-900 text-transparent'
                  }`}>
                    <Check className="w-3.5 h-3.5 stroke-[3.5]" />
                  </div>
                </div>

                <div className="space-y-1 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-sm font-semibold text-slate-200">{item.label}</span>
                    <a
                      href={item.link}
                      onClick={(e) => e.preventDefault()}
                      className="text-slate-500 hover:text-slate-300 transition-colors inline-flex items-center gap-1 text-xs font-mono"
                      title={`View ${item.label} (Placeholder)`}
                    >
                      <span className="underline">View Document</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">{item.desc}</p>
                </div>
              </label>
            );
          })}
        </div>

        {/* Informational Banner */}
        <div className="p-3.5 bg-slate-900 border border-slate-800 rounded-xl flex items-start gap-3">
          <Info className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
          <p className="text-xs text-slate-400 leading-relaxed">
            All records will be synchronized dynamically with our security ledger upon acceptance. Accepting all protocols allows the system to initialize the active node configuration.
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between pt-8 border-t border-slate-900">
        <button
          onClick={onBack}
          className="px-4 py-2.5 text-sm font-semibold text-slate-400 hover:text-slate-200 hover:bg-slate-900 rounded-lg transition-colors cursor-pointer"
          id="btn-terms-back"
        >
          Back
        </button>

        <button
          onClick={onContinue}
          disabled={!allAccepted}
          className={`inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 focus:ring-offset-slate-950 ${
            allAccepted
              ? 'text-slate-950 bg-emerald-400 hover:bg-emerald-300 active:bg-emerald-500 font-bold cursor-pointer'
              : 'text-slate-500 bg-slate-900 border border-slate-800 cursor-not-allowed'
          }`}
          id="btn-terms-continue"
        >
          Accept All & Continue
        </button>
      </div>
    </div>
  );
};
