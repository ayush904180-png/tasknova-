/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { Submission, SubmissionStatus, SubmissionFilterOptions } from '../../types/submission';
import { PlayerSession } from '../../types/player';
import { Task } from '../../types/tasks';
import { GlobalSubmissionRepository } from '../repositories/SubmissionRepository';
import { GlobalSubmissionService, SubmissionTelemetrySummary } from '../services/SubmissionService';

export interface SubmissionContextProps {
  submissions: Submission[];
  offlineQueueLength: number;
  telemetry: SubmissionTelemetrySummary;
  isOnline: boolean;
  packageAndSave: (session: PlayerSession, task: Task) => Promise<{ success: boolean; submissionId?: string; error?: string }>;
  manualReview: (submissionId: string, status: 'approved' | 'rejected', comments: string) => Promise<void>;
  archive: (submissionId: string) => Promise<void>;
  syncOfflineQueue: () => Promise<{ successCount: number; dlqCount: number }>;
  deleteDraft: (submissionId: string) => Promise<void>;
  querySubmissions: (filters: SubmissionFilterOptions) => Promise<Submission[]>;
}

const SubmissionContext = createContext<SubmissionContextProps | undefined>(undefined);

/**
 * Enterprise Submission Provider.
 * Connects the repository caching pipeline and validation services reactively into the React tree.
 */
export const SubmissionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [offlineQueueLength, setOfflineQueueLength] = useState<number>(0);
  const [telemetry, setTelemetry] = useState<SubmissionTelemetrySummary>({
    totalCreated: 0,
    totalSaved: 0,
    totalSynced: 0,
    approvalRate: 0,
    rejectRate: 0,
    retryCount: 0,
    offlineSyncSuccess: 0,
    averageCompletionTime: 0,
  });
  const [isOnline, setIsOnline] = useState<boolean>(typeof navigator !== 'undefined' ? navigator.onLine : true);

  // Subscribe to real-time repository mutations
  useEffect(() => {
    const unsubscribeRepo = GlobalSubmissionRepository.subscribe((latestSubs) => {
      setSubmissions(latestSubs);
      setTelemetry(GlobalSubmissionService.compileTelemetry());

      // Update offline queue length safely from LocalStorage
      try {
        const queueStr = localStorage.getItem('tasknova_submissions_offline_queue');
        const queue = queueStr ? JSON.parse(queueStr) : [];
        setOfflineQueueLength(queue.length);
      } catch {
        setOfflineQueueLength(0);
      }
    });

    // Track network connectivity
    const handleOnline = () => {
      setIsOnline(true);
      GlobalSubmissionService.syncOfflineSubmissions();
    };
    const handleOffline = () => setIsOnline(false);

    if (typeof window !== 'undefined') {
      window.addEventListener('online', handleOnline);
      window.addEventListener('offline', handleOffline);
    }

    return () => {
      unsubscribeRepo();
      if (typeof window !== 'undefined') {
        window.removeEventListener('online', handleOnline);
        window.removeEventListener('offline', handleOffline);
      }
    };
  }, []);

  const value = useMemo<SubmissionContextProps>(() => {
    return {
      submissions,
      offlineQueueLength,
      telemetry,
      isOnline,

      packageAndSave: async (session: PlayerSession, task: Task) => {
        const userAgent = typeof navigator !== 'undefined' ? navigator.userAgent : 'Unknown';
        const res = await GlobalSubmissionService.packageAndSave(session, task, userAgent, !isOnline);
        
        // Instantly update localized states
        const latest = localStorage.getItem('tasknova_submissions_db');
        if (latest) setSubmissions(JSON.parse(latest));
        setTelemetry(GlobalSubmissionService.compileTelemetry());
        
        return res;
      },

      manualReview: async (submissionId: string, status: 'approved' | 'rejected', comments: string) => {
        await GlobalSubmissionService.manualReviewSubmission(submissionId, status, comments, 'operator_reviewer_1');
        // Trigger subscription update automatically
      },

      archive: async (submissionId: string) => {
        await GlobalSubmissionService.archiveSubmission(submissionId, 'sys_admin');
      },

      syncOfflineQueue: async () => {
        const res = await GlobalSubmissionService.syncOfflineSubmissions();
        setTelemetry(GlobalSubmissionService.compileTelemetry());
        return res;
      },

      deleteDraft: async (submissionId: string) => {
        await GlobalSubmissionRepository.delete(submissionId);
      },

      querySubmissions: async (filters: SubmissionFilterOptions) => {
        return GlobalSubmissionRepository.list(filters);
      }
    };
  }, [submissions, offlineQueueLength, telemetry, isOnline]);

  return (
    <SubmissionContext.Provider value={value}>
      {children}
    </SubmissionContext.Provider>
  );
};

/**
 * Access hook for React components.
 */
export const useSubmissions = (): SubmissionContextProps => {
  const context = useContext(SubmissionContext);
  if (!context) {
    throw new Error('useSubmissions must be executed within an active SubmissionProvider block.');
  }
  return context;
};
