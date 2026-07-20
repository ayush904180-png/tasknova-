/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { DashboardWidget, SavedReport, GlobalFilters } from '../types';
import { OfflineCache } from '../cache/OfflineCache';
import { DEFAULT_WIDGETS, DEFAULT_FILTERS } from '../constants';

export interface IAnalyticsRepository {
  getWidgetsLayout(): DashboardWidget[];
  saveWidgetsLayout(widgets: DashboardWidget[]): void;
  getSavedReports(): SavedReport[];
  saveReport(report: SavedReport): void;
  deleteReport(id: string): void;
}

export class AnalyticsRepository implements IAnalyticsRepository {
  private static LAYOUT_KEY = 'tasknova_analytics_widgets_layout';
  private static REPORTS_KEY = 'tasknova_analytics_saved_reports';

  public getWidgetsLayout(): DashboardWidget[] {
    const cached = OfflineCache.get<DashboardWidget[]>(AnalyticsRepository.LAYOUT_KEY);
    if (cached) return cached;

    const raw = localStorage.getItem(AnalyticsRepository.LAYOUT_KEY);
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        OfflineCache.set(AnalyticsRepository.LAYOUT_KEY, parsed);
        return parsed;
      } catch (e) {
        return DEFAULT_WIDGETS;
      }
    }
    return DEFAULT_WIDGETS;
  }

  public saveWidgetsLayout(widgets: DashboardWidget[]): void {
    localStorage.setItem(AnalyticsRepository.LAYOUT_KEY, JSON.stringify(widgets));
    OfflineCache.set(AnalyticsRepository.LAYOUT_KEY, widgets);
    // Queue offline sync event
    OfflineCache.queueOfflineAction('SAVE_LAYOUT', widgets);
  }

  public getSavedReports(): SavedReport[] {
    const cached = OfflineCache.get<SavedReport[]>(AnalyticsRepository.REPORTS_KEY);
    if (cached) return cached;

    const raw = localStorage.getItem(AnalyticsRepository.REPORTS_KEY);
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        OfflineCache.set(AnalyticsRepository.REPORTS_KEY, parsed);
        return parsed;
      } catch (e) {
        return this.getDefaultReports();
      }
    }
    return this.getDefaultReports();
  }

  public saveReport(report: SavedReport): void {
    const current = this.getSavedReports();
    const idx = current.findIndex(r => r.id === report.id);
    if (idx >= 0) {
      current[idx] = report;
    } else {
      current.push(report);
    }
    localStorage.setItem(AnalyticsRepository.REPORTS_KEY, JSON.stringify(current));
    OfflineCache.set(AnalyticsRepository.REPORTS_KEY, current);
    OfflineCache.queueOfflineAction('SAVE_REPORT', report);
  }

  public deleteReport(id: string): void {
    const current = this.getSavedReports().filter(r => r.id !== id);
    localStorage.setItem(AnalyticsRepository.REPORTS_KEY, JSON.stringify(current));
    OfflineCache.set(AnalyticsRepository.REPORTS_KEY, current);
    OfflineCache.queueOfflineAction('DELETE_REPORT', { id });
  }

  private getDefaultReports(): SavedReport[] {
    return [
      {
        id: 'rep_mrr_churn_v1',
        title: 'Executive Financial & MRR Progression',
        description: 'Monthly recurring revenue, annual projections, and customer acquisition efficiency indicators.',
        createdDate: '2026-07-10',
        updatedDate: '2026-07-19',
        isArchived: false,
        filters: DEFAULT_FILTERS,
        widgets: DEFAULT_WIDGETS
      },
      {
        id: 'rep_task_consensus_v1',
        title: 'B2B Campaign Performance & Consensus',
        description: 'Dataset volume outputs, accuracy, prompt score weights, and average spend distribution.',
        createdDate: '2026-07-12',
        updatedDate: '2026-07-15',
        isArchived: false,
        filters: DEFAULT_FILTERS,
        widgets: DEFAULT_WIDGETS.filter(w => w.category === 'tasks' || w.category === 'validation')
      }
    ];
  }
}
