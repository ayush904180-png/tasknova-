/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Cpu, Award, Zap, Shield, Database, Workflow } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardBody } from '../ui/Card';
import { Badge } from '../ui/Badge';

export function FeaturesGrid() {
  return (
    <div className="py-12 border-t border-slate-200 dark:border-white/5" id="bento-features-grid">
      <div className="text-center mb-12">
        <Badge variant="primary" className="mb-2 dark:bg-indigo-500/10 dark:text-indigo-400 dark:border-indigo-500/20">How It Works</Badge>
        <h2 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
          A Platform Engineered for Supreme Quality
        </h2>
        <p className="text-sm text-slate-500 dark:text-zinc-400 max-w-xl mx-auto mt-2 font-sans font-light">
          We combine advanced machine intelligence pipelines with lightning-fast human verification interfaces.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Bento Card 1: RLHF Alignment */}
        <Card className="col-span-1" hoverable>
          <CardHeader>
            <div className="h-10 w-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-3">
              <Cpu className="h-5 w-5" />
            </div>
            <CardTitle>RLHF Fine-Tuning</CardTitle>
            <CardDescription>Human alignment for Large Language Models.</CardDescription>
          </CardHeader>
          <CardBody className="pt-0">
            <p className="text-xs text-slate-500 leading-relaxed">
              Large models fail when trained on static datasets alone. TaskNova channels real-time preference comparison tasks (e.g. choosing the best of two system prompts) to human contributors, outputting optimal reinforcement weights.
            </p>
          </CardBody>
        </Card>

        {/* Bento Card 2: India-First Economy */}
        <Card className="col-span-1 md:col-span-2" hoverable>
          <CardHeader>
            <div className="flex justify-between items-start">
              <div className="h-10 w-10 rounded-xl bg-brand-50 dark:bg-emerald-950/40 text-brand-600 dark:text-emerald-400 flex items-center justify-center mb-3">
                <Award className="h-5 w-5" />
              </div>
              <div className="flex gap-1.5">
                <Badge variant="success">INR Native</Badge>
                <Badge variant="neutral">UPI Enabled</Badge>
              </div>
            </div>
            <CardTitle>India-First Micro-Earning</CardTitle>
            <CardDescription>Optimized coin rewards conversion tailored for India and future global scaling.</CardDescription>
          </CardHeader>
          <CardBody className="pt-0 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-slate-500 leading-relaxed">
                India is the world's largest talent capital for micro-actions. By offering frictionless mobile web UX, UPI integrations, and transparent conversions (<strong>1 Coin = ₹0.10</strong>), we unlock millions of eager high-quality evaluators.
              </p>
            </div>
            <div className="bg-slate-50 dark:bg-white/5 p-4 rounded-xl border border-slate-200/60 dark:border-white/5 flex flex-col justify-center">
              <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 dark:text-zinc-500">Yield Multipliers</span>
              <div className="mt-2 space-y-1.5 font-mono text-xs text-slate-600 dark:text-zinc-400">
                <div className="flex justify-between">
                  <span>India (Primary)</span>
                  <span className="font-semibold text-slate-900 dark:text-zinc-200">₹0.10 / coin</span>
                </div>
                <div className="flex justify-between border-t border-slate-200/50 dark:border-white/5 pt-1">
                  <span>USA / Canada</span>
                  <span className="font-semibold text-slate-900 dark:text-zinc-200">$0.0012 / coin</span>
                </div>
                <div className="flex justify-between border-t border-slate-200/50 dark:border-white/5 pt-1">
                  <span>UK / Europe</span>
                  <span className="font-semibold text-slate-900 dark:text-zinc-200">£0.00095 / coin</span>
                </div>
              </div>
            </div>
          </CardBody>
        </Card>

        {/* Bento Card 3: Enterprise Integrity */}
        <Card className="col-span-1 md:col-span-2" hoverable>
          <CardHeader>
            <div className="flex justify-between items-start">
              <div className="h-10 w-10 rounded-xl bg-slate-100 dark:bg-slate-850 text-slate-700 dark:text-slate-300 flex items-center justify-center mb-3">
                <Shield className="h-5 w-5" />
              </div>
              <Badge variant="primary">Anti-Fraud</Badge>
            </div>
            <CardTitle>Elite Quality Control & Security</CardTitle>
            <CardDescription>Ensuring spam-free, ultra-consistent human annotations.</CardDescription>
          </CardHeader>
          <CardBody className="pt-0">
            <p className="text-xs text-slate-500 leading-relaxed">
              We defeat automated bots and low-quality workers using multi-evaluator consensus models and active trap-tasks. Every submission payload is statistically checked against a gold-standard cohort to prevent consensus manipulation.
            </p>
          </CardBody>
        </Card>

        {/* Bento Card 4: Modern Technical Stack */}
        <Card className="col-span-1" hoverable>
          <CardHeader>
            <div className="h-10 w-10 rounded-xl bg-orange-50 dark:bg-orange-950/40 text-orange-600 dark:text-orange-400 flex items-center justify-center mb-3">
              <Database className="h-5 w-5" />
            </div>
            <CardTitle>Architecture Stack</CardTitle>
            <CardDescription>Clean modular foundations.</CardDescription>
          </CardHeader>
          <CardBody className="pt-0">
            <p className="text-xs text-slate-500 leading-relaxed font-sans">
              Configured using <strong>TypeScript</strong>, <strong>React 19</strong>, <strong>Tailwind CSS</strong>, and a robust lazy Firebase adapter. Designed entirely around SOLID principles to support future production scale.
            </p>
          </CardBody>
        </Card>

      </div>
    </div>
  );
}
