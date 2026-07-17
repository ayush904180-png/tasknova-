/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ONBOARDING_INTERESTS } from '../constants';
import { Check, Search, Grid, HelpCircle, Star } from 'lucide-react';

interface InterestsSkillsStepProps {
  selectedInterests: string[];
  onChangeInterests: (interests: string[]) => void;
  onContinue: () => void;
  onBack: () => void;
}

export const InterestsSkillsStep: React.FC<InterestsSkillsStepProps> = ({
  selectedInterests,
  onChangeInterests,
  onContinue,
  onBack,
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  const toggleInterest = (id: string) => {
    if (selectedInterests.includes(id)) {
      onChangeInterests(selectedInterests.filter((x) => x !== id));
    } else {
      onChangeInterests([...selectedInterests, id]);
    }
  };

  const handleSelectAll = () => {
    onChangeInterests(ONBOARDING_INTERESTS.map((x) => x.id));
  };

  const handleDeselectAll = () => {
    onChangeInterests([]);
  };

  const filteredInterests = ONBOARDING_INTERESTS.filter((item) =>
    item.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-fade-in" id="onboarding-interests-step">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-slate-100 tracking-tight sm:text-3xl">
          Interests & Alignment Skills
        </h2>
        <p className="text-sm text-slate-400 max-w-lg mx-auto">
          Select areas you are interested in or already have background experience aligning. Choose at least one.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between pt-2">
        {/* Search Bar */}
        <div className="relative w-full sm:max-w-xs">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-500 pointer-events-none">
            <Search className="w-4 h-4" />
          </span>
          <input
            type="text"
            placeholder="Search specialties..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs rounded-lg bg-slate-900 border border-slate-800 text-slate-200 placeholder:text-slate-600 focus:outline-none focus:ring-1 focus:ring-indigo-500 hover:border-slate-700 transition-colors"
          />
        </div>

        {/* Shortcuts */}
        <div className="flex gap-2 w-full sm:w-auto justify-end">
          <button
            type="button"
            onClick={handleSelectAll}
            className="text-xs px-2.5 py-1.5 rounded bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-slate-200 transition-all cursor-pointer"
            id="btn-interests-select-all"
          >
            Select All
          </button>
          <button
            type="button"
            onClick={handleDeselectAll}
            disabled={selectedInterests.length === 0}
            className={`text-xs px-2.5 py-1.5 rounded border transition-all ${
              selectedInterests.length > 0
                ? 'bg-slate-900 hover:bg-slate-800 border-slate-800 text-slate-400 hover:text-slate-200 cursor-pointer'
                : 'bg-slate-950 border-slate-900 text-slate-700 cursor-not-allowed'
            }`}
            id="btn-interests-clear"
          >
            Clear Selected
          </button>
        </div>
      </div>

      {/* Grid of Selectable Skill Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" role="group" aria-label="Selectable interests and skills">
        {filteredInterests.length > 0 ? (
          filteredInterests.map((item) => {
            const isSelected = selectedInterests.includes(item.id);

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => toggleInterest(item.id)}
                className={`text-left p-4 rounded-xl border transition-all duration-200 flex items-start gap-3 relative focus:outline-none focus:ring-2 focus:ring-indigo-500/40 cursor-pointer ${
                  isSelected
                    ? 'border-indigo-500/80 bg-indigo-950/15 shadow-md shadow-indigo-500/5'
                    : 'border-slate-800/80 bg-slate-950/20 hover:border-slate-700 hover:bg-slate-900/10'
                }`}
                aria-checked={isSelected}
                role="checkbox"
                id={`interest-card-${item.id}`}
              >
                <div className={`w-5 h-5 rounded flex items-center justify-center shrink-0 mt-0.5 border ${
                  isSelected
                    ? 'border-indigo-500 bg-indigo-500 text-slate-950'
                    : 'border-slate-700 bg-slate-900 text-transparent'
                }`}>
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                </div>

                <div className="space-y-1 pr-4">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-sm font-semibold text-slate-200">{item.label}</span>
                    <span className="px-1.5 py-0.5 rounded bg-slate-900 text-[10px] font-medium text-slate-500 border border-slate-800">
                      {item.category}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">{item.description}</p>
                </div>
              </button>
            );
          })
        ) : (
          <div className="col-span-full py-12 text-center border border-dashed border-slate-800 rounded-2xl">
            <HelpCircle className="w-8 h-8 text-slate-600 mx-auto mb-2" />
            <p className="text-sm text-slate-400">No specialties match your search filter.</p>
            <button
              onClick={() => setSearchQuery('')}
              className="mt-2 text-xs font-semibold text-indigo-400 underline hover:text-indigo-300"
            >
              Clear Search Filter
            </button>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between pt-8 border-t border-slate-900">
        <button
          onClick={onBack}
          className="px-4 py-2.5 text-sm font-semibold text-slate-400 hover:text-slate-200 hover:bg-slate-900 rounded-lg transition-colors cursor-pointer"
          id="btn-interests-back"
        >
          Back
        </button>

        <button
          onClick={onContinue}
          disabled={selectedInterests.length === 0}
          className={`inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-slate-950 ${
            selectedInterests.length > 0
              ? 'text-white bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 cursor-pointer'
              : 'text-slate-500 bg-slate-900 border border-slate-800 cursor-not-allowed'
          }`}
          id="btn-interests-continue"
        >
          Save & Continue
        </button>
      </div>
    </div>
  );
};
