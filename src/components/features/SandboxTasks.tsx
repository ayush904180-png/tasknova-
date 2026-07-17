/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { Clock, Coins, CheckCircle, Sparkles, ThumbsUp, HelpCircle, ArrowRight, RotateCcw, ShieldCheck, Heart } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardBody, CardFooter } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { formatCoins, formatCurrencyValue, formatDuration, generateTaskId } from '../../utils';

interface MockTask {
  id: string;
  category: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  title: string;
  description: string;
  rewardCoins: number;
  payload: Record<string, any>;
}

const MOCK_TASKS: MockTask[] = [
  {
    id: 'TASK-RLHF-01',
    category: 'RLHF Preference',
    difficulty: 'Medium',
    title: 'Select Higher Quality Chatbot Response',
    description: 'Compare two AI responses generated for a tricky analytical prompt and select the superior answer.',
    rewardCoins: 15,
    payload: {
      prompt: "Can you explain why black holes don't suck in everything in the universe if their gravity is so strong?",
      modelA: "Black holes are incredibly dense, meaning they have massive gravitational fields. However, they aren't cosmic vacuum cleaners. If our Sun were replaced by a black hole of the exact same mass, Earth's orbit wouldn't change at all because the gravitational force at that distance remains identical. They only 'suck in' things that cross their event horizon—the point of no return.",
      modelB: "A black hole has an infinite pull of gravity that drags everything near it down into a central point. Eventually, given enough time, everything in galaxies will fall into a black hole since gravity is always working and nothing can escape black hole fields. The only reason we aren't sucked in yet is because space is very large, but its gravity is infinite."
    }
  },
  {
    id: 'TASK-PRMPT-02',
    category: 'Prompt Auditing',
    difficulty: 'Easy',
    title: 'Evaluate AI Safety & Relevance',
    description: 'Analyze an incoming user prompt to verify if it contains harmful instructions, malware requests, or toxic themes.',
    rewardCoins: 10,
    payload: {
      userPrompt: "Translate this code into python: const numbers = [1, 2, 3]; const doubles = numbers.map(x => x * 2);",
      riskType: "No risk / Safe code translation",
      categorySuggested: "Coding Assistance"
    }
  },
  {
    id: 'TASK-TRANS-03',
    category: 'Translation Validation',
    difficulty: 'Hard',
    title: 'Verify English to Hindi Localization',
    description: 'Verify if the AI-translated Hindi phrase matches the idiomatic, localized meaning of the original English quote.',
    rewardCoins: 25,
    payload: {
      english: "Don't count your chickens before they hatch.",
      aiHindi: "अपने अंडों से निकलने से पहले अपने मुर्गियों की गिनती न करें।",
      naturalHindi: "काम पूरा होने से पहले ही परिणाम की उम्मीद न करें (हथेली पर सरसों नहीं जमती)।"
    }
  }
];

export function SandboxTasks() {
  const [selectedTaskIndex, setSelectedTaskIndex] = useState<number>(0);
  const [userCoins, setUserCoins] = useState<number>(() => {
    const saved = localStorage.getItem('tasknova-mock-coins');
    return saved ? parseInt(saved, 10) : 0;
  });
  const [completedCount, setCompletedCount] = useState<number>(() => {
    const saved = localStorage.getItem('tasknova-mock-completed');
    return saved ? parseInt(saved, 10) : 0;
  });

  const [activeTimer, setActiveTimer] = useState<number>(0);
  const [submissionFeedback, setSubmissionFeedback] = useState<string | null>(null);
  
  // Interactive answers states
  const [rlhfChoice, setRlhfChoice] = useState<'A' | 'B' | null>(null);
  const [safetyChoice, setSafetyChoice] = useState<'safe' | 'toxic' | null>(null);
  const [translationChoice, setTranslationChoice] = useState<'perfect' | 'literal' | 'bad' | null>(null);

  const activeTask = MOCK_TASKS[selectedTaskIndex];

  // Micro stopwatch timer
  useEffect(() => {
    setActiveTimer(0);
    const interval = setInterval(() => {
      setActiveTimer((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [selectedTaskIndex]);

  // Persist mock wallet values
  useEffect(() => {
    localStorage.setItem('tasknova-mock-coins', userCoins.toString());
    localStorage.setItem('tasknova-mock-completed', completedCount.toString());
  }, [userCoins, completedCount]);

  const handleResetSandbox = () => {
    setUserCoins(0);
    setCompletedCount(0);
    setRlhfChoice(null);
    setSafetyChoice(null);
    setTranslationChoice(null);
    setSubmissionFeedback(null);
    localStorage.removeItem('tasknova-mock-coins');
    localStorage.removeItem('tasknova-mock-completed');
  };

  const handleTaskSubmit = () => {
    // Audit input checks based on active selection
    if (selectedTaskIndex === 0 && !rlhfChoice) return;
    if (selectedTaskIndex === 1 && !safetyChoice) return;
    if (selectedTaskIndex === 2 && !translationChoice) return;

    const coinsEarned = activeTask.rewardCoins;
    setUserCoins((prev) => prev + coinsEarned);
    setCompletedCount((prev) => prev + 1);

    // Prompt user feedback alert
    setSubmissionFeedback(`Congratulations! Task successfully verified. +${coinsEarned} Coins credited to your wallet in ${activeTimer}s.`);

    // Reset interaction buffers
    setRlhfChoice(null);
    setSafetyChoice(null);
    setTranslationChoice(null);

    // Advance to next task if available
    setTimeout(() => {
      setSubmissionFeedback(null);
      setSelectedTaskIndex((prev) => (prev + 1) % MOCK_TASKS.length);
    }, 4500);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8" id="sandbox-tasks-section">
      
      {/* LEFT COLUMN: MOCK LEDGER / STATS CARD */}
      <div className="lg:col-span-1 space-y-6">
        
        {/* Core Wallet Display */}
        <Card className="bg-gradient-to-br from-indigo-950 via-[#09090b] to-purple-950 text-white dark:border-white/5 border-none relative overflow-hidden shadow-2xl">
          <div className="absolute -right-10 -bottom-10 opacity-10">
            <Coins className="h-40 w-40" />
          </div>
          <CardHeader className="border-b border-white/5">
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400">Contributor Wallet</span>
              <Badge variant="success" className="bg-emerald-500/25 text-emerald-300 border-emerald-500/40 font-semibold">Live State</Badge>
            </div>
            <CardTitle className="text-white font-display text-lg mt-2">TaskNova Ledger</CardTitle>
          </CardHeader>
          <CardBody className="py-6 text-white">
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-extrabold tracking-tight text-white font-display">
                {formatCoins(userCoins)}
              </span>
              <span className="text-xs text-brand-300 font-mono font-medium">Coins</span>
            </div>
            
            <div className="mt-4 pt-4 border-t border-white/5 space-y-3 font-mono text-xs text-slate-300">
              <div className="flex justify-between">
                <span>Value in INR (₹)</span>
                <span className="font-semibold text-emerald-400">{formatCurrencyValue(userCoins, 'IN')}</span>
              </div>
              <div className="flex justify-between">
                <span>Value in USD ($)</span>
                <span className="font-semibold text-sky-400">{formatCurrencyValue(userCoins, 'US')}</span>
              </div>
              <div className="flex justify-between border-t border-white/5 pt-2">
                <span>Micro Tasks Completed</span>
                <span className="font-semibold text-white">{completedCount}</span>
              </div>
            </div>
          </CardBody>
          <CardFooter className="bg-black/20 border-white/5 justify-between">
            <span className="text-[10px] text-slate-400 font-mono">UPI instant cashout eligible</span>
            <button 
              onClick={handleResetSandbox}
              className="text-[10px] text-rose-400 hover:text-rose-300 font-mono underline cursor-pointer"
            >
              Reset Ledger
            </button>
          </CardFooter>
        </Card>

        {/* Task Index / Queue Menu */}
        <Card className="shadow-xs">
          <CardHeader>
            <CardTitle className="text-sm">Verification Queue</CardTitle>
            <CardDescription>Select a mock task to rating.</CardDescription>
          </CardHeader>
          <CardBody className="p-2 space-y-1 pt-0">
            {MOCK_TASKS.map((task, index) => {
              const isActive = index === selectedTaskIndex;
              return (
                <button
                  key={task.id}
                  onClick={() => {
                    setSelectedTaskIndex(index);
                    setSubmissionFeedback(null);
                  }}
                  className={`w-full text-left p-3 rounded-lg border transition-all text-xs flex items-center justify-between cursor-pointer ${
                    isActive
                      ? 'bg-slate-50 border-slate-300 dark:bg-white/5 dark:border-white/10'
                      : 'bg-transparent border-transparent hover:bg-slate-100/50 dark:hover:bg-white/5 text-slate-600 dark:text-zinc-400'
                  }`}
                >
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-slate-800 dark:text-slate-200">{task.category}</span>
                      <span className="text-[10px] font-mono text-slate-400">({task.id})</span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-0.5 truncate max-w-[180px]">{task.title}</p>
                  </div>
                  <div className="flex items-center gap-1">
                    <Coins className="h-3.5 w-3.5 text-amber-500" />
                    <span className="font-mono font-semibold text-slate-800 dark:text-slate-200">{task.rewardCoins}</span>
                  </div>
                </button>
              );
            })}
          </CardBody>
        </Card>

      </div>

      {/* RIGHT COLUMN: THE TASK WORKSPACE CONTAINER */}
      <div className="lg:col-span-2">
        
        {/* Onboarding Sandbox Alert banner */}
        {submissionFeedback && (
          <div className="mb-6 p-4 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/30 rounded-xl text-xs text-brand-800 dark:text-brand-300 flex items-start gap-2.5 animate-fade-in shadow-xs">
            <CheckCircle className="h-4.5 w-4.5 text-brand-600 dark:text-emerald-400 mt-0.5" />
            <div>
              <p className="font-semibold">{submissionFeedback}</p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">Simulating submission stream. Next human evaluation queue loading shortly...</p>
            </div>
          </div>
        )}

        {/* Primary Task Playground Workspace */}
        <Card className="border-slate-200 shadow-sm relative overflow-hidden">
          
          {/* Subtle timer banner top */}
          <div className="bg-slate-50 dark:bg-[#030303]/85 px-6 py-2.5 border-b border-slate-150 dark:border-white/5 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Badge variant={activeTask.difficulty === 'Easy' ? 'success' : activeTask.difficulty === 'Medium' ? 'primary' : 'danger'} className="dark:bg-indigo-500/10 dark:text-indigo-400 dark:border-indigo-500/20">
                {activeTask.difficulty}
              </Badge>
              <span className="text-[11px] font-mono text-slate-400">{activeTask.category} Task</span>
            </div>
            <div className="flex items-center gap-1.5 font-mono text-[11px] text-slate-500">
              <Clock className="h-3.5 w-3.5 text-slate-400" />
              <span>Time in Session:</span>
              <span className="font-bold text-slate-800 dark:text-slate-200">{formatDuration(activeTimer)}</span>
            </div>
          </div>

          <CardBody className="py-6 space-y-6">
            
            {/* Task Header info */}
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white font-display">
                {activeTask.title}
              </h2>
              <p className="text-xs text-slate-500 dark:text-zinc-400 mt-1">
                {activeTask.description}
              </p>
            </div>

            {/* TASK-SPECIFIC DYNAMIC UI RENDERERS */}
            <div className="p-5 bg-slate-50 dark:bg-white/5 rounded-xl border border-slate-200/80 dark:border-white/5">
              
              {/* Variant 1: RLHF Model Selection */}
              {activeTask.id === 'TASK-RLHF-01' && (
                <div className="space-y-4">
                  <div className="space-y-1">
                    <span className="text-[10px] uppercase font-mono tracking-wider font-semibold text-indigo-400">Input Prompt:</span>
                    <blockquote className="text-xs font-medium text-slate-700 dark:text-zinc-300 bg-white dark:bg-[#030303] p-3 rounded-lg border border-slate-150 dark:border-white/5 leading-relaxed">
                      "{activeTask.payload.prompt}"
                    </blockquote>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Response A */}
                    <button
                      onClick={() => setRlhfChoice('A')}
                      className={`p-4 rounded-xl border text-left transition-all relative cursor-pointer ${
                        rlhfChoice === 'A'
                          ? 'bg-indigo-500/10 border-indigo-500 ring-2 ring-indigo-500/20'
                          : 'bg-white dark:bg-[#030303] border-slate-200 dark:border-white/5 hover:border-slate-300 dark:hover:border-white/10'
                      }`}
                    >
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-xs font-mono font-bold text-indigo-400">Response Alpha</span>
                        {rlhfChoice === 'A' && <CheckCircle className="h-4 w-4 text-indigo-400" />}
                      </div>
                      <p className="text-xs text-slate-600 dark:text-zinc-400 leading-relaxed font-sans font-light">
                        {activeTask.payload.modelA}
                      </p>
                    </button>

                    {/* Response B */}
                    <button
                      onClick={() => setRlhfChoice('B')}
                      className={`p-4 rounded-xl border text-left transition-all relative cursor-pointer ${
                        rlhfChoice === 'B'
                          ? 'bg-indigo-500/10 border-indigo-500 ring-2 ring-indigo-500/20'
                          : 'bg-white dark:bg-[#030303] border-slate-200 dark:border-white/5 hover:border-slate-300 dark:hover:border-white/10'
                      }`}
                    >
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-xs font-mono font-bold text-indigo-400">Response Beta</span>
                        {rlhfChoice === 'B' && <CheckCircle className="h-4 w-4 text-indigo-400" />}
                      </div>
                      <p className="text-xs text-slate-600 dark:text-zinc-400 leading-relaxed font-sans font-light">
                        {activeTask.payload.modelB}
                      </p>
                    </button>
                  </div>
                </div>
              )}

              {/* Variant 2: Prompt Auditing */}
              {activeTask.id === 'TASK-PRMPT-02' && (
                <div className="space-y-4 text-xs">
                  <div className="space-y-1">
                    <span className="text-[10px] uppercase font-mono tracking-wider font-semibold text-indigo-400">User Incoming Prompt:</span>
                    <pre className="font-mono text-[11px] bg-white dark:bg-[#030303] p-3 rounded-lg border border-slate-150 dark:border-white/5 leading-relaxed overflow-x-auto text-slate-700 dark:text-zinc-300">
                      {activeTask.payload.userPrompt}
                    </pre>
                  </div>

                  <div className="p-3 bg-white dark:bg-[#030303] rounded-lg border border-slate-150 dark:border-white/5 flex items-center justify-between">
                    <div>
                      <span className="font-mono text-[10px] text-slate-400">Heuristic Signal Classifier:</span>
                      <p className="font-semibold text-slate-800 dark:text-zinc-200 mt-0.5">{activeTask.payload.riskType}</p>
                    </div>
                    <Badge variant="neutral" className="dark:bg-white/5 dark:text-zinc-400 dark:border-white/5">{activeTask.payload.categorySuggested}</Badge>
                  </div>

                  <div className="space-y-2">
                    <span className="text-[10px] uppercase font-mono tracking-wider font-semibold text-indigo-400">Auditor Judgment:</span>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        onClick={() => setSafetyChoice('safe')}
                        className={`p-3.5 rounded-lg border text-center font-medium transition-all flex items-center justify-center gap-2 cursor-pointer ${
                          safetyChoice === 'safe'
                            ? 'bg-emerald-500/10 border-emerald-500 text-emerald-400'
                            : 'bg-white dark:bg-[#030303] border-slate-200 dark:border-white/5 dark:hover:bg-white/5'
                        }`}
                      >
                        <ShieldCheck className="h-4.5 w-4.5" />
                        <span>Safe / Approve Prompt</span>
                      </button>

                      <button
                        onClick={() => setSafetyChoice('toxic')}
                        className={`p-3.5 rounded-lg border text-center font-medium transition-all flex items-center justify-center gap-2 cursor-pointer ${
                          safetyChoice === 'toxic'
                            ? 'bg-rose-500/10 border-rose-500 text-rose-400'
                            : 'bg-white dark:bg-[#030303] border-slate-200 dark:border-white/5 dark:hover:bg-white/5'
                        }`}
                      >
                        <HelpCircle className="h-4.5 w-4.5" />
                        <span>Violates Safety / Flags</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Variant 3: English-to-Hindi Localization */}
              {activeTask.id === 'TASK-TRANS-03' && (
                <div className="space-y-4 text-xs">
                  <div className="space-y-2">
                    <div>
                      <span className="text-[10px] uppercase font-mono tracking-wider font-semibold text-indigo-400">English Original:</span>
                      <blockquote className="text-xs font-semibold text-slate-700 dark:text-zinc-300 bg-white dark:bg-[#030303] p-3 rounded-lg border border-slate-150 dark:border-white/5 mt-1">
                        "{activeTask.payload.english}"
                      </blockquote>
                    </div>

                    <div>
                      <span className="text-[10px] uppercase font-mono tracking-wider font-semibold text-amber-500">Model Translation Output:</span>
                      <blockquote className="text-xs font-medium text-slate-700 dark:text-zinc-300 bg-white dark:bg-[#030303] p-3 rounded-lg border border-slate-150 dark:border-white/5 mt-1">
                        "{activeTask.payload.aiHindi}"
                      </blockquote>
                    </div>

                    <div>
                      <span className="text-[10px] uppercase font-mono tracking-wider font-semibold text-brand-400">Natural Idiomatic Translation Reference:</span>
                      <blockquote className="text-xs font-medium text-brand-800 dark:text-emerald-400 bg-emerald-50/50 dark:bg-emerald-950/10 p-3 rounded-lg border border-emerald-100 dark:border-emerald-900/10 mt-1">
                        "{activeTask.payload.naturalHindi}"
                      </blockquote>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <span className="text-[10px] uppercase font-mono tracking-wider font-semibold text-indigo-400">Localization Rating:</span>
                    <div className="grid grid-cols-3 gap-2.5">
                      <button
                        onClick={() => setTranslationChoice('perfect')}
                        className={`p-3 rounded-lg border text-center transition-all cursor-pointer ${
                          translationChoice === 'perfect'
                            ? 'bg-emerald-500/10 border-emerald-500 text-emerald-400 font-bold'
                            : 'bg-white dark:bg-[#030303] border-slate-200 dark:border-white/5'
                        }`}
                      >
                        Excellent
                      </button>

                      <button
                        onClick={() => setTranslationChoice('literal')}
                        className={`p-3 rounded-lg border text-center transition-all cursor-pointer ${
                          translationChoice === 'literal'
                            ? 'bg-amber-500/10 border-amber-500 text-amber-400 font-bold'
                            : 'bg-white dark:bg-[#030303] border-slate-200 dark:border-white/5'
                        }`}
                      >
                        Literal/Awkward
                      </button>

                      <button
                        onClick={() => setTranslationChoice('bad')}
                        className={`p-3 rounded-lg border text-center transition-all cursor-pointer ${
                          translationChoice === 'bad'
                            ? 'bg-rose-500/10 border-rose-500 text-rose-400 font-bold'
                            : 'bg-white dark:bg-[#030303] border-slate-200 dark:border-white/5'
                        }`}
                      >
                        Inaccurate
                      </button>
                    </div>
                  </div>
                </div>
              )}

            </div>

            {/* Instruction specs footnotes */}
            <div className="space-y-1.5 text-[11px] text-slate-500 border-t border-slate-100 dark:border-slate-900 pt-4">
              <span className="font-bold text-slate-700 dark:text-slate-300 block font-mono uppercase tracking-wider text-[10px]">Verification Protocol:</span>
              <ul className="list-disc pl-4 space-y-1 leading-normal font-sans font-light">
                <li>Read and compare with extreme focus; high-quality human ratings align next-gen systems.</li>
                <li>Trap actions exist in production: random double checks verify user authenticity.</li>
                <li>Submit to credit <span className="font-bold text-slate-700 dark:text-slate-300 font-mono">+{activeTask.rewardCoins} coins</span> instantly to your browser wallet.</li>
              </ul>
            </div>

          </CardBody>

          <CardFooter className="justify-between">
            <span className="text-xs text-slate-400 font-mono">ID: {activeTask.id}</span>
            <Button
              variant="primary"
              size="md"
              onClick={handleTaskSubmit}
              disabled={
                (selectedTaskIndex === 0 && !rlhfChoice) ||
                (selectedTaskIndex === 1 && !safetyChoice) ||
                (selectedTaskIndex === 2 && !translationChoice) ||
                submissionFeedback !== null
              }
              rightIcon={<ArrowRight className="h-4 w-4" />}
            >
              Verify & Submit
            </Button>
          </CardFooter>
        </Card>

      </div>
    </div>
  );
}
