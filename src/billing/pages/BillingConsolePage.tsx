/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  LayoutGrid,
  Shield,
  CreditCard,
  Settings,
  Activity,
  Coins,
  Receipt,
  FileText
} from 'lucide-react';
import { DashboardTab } from '../components/DashboardTab';
import { SubscriptionTab } from '../components/SubscriptionTab';
import { InvoicesTab } from '../components/InvoicesTab';
import { UsageTab } from '../components/UsageTab';
import { BudgetTab } from '../components/BudgetTab';
import { PaymentMethodsTab } from '../components/PaymentMethodsTab';
import { CreditsTab } from '../components/CreditsTab';

type BillingTab = 'dashboard' | 'subscription' | 'invoices' | 'usage' | 'budget' | 'payment' | 'credits';

export function BillingConsolePage() {
  const [activeTab, setActiveTab] = useState<BillingTab>('dashboard');

  const tabs = [
    { id: 'dashboard', label: 'Billing Dashboard', icon: LayoutGrid },
    { id: 'subscription', label: 'Subscription Center', icon: Shield },
    { id: 'invoices', label: 'Invoices Ledger', icon: Receipt },
    { id: 'usage', label: 'Usage Metering', icon: Activity },
    { id: 'budget', label: 'Budget Console', icon: Settings },
    { id: 'payment', label: 'Payment Methods', icon: CreditCard },
    { id: 'credits', label: 'Credits Ledger', icon: Coins }
  ];

  const renderActiveTabContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardTab />;
      case 'subscription':
        return <SubscriptionTab />;
      case 'invoices':
        return <InvoicesTab />;
      case 'usage':
        return <UsageTab />;
      case 'budget':
        return <BudgetTab />;
      case 'payment':
        return <PaymentMethodsTab />;
      case 'credits':
        return <CreditsTab />;
      default:
        return <DashboardTab />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-[#09090b] text-slate-800 dark:text-slate-100 flex flex-col" id="billing-console-page">
      {/* Upper header navigation space */}
      <header className="border-b border-slate-100 dark:border-white/5 bg-white dark:bg-[#030303] py-5 px-6 md:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
              <span>TaskNova AI Console</span>
              <span>/</span>
              <span className="text-indigo-500 font-semibold">Billing & Financial Operations</span>
            </div>
            <h1 className="text-2xl font-bold font-sans text-slate-900 dark:text-white mt-1.5 tracking-tight flex items-center gap-2">
              <FileText className="h-6 w-6 text-indigo-500" /> Enterprise Billing Platform
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Statutory 18% GST tax computations, credit offsets, and dynamic quota allocation mechanics.
            </p>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-6 md:p-8 space-y-6">
        {/* Horizontal Navigation Tabs */}
        <div className="border-b border-slate-200/85 dark:border-white/5 flex gap-1 overflow-x-auto pb-px scrollbar-thin">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isSelected = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as BillingTab)}
                className={`flex items-center gap-2 px-4 py-3 text-xs font-medium border-b-2 cursor-pointer transition-all shrink-0 ${
                  isSelected
                    ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400'
                    : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Icon className="h-4 w-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Tab content wrapper with smooth motion stagger */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.15 }}
            className="focus:outline-none"
          >
            {renderActiveTabContent()}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}
export default BillingConsolePage;
