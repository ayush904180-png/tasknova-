/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Task, TaskStatus, TaskDifficulty } from '../../types/tasks';
import { GlobalTaskService, TaskService } from '../services/TaskService';
import { TaskFilterOptions } from '../utils/TaskQueryBuilder';
import { TaskEventBus, TaskEventType } from '../events/TaskEventBus';
import { GlobalTaskRepository } from '../repositories/TaskRepository';

interface TaskContextType {
  tasks: Task[];
  allTasks: Task[];
  activeTask: Task | null;
  setActiveTask: (task: Task | null) => void;
  filters: TaskFilterOptions;
  setFilters: (filters: TaskFilterOptions | ((prev: TaskFilterOptions) => TaskFilterOptions)) => void;
  bookmarks: string[];
  toggleBookmark: (taskId: string) => void;
  isLoading: boolean;
  isSyncing: boolean;
  isOnline: boolean;
  sessionCompletedCount: number;
  sessionCoinsEarned: number;
  submitTask: (responsePayload: Record<string, any>, durationSeconds: number) => Promise<boolean>;
  syncOfflineQueue: () => Promise<void>;
  createNewTask: (taskData: Partial<Task>) => Promise<void>;
  sheetsExport: (reportType: 'Task' | 'Category' | 'Completion' | 'Quality' | 'Business' | 'Admin') => Promise<{ headers: string[]; rows: any[][] }>;
  driveAttachMock: (fileMeta: { id: string; name: string; mimeType: string; sizeBytes: number; webViewLink: string }) => Promise<void>;
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export function TaskProvider({ children, service = GlobalTaskService }: { children: ReactNode; service?: TaskService }) {
  const [allTasks, setAllTasks] = useState<Task[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [bookmarks, setBookmarks] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem('tasknova_bookmarks');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const [filters, setFiltersState] = useState<TaskFilterOptions>({
    category: 'All',
    difficulty: undefined,
    minReward: undefined,
    maxReward: undefined,
    country: 'ALL',
    language: 'All',
    priority: undefined,
    maxEstimatedTime: undefined,
    status: undefined,
    bookmarkedOnly: false,
    searchQuery: '',
    sortBy: 'Newest'
  });

  const [isLoading, setIsLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const [isOnline, setIsOnline] = useState(true);

  // Session Statistics tracking
  const [sessionCompletedCount, setSessionCompletedCount] = useState(0);
  const [sessionCoinsEarned, setSessionCoinsEarned] = useState(0);

  // Sync bookmarks state to localStorage
  useEffect(() => {
    localStorage.setItem('tasknova_bookmarks', JSON.stringify(bookmarks));
  }, [bookmarks]);

  // Track online/offline status
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setIsOnline(navigator.onLine);
      const handleOnline = () => setIsOnline(true);
      const handleOffline = () => setIsOnline(false);

      window.addEventListener('online', handleOnline);
      window.addEventListener('offline', handleOffline);

      return () => {
        window.removeEventListener('online', handleOnline);
        window.removeEventListener('offline', handleOffline);
      };
    }
  }, []);

  // Listen for realtime task database updates
  useEffect(() => {
    setIsLoading(true);
    const unsubscribe = GlobalTaskRepository.subscribeToTasks((updatedTasks) => {
      setAllTasks(updatedTasks);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Filter tasks in-memory reactively when allTasks or filters update
  useEffect(() => {
    const fetchFiltered = async () => {
      const queryParams = { ...filters, bookmarkedIds: bookmarks };
      const filtered = await service.getTasks(queryParams);
      setTasks(filtered);

      // Auto-select first active task if none selected or previous selected is gone
      if (filtered.length > 0) {
        if (!activeTask || !filtered.some(t => t.id === activeTask.id)) {
          setActiveTask(filtered[0]);
        }
      } else {
        setActiveTask(null);
      }
    };

    fetchFiltered();
  }, [allTasks, filters, bookmarks]);

  // Helper setter supporting function callbacks
  const setFilters = (newFilters: TaskFilterOptions | ((prev: TaskFilterOptions) => TaskFilterOptions)) => {
    setFiltersState(prev => {
      const resolved = typeof newFilters === 'function' ? newFilters(prev) : newFilters;
      return resolved;
    });
  };

  /**
   * Toggles bookmarking for tasks.
   */
  const toggleBookmark = (taskId: string) => {
    setBookmarks(prev => {
      const isBookmarked = prev.includes(taskId);
      const updated = isBookmarked ? prev.filter(id => id !== taskId) : [...prev, taskId];
      
      // Emit bookmark telemetry event
      GlobalTaskRepository.recordTelemetry(taskId, TaskEventType.TaskBookmarked, 'session_user', { isBookmarked: !isBookmarked });
      return updated;
    });
  };

  /**
   * Submits active task answers.
   */
  const submitTask = async (responsePayload: Record<string, any>, durationSeconds: number): Promise<boolean> => {
    if (!activeTask) return false;

    const result = await service.submitTaskWork(
      activeTask.id,
      'validator_contributor_1',
      responsePayload,
      durationSeconds
    );

    if (result.success) {
      setSessionCompletedCount(prev => prev + 1);
      setSessionCoinsEarned(prev => prev + result.coinsEarned);

      // Dynamically advance selection to next task in filtered list
      const index = tasks.findIndex(t => t.id === activeTask.id);
      if (index !== -1 && tasks.length > 1) {
        const nextIndex = (index + 1) % tasks.length;
        setActiveTask(tasks[nextIndex]);
      }
      return true;
    }
    return false;
  };

  /**
   * Syncs the offline pending queue operations.
   */
  const syncOfflineQueue = async () => {
    setIsSyncing(true);
    try {
      const res = await GlobalTaskRepository.syncOfflinePending();
      if (res.successCount > 0) {
        // Reload tasks list
        const updated = await service.getTasks(filters);
        setAllTasks(updated);
      }
    } finally {
      setIsSyncing(false);
    }
  };

  /**
   * Registers a dynamic task from UI forms.
   */
  const createNewTask = async (taskData: Partial<Task>) => {
    const newTask: Task = {
      id: taskData.id || `TASK-CUSTOM-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
      version: 1,
      parentTaskId: null,
      taskType: taskData.taskType || 'AI Response Comparison',
      title: taskData.title || 'Untitled Custom Task',
      description: taskData.description || 'No description provided.',
      instructions: taskData.instructions || ['Follow standard alignment rules.'],
      category: taskData.category || 'AI Response Comparison',
      difficulty: taskData.difficulty || TaskDifficulty.EASY,
      estimatedCompletionTime: taskData.estimatedCompletionTime || 60,
      rewardCoins: taskData.rewardCoins || 10,
      priority: taskData.priority || undefined as any,
      language: taskData.language || 'en-US',
      country: taskData.country || 'ALL',
      region: null,
      requiredAccuracy: taskData.requiredAccuracy || 95,
      requiredTrustScore: taskData.requiredTrustScore || 80,
      maximumAttempts: taskData.maximumAttempts || 1,
      cooldownPeriod: 0,
      validationMethod: 'Consensus',
      reviewStrategy: 'Immediate',
      expiryDate: null,
      visibility: 'Public',
      currentStatus: TaskStatus.ACTIVE,
      tags: taskData.tags || [],
      attachments: taskData.attachments || [],
      creator: 'session_creator',
      business: null,
      metadata: {},
      aiMetadata: {},
      humanMetadata: {},
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      archivedAt: null,
    };

    await GlobalTaskRepository.save(newTask, 'session_creator');
  };

  /**
   * Sheets export mapper.
   */
  const sheetsExport = async (reportType: 'Task' | 'Category' | 'Completion' | 'Quality' | 'Business' | 'Admin') => {
    return service.generateSheetsExport(reportType);
  };

  /**
   * Attaches a mock Drive File to active task.
   */
  const driveAttachMock = async (fileMeta: { id: string; name: string; mimeType: string; sizeBytes: number; webViewLink: string }) => {
    if (!activeTask) return;
    await service.attachGoogleDriveFile(activeTask.id, fileMeta);
  };

  return (
    <TaskContext.Provider
      value={{
        tasks,
        allTasks,
        activeTask,
        setActiveTask,
        filters,
        setFilters,
        bookmarks,
        toggleBookmark,
        isLoading,
        isSyncing,
        isOnline,
        sessionCompletedCount,
        sessionCoinsEarned,
        submitTask,
        syncOfflineQueue,
        createNewTask,
        sheetsExport,
        driveAttachMock
      }}
      id="task-context-provider"
    >
      {children}
    </TaskContext.Provider>
  );
}

export function useTasks() {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error('useTasks must be used within a TaskProvider');
  }
  return context;
}
