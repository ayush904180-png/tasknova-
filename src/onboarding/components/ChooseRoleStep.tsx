/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { UserRole } from '../../auth/types';
import { ONBOARDING_ROLES } from '../constants';
import { Check, Clock, User, ShieldAlert, Award, Star } from 'lucide-react';

interface ChooseRoleStepProps {
  selectedRole: UserRole | null;
  onSelectRole: (role: UserRole) => void;
  onContinue: () => void;
  onBack: () => void;
}

export const ChooseRoleStep: React.FC<ChooseRoleStepProps> = ({
  selectedRole,
  onSelectRole,
  onContinue,
  onBack,
}) => {
  return (
    <div className="space-y-6 animate-fade-in" id="onboarding-role-step">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-slate-100 tracking-tight sm:text-3xl">
          Choose Your Account Node
        </h2>
        <p className="text-sm text-slate-400 max-w-lg mx-auto">
          Select the active role that matches your engagement intent. You can configure secondary permissions inside settings later.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-4">
        {ONBOARDING_ROLES.map((option) => {
          const isSelected = selectedRole === option.role;
          
          return (
            <button
              key={option.role}
              type="button"
              onClick={() => onSelectRole(option.role)}
              className={`text-left flex flex-col justify-between p-6 rounded-2xl border transition-all duration-200 relative focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-slate-950 cursor-pointer ${
                isSelected
                  ? 'border-indigo-500 bg-indigo-950/20 shadow-lg shadow-indigo-500/5'
                  : 'border-slate-800 bg-slate-950/40 hover:border-slate-700 hover:bg-slate-900/30'
              }`}
              aria-checked={isSelected}
              role="radio"
              id={`role-card-${option.role}`}
            >
              {isSelected && (
                <span className="absolute top-4 right-4 flex h-6 w-6 items-center justify-center rounded-full bg-indigo-500 text-slate-950">
                  <Check className="w-4 h-4 stroke-[3]" />
                </span>
              )}

              <div className="space-y-4">
                {/* Header Tag / Badge */}
                <div className="flex items-center justify-between">
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold ${
                    option.role === UserRole.CONTRIBUTOR 
                      ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20'
                      : option.role === UserRole.CREATOR
                      ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20'
                      : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                  }`}>
                    {option.role === UserRole.CONTRIBUTOR ? <User className="w-3 h-3" /> : option.role === UserRole.CREATOR ? <Star className="w-3 h-3" /> : <Award className="w-3 h-3" />}
                    {option.role.toUpperCase()}
                  </span>
                  
                  <span className="flex items-center gap-1 text-xs text-slate-500 font-mono">
                    <Clock className="w-3 h-3" />
                    {option.estimatedTime}
                  </span>
                </div>

                <div className="space-y-2">
                  <h3 className="text-lg font-bold text-slate-100">{option.title}</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">{option.description}</p>
                </div>

                {/* Capabilities checklist */}
                <div className="space-y-2 pt-2 border-t border-slate-800/80">
                  <h4 className="text-xs font-semibold text-slate-400 tracking-wider uppercase">Capabilities Includes:</h4>
                  <ul className="space-y-1.5">
                    {option.capabilities.map((cap, i) => (
                      <li key={i} className="flex items-start gap-2 text-xs text-slate-400">
                        <Check className="w-3.5 h-3.5 text-indigo-400/80 shrink-0 mt-0.5" />
                        <span>{cap}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      <div className="flex items-center justify-between pt-8 border-t border-slate-900">
        <button
          onClick={onBack}
          className="px-4 py-2.5 text-sm font-semibold text-slate-400 hover:text-slate-200 hover:bg-slate-900 rounded-lg transition-colors cursor-pointer focus:outline-none focus:ring-1 focus:ring-slate-700"
          id="btn-role-back"
        >
          Back
        </button>

        <button
          onClick={onContinue}
          disabled={!selectedRole}
          className={`inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-slate-950 ${
            selectedRole
              ? 'text-white bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 cursor-pointer'
              : 'text-slate-500 bg-slate-900 border border-slate-800 cursor-not-allowed'
          }`}
          id="btn-role-continue"
        >
          Save & Continue
        </button>
      </div>
    </div>
  );
};
