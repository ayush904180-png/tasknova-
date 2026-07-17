/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { Folder, FolderOpen, FileCode, Layers, Info, Terminal, BookOpen, Compass, ShieldCheck } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardBody } from '../ui/Card';
import { Badge } from '../ui/Badge';

interface DirectoryNode {
  name: string;
  path: string;
  description: string;
  files: string[];
  role: string;
  solidPrinciple: string;
}

const DIRECTORIES: DirectoryNode[] = [
  {
    name: 'types',
    path: '/src/types/',
    description: 'Centralized TypeScript interfaces, custom enum registers, and core schemas representing data objects.',
    files: ['/src/types/index.ts'],
    role: 'Provides an immutable source of truth for the platforms core data structures (Tasks, Wallets, Coins, Submissions, Routes).',
    solidPrinciple: 'Single Responsibility Principle (SRP) — isolates compile-time structure from runtime behavior, preventing styling or logic modules from redefining type constraints.'
  },
  {
    name: 'context',
    path: '/src/context/',
    description: 'React global state context providers handling persistent cross-applet features.',
    files: ['/src/context/ThemeContext.tsx'],
    role: 'Manages user-specific environmental states such as Light vs Dark mode theme preferences with LocalStorage persistent caching.',
    solidPrinciple: 'Interface Segregation — context exposes micro-focused state targets rather than a single monolithic app state object.'
  },
  {
    name: 'components/ui',
    path: '/src/components/ui/',
    description: 'Atomic, stateless design primitive components crafted with high-precision Tailwind CSS styling.',
    files: ['Button.tsx', 'Card.tsx', 'Badge.tsx', 'Tabs.tsx'],
    role: 'Acts as the design system base. These components are independent of specific domain contexts and highly reusable.',
    solidPrinciple: 'Open/Closed Principle (OCP) — components are open to styling extension via the cn(...) class merges but closed to modification of their internal layout rules.'
  },
  {
    name: 'components/layout',
    path: '/src/components/layout/',
    description: 'Sovereign layouts organizing structural screens, central page widths, navigation headers, and footers.',
    files: ['Header.tsx', 'Footer.tsx', 'LayoutShell.tsx'],
    role: 'Orchestrates the global structural scaffolding of the application, isolating page-level headers, menus, and footer indicators.',
    solidPrinciple: 'Single Responsibility Principle — limits structural templates from mixing with specific task payload logic.'
  },
  {
    name: 'components/features',
    path: '/src/components/features/',
    description: 'Rich, interactive domain modules representing distinct flows within the TaskNova AI ecosystem.',
    files: ['Hero.tsx', 'FeaturesGrid.tsx', 'SandboxTasks.tsx', 'ArchitectureHub.tsx'],
    role: 'Holds composite assemblies that define the core value proposition of the SaaS product (Landing details, micro-task verification workspace, folder explorer).',
    solidPrinciple: 'Interface Segregation — breaks complex experiences into modular, isolated panels (e.g. Sandbox vs Blueprint) preventing massive monolithic file blobs.'
  },
  {
    name: 'config',
    path: '/src/config/',
    description: 'Environment controllers, API variable registrations, and credential placeholders.',
    files: ['env.ts', 'firebase.placeholder.ts'],
    role: 'Bootstraps third-party resources and configuration constants safely, shielding components from raw process.env statements.',
    solidPrinciple: 'Dependency Inversion — provides abstract interface endpoints for future databases (Firestore) so the application remains decoupled from the specific SDK load states.'
  },
  {
    name: 'utils',
    path: '/src/utils/',
    description: 'Pure, stateless side-effect-free helper functions for formatting, class merging, and string builders.',
    files: ['/src/utils/index.ts'],
    role: 'Handles repeatable algorithms like currency values (Coins to Rupees ₹ or Dollars $), stopwatch formatting, and CSS className deduplications.',
    solidPrinciple: 'Dependency Inversion — utilities are pure mathematical routines that have zero outward dependencies, making them highly testable.'
  }
];

export function ArchitectureHub() {
  const [selectedDirIndex, setSelectedDirIndex] = useState<number>(0);
  const activeDir = DIRECTORIES[selectedDirIndex];

  return (
    <div className="space-y-8" id="architecture-blueprint-container">
      
      {/* Intro Banner */}
      <div className="bg-gradient-to-r from-indigo-950/40 via-[#030303]/85 to-purple-950/40 text-white rounded-2xl p-6 md:p-8 border border-white/5 shadow-md flex flex-col md:flex-row items-center gap-6 justify-between">
        <div className="space-y-2">
          <Badge variant="success" className="bg-emerald-500/25 text-emerald-300 border-emerald-500/40">Enterprise Blueprint</Badge>
          <h2 className="text-xl md:text-2xl font-bold font-display tracking-tight text-white">TaskNova AI Modular Architecture Hub</h2>
          <p className="text-xs text-slate-400 max-w-2xl leading-relaxed">
            In compliance with elite engineering standards, TaskNova AI MVP Build v0.1 implements a highly optimized, scalable folder architecture. Explore directory components interactively to view SOLID justifications and module details.
          </p>
        </div>
        <div className="p-3 bg-white/5 rounded-xl border border-white/10 hidden sm:block">
          <Terminal className="h-8 w-8 text-brand-500 animate-pulse" />
        </div>
      </div>

      {/* Directory Browser Layout */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* DIRECTORY TREE SELECTOR */}
        <div className="md:col-span-1 space-y-3">
          <span className="text-[10px] uppercase font-mono tracking-wider font-semibold text-slate-400">Directory Tree</span>
          <div className="bg-white dark:bg-[#09090b] border border-slate-200 dark:border-white/5 rounded-xl overflow-hidden p-3 space-y-1.5 shadow-xs">
            {DIRECTORIES.map((dir, index) => {
              const isSelected = index === selectedDirIndex;
              return (
                <button
                  key={dir.name}
                  onClick={() => setSelectedDirIndex(index)}
                  className={`w-full text-left px-3.5 py-3 rounded-lg border text-xs flex items-center gap-3 transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-slate-50 border-slate-300 text-slate-900 font-bold dark:bg-white/5 dark:border-white/10 dark:text-white'
                      : 'bg-transparent border-transparent text-slate-500 hover:bg-slate-100/50 hover:text-slate-800 dark:text-zinc-400 dark:hover:text-zinc-200 dark:hover:bg-white/5'
                  }`}
                >
                  {isSelected ? (
                    <FolderOpen className="h-4.5 w-4.5 text-brand-600 dark:text-emerald-400 shrink-0" />
                  ) : (
                    <Folder className="h-4.5 w-4.5 text-slate-400 shrink-0" />
                  )}
                  <div className="truncate">
                    <span className="font-mono text-[11px] block">{dir.path}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* BLUEPRINT DESCRIPTION PANEL */}
        <div className="md:col-span-2 space-y-3">
          <span className="text-[10px] uppercase font-mono tracking-wider font-semibold text-indigo-500">Directory Specification</span>
          
          <Card className="shadow-xs">
            <CardHeader className="flex flex-row justify-between items-center">
              <div className="flex items-center gap-2">
                <FolderOpen className="h-5 w-5 text-brand-600 dark:text-emerald-400" />
                <CardTitle className="font-mono text-base">{activeDir.path}</CardTitle>
              </div>
              <Badge variant="primary">{activeDir.files.length} Modules</Badge>
            </CardHeader>
            <CardBody className="space-y-6">
              
              {/* Objective Description */}
              <div className="space-y-1.5">
                <span className="text-[10px] font-mono uppercase text-slate-400 flex items-center gap-1.5">
                  <Info className="h-3.5 w-3.5" /> Core Objective
                </span>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-sans font-light">
                  {activeDir.description}
                </p>
              </div>

              {/* Functional Role */}
              <div className="space-y-1.5">
                <span className="text-[10px] font-mono uppercase text-slate-400 flex items-center gap-1.5">
                  <Layers className="h-3.5 w-3.5" /> Functional Role in MVP
                </span>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-sans font-light">
                  {activeDir.role}
                </p>
              </div>

              {/* SOLID Principle Justification */}
              <div className="p-4 bg-indigo-50/50 dark:bg-indigo-500/5 rounded-xl border border-indigo-100 dark:border-indigo-500/10 space-y-1.5">
                <span className="text-[10px] font-mono uppercase text-indigo-600 dark:text-indigo-400 flex items-center gap-1.5 font-bold">
                  <ShieldCheck className="h-3.5 w-3.5" /> SOLID Alignment
                </span>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-sans">
                  {activeDir.solidPrinciple}
                </p>
              </div>

              {/* Registered Files list */}
              <div className="space-y-2">
                <span className="text-[10px] font-mono uppercase text-slate-400 flex items-center gap-1.5">
                  <BookOpen className="h-3.5 w-3.5" /> Contained File Modules
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {activeDir.files.map((file) => (
                    <div
                      key={file}
                      className="p-2.5 bg-slate-50 dark:bg-[#030303] border border-slate-150 dark:border-white/5 rounded-lg flex items-center gap-2 font-mono text-[11px] text-slate-700 dark:text-slate-300"
                    >
                      <FileCode className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                      <span className="truncate">{file}</span>
                    </div>
                  ))}
                </div>
              </div>

            </CardBody>
          </Card>
        </div>

      </div>
    </div>
  );
}
