/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowRight, Sparkles, Cpu, Award, Zap, Shield, Database, Layout, 
  ChevronDown, MessageSquare, Mic, Image as ImageIcon, Search, CheckCircle2, 
  Globe, Languages, Eye, Heart, BarChart3, Users, Star, ArrowUpRight, Lock, Command
} from 'lucide-react';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { Card, CardHeader, CardTitle, CardDescription, CardBody, CardFooter } from '../ui/Card';
import { AppRoute } from '../../types';

interface LandingPageProps {
  setActiveRoute: (route: AppRoute) => void;
}

export function LandingPage({ setActiveRoute }: LandingPageProps) {
  // Stats state for animated counter
  const [tasksCount, setTasksCount] = useState(14840120);
  const [activeContributors, setActiveContributors] = useState(124500);
  const [averageTime, setAverageTime] = useState(12.4);

  // FAQ state
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  // Increment stats on interval to simulate real-time operations
  useEffect(() => {
    const statsInterval = setInterval(() => {
      setTasksCount(prev => prev + Math.floor(Math.random() * 3) + 1);
      if (Math.random() > 0.8) {
        setActiveContributors(prev => prev + 1);
      }
      if (Math.random() > 0.9) {
        setAverageTime(prev => parseFloat((12.0 + Math.random() * 0.8).toFixed(1)));
      }
    }, 4000);

    return () => clearInterval(statsInterval);
  }, []);

  const toggleFaq = (index: number) => {
    setExpandedFaq(expandedFaq === index ? null : index);
  };

  // FAQ items - minimum 10
  const faqItems = [
    {
      q: "What is TaskNova AI?",
      a: "TaskNova AI is a premium, high-fidelity human intelligence layer built to train and align Large Language Models (LLMs). We connect global AI research teams who need high-quality human evaluation, RLHF (Reinforcement Learning from Human Feedback), and preference comparisons with a curated network of contributors who complete these smart, ad-free micro tasks."
    },
    {
      q: "How do coin rewards work and what is their conversion?",
      a: "Every micro task you complete successfully rewards you with TaskNova Coins based on its complexity and SLA requirements. The conversion index is transparently set: 1 Coin = ₹0.10. Coins accumulate securely in your local browser ledger and can be redeemed directly to local payout systems like UPI, NetBanking, or digital gift nodes."
    },
    {
      q: "Is my personal data secure and anonymized?",
      a: "Absolutely. Security and privacy are our top-level priorities. We employ military-grade encryption for all communication and enforce a strict zero-telemetry disclosure policy. Your evaluations are submitted as anonymous mathematical cohorts, ensuring no individual identification or tracking ever occurs."
    },
    {
      q: "How long does a typical task take?",
      a: "Most tasks are optimized for high-speed, frictionless interactions taking anywhere from 8 to 20 seconds. We have structured our interface to completely eliminate slow loading, captchas, redirects, and popups, enabling you to build momentum and complete tasks efficiently."
    },
    {
      q: "Who creates the tasks on TaskNova AI?",
      a: "Tasks are submitted by top-tier AI laboratories, enterprise companies, independent creators, and academic researchers. These organizations require diverse, reliable human feedback to check alignment, remove bias, evaluate translation, and rate LLM responses."
    },
    {
      q: "Are there any upfront fees or subscription costs to join?",
      a: "No. TaskNova AI is completely free to access and use. There are no registration fees, monthly subscription costs, or locked features. Anyone with a modern mobile, tablet, or desktop web browser can launch the Interactive Sandbox instantly."
    },
    {
      q: "How are payouts processed?",
      a: "Once you accumulate the minimum milestone balance in your ledger, you can initiate a digital transfer. We support secure UPI transactions for instant settlements in India, along with standard international payout pathways for a seamless transfer experience."
    },
    {
      q: "What is the Accuracy SLA scoring system?",
      a: "The Accuracy Service Level Agreement (SLA) is a quality metric calculated for every contributor. By reviewing gold-standard trap tasks and matching consensus scores with other verified human nodes, we maintain an accuracy database. High SLA contributors receive multiplier bonuses and access to premium high-yield tasks."
    },
    {
      q: "Can I complete evaluations on my mobile device?",
      a: "Yes. The entire platform has been designed from the ground up following mobile-first responsive design rules. The task cards, sliders, comparison panels, and submission keys are touch-optimized and load instantly even on low-bandwidth networks."
    },
    {
      q: "How does TaskNova AI prevent automated bots and artificial spam?",
      a: "We deploy active, state-of-the-art consensus defense. Every task uses real-time behavioral fingerprinting, hidden trap-evaluations, and statistical deviation filters. Automated bots are instantly flagged and discarded, preserving the enterprise value of our human feedback datasets."
    }
  ];

  // Why TaskNova - 6 Premium Feature Cards
  const featureCards = [
    {
      icon: Cpu,
      title: "Human Intelligence",
      desc: "Our evaluations capture the subtle nuances, context, and creative depths of human intuition that automated programmatic benchmarks miss.",
      badge: "RLHF Target"
    },
    {
      icon: Shield,
      title: "No Spam or Ads",
      desc: "Experience a pristine, distraction-free workspace. Zero redirects, zero popups, and no annoying low-quality capture pages.",
      badge: "Pure UX"
    },
    {
      icon: Zap,
      title: "Frictionless Speed",
      desc: "Tasks are micro-sized and engineered to complete in under 15 seconds, complete with hotkeys, fluid layouts, and tactile feedback.",
      badge: "Ultra-Fast"
    },
    {
      icon: Award,
      title: "Verified Ledger",
      desc: "Watch coin rewards log instantly to your local client ledger. Safe, clear, and cryptographically signed to prevent discrepancies.",
      badge: "UPI Ready"
    },
    {
      icon: Database,
      title: "AI Validation",
      desc: "Intelligent background models dynamically calibrate difficulty and evaluate multi-user consensus vectors on-the-fly.",
      badge: "Smart Core"
    },
    {
      icon: Lock,
      title: "Privacy Shield",
      desc: "Complete anonymization protocols protect your personal details. We do not track, share, or sell your telemetry footprint.",
      badge: "Anonymized"
    }
  ];

  // Task Categories for Bento Grid
  const bentoCategories = [
    {
      title: "AI Response Comparison",
      desc: "Review outputs from twin models side-by-side. Score helpfulness, style, and pinpoint potential hallucination patterns.",
      tag: "Preferred",
      span: "md:col-span-2",
      icon: Sparkles,
      color: "from-indigo-500/10 to-purple-500/10",
      border: "border-indigo-500/20",
      preview: (
        <div className="flex gap-2 w-full mt-2 select-none">
          <div className="flex-1 bg-slate-50 dark:bg-[#060608] border border-slate-150 dark:border-white/5 p-3 rounded-xl text-left">
            <span className="text-[8px] font-mono uppercase text-indigo-400 font-bold block mb-1">Model Delta-A</span>
            <p className="text-[10px] text-slate-500 dark:text-zinc-400 line-clamp-2">The optimal approach to sorting is Mergesort due to its absolute O(N log N) guarantee...</p>
          </div>
          <div className="flex-1 bg-indigo-50/20 dark:bg-indigo-950/20 border border-indigo-500/30 p-3 rounded-xl text-left relative">
            <span className="text-[8px] font-mono uppercase text-indigo-400 font-bold flex justify-between items-center mb-1">
              Model Delta-B
              <Badge variant="success" className="text-[6px] scale-90 px-1 py-0">Best Choice</Badge>
            </span>
            <p className="text-[10px] text-slate-900 dark:text-zinc-100 line-clamp-2 font-medium">Mergesort is highly stable, guarantees O(n log n) efficiency, and remains parallelizable...</p>
          </div>
        </div>
      )
    },
    {
      title: "Image Safety Review",
      desc: "Assess visual accuracy, label features, and verify bounding boxes for image comprehension models.",
      tag: "Visual",
      span: "md:col-span-1",
      icon: ImageIcon,
      color: "from-pink-500/5 to-purple-500/5",
      border: "border-pink-500/10",
      preview: (
        <div className="flex justify-center items-center h-20 w-full mt-2 bg-slate-50 dark:bg-[#060608] rounded-xl border border-dashed border-slate-200 dark:border-white/10 relative overflow-hidden">
          <div className="absolute inset-0 bg-radial-gradient from-transparent to-black/10 pointer-events-none" />
          <ImageIcon className="h-6 w-6 text-pink-500/60 animate-pulse" />
          <div className="absolute bottom-1.5 left-2 right-2 flex justify-between text-[8px] font-mono text-zinc-400">
            <span>Accuracy Check</span>
            <span className="text-emerald-400 font-bold">Passed</span>
          </div>
        </div>
      )
    },
    {
      title: "Voice Annotation",
      desc: "Transcribe short audio prompts, flag robotic distortions, and match synthetic voice styles.",
      tag: "Audio",
      span: "md:col-span-1",
      icon: Mic,
      color: "from-amber-500/5 to-orange-500/5",
      border: "border-amber-500/10",
      preview: (
        <div className="flex items-center gap-1.5 h-16 w-full mt-4 justify-center bg-slate-50 dark:bg-[#060608] rounded-xl border border-slate-150 dark:border-white/5 px-4">
          <div className="h-3 w-1 bg-amber-500 rounded-full animate-pulse" style={{ animationDelay: '0.1s' }} />
          <div className="h-6 w-1 bg-amber-500 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }} />
          <div className="h-4 w-1 bg-amber-500 rounded-full animate-pulse" style={{ animationDelay: '0.3s' }} />
          <div className="h-8 w-1 bg-amber-500 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }} />
          <div className="h-5 w-1 bg-amber-500 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }} />
          <div className="h-2 w-1 bg-amber-500 rounded-full animate-pulse" style={{ animationDelay: '0.6s' }} />
        </div>
      )
    },
    {
      title: "Interactive UI Testing",
      desc: "Tap through fresh frontend builds, verify responsive layout ratios, and report visual breaks.",
      tag: "Engineering",
      span: "md:col-span-2",
      icon: Layout,
      color: "from-emerald-500/5 to-teal-500/5",
      border: "border-emerald-500/10",
      preview: (
        <div className="w-full mt-2 bg-slate-50 dark:bg-[#060608] rounded-xl border border-slate-150 dark:border-white/5 p-3 flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-red-400" />
              <div className="w-2 h-2 rounded-full bg-yellow-400" />
              <div className="w-2 h-2 rounded-full bg-green-400" />
            </div>
            <span className="text-[7px] font-mono text-zinc-500">MOBILE PORTRAIT PREVIEW</span>
          </div>
          <div className="h-10 border border-emerald-500/30 rounded bg-emerald-500/5 flex items-center justify-center text-[9px] font-mono text-emerald-400 font-bold">
            All Breakpoints Verified • 100% Correct
          </div>
        </div>
      )
    },
    {
      title: "Multilingual Translation Check",
      desc: "Compare translations with regional dialects, checking context, formality, and emotional resonance.",
      tag: "Language",
      span: "md:col-span-1",
      icon: Languages,
      color: "from-blue-500/5 to-indigo-500/5",
      border: "border-blue-500/10",
      preview: (
        <div className="mt-2 bg-slate-50 dark:bg-[#060608] rounded-xl border border-slate-150 dark:border-white/5 p-3 text-left">
          <span className="text-[8px] font-mono text-slate-400 block">Source: English</span>
          <p className="text-[10px] text-slate-600 dark:text-zinc-400 mt-0.5">Let's coordinate on Monday.</p>
          <span className="text-[8px] font-mono text-indigo-400 block mt-2">Target: Hindi (Veracular Context)</span>
          <p className="text-[10px] text-slate-900 dark:text-zinc-100 font-medium">सोमवार को बैठक तय करते हैं।</p>
        </div>
      )
    },
    {
      title: "Semantic Sentiment Indexing",
      desc: "Analyze customer conversations, forum logs, and support records to grade underlying emotional signals.",
      tag: "Analytics",
      span: "md:col-span-1",
      icon: BarChart3,
      color: "from-purple-500/5 to-violet-500/5",
      border: "border-purple-500/10",
      preview: (
        <div className="mt-2 flex justify-around items-end h-16 w-full bg-slate-50 dark:bg-[#060608] rounded-xl border border-slate-150 dark:border-white/5 p-3 font-mono">
          <div className="text-center">
            <span className="text-[8px] text-red-400 block">Negative</span>
            <div className="w-8 h-2.5 bg-red-400/20 rounded-t mt-1" />
          </div>
          <div className="text-center">
            <span className="text-[8px] text-zinc-400 block">Neutral</span>
            <div className="w-8 h-4 bg-zinc-400/20 rounded-t mt-1" />
          </div>
          <div className="text-center">
            <span className="text-[8px] text-emerald-400 block font-bold">Positive</span>
            <div className="w-8 h-8 bg-emerald-400/40 rounded-t mt-1 animate-pulse" />
          </div>
        </div>
      )
    },
    {
      title: "Content Quality Rating",
      desc: "Assess factual clarity, structure, citations, and identify toxic suggestions or spam text blocks.",
      tag: "Content",
      span: "md:col-span-1",
      icon: Eye,
      color: "from-red-500/5 to-orange-500/5",
      border: "border-red-500/10",
      preview: (
        <div className="mt-2 bg-slate-50 dark:bg-[#060608] rounded-xl border border-slate-150 dark:border-white/5 p-3 text-left">
          <div className="flex justify-between items-center">
            <span className="text-[8px] font-mono text-slate-400">Toxicity Check</span>
            <Badge variant="success" className="text-[7px] px-1 py-0 scale-95">Safe (0.01)</Badge>
          </div>
          <p className="text-[10px] text-slate-500 dark:text-zinc-400 mt-1.5 line-clamp-2 leading-tight">This documentation contains clear guidelines, referencing official API models...</p>
        </div>
      )
    },
    {
      title: "Search Relevance Rating",
      desc: "Review queries against landing page content to measure how accurately search results fit actual user intent.",
      tag: "Discovery",
      span: "md:col-span-2",
      icon: Search,
      color: "from-cyan-500/5 to-blue-500/5",
      border: "border-cyan-500/10",
      preview: (
        <div className="mt-2 bg-slate-50 dark:bg-[#060608] rounded-xl border border-slate-150 dark:border-white/5 p-3 flex flex-col gap-2">
          <div className="flex gap-2 items-center bg-white dark:bg-[#0c0c0e] border border-slate-200 dark:border-white/5 px-2 py-1 rounded-lg">
            <Search className="h-3 w-3 text-slate-400" />
            <span className="text-[9px] font-mono text-slate-900 dark:text-white">best task-scheduler package nodejs</span>
          </div>
          <div className="flex gap-1.5 text-[8px] font-mono">
            <span className="px-1.5 py-0.5 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 font-bold">Highly Relevant (98%)</span>
            <span className="px-1.5 py-0.5 rounded bg-slate-150 text-slate-500 dark:bg-white/5">Exact Match</span>
          </div>
        </div>
      )
    },
    {
      title: "Next-Gen Category Node",
      desc: "We are actively engineering fresh evaluations for Video Generation, Code Logic, and Agent Autonomy loops.",
      tag: "Upcoming",
      span: "md:col-span-3",
      icon: Command,
      color: "from-indigo-600/10 via-purple-600/10 to-pink-600/10",
      border: "border-indigo-500/30",
      preview: (
        <div className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-3 bg-white/40 dark:bg-[#09090b]/40 border border-slate-150 dark:border-white/5 p-3 rounded-xl">
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 rounded bg-indigo-500/20 flex items-center justify-center">
              <Command className="h-3.5 w-3.5 text-indigo-400 animate-spin" style={{ animationDuration: '6s' }} />
            </div>
            <div className="text-left">
              <span className="text-[10px] font-bold text-slate-900 dark:text-white font-display">Multimodal Agent Evaluators</span>
              <span className="text-[8px] text-zinc-500 block">Currently running developer Alpha-03 node tests</span>
            </div>
          </div>
          <div className="flex gap-2">
            <Badge variant="primary" className="text-[8px] px-2 py-0.5 animate-pulse">Alpha Active</Badge>
          </div>
        </div>
      )
    }
  ];

  // Testimonials with fictional placeholder users (No real companies)
  const testimonials = [
    {
      quote: "TaskNova's human evaluation data has fundamentally altered our fine-tuning model outputs. We achieved 99% accuracy SLA on translation alignment within three model iterations.",
      author: "Dr. Elena Rostova",
      role: "Lead Alignment Scientist",
      avatar: "ER",
      dept: "Quantum Cognitive Systems"
    },
    {
      quote: "As an independent prompt modeler, I love the speed of TaskNova's micro-tasks. The interface is lightning-fast, and watch credits register instantly in INR. Zero clutter, pure performance.",
      author: "Siddharth Mehta",
      role: "Verified Core Validator",
      avatar: "SM",
      dept: "Bengaluru Dev Collective"
    },
    {
      quote: "We spent months fighting automated bot spam on typical data-tagging systems. TaskNova's consensus check model guarantees only high-quality human nodes score tasks.",
      author: "Marcus Vance",
      role: "VP of Dataset Integrity",
      avatar: "MV",
      dept: "Helix Synthesis Labs"
    }
  ];

  // Enterprise Partners placeholders (Stylized SVGs text light up on hover)
  const partners = [
    { name: "Symphony AI", icon: Cpu },
    { name: "Hyperion Labs", icon: Database },
    { name: "Linear Logic", icon: Command },
    { name: "Apex Synthetics", icon: Sparkles },
    { name: "Atlas Dataset", icon: Globe },
    { name: "Vertex Align", icon: BarChart3 }
  ];

  return (
    <div className="w-full space-y-24 pb-12" id="premium-landing-page">
      
      {/* SECTION 1: Premium Hero */}
      <section className="relative py-16 md:py-28 flex flex-col items-center text-center max-w-5xl mx-auto overflow-hidden rounded-3xl" id="landing-hero-section">
        
        {/* Apple/Linear-inspired glowing background */}
        <div className="absolute inset-0 bg-radial-gradient from-indigo-500/10 via-purple-500/5 to-transparent blur-3xl opacity-80 pointer-events-none -z-10" />
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-indigo-500/5 rounded-full blur-[120px] pointer-events-none -z-10" />
        
        {/* Animated sparkling float element */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-600 dark:text-zinc-400 mb-8 cursor-default"
        >
          <Sparkles className="h-3.5 w-3.5 text-indigo-500 dark:text-indigo-400" />
          <span className="text-[10px] font-mono uppercase tracking-widest font-semibold">Verified Human Intelligence Platform</span>
        </motion.div>

        {/* Large premium headline */}
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.15 }}
          className="font-display text-4xl sm:text-5xl md:text-7xl font-bold tracking-tight text-slate-900 dark:text-white leading-[1.08] mb-6 max-w-4xl"
        >
          Train AI. <br className="sm:hidden" />
          Complete Smart Tasks. <br />
          <span className="bg-gradient-to-r from-indigo-500 via-purple-400 to-indigo-400 bg-clip-text text-transparent">
            Earn Verified Rewards.
          </span>
        </motion.h1>

        {/* Professional supporting paragraph */}
        <motion.p 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="text-base sm:text-lg md:text-xl text-slate-500 dark:text-zinc-400 max-w-2xl leading-relaxed mb-10 font-sans font-light"
        >
          Help global AI networks become safer, smarter, and bias-free. Complete beautiful, 10-second alignment evaluations and receive direct coin payouts, securely tracked in your local client ledger.
        </motion.p>

        {/* Two CTA buttons */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.45 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center w-full max-w-md px-4"
        >
          <Button
            variant="primary"
            size="lg"
            onClick={() => setActiveRoute(AppRoute.SANDBOX)}
            rightIcon={<ArrowRight className="h-4 w-4" />}
            className="w-full sm:w-auto font-semibold text-sm h-12 px-6 dark:bg-indigo-600 dark:text-white dark:hover:bg-indigo-500 dark:shadow-2xl dark:shadow-indigo-500/20 shadow-lg cursor-pointer"
            id="hero-primary-cta"
          >
            Launch Task Sandbox
          </Button>
          <Button
            variant="outline"
            size="lg"
            onClick={() => setActiveRoute(AppRoute.BLUEPRINT)}
            className="w-full sm:w-auto font-medium text-sm h-12 px-6 dark:bg-white/5 dark:border-white/10 dark:text-zinc-300 dark:hover:bg-white/10 cursor-pointer"
            id="hero-secondary-cta"
          >
            View Specifications
          </Button>
        </motion.div>

        {/* Trust & compliance badge note */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.6 }}
          className="mt-8 flex flex-wrap items-center justify-center gap-6 text-[10px] font-mono text-slate-400 dark:text-zinc-500"
        >
          <span className="flex items-center gap-1.5"><CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" /> Free Alpha Sandbox</span>
          <span className="flex items-center gap-1.5"><CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" /> No Credit Card Required</span>
          <span className="flex items-center gap-1.5"><CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" /> Instant Ledger Logging</span>
        </motion.div>

      </section>

      {/* SECTION 2: How It Works */}
      <section className="py-12 border-t border-slate-200 dark:border-white/5 scroll-mt-20" id="landing-how-it-works">
        <div className="text-center mb-16">
          <Badge variant="primary" className="mb-2 dark:bg-indigo-500/10 dark:text-indigo-400 dark:border-indigo-500/20 uppercase tracking-widest font-mono text-[9px]">Workflow</Badge>
          <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 dark:text-white">
            Three Steps to verified alignment
          </h2>
          <p className="text-sm text-slate-500 dark:text-zinc-400 max-w-xl mx-auto mt-2 font-sans font-light">
            Our optimized human validation pipeline is designed for ultimate clarity, speed, and trust.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          
          {/* Timeline connecting line (Only on desktop) */}
          <div className="hidden md:block absolute top-[90px] left-[15%] right-[15%] h-[1px] bg-gradient-to-r from-indigo-500/30 via-purple-500/20 to-indigo-500/30 -z-10" />

          {/* Step 1 */}
          <div className="flex flex-col items-center text-center p-6 bg-white dark:bg-[#09090b] border border-slate-150 dark:border-white/5 rounded-2xl relative shadow-xs">
            <div className="h-14 w-14 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-500/20 flex items-center justify-center font-display font-bold text-lg text-indigo-600 dark:text-indigo-400 mb-6">
              01
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white font-display mb-2">Create Account</h3>
            <p className="text-xs text-slate-500 dark:text-zinc-400 leading-relaxed font-sans font-light mb-6">
              Establish your verified human node instantly with your email. No payment card or hidden sign-ups ever.
            </p>
            {/* Visual placeholder */}
            <div className="w-full bg-slate-50 dark:bg-[#030303] p-4 rounded-xl border border-slate-150 dark:border-white/5">
              <div className="flex items-center gap-2.5 text-left">
                <div className="h-7 w-7 rounded-full bg-indigo-500/20 flex items-center justify-center font-bold text-xs text-indigo-400 font-mono">U</div>
                <div className="flex-1 min-w-0">
                  <span className="text-[10px] font-bold text-slate-900 dark:text-white block font-display leading-tight">user@node.io</span>
                  <span className="text-[8px] text-emerald-400 font-mono flex items-center gap-1 mt-0.5">
                    <span className="h-1 w-1 rounded-full bg-emerald-400 animate-pulse" /> Active Node Verified
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Step 2 */}
          <div className="flex flex-col items-center text-center p-6 bg-white dark:bg-[#09090b] border border-slate-150 dark:border-white/5 rounded-2xl relative shadow-xs">
            <div className="h-14 w-14 rounded-2xl bg-purple-50 dark:bg-purple-950/40 border border-purple-100 dark:border-purple-500/20 flex items-center justify-center font-display font-bold text-lg text-purple-600 dark:text-purple-400 mb-6">
              02
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white font-display mb-2">Complete AI Tasks</h3>
            <p className="text-xs text-slate-500 dark:text-zinc-400 leading-relaxed font-sans font-light mb-6">
              Complete smart comparisons, evaluate synthetic content, or verify responsive layouts in under 15 seconds.
            </p>
            {/* Visual placeholder */}
            <div className="w-full bg-slate-50 dark:bg-[#030303] p-3 rounded-xl border border-slate-150 dark:border-white/5 text-left space-y-2">
              <span className="text-[8px] font-mono text-purple-400 font-bold uppercase tracking-wider block">Task Payload 8031</span>
              <div className="flex items-center justify-between gap-1.5">
                <button className="flex-1 text-[8px] font-mono py-1 px-2 border border-slate-200 dark:border-white/10 rounded bg-white dark:bg-[#0c0c0e] text-center hover:border-indigo-500 transition-colors">
                  Option A
                </button>
                <button className="flex-1 text-[8px] font-mono py-1 px-2 border border-indigo-500/50 rounded bg-indigo-500/5 text-center text-indigo-400 font-bold">
                  Option B ✓
                </button>
              </div>
            </div>
          </div>

          {/* Step 3 */}
          <div className="flex flex-col items-center text-center p-6 bg-white dark:bg-[#09090b] border border-slate-150 dark:border-white/5 rounded-2xl relative shadow-xs">
            <div className="h-14 w-14 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-100 dark:border-emerald-500/20 flex items-center justify-center font-display font-bold text-lg text-emerald-600 dark:text-emerald-400 mb-6">
              03
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white font-display mb-2">Receive Verified Rewards</h3>
            <p className="text-xs text-slate-500 dark:text-zinc-400 leading-relaxed font-sans font-light mb-6">
              Rewards are processed to your digital ledger instantly, ready to exchange directly for real UPI and bank transfers.
            </p>
            {/* Visual placeholder */}
            <div className="w-full bg-slate-50 dark:bg-[#030303] p-3 rounded-xl border border-slate-150 dark:border-white/5 text-left">
              <div className="flex justify-between items-center">
                <span className="text-[8px] font-mono text-zinc-500">LEDGER TX LOG</span>
                <span className="text-[8px] font-mono text-emerald-400 font-bold">+150 Coins</span>
              </div>
              <div className="mt-1.5 flex justify-between items-center border-t border-slate-200/50 dark:border-white/5 pt-1.5">
                <span className="text-[8px] font-mono text-zinc-400">UPI Destination</span>
                <span className="text-[8px] font-mono text-slate-900 dark:text-white">success_node</span>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* SECTION 3: Why TaskNova */}
      <section className="py-12 border-t border-slate-200 dark:border-white/5" id="landing-why-tasknova">
        <div className="text-center mb-16">
          <Badge variant="primary" className="mb-2 dark:bg-indigo-500/10 dark:text-indigo-400 dark:border-indigo-500/20 uppercase tracking-widest font-mono text-[9px]">Platform Core</Badge>
          <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 dark:text-white">
            Designed for human precision
          </h2>
          <p className="text-sm text-slate-500 dark:text-zinc-400 max-w-xl mx-auto mt-2 font-sans font-light">
            We reject the cluttered layouts and spammy environments of legacy websites to deliver a high-performance workspace.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featureCards.map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <div key={idx} className="flex flex-col">
                <Card className="flex flex-col justify-between h-full border-slate-200 dark:border-white/5 hover:border-slate-300 dark:hover:border-indigo-500/20 hover:shadow-lg dark:hover:shadow-indigo-500/5 transition-all group duration-200 text-left" hoverable>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start mb-3">
                      <div className="h-10 w-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center group-hover:scale-105 transition-all">
                        <Icon className="h-5 w-5" />
                      </div>
                      <Badge variant="neutral" className="text-[8px] px-1.5 py-0.5">{feat.badge}</Badge>
                    </div>
                    <CardTitle className="text-base font-display font-bold text-slate-900 dark:text-white">{feat.title}</CardTitle>
                  </CardHeader>
                  <CardBody className="pt-0 pb-5">
                    <p className="text-xs text-slate-500 dark:text-zinc-400 leading-relaxed font-sans font-light">
                      {feat.desc}
                    </p>
                  </CardBody>
                </Card>
              </div>
            );
          })}
        </div>
      </section>

      {/* SECTION 4: Live Statistics */}
      <section className="py-12 border-t border-slate-200 dark:border-white/5 relative" id="landing-live-statistics">
        
        {/* Decorative ambient gradient */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[200px] bg-purple-500/5 dark:bg-indigo-500/5 rounded-full blur-[100px] pointer-events-none" />

        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 mb-3 font-mono text-[9px] uppercase tracking-wider">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Live System Telemetry
          </div>
          <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 dark:text-white">
            Our network in numbers
          </h2>
          <p className="text-sm text-slate-500 dark:text-zinc-400 max-w-xl mx-auto mt-2 font-sans font-light">
            Real-time, authentic system statistics updated continuously across our global consensus node matrix.
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 relative z-10 max-w-6xl mx-auto">
          
          {/* Card 1 */}
          <div className="bg-white dark:bg-[#09090b]/80 border border-slate-150 dark:border-white/5 rounded-2xl p-6 text-center shadow-xs">
            <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 dark:text-zinc-500 block mb-2">Tasks Completed</span>
            <span className="font-display text-2xl sm:text-4xl font-bold tracking-tight text-indigo-500 dark:text-indigo-400 block tabular-nums">
              {tasksCount.toLocaleString()}
            </span>
            <span className="text-[9px] text-slate-400 dark:text-zinc-600 block mt-1 font-mono">Consensus Verified</span>
          </div>

          {/* Card 2 */}
          <div className="bg-white dark:bg-[#09090b]/80 border border-slate-150 dark:border-white/5 rounded-2xl p-6 text-center shadow-xs">
            <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 dark:text-zinc-500 block mb-2">Active Contributors</span>
            <span className="font-display text-2xl sm:text-4xl font-bold tracking-tight text-slate-900 dark:text-white block tabular-nums">
              {activeContributors.toLocaleString()}
            </span>
            <span className="text-[9px] text-slate-400 dark:text-zinc-600 block mt-1 font-mono">Nodes Active Now</span>
          </div>

          {/* Card 3 */}
          <div className="bg-white dark:bg-[#09090b]/80 border border-slate-150 dark:border-white/5 rounded-2xl p-6 text-center shadow-xs">
            <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 dark:text-zinc-500 block mb-2">Countries Supported</span>
            <span className="font-display text-2xl sm:text-4xl font-bold tracking-tight text-slate-900 dark:text-white block">
              18+
            </span>
            <span className="text-[9px] text-slate-400 dark:text-zinc-600 block mt-1 font-mono">Global Coverage</span>
          </div>

          {/* Card 4 */}
          <div className="bg-white dark:bg-[#09090b]/80 border border-slate-150 dark:border-white/5 rounded-2xl p-6 text-center shadow-xs">
            <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 dark:text-zinc-500 block mb-2">Average Task Time</span>
            <span className="font-display text-2xl sm:text-4xl font-bold tracking-tight text-indigo-500 dark:text-indigo-400 block tabular-nums">
              {averageTime}s
            </span>
            <span className="text-[9px] text-slate-400 dark:text-zinc-600 block mt-1 font-mono">Speed Calibration</span>
          </div>

        </div>
      </section>

      {/* SECTION 5: Task Categories Bento Grid */}
      <section className="py-12 border-t border-slate-200 dark:border-white/5" id="landing-task-categories">
        <div className="text-center mb-16">
          <Badge variant="primary" className="mb-2 dark:bg-indigo-500/10 dark:text-indigo-400 dark:border-indigo-500/20 uppercase tracking-widest font-mono text-[9px]">SaaS Schema</Badge>
          <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 dark:text-white">
            Sleek task categories portfolio
          </h2>
          <p className="text-sm text-slate-500 dark:text-zinc-400 max-w-xl mx-auto mt-2 font-sans font-light">
            We provide a diverse portfolio of structured evaluations, optimized with modern visual guidelines.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {bentoCategories.map((cat, idx) => {
            const Icon = cat.icon;
            return (
              <div 
                key={idx} 
                className={`${cat.span} relative rounded-2xl border border-slate-200 dark:border-white/5 bg-gradient-to-br ${cat.color} p-6 flex flex-col justify-between text-left overflow-hidden group shadow-xs transition-all hover:border-slate-300 dark:hover:border-white/10`}
              >
                {/* Decorative radial blur for bento cards */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/2 dark:bg-white/5 rounded-full blur-2xl group-hover:scale-110 transition-transform pointer-events-none" />

                <div>
                  <div className="flex justify-between items-start mb-4">
                    <div className={`h-9 w-9 rounded-lg bg-white dark:bg-[#0c0c0e] border border-slate-150 dark:border-white/10 flex items-center justify-center text-slate-700 dark:text-zinc-300`}>
                      <Icon className="h-4.5 w-4.5" />
                    </div>
                    <Badge variant="neutral" className="text-[8px] px-1.5 py-0.5">{cat.tag}</Badge>
                  </div>
                  <h3 className="font-display text-sm font-bold text-slate-900 dark:text-white mb-1.5">{cat.title}</h3>
                  <p className="text-xs text-slate-500 dark:text-zinc-400 font-sans font-light leading-relaxed max-w-md">{cat.desc}</p>
                </div>

                <div className="w-full mt-4">
                  {cat.preview}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* SECTION 6: Enterprise Trust */}
      <section className="py-12 border-t border-slate-200 dark:border-white/5 text-center" id="landing-enterprise-trust">
        <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400 dark:text-zinc-500 font-bold block mb-4">
          Enterprise Integration Matrix
        </span>
        <h3 className="font-display text-xl sm:text-2xl font-semibold text-slate-900 dark:text-white mb-2">
          Built for businesses, creators, and AI teams.
        </h3>
        <p className="text-xs text-slate-500 dark:text-zinc-400 max-w-md mx-auto font-sans font-light mb-10">
          Our validated human dataset architecture supports global innovators and modern language models.
        </p>

        {/* Logo Placeholders (Elegant and minimalist) */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6 max-w-4xl mx-auto select-none">
          {partners.map((partner, idx) => {
            const PartnerIcon = partner.icon;
            return (
              <div 
                key={idx}
                className="flex items-center justify-center gap-2 px-4 py-3 bg-white dark:bg-[#09090b] border border-slate-150 dark:border-white/5 rounded-xl text-slate-400 hover:text-slate-900 dark:text-zinc-500 dark:hover:text-zinc-300 transition-colors cursor-default"
                title={`${partner.name} Network Partner`}
              >
                <PartnerIcon className="h-4 w-4" />
                <span className="text-xs font-display font-medium tracking-tight uppercase">{partner.name.split(' ')[0]}</span>
              </div>
            );
          })}
        </div>
      </section>

      {/* SECTION 7: Testimonials */}
      <section className="py-12 border-t border-slate-200 dark:border-white/5" id="landing-testimonials">
        <div className="text-center mb-16">
          <Badge variant="primary" className="mb-2 dark:bg-indigo-500/10 dark:text-indigo-400 dark:border-indigo-500/20 uppercase tracking-widest font-mono text-[9px]">SLA Feedback</Badge>
          <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 dark:text-white">
            Trust from the integration front
          </h2>
          <p className="text-sm text-slate-500 dark:text-zinc-400 max-w-xl mx-auto mt-2 font-sans font-light">
            Read comments from verified scientists, validators, and dataset designers who coordinate with our node.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((test, idx) => (
            <div key={idx} className="flex flex-col">
              <Card className="flex flex-col justify-between h-full border-slate-200 dark:border-white/5 text-left p-6" hoverable>
                <CardHeader className="p-0 mb-4">
                  <div className="flex gap-1 mb-3">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-3 w-3 fill-indigo-500 text-indigo-500" />
                    ))}
                  </div>
                  <p className="text-xs text-slate-600 dark:text-zinc-300 leading-relaxed font-sans font-light italic">
                    "{test.quote}"
                  </p>
                </CardHeader>
                <CardFooter className="p-0 pt-4 border-t border-slate-100 dark:border-white/5 flex items-center gap-3 bg-transparent">
                  <div className="h-8 w-8 rounded-full bg-slate-100 dark:bg-white/5 flex items-center justify-center font-mono font-bold text-xs text-indigo-400 uppercase">
                    {test.avatar}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white font-display leading-none">{test.author}</h4>
                    <span className="text-[9px] text-slate-400 dark:text-zinc-500 font-mono block mt-1">{test.role} • <span className="text-indigo-400">{test.dept}</span></span>
                  </div>
                </CardFooter>
              </Card>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 8: FAQ Interactive Accordion */}
      <section className="py-12 border-t border-slate-200 dark:border-white/5 scroll-mt-20" id="landing-faq">
        <div className="text-center mb-16">
          <Badge variant="primary" className="mb-2 dark:bg-indigo-500/10 dark:text-indigo-400 dark:border-indigo-500/20 uppercase tracking-widest font-mono text-[9px]">Help Center</Badge>
          <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 dark:text-white">
            Frequently answered queries
          </h2>
          <p className="text-sm text-slate-500 dark:text-zinc-400 max-w-xl mx-auto mt-2 font-sans font-light">
            Find technical details regarding system logic, rewards, coin rates, and security parameters below.
          </p>
        </div>

        <div className="max-w-3xl mx-auto space-y-3">
          {faqItems.map((item, index) => {
            const isExpanded = expandedFaq === index;
            return (
              <div 
                key={index} 
                className="border border-slate-150 dark:border-white/5 rounded-xl bg-white dark:bg-[#09090b] overflow-hidden transition-all duration-200"
              >
                <button
                  onClick={() => toggleFaq(index)}
                  className="w-full flex items-center justify-between p-4.5 text-left font-display font-medium text-xs sm:text-sm text-slate-900 dark:text-white hover:bg-slate-50 dark:hover:bg-white/2 cursor-pointer focus:outline-none"
                  aria-expanded={isExpanded}
                  style={{ minHeight: '48px' }}
                >
                  <span>{item.q}</span>
                  <ChevronDown className={`h-4 w-4 text-slate-400 transition-transform duration-200 ${isExpanded ? 'rotate-180 text-indigo-400' : ''}`} />
                </button>
                
                <AnimatePresence initial={false}>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="p-4.5 pt-0 border-t border-slate-50 dark:border-white/5 text-xs text-slate-500 dark:text-zinc-400 leading-relaxed font-sans font-light text-left bg-slate-50/30 dark:bg-[#030303]/25">
                        {item.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </section>

      {/* SECTION 9: Call To Action */}
      <section className="relative py-16 md:py-24 text-center max-w-5xl mx-auto rounded-3xl overflow-hidden border border-indigo-500/20 shadow-2xl dark:shadow-indigo-500/5 bg-[#07070b]" id="landing-cta-container">
        
        {/* Abstract floating shapes for glass background */}
        <div className="absolute top-[-50%] left-[-20%] w-[400px] h-[400px] bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-[-50%] right-[-20%] w-[400px] h-[400px] bg-purple-500/10 rounded-full blur-[100px] pointer-events-none" />
        
        <div className="relative z-10 px-6 max-w-3xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 font-mono text-[9px] uppercase tracking-wider mx-auto">
            <span className="h-1.5 w-1.5 rounded-full bg-indigo-400 animate-pulse" />
            Consensus Engine Online
          </div>
          <h2 className="font-display text-3xl sm:text-5xl font-bold tracking-tight text-white leading-tight">
            Ready to deploy your human cognitive bandwidth?
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400 max-w-xl mx-auto font-sans font-light leading-relaxed">
            Join thousands of human node intelligence validators helping align the frontier of modern LLM technology. No upfront deposits or setup required.
          </p>
          <div className="pt-4 flex flex-col sm:flex-row gap-4 justify-center items-center max-w-md mx-auto">
            <Button
              variant="primary"
              size="lg"
              onClick={() => setActiveRoute(AppRoute.SANDBOX)}
              rightIcon={<ArrowRight className="h-4 w-4" />}
              className="w-full sm:w-auto font-semibold text-sm h-12 px-8 bg-indigo-600 hover:bg-indigo-500 text-white shadow-xl shadow-indigo-500/20 cursor-pointer"
            >
              Launch Task Sandbox
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={() => setActiveRoute(AppRoute.BLUEPRINT)}
              className="w-full sm:w-auto font-medium text-sm h-12 px-8 border-white/10 text-zinc-300 hover:bg-white/5 cursor-pointer bg-transparent"
            >
              Read Architecture
            </Button>
          </div>
        </div>
      </section>

    </div>
  );
}
