/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, FormEvent } from 'react';
import { 
  Coins, CheckCircle, ArrowRight, ShieldCheck, Bookmark, Search, Filter, 
  ChevronLeft, ChevronRight, AlertTriangle, FileText, Music, Video, 
  Layers, Tag, Languages, ExternalLink, RefreshCw, X, Check, Eye,
  Download, Database, Plus, Laptop, Wifi, WifiOff, Layout, List
} from 'lucide-react';
import { TaskProvider, useTasks } from '../../tasks/context/TaskContext';
import { 
  TaskCard, TaskDetail, TaskLoadingSkeleton, TaskEmptyState, TaskErrorState, 
  TaskSearchBar, TaskSortMenu, TaskFilterBar, TaskPagination, TaskList, TaskGrid,
  TaskRewardCard, TaskRequirements, TaskMetadataPanel
} from '../../tasks/components/TaskComponents';
import { Task, TaskDifficulty, TaskPriority } from '../../types/tasks';
import { Card, CardHeader, CardTitle, CardDescription, CardBody, CardFooter } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { formatCoins, formatCurrencyValue } from '../../utils';

function SandboxTasksContent() {
  const {
    tasks,
    activeTask,
    bookmarks,
    isLoading,
    isSyncing,
    isOnline,
    sessionCompletedCount,
    sessionCoinsEarned,
    syncOfflineQueue,
    createNewTask,
    sheetsExport
  } = useTasks();

  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 4;

  // View Controllers
  const [showExporter, setShowExporter] = useState(false);
  const [showCreator, setShowCreator] = useState(false);
  const [exportReportType, setExportReportType] = useState<'Task' | 'Category' | 'Completion' | 'Quality' | 'Business' | 'Admin'>('Task');
  const [exportedData, setExportedData] = useState<{ headers: string[]; rows: any[][] } | null>(null);

  // Form states for dynamic task publishing
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newCategory, setNewCategory] = useState('AI Response Comparison');
  const [newDifficulty, setNewDifficulty] = useState<TaskDifficulty>(TaskDifficulty.EASY);
  const [newReward, setNewReward] = useState(15);
  const [newInstructions, setNewInstructions] = useState('1. Inspect inputs carefully.\n2. Rate localization accuracy.\n3. Verify consensus details.');

  // Paginated tasks calculation
  const totalTasks = tasks.length;
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedTasks = tasks.slice(startIndex, startIndex + pageSize);

  const handleCreateCustomTask = async (e: FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newDesc.trim()) return;

    await createNewTask({
      title: newTitle,
      description: newDesc,
      category: newCategory,
      taskType: newCategory,
      difficulty: newDifficulty,
      rewardCoins: Number(newReward),
      instructions: newInstructions.split('\n').filter(line => line.trim().length > 0)
    });

    // Reset Form
    setNewTitle('');
    setNewDesc('');
    setNewInstructions('1. Inspect inputs carefully.\n2. Rate localization accuracy.\n3. Verify consensus details.');
    setShowCreator(false);
  };

  const handleGenerateExport = async () => {
    const data = await sheetsExport(exportReportType);
    setExportedData(data);
  };

  return (
    <div className="space-y-8" id="sandbox-root">
      
      {/* 1. TOP STATS BAR BENTO */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4" id="sandbox-bento-metrics">
        
        {/* Wallet Ledger */}
        <Card className="bg-gradient-to-br from-indigo-950 via-[#09090b] to-[#120f26] text-white border-none relative overflow-hidden shadow-xl md:col-span-2">
          <div className="absolute right-3 bottom-3 opacity-5">
            <Coins className="h-32 w-32" />
          </div>
          <CardBody className="p-6">
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-mono uppercase tracking-widest text-indigo-400">Live Session Ledger</span>
              <div className="flex items-center gap-1.5">
                <span className={`h-2 w-2 rounded-full ${isOnline ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`} />
                <span className="text-[9px] font-mono uppercase tracking-wider text-slate-400">
                  {isOnline ? 'Network Synchronized' : 'Offline Buffer Active'}
                </span>
              </div>
            </div>
            
            <div className="flex items-baseline gap-2 mt-3">
              <span className="text-3xl font-extrabold text-white font-display">
                {formatCoins(sessionCoinsEarned)}
              </span>
              <span className="text-xs text-indigo-300 font-mono">Session Coins</span>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-white/5 font-mono text-xs text-slate-300">
              <div>
                <span className="text-[10px] text-slate-400">INR Valuation</span>
                <p className="font-bold text-emerald-400 mt-0.5">{formatCurrencyValue(sessionCoinsEarned, 'IN')}</p>
              </div>
              <div>
                <span className="text-[10px] text-slate-400">USD Valuation</span>
                <p className="font-bold text-sky-400 mt-0.5">{formatCurrencyValue(sessionCoinsEarned, 'US')}</p>
              </div>
            </div>
          </CardBody>
        </Card>

        {/* Verification Counter */}
        <Card className="bg-white border-slate-200 dark:bg-[#09090b] dark:border-zinc-800">
          <CardBody className="p-6 flex flex-col justify-between h-full">
            <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400">Verified Alignments</span>
            <div>
              <p className="text-3xl font-extrabold text-slate-800 dark:text-white font-display mt-2">{sessionCompletedCount}</p>
              <p className="text-xs text-slate-400 mt-1 font-sans">SLA alignments completed this turn</p>
            </div>
          </CardBody>
        </Card>

        {/* Sync & Connectivity Node */}
        <Card className="bg-white border-slate-200 dark:bg-[#09090b] dark:border-zinc-800">
          <CardBody className="p-6 flex flex-col justify-between h-full">
            <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400">Offline Pending Sync</span>
            <div>
              <div className="flex items-center gap-1.5 mt-2">
                {isOnline ? (
                  <Wifi className="h-5 w-5 text-emerald-500" />
                ) : (
                  <WifiOff className="h-5 w-5 text-amber-500" />
                )}
                <span className="text-base font-bold text-slate-800 dark:text-white font-mono">
                  {isOnline ? 'Online Ready' : 'Buffer Mode'}
                </span>
              </div>
              <button
                onClick={syncOfflineQueue}
                disabled={!isOnline || isSyncing}
                className="mt-3.5 w-full inline-flex items-center justify-center gap-1.5 px-3 py-1.5 bg-indigo-50 border border-indigo-200 text-indigo-600 text-xs font-semibold rounded-lg hover:bg-indigo-100 disabled:opacity-40 transition-all cursor-pointer dark:bg-indigo-500/10 dark:text-indigo-400 dark:border-indigo-500/20"
              >
                <RefreshCw className={`h-3.5 w-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
                <span>Sync Offline Buffer</span>
              </button>
            </div>
          </CardBody>
        </Card>

      </div>

      {/* 2. THE MAIN SPLIT WORKSPACE INTERFACE */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6" id="sandbox-split-workspace">
        
        {/* LEFT COLUMN: FILTER CONTROLS & VERIFICATION QUEUE */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-slate-50/50 p-1.5 rounded-2xl border border-slate-150 dark:bg-zinc-950/20 dark:border-zinc-850 space-y-3">
            <TaskSearchBar />
            <div className="px-2 flex justify-between items-center">
              <TaskSortMenu />
              <Badge variant="neutral" className="font-mono text-[10px] dark:bg-zinc-800 dark:text-zinc-300">{tasks.length} Matches</Badge>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6">
            <TaskFilterBar />
            
            {/* Realtime verification Queue */}
            <Card className="border-slate-200 dark:bg-[#09090b] dark:border-zinc-800/80">
              <CardHeader className="pb-3">
                <CardTitle className="text-xs uppercase tracking-wider font-mono text-slate-400">Interactive Task Queue</CardTitle>
                <CardDescription>Select a task below to load into the workspace</CardDescription>
              </CardHeader>
              <CardBody className="p-3 pt-0">
                {isLoading ? (
                  <div className="space-y-3">
                    {[1, 2, 3].map(i => (
                      <div key={i} className="h-16 bg-slate-100 rounded-lg animate-pulse" />
                    ))}
                  </div>
                ) : tasks.length === 0 ? (
                  <p className="text-xs text-slate-400 font-sans italic text-center py-6">No tasks matched your queries.</p>
                ) : (
                  <div className="space-y-2">
                    {paginatedTasks.map(task => (
                      <div key={task.id}>
                        <TaskCard task={task} />
                      </div>
                    ))}
                  </div>
                )}
              </CardBody>
              {totalTasks > pageSize && (
                <CardFooter className="py-2.5 bg-slate-50/50 border-t border-slate-150 dark:bg-transparent dark:border-zinc-850">
                  <TaskPagination 
                    total={totalTasks}
                    size={pageSize}
                    current={currentPage}
                    onPageChange={setCurrentPage}
                  />
                </CardFooter>
              )}
            </Card>
          </div>
        </div>

        {/* RIGHT COLUMN: ACTIVE VERIFICATION WORKSPACE PLAYGROUND */}
        <div className="lg:col-span-2 space-y-6">
          <TaskDetail />
        </div>

      </div>

      {/* 3. WORKSPACE INTEGRATIONS HUB (CREATION & EXPORTS) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6" id="integrations-hub">
        
        {/* Module A: Google Sheets Adapter Reporting Module */}
        <Card className="border-slate-200 dark:bg-[#09090b] dark:border-zinc-800">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="text-base font-bold font-display">Workspace Reports & Export Adapters</CardTitle>
              <Badge variant="primary" className="font-mono text-[9px] bg-emerald-500/10 text-emerald-400 border-emerald-500/20">Google Sheets Integration</Badge>
            </div>
            <CardDescription>Format alignment data reports into standard column structures compatible with Google Sheets range writes.</CardDescription>
          </CardHeader>
          <CardBody className="space-y-4">
            <div className="flex gap-2.5">
              <select
                value={exportReportType}
                onChange={e => setExportReportType(e.target.value as any)}
                className="flex-1 p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-indigo-500 dark:bg-zinc-900 dark:border-zinc-800 text-slate-800 dark:text-white"
              >
                <option value="Task">Task Summary Report</option>
                <option value="Category">Category Coverage Report</option>
                <option value="Completion">Completion Efficiency Report</option>
                <option value="Quality">SLA Quality Review Audit</option>
                <option value="Business">Campaign Financial Summary</option>
                <option value="Admin">System Admin Audit Trails</option>
              </select>
              <button
                onClick={handleGenerateExport}
                className="px-4 py-2 bg-indigo-600 text-white font-semibold text-xs rounded-xl hover:bg-indigo-500 transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <Download className="h-4 w-4" />
                <span>Compile Sheets Grid</span>
              </button>
            </div>

            {exportedData && (
              <div className="p-3 bg-slate-50 dark:bg-zinc-950 border border-slate-150 dark:border-zinc-850 rounded-xl space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-mono text-indigo-400 uppercase tracking-widest">Compiled Sheets Row Matrix ({exportedData.rows.length} rows)</span>
                  <button 
                    onClick={() => setExportedData(null)}
                    className="text-[10px] text-slate-400 hover:text-slate-600 font-mono cursor-pointer"
                  >
                    Clear Preview
                  </button>
                </div>
                <div className="max-h-40 overflow-auto border border-slate-200 rounded-lg text-[10px] font-mono bg-white dark:bg-zinc-900 dark:border-zinc-800">
                  <table className="w-full text-left border-collapse">
                    <thead className="bg-slate-100 dark:bg-zinc-950 sticky top-0 border-b border-slate-200 dark:border-zinc-850">
                      <tr>
                        {exportedData.headers.map((h, i) => (
                          <th key={i} className="p-2 border-r border-slate-200 dark:border-zinc-800">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {exportedData.rows.map((row, ri) => (
                        <tr key={ri} className="border-b border-slate-100 dark:border-zinc-850 hover:bg-slate-50/50">
                          {row.map((val, ci) => (
                            <td key={ci} className="p-2 border-r border-slate-200 dark:border-zinc-800 truncate max-w-[120px]" title={String(val)}>{String(val)}</td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </CardBody>
        </Card>

        {/* Module B: Dynamic Task Publisher Engine */}
        <Card className="border-slate-200 dark:bg-[#09090b] dark:border-zinc-800">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="text-base font-bold font-display">Continuous Task Publisher Engine</CardTitle>
              <button
                onClick={() => setShowCreator(!showCreator)}
                className="p-1.5 rounded-lg border border-slate-200 dark:border-zinc-800 bg-slate-50 hover:bg-slate-100 dark:bg-zinc-900 dark:hover:bg-zinc-800 text-slate-600 dark:text-zinc-400 cursor-pointer text-xs flex items-center gap-1"
              >
                <Plus className="h-4 w-4" />
                <span>{showCreator ? 'Collapse Form' : 'Deploy Task'}</span>
              </button>
            </div>
            <CardDescription>Submit and deploy new verification tasks programmatically straight to the active registry database.</CardDescription>
          </CardHeader>
          <CardBody className="pt-0">
            {showCreator ? (
              <form onSubmit={handleCreateCustomTask} className="space-y-4 text-xs">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-500 font-medium mb-1">Task Title:</label>
                    <input
                      type="text"
                      placeholder="e.g. Audit translation tone"
                      value={newTitle}
                      onChange={e => setNewTitle(e.target.value)}
                      className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-indigo-500 dark:bg-zinc-900 dark:border-zinc-800 text-slate-800 dark:text-white"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-slate-500 font-medium mb-1">Target Category:</label>
                    <select
                      value={newCategory}
                      onChange={e => setNewCategory(e.target.value)}
                      className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-indigo-500 dark:bg-zinc-900 dark:border-zinc-800 text-slate-800 dark:text-white"
                    >
                      <option value="AI Response Comparison">AI Response Comparison</option>
                      <option value="Image Safety Review">Image Safety Review</option>
                      <option value="Translation Review">Translation Review</option>
                      <option value="Voice Quality Rating">Voice Quality Rating</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-500 font-medium mb-1">Difficulty:</label>
                    <select
                      value={newDifficulty}
                      onChange={e => setNewDifficulty(e.target.value as any)}
                      className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-indigo-500 dark:bg-zinc-900 dark:border-zinc-800 text-slate-800 dark:text-white"
                    >
                      <option value={TaskDifficulty.EASY}>Easy</option>
                      <option value={TaskDifficulty.MEDIUM}>Medium</option>
                      <option value={TaskDifficulty.HARD}>Hard</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-slate-500 font-medium mb-1">Coins Bounty Reward:</label>
                    <input
                      type="number"
                      min={5}
                      max={100}
                      value={newReward}
                      onChange={e => setNewReward(Number(e.target.value))}
                      className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-indigo-500 dark:bg-zinc-900 dark:border-zinc-800 text-slate-800 dark:text-white"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-500 font-medium mb-1">Description:</label>
                  <textarea
                    rows={2}
                    placeholder="Provide a clear, brief operational summary..."
                    value={newDesc}
                    onChange={e => setNewDesc(e.target.value)}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-indigo-500 dark:bg-zinc-900 dark:border-zinc-800 text-slate-800 dark:text-white"
                    required
                  />
                </div>

                <div>
                  <label className="block text-slate-500 font-medium mb-1">SLA Protocol Instructions (New line per step):</label>
                  <textarea
                    rows={3}
                    value={newInstructions}
                    onChange={e => setNewInstructions(e.target.value)}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono focus:ring-2 focus:ring-indigo-500 dark:bg-zinc-900 dark:border-zinc-800 text-slate-800 dark:text-white"
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2 bg-indigo-600 text-white font-bold text-xs rounded-xl hover:bg-indigo-500 transition-all cursor-pointer shadow-sm flex items-center justify-center gap-1.5"
                >
                  <Database className="h-4 w-4" />
                  <span>Register & Publish Dynamic Task</span>
                </button>
              </form>
            ) : (
              <div className="flex flex-col items-center justify-center py-6 text-slate-400 bg-slate-50 rounded-xl border border-dashed border-slate-200 dark:bg-zinc-950/20 dark:border-zinc-800/80">
                <Laptop className="h-8 w-8 mb-2 text-slate-300" />
                <p className="text-xs text-center font-sans font-light">Dynamic editor is collapsed. Expand to publish custom validator tasks.</p>
              </div>
            )}
          </CardBody>
        </Card>

      </div>

    </div>
  );
}

export function SandboxTasks() {
  return (
    <TaskProvider>
      <SandboxTasksContent />
    </TaskProvider>
  );
}
