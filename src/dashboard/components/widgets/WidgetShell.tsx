/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Settings, Info, RefreshCw, EyeOff, LayoutGrid, CheckCircle } from 'lucide-react';
import { WidgetSize } from '../../types/widgets';
import { useDashboard } from '../../context/DashboardContext';

interface WidgetShellProps {
  id: string;
  title: string;
  subtitle?: string;
  size: WidgetSize;
  expectedRepository: string;
  expectedModel: string;
  expectedFields: string[];
  futureConnectionPoint: string;
  loadingStateSim?: string;
  emptyStateSim?: string;
  errorStateSim?: string;
  children: React.ReactNode;
}

export const WidgetShell: React.FC<WidgetShellProps> = ({
  id,
  title,
  subtitle,
  size,
  expectedRepository,
  expectedModel,
  expectedFields,
  futureConnectionPoint,
  loadingStateSim,
  emptyStateSim,
  errorStateSim,
  children,
}) => {
  const { uiState, updateWidgetSize, toggleWidgetVisibility } = useDashboard();
  const [showContract, setShowContract] = useState(false);
  const [localLoading, setLocalLoading] = useState(false);
  const [isEmptyState, setIsEmptyState] = useState(false);
  const [isErrorState, setIsErrorState] = useState(false);

  const sizeClasses = {
    [WidgetSize.SMALL]: 'col-span-1 row-span-1 h-[220px]',
    [WidgetSize.MEDIUM]: 'col-span-1 md:col-span-2 row-span-1 h-[220px]',
    [WidgetSize.LARGE]: 'col-span-1 md:col-span-2 row-span-2 h-[460px]',
    [WidgetSize.FULL]: 'col-span-1 md:col-span-4 row-span-1 md:row-span-2 min-h-[300px]',
  };

  const simulateReload = () => {
    setLocalLoading(true);
    setTimeout(() => {
      setLocalLoading(false);
    }, 850);
  };

  return (
    <motion.div
      layoutId={`widget-shell-${id}`}
      className={`relative rounded-xl border border-slate-200/80 bg-white p-5 shadow-xs dark:border-white/5 dark:bg-[#0a0a0c] flex flex-col justify-between overflow-hidden group/shell transition-all duration-300 ${sizeClasses[size]} ${
        uiState.customizationMode ? 'ring-2 ring-dashed ring-indigo-500/50 cursor-grab active:cursor-grabbing' : ''
      }`}
      id={`widget-${id}`}
    >
      {/* Header section */}
      <div>
        <div className="flex items-center justify-between gap-2 border-b border-slate-100 dark:border-white/5 pb-2.5 mb-3">
          <div>
            <h3 className="font-display font-semibold text-xs tracking-tight text-slate-900 dark:text-zinc-100 flex items-center gap-1.5">
              {title}
            </h3>
            {subtitle && (
              <p className="text-[10px] text-slate-400 dark:text-zinc-500 font-sans tracking-wide">
                {subtitle}
              </p>
            )}
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setShowContract(!showContract)}
              className={`h-6 w-6 rounded-md flex items-center justify-center border text-slate-400 hover:text-slate-950 dark:border-white/5 dark:bg-white/5 dark:text-zinc-400 dark:hover:text-white transition-all cursor-pointer ${
                showContract ? 'bg-indigo-50 border-indigo-200 text-indigo-500' : ''
              }`}
              title="Inspect Architectural Contract"
              aria-label="Inspect Architectural Contract"
            >
              <Info className="h-3 w-3" />
            </button>
            <button
              onClick={simulateReload}
              className="h-6 w-6 rounded-md flex items-center justify-center border border-slate-200 bg-white text-slate-400 hover:text-slate-950 dark:border-white/5 dark:bg-white/5 dark:text-zinc-400 dark:hover:text-white transition-all cursor-pointer"
              title="Reload Component Cache"
              aria-label="Reload Component Cache"
            >
              <RefreshCw className={`h-3 w-3 ${localLoading ? 'animate-spin text-indigo-500' : ''}`} />
            </button>
            {uiState.customizationMode && (
              <>
                <button
                  onClick={() => {
                    const nextSizes = [WidgetSize.SMALL, WidgetSize.MEDIUM, WidgetSize.LARGE, WidgetSize.FULL];
                    const currentIndex = nextSizes.indexOf(size);
                    const nextSize = nextSizes[(currentIndex + 1) % nextSizes.length];
                    updateWidgetSize(id, nextSize);
                  }}
                  className="h-6 w-6 rounded-md flex items-center justify-center border border-slate-200 bg-white text-slate-400 hover:text-slate-950 dark:border-white/5 dark:bg-white/5 dark:text-zinc-400 dark:hover:text-white transition-all cursor-pointer"
                  title="Cycle Widget Dimension"
                  aria-label="Cycle Widget Dimension"
                >
                  <LayoutGrid className="h-3 w-3" />
                </button>
                <button
                  onClick={() => toggleWidgetVisibility(id)}
                  className="h-6 w-6 rounded-md flex items-center justify-center border border-red-100 bg-red-50/20 text-red-400 hover:text-red-600 dark:border-red-950/20 dark:bg-red-950/5 transition-all cursor-pointer"
                  title="Hide Widget"
                  aria-label="Hide Widget"
                >
                  <EyeOff className="h-3 w-3" />
                </button>
              </>
            )}
          </div>
        </div>

        {/* Loading / Empty / Error State Simulators inside the widget frame */}
        {localLoading ? (
          <div className="flex flex-col items-center justify-center py-8 text-center h-[120px]">
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-indigo-500 border-t-transparent mb-2"></div>
            <span className="text-[10px] font-mono text-slate-400 dark:text-zinc-500">
              {loadingStateSim || 'Resolving read-through cache...'}
            </span>
          </div>
        ) : isErrorState ? (
          <div className="flex flex-col items-center justify-center py-6 text-center h-[120px] cursor-pointer" onClick={() => setIsErrorState(false)}>
            <span className="text-red-500 font-bold text-xs uppercase font-mono tracking-tight">Read Failure</span>
            <p className="text-[10px] text-slate-400 mt-1">{errorStateSim || 'Permission denied or network offline.'}</p>
          </div>
        ) : isEmptyState ? (
          <div className="flex flex-col items-center justify-center py-6 text-center h-[120px] cursor-pointer" onClick={() => setIsEmptyState(false)}>
            <span className="text-slate-400 font-bold text-xs uppercase font-mono tracking-tight">No Records</span>
            <p className="text-[10px] text-slate-400 mt-1">{emptyStateSim || 'Your search query returned 0 items.'}</p>
          </div>
        ) : (
          <div className="text-left font-sans text-xs">
            {children}
          </div>
        )}
      </div>

      {/* Contract Detail Panel (Beautiful sliding glass drawer overlay) */}
      {showContract && (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute inset-0 bg-slate-900/98 text-slate-200 z-30 p-5 font-mono text-[10px] flex flex-col justify-between"
        >
          <div className="space-y-3.5">
            <div className="flex items-center justify-between border-b border-white/10 pb-1.5">
              <span className="text-indigo-400 font-bold tracking-wide uppercase">⚙️ Architectural Contract</span>
              <button
                onClick={() => setShowContract(false)}
                className="text-white hover:text-indigo-400 text-xs px-1"
              >
                [X]
              </button>
            </div>

            <div className="space-y-1.5">
              <div>
                <span className="text-slate-400">Expected Repo:</span>{' '}
                <span className="text-indigo-300 font-bold">{expectedRepository}</span>
              </div>
              <div>
                <span className="text-slate-400">Expected Model:</span>{' '}
                <span className="text-teal-300 font-bold">{expectedModel}</span>
              </div>
              <div>
                <span className="text-slate-400">Expected Fields:</span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {expectedFields.map(field => (
                    <span key={field} className="px-1.5 py-0.5 bg-white/5 border border-white/10 rounded-sm text-pink-300 text-[8px]">
                      {field}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <span className="text-slate-400">Future Bindpoint:</span>
                <pre className="mt-1 bg-black/40 border border-white/5 p-1 rounded-sm text-[8px] text-green-300 overflow-x-auto whitespace-pre">
                  {futureConnectionPoint}
                </pre>
              </div>
            </div>
          </div>

          <div className="border-t border-white/5 pt-2.5 flex items-center justify-between text-[9px]">
            <span className="text-slate-400">Simulate States:</span>
            <div className="flex gap-1.5">
              <button
                onClick={() => { setIsEmptyState(!isEmptyState); setIsErrorState(false); }}
                className={`px-1.5 py-0.5 rounded border border-white/15 text-[8px] ${
                  isEmptyState ? 'bg-amber-500/20 text-amber-300' : 'hover:bg-white/5'
                }`}
              >
                Empty
              </button>
              <button
                onClick={() => { setIsErrorState(!isErrorState); setIsEmptyState(false); }}
                className={`px-1.5 py-0.5 rounded border border-white/15 text-[8px] ${
                  isErrorState ? 'bg-red-500/20 text-red-300' : 'hover:bg-white/5'
                }`}
              >
                Error
              </button>
            </div>
          </div>
        </motion.div>
      )}

      {/* Customize overlay indicators */}
      {uiState.customizationMode && (
        <div className="absolute inset-0 bg-indigo-500/5 pointer-events-none border border-indigo-500 rounded-xl" />
      )}
    </motion.div>
  );
};
