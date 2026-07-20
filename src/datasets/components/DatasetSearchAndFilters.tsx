/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Search, Filter, ArrowUpDown, Tag } from 'lucide-react';
import { DatasetLifecycle, DatasetCategory } from '../types';

interface DatasetSearchAndFiltersProps {
  searchTerm: string;
  setSearchTerm: (val: string) => void;
  selectedCategory: string;
  setSelectedCategory: (val: string) => void;
  selectedLifecycle: string;
  setSelectedLifecycle: (val: string) => void;
  sortBy: string;
  setSortBy: (val: string) => void;
}

export const DatasetSearchAndFilters: React.FC<DatasetSearchAndFiltersProps> = ({
  searchTerm,
  setSearchTerm,
  selectedCategory,
  setSelectedCategory,
  selectedLifecycle,
  setSelectedLifecycle,
  sortBy,
  setSortBy,
}) => {
  return (
    <div className="bg-slate-100 dark:bg-[#131316] border border-slate-200 dark:border-white/5 rounded-2xl p-4 space-y-3">
      <div className="flex flex-col md:flex-row gap-3">
        
        {/* Keyword Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
          <input 
            type="text"
            placeholder="Search datasets by name, identifier, metadata tags..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white dark:bg-[#09090b] border border-slate-200 dark:border-white/5 pl-9 pr-4 py-2 text-xs text-slate-900 dark:text-white rounded-xl focus:outline-none focus:ring-1 focus:ring-indigo-500 placeholder-slate-400 dark:placeholder-slate-500"
          />
        </div>

        {/* Categories */}
        <div className="relative">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full md:w-44 bg-white dark:bg-[#09090b] border border-slate-200 dark:border-white/5 px-3 py-2 text-xs text-slate-900 dark:text-slate-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-indigo-500 font-mono cursor-pointer appearance-none"
          >
            <option value="all">📁 All Categories</option>
            {Object.values(DatasetCategory).map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        {/* Lifecycles */}
        <div className="relative">
          <select
            value={selectedLifecycle}
            onChange={(e) => setSelectedLifecycle(e.target.value)}
            className="w-full md:w-44 bg-white dark:bg-[#09090b] border border-slate-200 dark:border-white/5 px-3 py-2 text-xs text-slate-900 dark:text-slate-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-indigo-500 font-mono cursor-pointer appearance-none"
          >
            <option value="all">⚡ All Statuses</option>
            {Object.values(DatasetLifecycle).map((state) => (
              <option key={state} value={state}>
                {state}
              </option>
            ))}
          </select>
        </div>

        {/* Sorters */}
        <div className="relative">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="w-full md:w-44 bg-white dark:bg-[#09090b] border border-slate-200 dark:border-white/5 px-3 py-2 text-xs text-slate-900 dark:text-slate-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-indigo-500 font-mono cursor-pointer appearance-none"
          >
            <option value="newest">📅 Newest Ingest</option>
            <option value="oldest">📅 Oldest Ingest</option>
            <option value="rowsHigh">📊 Row Count: High</option>
            <option value="rowsLow">📊 Row Count: Low</option>
            <option value="qualityHigh">🛡️ Quality: High</option>
            <option value="sizeHigh">📦 File Size: High</option>
          </select>
        </div>

      </div>

      {/* Active Filter Badges */}
      {(selectedCategory !== 'all' || selectedLifecycle !== 'all' || searchTerm) && (
        <div className="flex flex-wrap gap-1.5 items-center pt-2 border-t border-slate-200 dark:border-white/5 text-[10px] font-mono text-slate-400">
          <span>Active Filters:</span>
          {searchTerm && (
            <span className="bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 px-2 py-0.5 rounded-md">
              Keyword: "{searchTerm}"
            </span>
          )}
          {selectedCategory !== 'all' && (
            <span className="bg-purple-500/10 text-purple-400 border border-purple-500/20 px-2 py-0.5 rounded-md">
              Category: {selectedCategory}
            </span>
          )}
          {selectedLifecycle !== 'all' && (
            <span className="bg-amber-500/10 text-amber-400 border border-amber-500/20 px-2 py-0.5 rounded-md">
              Status: {selectedLifecycle}
            </span>
          )}
          <button 
            onClick={() => {
              setSearchTerm('');
              setSelectedCategory('all');
              setSelectedLifecycle('all');
            }}
            className="text-indigo-400 hover:underline hover:text-white ml-auto cursor-pointer"
          >
            Reset Filters
          </button>
        </div>
      )}
    </div>
  );
};
