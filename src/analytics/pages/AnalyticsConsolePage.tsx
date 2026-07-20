/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { AnalyticsProvider, useAnalytics } from '../context/AnalyticsContext';
import { GlobalFiltersBar } from '../components/GlobalFiltersBar';
import { ExecutiveKPIDashboard } from '../components/ExecutiveKPIDashboard';
import { BusinessIntelligenceDashboard } from '../components/BusinessIntelligenceDashboard';
import { UserAnalyticsDashboard } from '../components/UserAnalyticsDashboard';
import { ContributorAnalyticsDashboard } from '../components/ContributorAnalyticsDashboard';
import { TaskAnalyticsDashboard } from '../components/TaskAnalyticsDashboard';
import { ValidationAnalyticsDashboard } from '../components/ValidationAnalyticsDashboard';
import { MarketplaceAnalyticsDashboard } from '../components/MarketplaceAnalyticsDashboard';
import { BillingAnalyticsDashboard } from '../components/BillingAnalyticsDashboard';
import { SecurityAnalyticsDashboard } from '../components/SecurityAnalyticsDashboard';
import { CloudAnalyticsDashboard } from '../components/CloudAnalyticsDashboard';
import { PredictiveAnalyticsDashboard } from '../components/PredictiveAnalyticsDashboard';
import { ExecutiveReports } from '../components/ExecutiveReports';
import { ExportCenter } from '../components/ExportCenter';
import { CustomDashboardBuilder } from '../components/CustomDashboardBuilder';
import { SavedReportsTab } from '../components/SavedReportsTab';
import { LiveTelemetryStream } from '../components/LiveTelemetryStream';
import { 
  TrendingUp, BarChart3, Users, Award, CheckSquare, Sparkles, ShoppingBag, CreditCard, ShieldAlert, Cloud, HelpCircle, FileText, Download, Sliders, Save, Activity
} from 'lucide-react';

type TabId = 
  | 'overview' 
  | 'bi' 
  | 'users' 
  | 'contributors' 
  | 'tasks' 
  | 'validation' 
  | 'marketplace' 
  | 'billing' 
  | 'security' 
  | 'cloud' 
  | 'predictive'
  | 'reports'
  | 'export'
  | 'saved'
  | 'builder';

const AnalyticsConsoleInner: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabId>('overview');
  const { rbacRole, userPermissions } = useAnalytics();

  const tabs: { id: TabId; label: string; icon: React.ReactNode; category: string }[] = [
    { id: 'overview', label: 'Executive KPIs', icon: <TrendingUp className="h-3.5 w-3.5" />, category: 'general' },
    { id: 'bi', label: 'Business Intelligence', icon: <BarChart3 className="h-3.5 w-3.5" />, category: 'general' },
    { id: 'users', label: 'User Growth', icon: <Users className="h-3.5 w-3.5" />, category: 'general' },
    { id: 'contributors', label: 'Contributor Quality', icon: <Award className="h-3.5 w-3.5" />, category: 'general' },
    { id: 'tasks', label: 'Task Volumes', icon: <CheckSquare className="h-3.5 w-3.5" />, category: 'execution' },
    { id: 'validation', label: 'Consensus Quality', icon: <Sparkles className="h-3.5 w-3.5" />, category: 'execution' },
    { id: 'marketplace', label: 'Allocation Pool', icon: <ShoppingBag className="h-3.5 w-3.5" />, category: 'execution' },
    { id: 'billing', label: 'Ledger Billings', icon: <CreditCard className="h-3.5 w-3.5" />, category: 'billing' },
    { id: 'security', label: 'Threat Ingress', icon: <ShieldAlert className="h-3.5 w-3.5" />, category: 'billing' },
    { id: 'cloud', label: 'Cloud Resources', icon: <Cloud className="h-3.5 w-3.5" />, category: 'billing' },
    { id: 'predictive', label: 'Regression Model', icon: <TrendingUp className="h-3.5 w-3.5" />, category: 'predictive' },
    { id: 'reports', label: 'Executive Reports', icon: <FileText className="h-3.5 w-3.5" />, category: 'predictive' },
    { id: 'export', label: 'Integration Exports', icon: <Download className="h-3.5 w-3.5" />, category: 'predictive' },
    { id: 'saved', label: 'Saved Presets', icon: <FileText className="h-3.5 w-3.5" />, category: 'custom' },
    { id: 'builder', label: 'Widget Builder', icon: <Sliders className="h-3.5 w-3.5" />, category: 'custom' }
  ];

  const renderActiveTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-6">
            <ExecutiveKPIDashboard />
            <LiveTelemetryStream />
          </div>
        );
      case 'bi':
        return <BusinessIntelligenceDashboard />;
      case 'users':
        return <UserAnalyticsDashboard />;
      case 'contributors':
        return <ContributorAnalyticsDashboard />;
      case 'tasks':
        return <TaskAnalyticsDashboard />;
      case 'validation':
        return <ValidationAnalyticsDashboard />;
      case 'marketplace':
        return <MarketplaceAnalyticsDashboard />;
      case 'billing':
        return <BillingAnalyticsDashboard />;
      case 'security':
        return <SecurityAnalyticsDashboard />;
      case 'cloud':
        return <CloudAnalyticsDashboard />;
      case 'predictive':
        return <PredictiveAnalyticsDashboard />;
      case 'reports':
        return <ExecutiveReports />;
      case 'export':
        return <ExportCenter />;
      case 'saved':
        return <SavedReportsTab />;
      case 'builder':
        return <CustomDashboardBuilder />;
      default:
        return <ExecutiveKPIDashboard />;
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 py-6" id="analytics-console-main">
      {/* 1. Header Block */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/5 pb-5">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-[10px] uppercase font-bold tracking-widest text-indigo-400 bg-indigo-500/10 px-2.5 py-0.5 rounded border border-indigo-500/20">TaskNova BI Node</span>
            <span className="text-slate-500">•</span>
            <span className="text-[10px] text-slate-400 font-mono">v4.8.2-PRO</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-100 tracking-tight">Ecosystem BI & KPI Command Headquarters</h1>
          <p className="text-xs text-slate-400">
            High-fidelity visual control platform for executive revenue monitoring, campaign analysis, linear forecasting, and GCP telemetry logging.
          </p>
        </div>

        {/* Status badges */}
        <div className="flex items-center gap-3">
          <div className="bg-slate-900 border border-white/5 rounded-xl px-4 py-2 flex items-center gap-2.5 text-xs text-slate-300">
            <Activity className="h-4 w-4 text-emerald-400 animate-pulse" />
            <div>
              <div className="font-semibold text-slate-200">GCP Sync Status</div>
              <div className="text-[10px] text-slate-400">99.98% connectivity accuracy</div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Global Filters Bar */}
      <GlobalFiltersBar />

      {/* 3. Analytics Navigation Hub */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Navigation panel */}
        <div className="lg:col-span-3 bg-slate-900 border border-white/5 rounded-xl p-3 space-y-4 shadow-lg">
          <div className="px-2 pt-1">
            <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">Analytics Segments</span>
          </div>

          <div className="space-y-3">
            {/* Category Groups */}
            {[
              { id: 'general', title: 'Operational Overview' },
              { id: 'execution', title: 'Task Execution Consensus' },
              { id: 'billing', title: 'Financial & Security Audit' },
              { id: 'predictive', title: 'Predictive & Reports Center' },
              { id: 'custom', title: 'Visual Personalization' }
            ].map((cat) => (
              <div key={cat.id} className="space-y-1">
                <span className="px-2 text-[9px] uppercase tracking-widest text-slate-500 font-semibold">{cat.title}</span>
                <div className="space-y-0.5">
                  {tabs
                    .filter((t) => t.category === cat.id)
                    .map((t) => {
                      const isActive = activeTab === t.id;
                      return (
                        <button
                          key={t.id}
                          onClick={() => setActiveTab(t.id)}
                          className={`w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium rounded-lg transition-colors border ${
                            isActive
                              ? 'bg-indigo-600/15 border-indigo-500/20 text-indigo-300 font-semibold'
                              : 'bg-transparent border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                          }`}
                        >
                          {t.icon}
                          <span className="truncate">{t.label}</span>
                        </button>
                      );
                    })}
                </div>
              </div>
            ))}
          </div>

          <div className="pt-3 border-t border-white/5 px-2 flex justify-between items-center text-[10px] text-slate-500">
            <span>Identity Node Role:</span>
            <span className="font-semibold text-indigo-400">{rbacRole}</span>
          </div>
        </div>

        {/* Workspace Display Area */}
        <div className="lg:col-span-9 space-y-6">
          {renderActiveTabContent()}
        </div>
      </div>
    </div>
  );
};

export const AnalyticsConsolePage: React.FC = () => {
  return (
    <AnalyticsProvider>
      <AnalyticsConsoleInner />
    </AnalyticsProvider>
  );
};
