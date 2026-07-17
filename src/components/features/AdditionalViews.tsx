/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Award, TrendingUp, Coins, Users, BookOpen, Info, Mail, ShieldAlert, 
  Globe, Search, Bell, Zap, Sparkles, Check, ExternalLink, Lock, 
  Settings, Code, WifiOff, RefreshCw, AlertTriangle, ArrowRight, 
  ChevronRight, Calendar, Landmark, CheckCircle2, Star, ShieldCheck, HelpCircle
} from 'lucide-react';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { Card, CardHeader, CardContent, CardFooter } from '../ui/Card';
import { RewardCard, WalletCard, ProfileCard, EmptyCard, InformationCard } from '../ui/CardComponents';
import { TextInput, EmailInput, Textarea, Dropdown } from '../ui/Inputs';
import { ProgressBar, Spinner } from '../ui/LoadingComponents';
import { AppRoute } from '../../types';

// ==========================================
// 1. REWARDS VIEW
// ==========================================
export function RewardsView() {
  const [unclaimedCoins, setUnclaimedCoins] = useState(380);
  const [lifetimeEarned, setLifetimeEarned] = useState(1480);
  const [isPayoutLoading, setIsPayoutLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handlePayout = () => {
    if (unclaimedCoins < 100) {
      alert("Minimum payout threshold is 100 coins.");
      return;
    }
    setIsPayoutLoading(true);
    setTimeout(() => {
      setIsPayoutLoading(false);
      setLifetimeEarned(prev => prev + unclaimedCoins);
      setSuccessMessage(`Successfully disbursed ₹${(unclaimedCoins * 0.45).toFixed(2)} to your linked UPI ledger!`);
      setUnclaimedCoins(0);
    }, 2000);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8 text-left"
    >
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white font-display">
          Holdings & Disbursals
        </h1>
        <p className="text-sm text-slate-500 mt-1.5 font-sans font-light">
          Monitor your human feedback reward coins, simulated payout indices, and historical transactions.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <RewardCard 
            title="Consolidated Rewards"
            totalRewards={lifetimeEarned}
            unclaimedCoins={unclaimedCoins}
            multiplier={1.5}
            onClaim={handlePayout}
          />

          {isPayoutLoading && (
            <div className="p-4 bg-indigo-50/50 dark:bg-indigo-500/5 border border-indigo-200/50 dark:border-indigo-500/20 rounded-xl flex items-center gap-3">
              <Spinner size="sm" />
              <span className="text-xs font-mono text-indigo-600 dark:text-indigo-400 font-medium">Contacting routing node, processing UPI instant ledger clearance...</span>
            </div>
          )}

          {successMessage && (
            <div className="p-4 bg-emerald-50/50 dark:bg-emerald-500/5 border border-emerald-200/50 dark:border-emerald-500/20 rounded-xl flex items-center gap-3">
              <CheckCircle2 className="h-5 w-5 text-emerald-500" />
              <span className="text-xs font-mono text-emerald-600 dark:text-emerald-400 font-medium">{successMessage}</span>
            </div>
          )}

          <div className="border border-slate-200/80 dark:border-white/5 rounded-xl bg-white dark:bg-[#09090b] overflow-hidden">
            <div className="p-4 border-b border-slate-100 dark:border-white/5 flex justify-between items-center bg-slate-50/50 dark:bg-[#030303]/40">
              <h3 className="text-xs font-bold uppercase tracking-wider font-mono text-slate-700 dark:text-zinc-300">Transaction History</h3>
              <Badge variant="neutral" className="text-[9px] font-mono">Consolidated Ledger</Badge>
            </div>
            <div className="divide-y divide-slate-100 dark:divide-white/5 text-xs">
              {[
                { id: 'TX-9022', task: 'RLHF Alignment Assessment #901', date: 'July 16, 2026', coins: 18, status: 'Completed' },
                { id: 'TX-8831', task: 'Translation Audit (Hindi regional)', date: 'July 15, 2026', coins: 12, status: 'Completed' },
                { id: 'TX-8042', task: 'Semantic Tagging Batch #4', date: 'July 13, 2026', coins: 25, status: 'Completed' },
                { id: 'TX-PAY-01', task: 'Instant UPI Payout Hold Release', date: 'July 10, 2026', coins: -500, status: 'Transferred' },
              ].map((tx) => (
                <div key={tx.id} className="p-4 flex justify-between items-center hover:bg-slate-50/50 dark:hover:bg-white/1 pt-4 pb-4">
                  <div className="space-y-1">
                    <span className="font-semibold text-slate-800 dark:text-zinc-200 block">{tx.task}</span>
                    <span className="text-[10px] text-slate-400 font-mono block">{tx.id} • {tx.date}</span>
                  </div>
                  <div className="text-right">
                    <span className={`font-mono font-bold block ${tx.coins > 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-600 dark:text-zinc-300'}`}>
                      {tx.coins > 0 ? `+${tx.coins}` : tx.coins} Coins
                    </span>
                    <span className="text-[9px] font-mono text-slate-400 uppercase tracking-widest">{tx.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="md:col-span-1 space-y-6">
          <WalletCard 
            balance={unclaimedCoins}
            inrValue={unclaimedCoins * 0.45}
            walletAddress="TNK-7712A-X09"
            transactionsCount={4}
          />

          <Card className="border-slate-200 dark:border-white/5">
            <CardHeader className="py-3 border-b border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-[#030303]/40">
              <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider block">Claim Criteria</span>
            </CardHeader>
            <CardContent className="p-4 space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-mono text-slate-500 dark:text-zinc-400">
                  <span>Minimum Threshold:</span>
                  <span>100 Coins</span>
                </div>
                <ProgressBar progress={Math.min(100, (unclaimedCoins / 100) * 100)} />
              </div>
              <p className="text-[11px] text-slate-400 leading-normal font-sans font-light">
                Minimum payout requires a hold value of 100 reward coins. Standard translation rates evaluate 1 Coin at ₹0.45.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </motion.div>
  );
}

// ==========================================
// 2. LEADERBOARD VIEW
// ==========================================
export function LeaderboardView() {
  const leaderboardData = [
    { rank: 1, name: 'ayush904180', region: 'India (IN)', tasks: 412, accuracy: '99.2%', xp: '3,840', reward: '₹ 1,728' },
    { rank: 2, name: 'elizabeth_p', region: 'United States (US)', tasks: 389, accuracy: '98.8%', xp: '3,520', reward: '₹ 1,584' },
    { rank: 3, name: 'dev_muthu', region: 'India (IN)', tasks: 354, accuracy: '98.5%', xp: '3,100', reward: '₹ 1,395' },
    { rank: 4, name: 'sarah_st', region: 'Canada (CA)', tasks: 312, accuracy: '97.9%', xp: '2,900', reward: '₹ 1,305' },
    { rank: 5, name: 'tanaka_k', region: 'Japan (JP)', tasks: 298, accuracy: '98.1%', xp: '2,750', reward: '₹ 1,237' },
    { rank: 6, name: 'marcus_v', region: 'Germany (DE)', tasks: 265, accuracy: '97.4%', xp: '2,400', reward: '₹ 1,080' },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8 text-left"
    >
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white font-display">
            Global Contributor Leaderboard
          </h1>
          <p className="text-sm text-slate-500 mt-1.5 font-sans font-light">
            Real-time standings of elite human-in-the-loop annotators across global networks.
          </p>
        </div>
        <div className="flex gap-2">
          <Badge variant="success" className="px-3 py-1 text-xs">Active Cycle: July 2026</Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Leaderboard main list */}
        <div className="md:col-span-3 border border-slate-200/80 dark:border-white/5 rounded-xl bg-white dark:bg-[#09090b] overflow-hidden">
          <table className="w-full text-xs font-sans text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-black/30 border-b border-slate-200/80 dark:border-white/5 font-mono text-[10px] text-slate-400 uppercase">
                <th className="p-4 text-center w-16">Rank</th>
                <th className="p-4">Validator</th>
                <th className="p-4">Submissions</th>
                <th className="p-4 text-right">Accuracy</th>
                <th className="p-4 text-right">XP Points</th>
                <th className="p-4 text-right">Holdings</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-white/5">
              {leaderboardData.map((user) => (
                <tr key={user.rank} className="hover:bg-slate-50/50 dark:hover:bg-white/1">
                  <td className="p-4 text-center">
                    {user.rank === 1 && <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-amber-500/10 text-amber-500 border border-amber-500/20 font-bold font-mono">1</span>}
                    {user.rank === 2 && <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-slate-400/10 text-slate-400 border border-slate-400/20 font-bold font-mono">2</span>}
                    {user.rank === 3 && <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-amber-700/10 text-amber-700 border border-amber-700/20 font-bold font-mono">3</span>}
                    {user.rank > 3 && <span className="text-slate-400 font-mono">{user.rank}</span>}
                  </td>
                  <td className="p-4">
                    <div className="flex flex-col">
                      <span className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                        {user.name}
                        {user.rank < 3 && <ShieldCheck className="h-3.5 w-3.5 text-indigo-500" />}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono mt-0.5">{user.region}</span>
                    </div>
                  </td>
                  <td className="p-4 font-mono font-medium text-slate-600 dark:text-zinc-300">{user.tasks} submissions</td>
                  <td className="p-4 text-right font-mono text-emerald-500 font-bold">{user.accuracy}</td>
                  <td className="p-4 text-right font-mono text-indigo-500 dark:text-indigo-400 font-bold">{user.xp} XP</td>
                  <td className="p-4 text-right font-mono font-bold text-slate-900 dark:text-white">{user.reward}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Supporting cards */}
        <div className="md:col-span-1 space-y-6">
          <Card className="border-slate-200 dark:border-white/5">
            <CardHeader className="py-3 border-b border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-[#030303]/40">
              <span className="text-xs font-mono font-bold text-slate-700 dark:text-zinc-200 uppercase tracking-wider flex items-center gap-1.5">
                <Star className="h-4 w-4 text-amber-500 fill-amber-500" /> High-Level Criteria
              </span>
            </CardHeader>
            <CardContent className="p-4 space-y-4">
              <p className="text-xs text-slate-500 dark:text-zinc-400 leading-normal font-sans font-light">
                Standings are refreshed every 15 minutes. Elite contributors (Accuracy &gt; 98.0%) qualify for premium RLHF evaluators yielding 2x reward multipliers.
              </p>
              <div className="border-t border-slate-100 dark:border-white/5 pt-3.5 space-y-3 font-mono text-[10px] text-slate-400">
                <div className="flex justify-between">
                  <span>Cycle Ends:</span>
                  <span className="text-slate-700 dark:text-zinc-300 font-bold">14d 08h remaining</span>
                </div>
                <div className="flex justify-between">
                  <span>Elite Pool Value:</span>
                  <span className="text-emerald-500 font-bold">₹ 5,00,000</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </motion.div>
  );
}

// ==========================================
// 3. COMMUNITY VIEW
// ==========================================
export function CommunityView() {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8 text-left"
    >
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white font-display">
          TaskNova Global Community
        </h1>
        <p className="text-sm text-slate-500 mt-1.5 font-sans font-light">
          Connect with professional annotators, AI researchers, and alignment validators.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Card className="border-slate-200 dark:border-white/5 hover:border-slate-300 dark:hover:border-indigo-500/30 transition-all cursor-pointer">
              <CardContent className="p-5 space-y-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-400">
                  <Users className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white font-display">General Contributor Forums</h3>
                  <p className="text-xs text-slate-500 dark:text-zinc-400 mt-1 font-sans font-light">
                    Discuss translation nuances, prompt evaluation parameters, and claim guidelines.
                  </p>
                </div>
                <span className="text-[10px] text-indigo-500 font-mono font-bold flex items-center gap-1 mt-2">
                  Explore Forums <ChevronRight className="h-3 w-3" />
                </span>
              </CardContent>
            </Card>

            <Card className="border-slate-200 dark:border-white/5 hover:border-slate-300 dark:hover:border-indigo-500/30 transition-all cursor-pointer">
              <CardContent className="p-5 space-y-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/10 text-purple-400">
                  <Zap className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white font-display">Model Alignment Workgroups</h3>
                  <p className="text-xs text-slate-500 dark:text-zinc-400 mt-1 font-sans font-light">
                    Collaborative research cohorts specializing in Safety and Toxic response evaluations.
                  </p>
                </div>
                <span className="text-[10px] text-purple-500 font-mono font-bold flex items-center gap-1 mt-2">
                  View cohorts <ChevronRight className="h-3 w-3" />
                </span>
              </CardContent>
            </Card>
          </div>

          <div className="border border-slate-200/80 dark:border-white/5 rounded-xl bg-white dark:bg-[#09090b] overflow-hidden">
            <div className="p-4 border-b border-slate-100 dark:border-white/5 flex justify-between items-center bg-slate-50/50 dark:bg-[#030303]/40">
              <h3 className="text-xs font-bold uppercase tracking-wider font-mono text-slate-700 dark:text-zinc-300">Upcoming Live Alignment Roundtables</h3>
            </div>
            <div className="p-4 space-y-4">
              {[
                { title: 'RLHF Tuning on South Asian Languages', host: 'TaskNova Core', date: 'July 24, 2026', time: '16:00 IST', count: 184 },
                { title: 'Minimizing Model Hallucinations in Financial Datasets', host: 'Research Labs', date: 'August 02, 2026', time: '10:00 EST', count: 320 },
              ].map((evt, i) => (
                <div key={i} className="flex justify-between items-center bg-slate-50 dark:bg-[#0c0c0e]/40 p-4 rounded-xl border border-slate-100 dark:border-white/5">
                  <div className="space-y-1">
                    <span className="font-semibold text-xs text-slate-900 dark:text-white block">{evt.title}</span>
                    <span className="text-[10px] text-slate-400 font-mono block">Host: {evt.host} • {evt.date} @ {evt.time}</span>
                  </div>
                  <Button variant="outline" size="sm" className="text-[10px] py-1.5 font-bold rounded-full">
                    Register ({evt.count})
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="md:col-span-1 space-y-6">
          <Card className="bg-gradient-to-br from-indigo-950 via-slate-950 to-purple-950 border-none text-white relative overflow-hidden">
            <div className="absolute right-0 bottom-0 opacity-10">
              <Users className="h-32 w-32" />
            </div>
            <CardContent className="p-6 space-y-4 relative z-10">
              <Badge className="bg-white/10 text-white border-transparent font-mono text-[9px]">OFFICIAL CHANNELS</Badge>
              <h3 className="text-lg font-bold font-display text-white">Join Slack & Discord Network</h3>
              <p className="text-xs text-slate-300 leading-relaxed font-sans font-light">
                Sync instantly with 15k+ active validators, get real-time task queue alerts, and receive quick support for disbursements.
              </p>
              <Button variant="primary" className="w-full text-xs font-semibold py-2 dark:bg-white dark:text-black dark:hover:bg-zinc-200 rounded-full" leftIcon={<ExternalLink className="h-3.5 w-3.5" />}>
                Join Discord Server
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </motion.div>
  );
}

// ==========================================
// 4. BLOG VIEW
// ==========================================
export function BlogView() {
  const posts = [
    {
      title: 'Human-in-the-Loop: Why Real Assessments Outperform Synthetic Data',
      excerpt: 'Exploring why enterprise-scale RLHF models depend on authentic, high-quality human evaluation inputs over automated model outputs.',
      author: 'TaskNova Research Team',
      date: 'July 14, 2026',
      readTime: '6 min read',
      tag: 'RLHF Alignment'
    },
    {
      title: 'Designing Accessible Micro-Task Systems for the Global South',
      excerpt: 'How TaskNova’s layout, 8-point vertical grids, and low latency interfaces enable thousands of Indian annotators to collaborate smoothly.',
      author: 'Ayush Sharma',
      date: 'July 10, 2026',
      readTime: '4 min read',
      tag: 'UX / Accessibility'
    },
    {
      title: 'Understanding Safety Heuristics in LLM Fine-Tuning',
      excerpt: 'An inside look at our safety verification pipelines, policy classification matrices, and how annotators flag toxic completions.',
      author: 'Alignment Labs',
      date: 'July 05, 2026',
      readTime: '8 min read',
      tag: 'Safety Systems'
    }
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8 text-left"
    >
      <div className="border-b border-slate-200/80 dark:border-white/5 pb-6">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white font-display">
          TaskNova AI Chronicles
        </h1>
        <p className="text-sm text-slate-500 mt-1.5 font-sans font-light">
          Deep-dives, architecture blueprints, research papers, and stories from the frontlines of model alignment.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {posts.map((post, index) => (
          <div key={index} className="h-full">
            <Card className="flex flex-col h-full border-slate-200 dark:border-white/5 hover:border-slate-300 dark:hover:border-white/10 transition-all cursor-pointer">
              <CardHeader className="py-4 border-b border-slate-100 dark:border-white/5 bg-slate-50/30 dark:bg-[#030303]/20 flex flex-row justify-between items-center">
                <Badge variant="neutral" className="text-[9px] font-mono px-2 py-0.5">{post.tag}</Badge>
                <span className="text-[10px] text-slate-400 font-mono">{post.readTime}</span>
              </CardHeader>
              <CardContent className="p-5 flex-1 space-y-3">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white font-display leading-snug line-clamp-2">{post.title}</h3>
                <p className="text-xs text-slate-500 dark:text-zinc-400 font-sans font-light line-clamp-3 leading-relaxed">{post.excerpt}</p>
              </CardContent>
              <CardFooter className="py-3 px-5 border-t border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-[#030303]/40 flex justify-between items-center text-[10px] text-slate-400 font-mono">
                <span>{post.author}</span>
                <span>{post.date}</span>
              </CardFooter>
            </Card>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

// ==========================================
// 5. ABOUT VIEW
// ==========================================
export function AboutView() {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8 text-left"
    >
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white font-display">
          Corporate Mission & Vision
        </h1>
        <p className="text-sm text-slate-500 mt-1.5 font-sans font-light">
          Why we exist, who we serve, and how we are building the future of safe model intelligence.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-6">
          <Card className="border-slate-200 dark:border-white/5 bg-gradient-to-br from-white to-slate-50/30 dark:from-[#09090b] dark:to-[#0c0c0f]">
            <CardContent className="p-6 space-y-4">
              <h3 className="text-base font-bold text-slate-900 dark:text-white font-display">The TaskNova Alignment Paradigm</h3>
              <p className="text-xs text-slate-600 dark:text-zinc-300 leading-relaxed font-sans font-light">
                Large Language Models represent humanity's collective knowledge, but they lack human context, cultural empathy, and safety bounds out of the box. Reinforcement Learning from Human Feedback (RLHF) and direct preference optimization bridges this critical gap.
              </p>
              <p className="text-xs text-slate-600 dark:text-zinc-300 leading-relaxed font-sans font-light">
                TaskNova AI operates high-accuracy human networks to assess, fine-tune, and align global models. Our MVP v0.1 targets rapid local alignment verification with low-latency client state tracking.
              </p>
            </CardContent>
          </Card>

          <div className="space-y-4">
            <h3 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">Enterprise Key Metrics</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono">
              {[
                { val: '1M+', label: 'Capacity Goal' },
                { val: '99.5%', label: 'SLA Quality' },
                { val: 'v0.1 MVP', label: 'Engine Core' },
              ].map((m, i) => (
                <div key={i} className="p-4 rounded-xl border border-slate-200/80 dark:border-white/5 bg-white dark:bg-[#09090b] text-center">
                  <span className="text-2xl font-bold text-indigo-500 block leading-none">{m.val}</span>
                  <span className="text-[10px] text-slate-400 uppercase tracking-widest block mt-2">{m.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="md:col-span-1 space-y-6">
          <Card className="border-slate-200 dark:border-white/5">
            <CardHeader className="py-3 border-b border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-[#030303]/40">
              <span className="text-xs font-mono font-bold text-slate-700 dark:text-zinc-200 uppercase tracking-wider flex items-center gap-1.5">
                <Landmark className="h-4 w-4 text-indigo-500" /> Platform Architecture
              </span>
            </CardHeader>
            <CardContent className="p-4 space-y-4 text-xs">
              <p className="text-slate-500 dark:text-zinc-400 leading-normal font-sans font-light">
                TaskNova is engineered following strict Clean Architecture guidelines. We prioritize:
              </p>
              <ul className="space-y-2 font-mono text-[11px] text-slate-600 dark:text-zinc-300">
                <li className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-indigo-500"></span>
                  <span>SOLID code principles</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-indigo-500"></span>
                  <span>100% Client Type-Safety</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-indigo-500"></span>
                  <span>Zero unnecessary state leaks</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </motion.div>
  );
}

// ==========================================
// 6. CONTACT VIEW
// ==========================================
export function ContactView() {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [isSending, setIsSending] = useState(false);
  const [sentStatus, setSentStatus] = useState<boolean | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      alert("Please populate all text blocks before submitting.");
      return;
    }
    setIsSending(true);
    setTimeout(() => {
      setIsSending(false);
      setSentStatus(true);
      setFormData({ name: '', email: '', message: '' });
    }, 1500);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8 text-left"
    >
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white font-display">
          Enterprise Communication Node
        </h1>
        <p className="text-sm text-slate-500 mt-1.5 font-sans font-light">
          Submit inquiries, support tickets, or business alignment requirements directly to corporate nodes.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 border border-slate-200/80 dark:border-white/5 rounded-xl bg-white dark:bg-[#09090b] p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <TextInput 
                id="contact-name"
                label="Full Name / Corporate Representative"
                placeholder="e.g. Ayush Sharma"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
              />
              <EmailInput 
                id="contact-email"
                label="Business Email Address"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
              />
            </div>
            <Textarea 
              id="contact-msg"
              label="Details of requested alignment scope / SLA hold inquiry"
              placeholder="Provide a complete description here..."
              value={formData.message}
              onChange={(e) => setFormData({...formData, message: e.target.value})}
              rows={5}
            />

            {sentStatus && (
              <div className="p-4 bg-emerald-50/50 dark:bg-emerald-500/5 border border-emerald-200/50 dark:border-emerald-500/20 rounded-xl text-xs font-mono text-emerald-600 dark:text-emerald-400 font-medium">
                Thank you. Communication packet received. Core operators will respond within 4 business hours.
              </div>
            )}

            <Button 
              variant="primary" 
              className="px-6 rounded-full"
              isLoading={isSending}
              type="submit"
            >
              {isSending ? 'Transmitting Data...' : 'Transmit Inquiries Packet'}
            </Button>
          </form>
        </div>

        <div className="md:col-span-1 space-y-6">
          <Card className="border-slate-200 dark:border-white/5">
            <CardHeader className="py-3 border-b border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-[#030303]/40">
              <span className="text-xs font-mono font-bold text-slate-700 dark:text-zinc-200 uppercase tracking-wider flex items-center gap-1.5">
                <Info className="h-4 w-4" /> Global Headquarters
              </span>
            </CardHeader>
            <CardContent className="p-4 space-y-4 text-xs font-sans font-light leading-relaxed">
              <div className="space-y-2">
                <span className="font-bold text-slate-900 dark:text-white block font-display">TaskNova AI Technology Corp</span>
                <p className="text-slate-500 dark:text-zinc-400">
                  Whitefield High-Tech Industrial Zone,<br />
                  Bengaluru, Karnataka, 560066<br />
                  India
                </p>
              </div>
              <div className="border-t border-slate-100 dark:border-white/5 pt-3.5 space-y-1 text-slate-400 font-mono text-[10px]">
                <span className="block">Tech: tech-alignment@tasknova.ai</span>
                <span className="block">Legal: legal-sla@tasknova.ai</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </motion.div>
  );
}

// ==========================================
// 7. SYSTEM ERROR / PLACEHOLDER VIEWS
// ==========================================
export function ErrorViews({ mode, setActiveRoute }: { mode: '404' | '500' | 'offline' | 'maintenance'; setActiveRoute: (route: AppRoute) => void }) {
  const [isRefreshing, setIsRefreshing] = useState(false);

  const simulateReconnect = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      setActiveRoute(AppRoute.HOME);
    }, 1500);
  };

  if (mode === '404') {
    return (
      <div className="min-h-[450px] flex flex-col items-center justify-center text-center p-8 space-y-6">
        <div className="h-16 w-16 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-2xl flex items-center justify-center shadow-lg">
          <AlertTriangle className="h-8 w-8" />
        </div>
        <div className="space-y-2 max-w-md">
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white font-display">404</h1>
          <h3 className="text-sm font-bold uppercase tracking-wider font-mono text-indigo-500 dark:text-indigo-400">Address Node Not Found</h3>
          <p className="text-xs text-slate-500 dark:text-zinc-400 leading-relaxed font-sans font-light">
            The requested routing path does not exist on this ledger checkpoint. It might have been migrated to the production ledger.
          </p>
        </div>
        <Button variant="primary" size="md" onClick={() => setActiveRoute(AppRoute.HOME)} className="rounded-full px-6 font-semibold">
          Return to Overview
        </Button>
      </div>
    );
  }

  if (mode === '500') {
    return (
      <div className="min-h-[450px] flex flex-col items-center justify-center text-center p-8 space-y-6">
        <div className="h-16 w-16 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-2xl flex items-center justify-center shadow-lg">
          <RefreshCw className="h-8 w-8 animate-spin" />
        </div>
        <div className="space-y-2 max-w-md">
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white font-display">500</h1>
          <h3 className="text-sm font-bold uppercase tracking-wider font-mono text-rose-500">Consolidated Engine Panic</h3>
          <p className="text-xs text-slate-500 dark:text-zinc-400 leading-relaxed font-sans font-light">
            An unexpected error occurred during database alignment checks. Standard safety heuristics prevented system-wide file crashes.
          </p>
        </div>
        <Button variant="outline" size="md" onClick={simulateReconnect} isLoading={isRefreshing} className="rounded-full px-6">
          {isRefreshing ? 'Re-aligning Database...' : 'Attempt Engine Soft Reset'}
        </Button>
      </div>
    );
  }

  if (mode === 'offline') {
    return (
      <div className="min-h-[450px] flex flex-col items-center justify-center text-center p-8 space-y-6">
        <div className="h-16 w-16 bg-amber-500/10 border border-amber-500/20 text-amber-400 rounded-2xl flex items-center justify-center shadow-lg">
          <WifiOff className="h-8 w-8" />
        </div>
        <div className="space-y-2 max-w-md">
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white font-display">Offline</h1>
          <h3 className="text-sm font-bold uppercase tracking-wider font-mono text-amber-500">No Network Ingress</h3>
          <p className="text-xs text-slate-500 dark:text-zinc-400 leading-relaxed font-sans font-light">
            We are unable to reach the nearest TaskNova AI gateway. Caching state locally. Your offline contributions will sync once connection returns.
          </p>
        </div>
        <Button variant="primary" size="md" onClick={simulateReconnect} isLoading={isRefreshing} className="rounded-full px-6">
          {isRefreshing ? 'Testing Socket Conns...' : 'Check Connection Status'}
        </Button>
      </div>
    );
  }

  // default: maintenance
  return (
    <div className="min-h-[450px] flex flex-col items-center justify-center text-center p-8 space-y-6">
      <div className="h-16 w-16 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 rounded-2xl flex items-center justify-center shadow-lg">
        <Lock className="h-8 w-8 animate-pulse" />
      </div>
      <div className="space-y-2 max-w-md">
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white font-display">Maintenance</h1>
        <h3 className="text-sm font-bold uppercase tracking-wider font-mono text-indigo-400">Schema Update in Progress</h3>
        <p className="text-xs text-slate-500 dark:text-zinc-400 leading-relaxed font-sans font-light">
          We are upgrading the TaskNova global SQL schemas to v0.2. Service will resume once data migrations complete and safety validators check the integrity.
        </p>
      </div>
      <div className="max-w-xs w-full bg-slate-100 dark:bg-white/5 p-4 rounded-xl border border-slate-200/50 dark:border-white/5 space-y-1 text-left font-mono text-[10px]">
        <div className="flex justify-between text-slate-400">
          <span>Est. Time Remaining:</span>
          <span className="text-slate-700 dark:text-zinc-200 font-bold">18m 42s</span>
        </div>
        <div className="flex justify-between text-slate-400">
          <span>Target Version:</span>
          <span className="text-indigo-400 font-bold">TaskNova v0.2 Ledger</span>
        </div>
      </div>
    </div>
  );
}
