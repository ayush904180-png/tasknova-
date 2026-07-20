/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
  TaskGenPipeline, GeneratedTaskEntity, TaskTemplate, 
  TaskGenerationAnalyticsSummary, GeneratedTaskStatus, TaskGenPipelineStatus 
} from '../types';
import { GlobalTaskGenerationRepository } from '../repositories/TaskGenerationRepository';
import { GlobalTaskGenerationService } from '../services/TaskGenerationService';
import { TaskGenerationAnalytics } from '../analytics/TaskGenerationAnalytics';
import { TaskGenerationCache } from '../cache/TaskGenerationCache';
import { TaskGenerationEventBus, TaskGenEventType } from '../events/TaskGenerationEventBus';
import { TaskDifficulty } from '../../types/tasks';

interface TaskGenerationContextType {
  pipelines: TaskGenPipeline[];
  generatedTasks: GeneratedTaskEntity[];
  templates: TaskTemplate[];
  analytics: TaskGenerationAnalyticsSummary;
  telemetryLogs: string[];
  isOnline: boolean;
  isSyncing: boolean;

  // Pipeline execution
  triggerPipelineRun: (
    name: string,
    datasetId: string,
    datasetName: string,
    taskType: string,
    templateId: string,
    sourceContent: string,
    customMediaUrls?: string[]
  ) => Promise<string>;

  // Task Reviews
  approveTask: (id: string, notes?: string) => Promise<void>;
  rejectTask: (id: string, notes?: string) => Promise<void>;
  publishTask: (id: string) => Promise<boolean>;

  // Bulk operations
  bulkApproveTasks: (ids: string[], notes?: string) => Promise<void>;
  bulkRejectTasks: (ids: string[], notes?: string) => Promise<void>;
  bulkPublishTasks: (ids: string[]) => Promise<void>;
  bulkDeleteTasks: (ids: string[]) => Promise<void>;

  // Templates
  createNewTemplate: (template: TaskTemplate) => Promise<void>;
  
  // Offline Sync
  syncOfflineQueue: () => Promise<void>;
}

const TaskGenerationContext = createContext<TaskGenerationContextType | undefined>(undefined);

export const TaskGenerationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [pipelines, setPipelines] = useState<TaskGenPipeline[]>([]);
  const [generatedTasks, setGeneratedTasks] = useState<GeneratedTaskEntity[]>([]);
  const [templates, setTemplates] = useState<TaskTemplate[]>([]);
  const [analytics, setAnalytics] = useState<TaskGenerationAnalyticsSummary>(() => TaskGenerationAnalytics.compileSummary());
  const [telemetryLogs, setTelemetryLogs] = useState<string[]>([]);
  const [isOnline, setIsOnline] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);

  // Load state and listen to repository updates
  useEffect(() => {
    const syncState = () => {
      const p = GlobalTaskGenerationRepository.loadPipelines();
      const t = GlobalTaskGenerationRepository.loadTasks();
      const temp = GlobalTaskGenerationRepository.loadTemplates();
      
      setPipelines(p);
      setGeneratedTasks(t);
      setTemplates(temp);
      setAnalytics(TaskGenerationAnalytics.compileSummary());
    };

    syncState();
    const unsubscribe = GlobalTaskGenerationRepository.subscribe(syncState);
    return () => unsubscribe();
  }, []);

  // Track network
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setIsOnline(navigator.onLine);
      const onlineHandler = () => {
        setIsOnline(true);
        syncOfflineQueue();
      };
      const offlineHandler = () => setIsOnline(false);

      window.addEventListener('online', onlineHandler);
      window.addEventListener('offline', offlineHandler);
      return () => {
        window.removeEventListener('online', onlineHandler);
        window.removeEventListener('offline', offlineHandler);
      };
    }
  }, []);

  // Listen to global telemetry event bus to append active developer console log outputs
  useEffect(() => {
    const unsubStarted = TaskGenerationEventBus.on(TaskGenEventType.GenerationStarted, (p) => {
      setTelemetryLogs(prev => [
        `[${new Date().toLocaleTimeString()}] 🚀 pipeline "${p.pipeline.name}" started by ${p.actorId}.`,
        ...prev
      ]);
    });

    const unsubAnalyzed = TaskGenerationEventBus.on(TaskGenEventType.DatasetAnalyzed, (p) => {
      setTelemetryLogs(prev => [
        `[${new Date().toLocaleTimeString()}] 📊 dataset analysis complete. detected ${p.rowCount} records.`,
        ...prev
      ]);
    });

    const unsubChunk = TaskGenerationEventBus.on(TaskGenEventType.ChunkCreated, (p) => {
      setTelemetryLogs(prev => [
        `[${new Date().toLocaleTimeString()}] 📦 chunk created: id=${p.chunk.id} hash=${p.chunk.hash.substring(0, 8)}.`,
        ...prev
      ]);
    });

    const unsubTask = TaskGenerationEventBus.on(TaskGenEventType.TaskCreated, (p) => {
      setTelemetryLogs(prev => [
        `[${new Date().toLocaleTimeString()}] ⚙️ microtask created: "${p.task.title}" estimated time ${p.task.estimatedCompletionTime}s.`,
        ...prev
      ]);
    });

    const unsubReward = TaskGenerationEventBus.on(TaskGenEventType.RewardCalculated, (p) => {
      setTelemetryLogs(prev => [
        `[${new Date().toLocaleTimeString()}] 🪙 reward model evaluated: base=${p.originalCoins} coins, final=${p.calculatedCoins} coins.`,
        ...prev
      ]);
    });

    const unsubVal = TaskGenerationEventBus.on(TaskGenEventType.TaskValidated, (p) => {
      if (!p.isValid) {
        setTelemetryLogs(prev => [
          `[${new Date().toLocaleTimeString()}] ⚠️ qa failure: task ${p.taskId} warnings: ${p.warnings.join(', ')}.`,
          ...prev
        ]);
      }
    });

    const unsubApprove = TaskGenerationEventBus.on(TaskGenEventType.TaskApproved, (p) => {
      setTelemetryLogs(prev => [
        `[${new Date().toLocaleTimeString()}] ✅ task ${p.taskId} approved by ${p.reviewerId}.`,
        ...prev
      ]);
    });

    const unsubReject = TaskGenerationEventBus.on(TaskGenEventType.TaskRejected, (p) => {
      setTelemetryLogs(prev => [
        `[${new Date().toLocaleTimeString()}] ❌ task ${p.taskId} REJECTED by ${p.reviewerId}. Reason: ${p.reason}`,
        ...prev
      ]);
    });

    const unsubPub = TaskGenerationEventBus.on(TaskGenEventType.TaskPublished, (p) => {
      setTelemetryLogs(prev => [
        `[${new Date().toLocaleTimeString()}] 🌐 task ${p.taskId} successfully published to market under id ${p.marketplaceTaskId}.`,
        ...prev
      ]);
    });

    const unsubComp = TaskGenerationEventBus.on(TaskGenEventType.GenerationCompleted, (p) => {
      setTelemetryLogs(prev => [
        `[${new Date().toLocaleTimeString()}] 🎉 pipeline "${p.pipelineId}" process finished successfully! total tasks generated: ${p.totalCreated}.`,
        ...prev
      ]);
    });

    return () => {
      unsubStarted();
      unsubAnalyzed();
      unsubChunk();
      unsubTask();
      unsubReward();
      unsubVal();
      unsubApprove();
      unsubReject();
      unsubPub();
      unsubComp();
    };
  }, []);

  // API ACTIONS
  const triggerPipelineRun = async (
    name: string,
    datasetId: string,
    datasetName: string,
    taskType: string,
    templateId: string,
    sourceContent: string,
    customMediaUrls?: string[]
  ): Promise<string> => {
    if (!isOnline) {
      // Offline mode: Queue pipeline creation
      const mockId = `PIPE-OFFLINE-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
      TaskGenerationCache.enqueueOffline({
        id: mockId,
        type: 'pipeline_create',
        payload: { name, datasetId, datasetName, taskType, templateId, sourceContent, customMediaUrls }
      });
      setTelemetryLogs(prev => [
        `[${new Date().toLocaleTimeString()}] 📶 offline: pipeline registration cached for background sync.`,
        ...prev
      ]);
      return mockId;
    }

    return GlobalTaskGenerationService.runInferencePipeline(
      name,
      datasetId,
      datasetName,
      taskType,
      templateId,
      sourceContent,
      customMediaUrls
    );
  };

  const approveTask = async (id: string, notes?: string): Promise<void> => {
    if (!isOnline) {
      TaskGenerationCache.enqueueOffline({
        id,
        type: 'task_update',
        payload: { id, status: GeneratedTaskStatus.APPROVED, notes }
      });
      return;
    }
    await GlobalTaskGenerationRepository.updateGeneratedTaskStatus(id, GeneratedTaskStatus.APPROVED, notes);
  };

  const rejectTask = async (id: string, notes?: string): Promise<void> => {
    if (!isOnline) {
      TaskGenerationCache.enqueueOffline({
        id,
        type: 'task_update',
        payload: { id, status: GeneratedTaskStatus.REJECTED, notes }
      });
      return;
    }
    await GlobalTaskGenerationRepository.updateGeneratedTaskStatus(id, GeneratedTaskStatus.REJECTED, notes);
  };

  const publishTask = async (id: string): Promise<boolean> => {
    if (!isOnline) {
      TaskGenerationCache.enqueueOffline({
        id,
        type: 'task_update',
        payload: { id, status: GeneratedTaskStatus.PUBLISHED }
      });
      return true;
    }
    return GlobalTaskGenerationService.publishTaskToMarketplace(id);
  };

  // Bulk actions
  const bulkApproveTasks = async (ids: string[], notes?: string): Promise<void> => {
    if (!isOnline) {
      ids.forEach(id => {
        TaskGenerationCache.enqueueOffline({
          id,
          type: 'task_update',
          payload: { id, status: GeneratedTaskStatus.APPROVED, notes }
        });
      });
      return;
    }
    await GlobalTaskGenerationRepository.bulkUpdateTasks(ids, GeneratedTaskStatus.APPROVED, notes);
  };

  const bulkRejectTasks = async (ids: string[], notes?: string): Promise<void> => {
    if (!isOnline) {
      ids.forEach(id => {
        TaskGenerationCache.enqueueOffline({
          id,
          type: 'task_update',
          payload: { id, status: GeneratedTaskStatus.REJECTED, notes }
        });
      });
      return;
    }
    await GlobalTaskGenerationRepository.bulkUpdateTasks(ids, GeneratedTaskStatus.REJECTED, notes);
  };

  const bulkPublishTasks = async (ids: string[]): Promise<void> => {
    if (!isOnline) {
      TaskGenerationCache.enqueueOffline({
        id: `bulk-pub-${Date.now()}`,
        type: 'task_bulk_publish',
        payload: { ids }
      });
      return;
    }
    await GlobalTaskGenerationService.bulkPublish(ids);
  };

  const bulkDeleteTasks = async (ids: string[]): Promise<void> => {
    await GlobalTaskGenerationRepository.bulkDeleteTasks(ids);
  };

  // Templates
  const createNewTemplate = async (template: TaskTemplate): Promise<void> => {
    const templates = GlobalTaskGenerationRepository.loadTemplates();
    templates.unshift(template);
    GlobalTaskGenerationRepository.saveTemplates(templates);
  };

  // Offline Sync Queue Trigger
  const syncOfflineQueue = async (): Promise<void> => {
    const queue = TaskGenerationCache.getOfflineQueue();
    if (queue.length === 0) return;

    setIsSyncing(true);
    setTelemetryLogs(prev => [
      `[${new Date().toLocaleTimeString()}] 📶 network established: synchronizing ${queue.length} offline operations...`,
      ...prev
    ]);

    for (const item of queue) {
      try {
        if (item.type === 'pipeline_create') {
          const { name, datasetId, datasetName, taskType, templateId, sourceContent, customMediaUrls } = item.payload;
          await GlobalTaskGenerationService.runInferencePipeline(
            name, datasetId, datasetName, taskType, templateId, sourceContent, customMediaUrls
          );
        } else if (item.type === 'task_update') {
          const { id, status, notes } = item.payload;
          if (status === GeneratedTaskStatus.APPROVED) {
            await GlobalTaskGenerationRepository.updateGeneratedTaskStatus(id, GeneratedTaskStatus.APPROVED, notes);
          } else if (status === GeneratedTaskStatus.REJECTED) {
            await GlobalTaskGenerationRepository.updateGeneratedTaskStatus(id, GeneratedTaskStatus.REJECTED, notes);
          } else if (status === GeneratedTaskStatus.PUBLISHED) {
            await GlobalTaskGenerationService.publishTaskToMarketplace(id);
          }
        } else if (item.type === 'task_bulk_publish') {
          await GlobalTaskGenerationService.bulkPublish(item.payload.ids);
        }

        // Dequeue success
        TaskGenerationCache.dequeueOffline(item.id, item.type);
      } catch (err: any) {
        console.error('[TaskGenerationProvider] Offline sync error', err);
        TaskGenerationCache.enqueueRetry(item);
      }
    }

    setIsSyncing(false);
    setTelemetryLogs(prev => [
      `[${new Date().toLocaleTimeString()}] 📶 background sync transactions completed successfully.`,
      ...prev
    ]);
  };

  return (
    <TaskGenerationContext.Provider value={{
      pipelines,
      generatedTasks,
      templates,
      analytics,
      telemetryLogs,
      isOnline,
      isSyncing,
      triggerPipelineRun,
      approveTask,
      rejectTask,
      publishTask,
      bulkApproveTasks,
      bulkRejectTasks,
      bulkPublishTasks,
      bulkDeleteTasks,
      createNewTemplate,
      syncOfflineQueue
    }} id="task-generation-context-provider">
      {children}
    </TaskGenerationContext.Provider>
  );
};

export const useTaskGeneration = () => {
  const context = useContext(TaskGenerationContext);
  if (!context) {
    throw new Error('useTaskGeneration must be used within a TaskGenerationProvider');
  }
  return context;
};
