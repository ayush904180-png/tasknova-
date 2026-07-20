/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import { GlobalFilters, DashboardWidget, SavedReport, LiveStreamEvent, KPICardData, ForecastDataPoint, AnalyticsRole } from '../types';
import { DEFAULT_FILTERS, ROLE_ANALYTICS_PERMISSIONS } from '../constants';
import { AnalyticsRepository } from '../repositories/AnalyticsRepository';
import { AnalyticsService } from '../services/AnalyticsService';
import { GoogleCloudAdapter } from '../adapters/GoogleCloudAdapter';

interface AnalyticsContextProps {
  filters: GlobalFilters;
  setFilters: React.Dispatch<React.SetStateAction<GlobalFilters>>;
  widgets: DashboardWidget[];
  setWidgets: React.Dispatch<React.SetStateAction<DashboardWidget[]>>;
  savedReports: SavedReport[];
  activeReport: SavedReport | null;
  setActiveReport: React.Dispatch<React.SetStateAction<SavedReport | null>>;
  liveEvents: LiveStreamEvent[];
  kpis: KPICardData[];
  forecastingMetric: string;
  setForecastingMetric: (metric: string) => void;
  forecastData: ForecastDataPoint[];
  rbacRole: AnalyticsRole;
  setRbacRole: (role: AnalyticsRole) => void;
  userPermissions: string[];
  
  // Custom Builders & Layout operations
  saveLayout: (newWidgets: DashboardWidget[]) => void;
  restoreDefaultLayout: () => void;
  saveNewReport: (title: string, description: string) => SavedReport;
  deleteReportById: (id: string) => void;
  
  // Exporters
  exportData: (format: 'CSV' | 'JSON') => void;
  exportToSheets: (spreadsheetId: string, sheetName: string) => Promise<boolean>;
  triggerModelRefresh: () => Promise<boolean>;
  
  // Search state
  searchQuery: string;
  setSearchQuery: (q: string) => void;
}

const AnalyticsContext = createContext<AnalyticsContextProps | undefined>(undefined);

export const AnalyticsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const repo = new AnalyticsRepository();

  const [filters, setFilters] = useState<GlobalFilters>(DEFAULT_FILTERS);
  const [widgets, setWidgets] = useState<DashboardWidget[]>([]);
  const [savedReports, setSavedReports] = useState<SavedReport[]>([]);
  const [activeReport, setActiveReport] = useState<SavedReport | null>(null);
  const [liveEvents, setLiveEvents] = useState<LiveStreamEvent[]>([]);
  const [forecastingMetric, setForecastingMetric] = useState<string>('Revenue');
  const [rbacRole, setRbacRole] = useState<AnalyticsRole>(AnalyticsRole.SUPER_ADMIN);
  const [searchQuery, setSearchQuery] = useState<string>('');

  // 1. Initial State Load
  useEffect(() => {
    setWidgets(repo.getWidgetsLayout());
    setSavedReports(repo.getSavedReports());
    setLiveEvents(AnalyticsService.generateLiveEvents());
  }, []);

  // 2. Real-time ticker simulator (Adds 1 new telemetry log event every 7 seconds)
  useEffect(() => {
    const interval = setInterval(() => {
      const fresh = AnalyticsService.generateLiveEvents()[0];
      setLiveEvents(prev => [fresh, ...prev.slice(0, 49)]);
    }, 7000);
    return () => clearInterval(interval);
  }, []);

  // 3. Compute active list of allowed metrics/features for RBAC roles
  const userPermissions = ROLE_ANALYTICS_PERMISSIONS[rbacRole] || [];

  // 4. Recalculate KPIs on filter adjustments
  const kpis = AnalyticsService.calculateKPIs(filters);

  // 5. Compute predictive forecasting array
  const forecastData = AnalyticsService.calculateForecasts(forecastingMetric);

  // Layout ops
  const saveLayout = (newWidgets: DashboardWidget[]) => {
    setWidgets(newWidgets);
    repo.saveWidgetsLayout(newWidgets);
  };

  const restoreDefaultLayout = () => {
    const defaults = repo.getWidgetsLayout();
    setWidgets(defaults);
    repo.saveWidgetsLayout(defaults);
  };

  const saveNewReport = (title: string, description: string): SavedReport => {
    const report: SavedReport = {
      id: `rep_${Date.now()}`,
      title,
      description,
      createdDate: new Date().toISOString().split('T')[0],
      updatedDate: new Date().toISOString().split('T')[0],
      isArchived: false,
      filters,
      widgets
    };
    repo.saveReport(report);
    setSavedReports(repo.getSavedReports());
    return report;
  };

  const deleteReportById = (id: string) => {
    repo.deleteReport(id);
    setSavedReports(repo.getSavedReports());
    if (activeReport?.id === id) {
      setActiveReport(null);
    }
  };

  // Exporters
  const exportData = (format: 'CSV' | 'JSON') => {
    const content = AnalyticsService.generateExportData(format, kpis);
    const mime = format === 'CSV' ? 'text/csv' : 'application/json';
    const blob = new Blob([content], { type: mime });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `tasknova_analytics_${filters.dateRange.startDate}_to_${filters.dateRange.endDate}.${format.toLowerCase()}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const exportToSheets = async (spreadsheetId: string, sheetName: string): Promise<boolean> => {
    try {
      const response = await GoogleCloudAdapter.exportToGoogleSheets({ spreadsheetId, sheetName }, kpis);
      return response.success;
    } catch (e) {
      return false;
    }
  };

  const triggerModelRefresh = async (): Promise<boolean> => {
    try {
      const response = await GoogleCloudAdapter.triggerCloudFunction(
        'https://us-central1-tasknova-core.cloudfunctions.net/refreshPredictiveModels',
        { forecastingMetric, timestamp: new Date().toISOString() }
      );
      return response.status === 'success';
    } catch (e) {
      return false;
    }
  };

  return (
    <AnalyticsContext.Provider value={{
      filters,
      setFilters,
      widgets,
      setWidgets,
      savedReports,
      activeReport,
      setActiveReport,
      liveEvents,
      kpis,
      forecastingMetric,
      setForecastingMetric,
      forecastData,
      rbacRole,
      setRbacRole,
      userPermissions,
      saveLayout,
      restoreDefaultLayout,
      saveNewReport,
      deleteReportById,
      exportData,
      exportToSheets,
      triggerModelRefresh,
      searchQuery,
      setSearchQuery
    }}>
      {children}
    </AnalyticsContext.Provider>
  );
};

export const useAnalytics = () => {
  const context = useContext(AnalyticsContext);
  if (!context) {
    throw new Error('useAnalytics must be used within an AnalyticsProvider');
  }
  return context;
};
