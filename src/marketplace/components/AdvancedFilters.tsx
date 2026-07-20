/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, FormEvent } from 'react';
import { useMarketplace } from '../context/MarketplaceContext';
import { 
  Search, SlidersHorizontal, Save, Trash2, 
  RefreshCw, Check, ArrowUpDown, HelpCircle, X 
} from 'lucide-react';

export function AdvancedFilters() {
  const { 
    filters, 
    setFilters, 
    preferences, 
    saveCurrentFilter, 
    loadSavedFilter, 
    deleteSavedFilter,
    resetProfile 
  } = useMarketplace();

  const [isOpen, setIsOpen] = useState(false);
  const [filterNameInput, setFilterNameInput] = useState('');
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState('');

  // Extract static unique helper values or fallback definitions
  const categories = ['All', 'AI Response Comparison', 'Image Safety Review', 'Translation Review', 'Semantic Tagging', 'Data Annotation', 'Prompt Engineering'];
  const difficulties = ['All', 'Easy', 'Medium', 'Hard'];
  const countries = ['All', 'US', 'ES', 'IN', 'GB', 'ALL'];
  const languages = ['All', 'en-US', 'es-ES', 'hi-IN', 'ALL'];
  const taskTypes = ['All', 'AI Response Comparison', 'Image Safety Review', 'Translation Review', 'Prompt Evaluation', 'RLHF Evaluation'];
  const sortOptions = ['Highest Match', 'Reward (High to Low)', 'Reward (Low to High)', 'Estimated Time (Fastest)', 'Required Trust (Lowest)', 'Recently Published'];

  const handleFilterChange = (key: string, value: any) => {
    setFilters((prev: any) => ({
      ...prev,
      [key]: value
    }));
  };

  const handleResetFilters = () => {
    setFilters({
      searchQuery: '',
      category: 'All',
      difficulty: 'All',
      minReward: 0,
      maxReward: 100,
      country: 'All',
      language: 'All',
      business: 'All',
      campaign: 'All',
      taskType: 'All',
      maxEstimatedTime: 300,
      minTrustRequirement: 0,
      status: 'All',
      sortBy: 'Highest Match'
    });
    setFilterNameInput('');
    setSaveError('');
  };

  const handleSaveFilter = (e: FormEvent) => {
    e.preventDefault();
    setSaveError('');
    if (!filterNameInput.trim()) {
      setSaveError('Please enter a name');
      return;
    }

    const res = saveCurrentFilter(filterNameInput);
    if (res.success) {
      setSaveSuccess(true);
      setFilterNameInput('');
      setTimeout(() => setSaveSuccess(false), 2000);
    } else {
      setSaveError(res.error || 'Failed to save');
    }
  };

  return (
    <div className="bg-slate-900/20 border border-slate-800/80 rounded-xl p-4 backdrop-blur-sm">
      {/* Search Header Row */}
      <div className="flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="relative w-full md:flex-1">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-500">
            <Search className="w-4 h-4" />
          </span>
          <input
            id="task-search-input"
            type="text"
            className="w-full bg-slate-950/60 border border-slate-800/60 hover:border-slate-800 focus:border-purple-500/80 rounded-lg py-2 pl-9 pr-4 text-sm text-slate-200 placeholder-slate-500 focus:outline-none transition-colors"
            placeholder="Search tasks by keyword, business campaigns, or matching requirements..."
            value={filters.searchQuery}
            onChange={(e) => handleFilterChange('searchQuery', e.target.value)}
          />
          {filters.searchQuery && (
            <button 
              onClick={() => handleFilterChange('searchQuery', '')}
              className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-500 hover:text-slate-300"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        <div className="flex w-full md:w-auto items-center gap-2">
          {/* Advanced toggle */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className={`flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-lg border text-xs font-semibold transition-all w-full md:w-auto ${
              isOpen 
                ? 'bg-purple-500/10 border-purple-500/40 text-purple-400' 
                : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:bg-slate-900 hover:text-slate-300'
            }`}
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Advanced Filters</span>
          </button>

          {/* Quick sorting selection */}
          <div className="relative w-full md:w-48">
            <select
              className="w-full bg-slate-900/60 border border-slate-800 text-xs text-slate-400 rounded-lg py-2 px-3 focus:outline-none focus:border-purple-500/60 cursor-pointer appearance-none"
              value={filters.sortBy}
              onChange={(e) => handleFilterChange('sortBy', e.target.value)}
            >
              {sortOptions.map(opt => (
                <option key={opt} value={opt} className="bg-slate-950 text-slate-300">{opt}</option>
              ))}
            </select>
            <span className="absolute inset-y-0 right-2 flex items-center text-slate-500 pointer-events-none">
              <ArrowUpDown className="w-3 h-3" />
            </span>
          </div>

          <button
            onClick={handleResetFilters}
            className="p-2 bg-slate-900/60 border border-slate-800 text-slate-400 hover:text-slate-200 rounded-lg transition-colors"
            title="Reset Filters"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Advanced Filters Expanded Drawer */}
      {isOpen && (
        <div className="mt-4 pt-4 border-t border-slate-800/60 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 animate-fade-in">
          {/* Column 1: Category & Difficulty */}
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-mono text-slate-400 mb-1">Task Category</label>
              <select
                className="w-full bg-slate-950/60 border border-slate-800/80 rounded-lg py-1.5 px-2 text-xs text-slate-300 focus:outline-none focus:border-purple-500/60"
                value={filters.category}
                onChange={(e) => handleFilterChange('category', e.target.value)}
              >
                {categories.map(cat => (
                  <option key={cat} value={cat} className="bg-slate-950">{cat}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-mono text-slate-400 mb-1">Difficulty Level</label>
              <select
                className="w-full bg-slate-950/60 border border-slate-800/80 rounded-lg py-1.5 px-2 text-xs text-slate-300 focus:outline-none focus:border-purple-500/60"
                value={filters.difficulty}
                onChange={(e) => handleFilterChange('difficulty', e.target.value)}
              >
                {difficulties.map(diff => (
                  <option key={diff} value={diff} className="bg-slate-950">{diff}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Column 2: Geographic & Language Parameters */}
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-mono text-slate-400 mb-1">Target Language</label>
              <select
                className="w-full bg-slate-950/60 border border-slate-800/80 rounded-lg py-1.5 px-2 text-xs text-slate-300 focus:outline-none focus:border-purple-500/60"
                value={filters.language}
                onChange={(e) => handleFilterChange('language', e.target.value)}
              >
                {languages.map(lang => (
                  <option key={lang} value={lang} className="bg-slate-950">{lang}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-mono text-slate-400 mb-1">Target Country</label>
              <select
                className="w-full bg-slate-950/60 border border-slate-800/80 rounded-lg py-1.5 px-2 text-xs text-slate-300 focus:outline-none focus:border-purple-500/60"
                value={filters.country}
                onChange={(e) => handleFilterChange('country', e.target.value)}
              >
                {countries.map(country => (
                  <option key={country} value={country} className="bg-slate-950">{country}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Column 3: Trust requirements & Maximum Duration */}
          <div className="space-y-3">
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-mono text-slate-400">Min Trust score</label>
                <span className="text-xs font-mono font-semibold text-purple-400">{filters.minTrustRequirement}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="95"
                step="5"
                className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-purple-500"
                value={filters.minTrustRequirement}
                onChange={(e) => handleFilterChange('minTrustRequirement', parseInt(e.target.value))}
              />
            </div>
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-mono text-slate-400">Max Estimated Time</label>
                <span className="text-xs font-mono font-semibold text-purple-400">{filters.maxEstimatedTime}s</span>
              </div>
              <input
                type="range"
                min="15"
                max="300"
                step="15"
                className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-purple-500"
                value={filters.maxEstimatedTime}
                onChange={(e) => handleFilterChange('maxEstimatedTime', parseInt(e.target.value))}
              />
            </div>
          </div>

          {/* Column 4: Reward Bounds & Save Query Node */}
          <div className="space-y-3 bg-slate-950/40 p-2.5 rounded-lg border border-slate-800/60">
            <span className="block text-xs font-semibold text-slate-400 mb-1 font-mono">Query Persistence</span>
            <form onSubmit={handleSaveFilter} className="flex gap-1.5">
              <input
                type="text"
                placeholder="Query Name..."
                value={filterNameInput}
                onChange={(e) => setFilterNameInput(e.target.value)}
                className="flex-1 bg-slate-950 border border-slate-800 rounded px-2 py-1 text-xs text-slate-300 focus:outline-none focus:border-purple-500/60"
              />
              <button
                type="submit"
                className="px-2 bg-purple-500/15 hover:bg-purple-500/25 border border-purple-500/30 text-purple-400 rounded text-xs transition-colors"
                title="Save Current Filter Configuration"
              >
                <Save className="w-3.5 h-3.5" />
              </button>
            </form>
            {saveSuccess && (
              <span className="text-[10px] text-emerald-400 block font-mono flex items-center mt-1">
                <Check className="w-3 h-3 mr-0.5" /> Saved to profile preferences!
              </span>
            )}
            {saveError && (
              <span className="text-[10px] text-red-400 block font-mono mt-1">{saveError}</span>
            )}

            {/* Render saved filter shortcuts */}
            {preferences?.savedFilters && preferences.savedFilters.length > 0 && (
              <div className="mt-2 pt-2 border-t border-slate-800/60">
                <span className="text-[10px] text-slate-500 uppercase tracking-wider block font-mono mb-1">Your Presets</span>
                <div className="flex flex-wrap gap-1 max-h-16 overflow-y-auto">
                  {preferences.savedFilters.map((saved) => (
                    <div key={saved.id} className="flex items-center gap-0.5 bg-slate-900 border border-slate-800 rounded px-1.5 py-0.5 text-[9px] font-mono text-slate-300">
                      <button 
                        type="button"
                        onClick={() => loadSavedFilter(saved.id)}
                        className="hover:text-purple-400 transition-colors"
                      >
                        {saved.name}
                      </button>
                      <button 
                        type="button" 
                        onClick={() => deleteSavedFilter(saved.id)}
                        className="text-slate-500 hover:text-red-400 transition-colors"
                      >
                        <Trash2 className="w-2.5 h-2.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
