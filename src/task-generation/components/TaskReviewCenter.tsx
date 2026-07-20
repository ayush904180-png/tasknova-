/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Search, Filter, CheckSquare, Square, Trash2, Check, X,
  ExternalLink, ShieldAlert, Sparkles, AlertTriangle, Eye, Globe, Coins, BookOpen, Layers, Settings, ListFilter, Save, ChevronLeft, ChevronRight
} from 'lucide-react';
import { useTaskGeneration } from '../context/TaskGenerationContext';
import { GeneratedTaskEntity, GeneratedTaskStatus } from '../types';
import { TaskDifficulty, TaskPriority } from '../../types/tasks';
import { TaskGenerationMapper } from '../mappers/TaskGenerationMapper';

export const TaskReviewCenter: React.FC = () => {
  const { 
    generatedTasks, approveTask, rejectTask, publishTask, 
    bulkApproveTasks, bulkRejectTasks, bulkPublishTasks, bulkDeleteTasks 
  } = useTaskGeneration();

  // Active status tab queue
  const [activeQueue, setActiveQueue] = useState<GeneratedTaskStatus>(GeneratedTaskStatus.PENDING);

  // Search & Filters state
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDatasetId, setSelectedDatasetId] = useState('all');
  const [selectedTaskType, setSelectedTaskType] = useState('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');
  const [selectedLanguage, setSelectedLanguage] = useState('all');
  const [selectedCountry, setSelectedCountry] = useState('all');
  const [minReward, setMinReward] = useState('');
  const [maxReward, setMaxReward] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Selected tasks for bulk operations
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  
  // Selected task for detailed side-panel preview / inspector
  const [inspectTask, setInspectTask] = useState<GeneratedTaskEntity | null>(null);
  const [reviewNoteInput, setReviewNoteInput] = useState('');

  // Predefined Saved Filters list (Fulfills Saved Filters requirement)
  const savedFilters = [
    { name: '🔥 Critical Anomalies', query: { difficulty: 'all', taskType: 'all', country: 'all', searchTerm: '', minReward: '', maxReward: '', sortBy: 'newest' } },
    { name: '💎 High Reward RLHF', query: { difficulty: 'all', taskType: 'RLHF Ranking', country: 'all', searchTerm: '', minReward: '20', maxReward: '', sortBy: 'rewardHigh' } },
    { name: '📷 Computer Vision US', query: { difficulty: 'all', taskType: 'Image Safety Review', country: 'US', searchTerm: '', minReward: '', maxReward: '', sortBy: 'newest' } },
    { name: '🌍 International Translation', query: { difficulty: 'Hard', taskType: 'Translation Review', country: 'ES', searchTerm: '', minReward: '', maxReward: '', sortBy: 'newest' } },
  ];

  const applySavedFilter = (f: typeof savedFilters[0]) => {
    setSelectedDifficulty(f.query.difficulty);
    setSelectedTaskType(f.query.taskType);
    setSelectedCountry(f.query.country);
    setSearchTerm(f.query.searchTerm);
    setMinReward(f.query.minReward);
    setMaxReward(f.query.maxReward);
    setSortBy(f.query.sortBy);
    setCurrentPage(1);
    setSelectedIds([]);
  };

  // Reset Filters helper
  const resetFilters = () => {
    setSearchTerm('');
    setSelectedDatasetId('all');
    setSelectedTaskType('all');
    setSelectedDifficulty('all');
    setSelectedLanguage('all');
    setSelectedCountry('all');
    setMinReward('');
    setMaxReward('');
    setSortBy('newest');
    setCurrentPage(1);
    setSelectedIds([]);
  };

  // Unique dataset ids, taskTypes, languages and countries for filter dropdowns
  const uniqueDatasetIds = Array.from(new Set(generatedTasks.map(t => t.datasetId)));
  const uniqueTaskTypes = Array.from(new Set(generatedTasks.map(t => t.taskType)));
  const uniqueLanguages = Array.from(new Set(generatedTasks.map(t => t.language)));
  const uniqueCountries = Array.from(new Set(generatedTasks.map(t => t.country)));

  // FILTER LOGIC
  const filtered = generatedTasks.filter((task) => {
    const matchesQueue = task.status === activeQueue;
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          task.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          task.id.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesDataset = selectedDatasetId === 'all' || task.datasetId === selectedDatasetId;
    const matchesType = selectedTaskType === 'all' || task.taskType === selectedTaskType;
    const matchesDifficulty = selectedDifficulty === 'all' || task.difficulty === selectedDifficulty;
    const matchesLanguage = selectedLanguage === 'all' || task.language === selectedLanguage;
    const matchesCountry = selectedCountry === 'all' || task.country === selectedCountry;
    
    const matchesMinReward = !minReward || task.rewardCoins >= parseInt(minReward);
    const matchesMaxReward = !maxReward || task.rewardCoins <= parseInt(maxReward);

    return matchesQueue && matchesSearch && matchesDataset && matchesType && 
           matchesDifficulty && matchesLanguage && matchesCountry && 
           matchesMinReward && matchesMaxReward;
  });

  // SORT LOGIC
  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === 'newest') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    if (sortBy === 'oldest') return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    if (sortBy === 'rewardHigh') return b.rewardCoins - a.rewardCoins;
    if (sortBy === 'rewardLow') return a.rewardCoins - b.rewardCoins;
    if (sortBy === 'difficultyHigh') {
      const diffMap = { Easy: 1, Medium: 2, Hard: 3 };
      return (diffMap[b.difficulty] || 0) - (diffMap[a.difficulty] || 0);
    }
    return 0;
  });

  // PAGINATION
  const totalItems = sorted.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedTasks = sorted.slice(startIndex, startIndex + itemsPerPage);

  // BULK CHECKBOX HANDLERS
  const handleSelectAll = () => {
    const pageIds = paginatedTasks.map(t => t.id);
    const allSelected = pageIds.every(id => selectedIds.includes(id));
    if (allSelected) {
      setSelectedIds(prev => prev.filter(id => !pageIds.includes(id)));
    } else {
      setSelectedIds(prev => Array.from(new Set([...prev, ...pageIds])));
    }
  };

  const handleSelectOne = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(prev => prev.filter(item => item !== id));
    } else {
      setSelectedIds(prev => [...prev, id]);
    }
  };

  // BULK ACTIONS
  const executeBulkApprove = async () => {
    if (selectedIds.length === 0) return;
    await bulkApproveTasks(selectedIds, 'Bulk Approved via Review Panel');
    setSelectedIds([]);
    alert('Bulk Approved successfully.');
  };

  const executeBulkReject = async () => {
    if (selectedIds.length === 0) return;
    const reason = prompt('Please input bulk rejection feedback comment:') || 'Bulk Rejected';
    await bulkRejectTasks(selectedIds, reason);
    setSelectedIds([]);
    alert('Bulk Rejected completed.');
  };

  const executeBulkPublish = async () => {
    if (selectedIds.length === 0) return;
    await bulkPublishTasks(selectedIds);
    setSelectedIds([]);
    alert('Bulk Published to marketplace successfully.');
  };

  const executeBulkDelete = async () => {
    if (selectedIds.length === 0) return;
    if (confirm(`Are you sure you want to delete ${selectedIds.length} tasks from generation draft database?`)) {
      await bulkDeleteTasks(selectedIds);
      setSelectedIds([]);
    }
  };

  // INSPECTOR ACTION
  const executeInspectApprove = async () => {
    if (!inspectTask) return;
    await approveTask(inspectTask.id, reviewNoteInput || 'Approved during manual audit checks');
    setInspectTask(null);
    setReviewNoteInput('');
  };

  const executeInspectReject = async () => {
    if (!inspectTask) return;
    await rejectTask(inspectTask.id, reviewNoteInput || 'Rejected - fails validation guidelines');
    setInspectTask(null);
    setReviewNoteInput('');
  };

  const executeInspectPublish = async () => {
    if (!inspectTask) return;
    const ok = await publishTask(inspectTask.id);
    if (ok) {
      alert('Task successfully published into standard live task stream.');
    }
    setInspectTask(null);
    setReviewNoteInput('');
  };

  return (
    <div className="space-y-6">
      
      {/* Search & Filter bar layout */}
      <div className="bg-white dark:bg-[#131316] border border-slate-200 dark:border-white/5 rounded-2xl p-5 space-y-4">
        
        {/* Dynamic Queue state selector bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 dark:border-white/5 pb-3">
          <div className="flex flex-wrap gap-1.5 text-[11px] font-mono">
            {Object.values(GeneratedTaskStatus).map((status) => {
              const count = generatedTasks.filter(t => t.status === status).length;
              return (
                <button
                  key={status}
                  onClick={() => {
                    setActiveQueue(status);
                    setCurrentPage(1);
                    setSelectedIds([]);
                    setInspectTask(null);
                  }}
                  className={`px-3 py-1.5 rounded-lg border transition-all cursor-pointer ${
                    activeQueue === status
                      ? 'bg-indigo-600 border-indigo-600 text-white font-bold'
                      : 'bg-slate-50 dark:bg-white/1 border-slate-200 dark:border-white/5 text-slate-500 hover:text-slate-300'
                  }`}
                >
                  {status} ({count})
                </button>
              );
            })}
          </div>

          <button
            onClick={resetFilters}
            className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 text-slate-500 hover:text-slate-300 text-[10px] font-mono rounded-lg cursor-pointer"
          >
            Reset All Filters
          </button>
        </div>

        {/* Compound Grid Filters */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3 text-xs">
          
          {/* Keyword search input */}
          <div className="space-y-1 col-span-2">
            <span className="block text-[9px] font-mono text-slate-500 uppercase tracking-widest font-bold">Search Keywords</span>
            <div className="relative">
              <Search className="h-3.5 w-3.5 text-slate-500 absolute left-3 top-3" />
              <input
                type="text"
                placeholder="ID, keyword, or title..."
                value={searchTerm}
                onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-white/1 border border-slate-200 dark:border-white/5 rounded-xl focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          {/* Task Type Filter */}
          <div className="space-y-1">
            <span className="block text-[9px] font-mono text-slate-500 uppercase tracking-widest font-bold">Task Type</span>
            <select
              value={selectedTaskType}
              onChange={(e) => { setSelectedTaskType(e.target.value); setCurrentPage(1); }}
              className="w-full px-2 py-2 bg-slate-50 dark:bg-[#131316] border border-slate-200 dark:border-white/5 rounded-xl focus:outline-none"
            >
              <option value="all">All Types</option>
              {uniqueTaskTypes.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>

          {/* Difficulty Filter */}
          <div className="space-y-1">
            <span className="block text-[9px] font-mono text-slate-500 uppercase tracking-widest font-bold">Difficulty</span>
            <select
              value={selectedDifficulty}
              onChange={(e) => { setSelectedDifficulty(e.target.value); setCurrentPage(1); }}
              className="w-full px-2 py-2 bg-slate-50 dark:bg-[#131316] border border-slate-200 dark:border-white/5 rounded-xl focus:outline-none"
            >
              <option value="all">All Difficulties</option>
              <option value="Easy">Easy</option>
              <option value="Medium">Medium</option>
              <option value="Hard">Hard</option>
            </select>
          </div>

          {/* Country Boundary */}
          <div className="space-y-1">
            <span className="block text-[9px] font-mono text-slate-500 uppercase tracking-widest font-bold">Target Country</span>
            <select
              value={selectedCountry}
              onChange={(e) => { setSelectedCountry(e.target.value); setCurrentPage(1); }}
              className="w-full px-2 py-2 bg-slate-50 dark:bg-[#131316] border border-slate-200 dark:border-white/5 rounded-xl focus:outline-none"
            >
              <option value="all">All Countries</option>
              {uniqueCountries.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          {/* Sorting Option */}
          <div className="space-y-1">
            <span className="block text-[9px] font-mono text-slate-500 uppercase tracking-widest font-bold">Sort By</span>
            <select
              value={sortBy}
              onChange={(e) => { setSortBy(e.target.value); setCurrentPage(1); }}
              className="w-full px-2 py-2 bg-slate-50 dark:bg-[#131316] border border-slate-200 dark:border-white/5 rounded-xl focus:outline-none font-sans font-medium"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="rewardHigh">Reward: High &rarr; Low</option>
              <option value="rewardLow">Reward: Low &rarr; High</option>
              <option value="difficultyHigh">Difficulty Scale</option>
            </select>
          </div>

        </div>

        {/* Quick Saved Filters Shortcut Bar */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-150 dark:border-white/5 text-[10px] font-mono">
          <span className="text-slate-500 font-bold flex items-center gap-1">
            <ListFilter className="h-3.5 w-3.5 text-indigo-400" /> Saved Filters:
          </span>
          {savedFilters.map((f, i) => (
            <button
              key={i}
              onClick={() => applySavedFilter(f)}
              className="px-2.5 py-1 bg-slate-50 hover:bg-slate-100 dark:bg-white/5 dark:hover:bg-white/10 border border-slate-200 dark:border-white/5 text-slate-400 hover:text-slate-200 rounded-lg cursor-pointer transition-colors"
            >
              {f.name}
            </button>
          ))}
        </div>

      </div>

      {/* Main Review Workspace */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
        
        {/* Left Area - Tasks Listing Panel (8/12 or 12/12 columns) */}
        <div className={`${inspectTask ? 'xl:col-span-7' : 'xl:col-span-12'} space-y-4`}>
          
          {/* Bulk operation toolbars (only if items present and status permits) */}
          {sorted.length > 0 && (
            <div className="bg-slate-50 dark:bg-white/1 border border-slate-200 dark:border-white/5 rounded-2xl p-3 flex flex-wrap items-center justify-between gap-4 text-xs font-mono">
              <div className="flex items-center gap-2">
                <button
                  onClick={handleSelectAll}
                  className="p-1 text-slate-400 hover:text-slate-300 rounded cursor-pointer"
                >
                  {paginatedTasks.map(t => t.id).every(id => selectedIds.includes(id)) ? (
                    <CheckSquare className="h-4 w-4 text-indigo-400" />
                  ) : (
                    <Square className="h-4 w-4" />
                  )}
                </button>
                <span className="text-[11px] text-slate-400 font-bold">
                  Selected {selectedIds.filter(id => sorted.some(t => t.id === id)).length} / {totalItems} candidates
                </span>
              </div>

              {selectedIds.length > 0 && (
                <div className="flex items-center gap-2">
                  {activeQueue === GeneratedTaskStatus.PENDING && (
                    <>
                      <button
                        onClick={executeBulkApprove}
                        className="flex items-center gap-1 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg cursor-pointer text-[10px]"
                      >
                        <Check className="h-3.5 w-3.5" /> Approve Selected
                      </button>
                      <button
                        onClick={executeBulkReject}
                        className="flex items-center gap-1 px-3 py-1.5 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-lg cursor-pointer text-[10px]"
                      >
                        <X className="h-3.5 w-3.5" /> Reject Selected
                      </button>
                    </>
                  )}

                  {activeQueue === GeneratedTaskStatus.APPROVED && (
                    <button
                      onClick={executeBulkPublish}
                      className="flex items-center gap-1 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-lg cursor-pointer text-[10px]"
                    >
                      <Sparkles className="h-3.5 w-3.5" /> Bulk Publish To Marketplace
                    </button>
                  )}

                  <button
                    onClick={executeBulkDelete}
                    className="p-1.5 text-slate-500 hover:text-rose-400 hover:bg-rose-500/5 rounded-lg cursor-pointer"
                    title="Bulk Delete drafts"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Tasks loop */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {paginatedTasks.length === 0 ? (
              <div className="col-span-2 bg-white dark:bg-[#131316] border border-slate-200 dark:border-white/5 rounded-2xl p-12 text-center text-slate-500 text-xs font-mono">
                No generated tasks found in queue matching search.
              </div>
            ) : (
              paginatedTasks.map((task) => {
                const isSelected = selectedIds.includes(task.id);
                const isInspecting = inspectTask?.id === task.id;

                const diffColor = 
                  task.difficulty === 'Easy' ? 'text-emerald-400 bg-emerald-500/10' :
                  task.difficulty === 'Medium' ? 'text-amber-400 bg-amber-500/10' :
                  'text-rose-400 bg-rose-500/10';

                return (
                  <div 
                    key={task.id}
                    className={`bg-white dark:bg-[#131316] border rounded-2xl p-4 flex flex-col justify-between space-y-4 hover:shadow-lg transition-all relative overflow-hidden group ${
                      isInspecting ? 'border-indigo-500 shadow-indigo-500/5' : 'border-slate-200 dark:border-white/5'
                    }`}
                  >
                    
                    {/* Select Checkbox corner */}
                    <div className="absolute top-2.5 left-2.5 z-10">
                      <button
                        onClick={() => handleSelectOne(task.id)}
                        className="p-1 text-slate-400 hover:text-slate-300"
                      >
                        {isSelected ? (
                          <CheckSquare className="h-4 w-4 text-indigo-400" />
                        ) : (
                          <Square className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                        )}
                      </button>
                    </div>

                    {/* Content */}
                    <div className="pl-6 space-y-2">
                      <div className="flex justify-between items-center text-[9px] font-mono text-slate-500">
                        <span>{task.taskType}</span>
                        <span>{task.id.substring(0, 15)}...</span>
                      </div>

                      <h4 className="text-xs font-bold font-display text-slate-900 dark:text-zinc-200 truncate pr-4">{task.title}</h4>
                      <p className="text-[10px] text-slate-400 line-clamp-2 leading-relaxed">{task.description}</p>
                    </div>

                    {/* Indicators Strip */}
                    <div className="grid grid-cols-3 gap-1.5 font-mono text-[9px] bg-slate-50 dark:bg-white/1 border border-slate-150 dark:border-white/5 rounded-xl p-2 text-slate-400 pl-6">
                      <div>
                        <span className="block text-slate-500 text-[7px] uppercase">Reward</span>
                        <span className="font-bold text-slate-900 dark:text-slate-300">{task.rewardCoins} Coins</span>
                      </div>
                      <div>
                        <span className="block text-slate-500 text-[7px] uppercase">Difficulty</span>
                        <span className={`font-bold px-1 rounded ${diffColor}`}>{task.difficulty}</span>
                      </div>
                      <div>
                        <span className="block text-slate-500 text-[7px] uppercase">AI Confidence</span>
                        <span className="font-bold text-indigo-400">{(task.aiMetadata.confidenceScore || 0.95) * 100}%</span>
                      </div>
                    </div>

                    {/* Footer Audit Triggers */}
                    <div className="pt-2.5 border-t border-slate-200 dark:border-white/5 flex justify-between items-center pl-6 font-mono text-[10px]">
                      
                      {/* Anomaly trigger highlights */}
                      {(task.aiMetadata.anomalyScore || 0) > 0.1 ? (
                        <span className="flex items-center gap-1 text-[8px] uppercase font-bold text-amber-400 animate-pulse bg-amber-500/5 px-1.5 py-0.5 rounded">
                          <ShieldAlert className="h-3 w-3" /> ANOMALY RISK
                        </span>
                      ) : (
                        <span className="text-[8px] text-slate-500 uppercase tracking-widest font-bold">QA PASS</span>
                      )}

                      <button
                        onClick={() => {
                          setInspectTask(task);
                          setReviewNoteInput(task.reviewNotes || '');
                        }}
                        className="flex items-center gap-1 px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 text-slate-900 dark:text-slate-300 font-bold rounded-lg cursor-pointer"
                      >
                        <Eye className="h-3 w-3" /> Audit Details
                      </button>

                    </div>

                  </div>
                );
              })
            )}
          </div>

          {/* Simple Pagination Footer */}
          {totalPages > 1 && (
            <div className="flex justify-between items-center pt-3 font-mono text-[11px] text-slate-500">
              <span>Showing {startIndex + 1} - {Math.min(startIndex + itemsPerPage, totalItems)} of {totalItems} candidates</span>
              <div className="flex items-center gap-2">
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  className="p-1 bg-slate-100 hover:bg-slate-200 dark:bg-white/5 disabled:opacity-40 rounded cursor-pointer"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <span>{currentPage} / {totalPages}</span>
                <button
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  className="p-1 bg-slate-100 hover:bg-slate-200 dark:bg-white/5 disabled:opacity-40 rounded cursor-pointer"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}

        </div>

        {/* Right Area - Detailed Inspector Drawer Panel (5/12 columns if active) */}
        {inspectTask && (
          <div className="xl:col-span-5 bg-white dark:bg-[#131316] border border-indigo-500/20 shadow-xl shadow-indigo-500/2 rounded-2xl p-5 space-y-4">
            
            <div className="flex justify-between items-start border-b border-slate-200 dark:border-white/5 pb-3">
              <div>
                <h3 className="text-xs font-bold font-display text-slate-900 dark:text-white flex items-center gap-1.5">
                  <ShieldAlert className="h-4 w-4 text-indigo-400" />
                  Manual Continuous Audit Inspector
                </h3>
                <p className="text-[8px] font-mono text-slate-500 mt-0.5">{inspectTask.id}</p>
              </div>
              <button
                onClick={() => setInspectTask(null)}
                className="p-1 text-slate-500 hover:text-slate-300 rounded cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* AI Predictions & Anomaly stats banner */}
            <div className="grid grid-cols-2 gap-2 bg-slate-50 dark:bg-white/1 border border-slate-150 dark:border-white/5 rounded-xl p-3 font-mono text-[10px] text-slate-400">
              <div>
                <span className="block text-slate-500 text-[8px] uppercase">Similarity overlap</span>
                <span className="font-bold text-slate-900 dark:text-slate-300">{(inspectTask.aiMetadata.duplicateScore || 0.02) * 100}%</span>
              </div>
              <div>
                <span className="block text-slate-500 text-[8px] uppercase">Outlier score</span>
                <span className="font-bold text-amber-400">{(inspectTask.aiMetadata.anomalyScore || 0) * 100}%</span>
              </div>
            </div>

            {/* Instructions list & Template properties */}
            <div className="space-y-2 text-xs">
              <div className="space-y-1">
                <span className="text-[9px] font-mono text-slate-500 uppercase tracking-widest font-bold">Metadata Title</span>
                <p className="font-semibold text-slate-900 dark:text-zinc-200">{inspectTask.title}</p>
              </div>
              
              <div className="space-y-1">
                <span className="text-[9px] font-mono text-slate-500 uppercase tracking-widest font-bold font-display">Target Task Instructions</span>
                <ul className="list-decimal list-inside space-y-1 text-slate-400 text-[11px] leading-relaxed">
                  {inspectTask.instructions.map((inst, i) => <li key={i}>{inst}</li>)}
                </ul>
              </div>
            </div>

            {/* Chunk / Media Raw Content Preview */}
            <div className="space-y-1.5">
              <span className="text-[9px] font-mono text-slate-500 uppercase tracking-widest block font-bold">Chunk Binary & Reference Preview</span>
              {inspectTask.attachments.length > 0 && inspectTask.attachments[0].fileType === 'image' ? (
                <div className="w-full h-36 rounded-xl border border-slate-200 dark:border-white/5 overflow-hidden relative group">
                  <img 
                    src={inspectTask.attachments[0].url} 
                    alt="Inspection attachment" 
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                    <span className="text-[9px] font-mono text-white flex items-center gap-1">
                      <ExternalLink className="h-3.5 w-3.5" /> inspect raw image
                    </span>
                  </div>
                </div>
              ) : (
                <div className="bg-slate-950 p-3 rounded-xl border border-slate-900 font-mono text-[10px] text-slate-300 max-h-[120px] overflow-y-auto leading-relaxed whitespace-pre-wrap">
                  {inspectTask.metadata.chunkValue || inspectTask.description}
                </div>
              )}
            </div>

            {/* Review feedback inputs */}
            <div className="space-y-1 pt-2 border-t border-slate-150 dark:border-white/5">
              <label className="block text-[9px] font-mono text-slate-500 uppercase tracking-widest font-bold">Continuous Audit Notes / Revision Remarks</label>
              <textarea
                value={reviewNoteInput}
                onChange={(e) => setReviewNoteInput(e.target.value)}
                placeholder="Write audit validation feedback or revision guidelines comments..."
                className="w-full h-16 px-3 py-2 bg-slate-50 dark:bg-white/1 border border-slate-200 dark:border-white/5 focus:outline-none focus:border-indigo-500 text-xs rounded-xl"
              />
            </div>

            {/* Action controls based on status */}
            <div className="grid grid-cols-2 gap-2 pt-2 text-xs">
              {inspectTask.status === GeneratedTaskStatus.PENDING && (
                <>
                  <button
                    onClick={executeInspectApprove}
                    className="flex items-center justify-center gap-1.5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl cursor-pointer"
                  >
                    <Check className="h-4 w-4" /> Approve Draft
                  </button>
                  <button
                    onClick={executeInspectReject}
                    className="flex items-center justify-center gap-1.5 py-2.5 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-xl cursor-pointer"
                  >
                    <X className="h-4 w-4" /> Reject Draft
                  </button>
                </>
              )}

              {inspectTask.status === GeneratedTaskStatus.APPROVED && (
                <button
                  onClick={executeInspectPublish}
                  className="col-span-2 flex items-center justify-center gap-1.5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl cursor-pointer"
                >
                  <Sparkles className="h-4 w-4" /> Publish to marketplace
                </button>
              )}

              {inspectTask.status === GeneratedTaskStatus.REJECTED && (
                <div className="col-span-2 text-center py-2 bg-rose-500/10 text-rose-400 rounded-xl font-mono text-[10px] border border-rose-500/10">
                  Rejected. Notes: {inspectTask.reviewNotes || 'No notes left.'}
                </div>
              )}

              {inspectTask.status === GeneratedTaskStatus.PUBLISHED && (
                <div className="col-span-2 text-center py-2 bg-emerald-500/10 text-emerald-400 rounded-xl font-mono text-[10px] border border-emerald-500/10 flex items-center justify-center gap-1.5">
                  <Check className="h-4 w-4" /> Published Task: {inspectTask.publishedTaskId}
                </div>
              )}
            </div>

          </div>
        )}

      </div>

    </div>
  );
};
