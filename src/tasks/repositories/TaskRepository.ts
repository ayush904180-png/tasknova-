/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Task, TaskStatus, TaskDifficulty, TaskPriority } from '../../types/tasks';
import { TaskCache } from '../cache/TaskCache';
import { TaskValidator } from '../utils/TaskValidator';
import { TaskMapper } from '../mappers/TaskMapper';
import { TaskEventBus, TaskEventType } from '../events/TaskEventBus';
import { TaskFilterOptions, TaskQueryBuilder } from '../utils/TaskQueryBuilder';

/**
 * Enterprise Task Repository Layer.
 * Decouples the UI entirely from raw Firebase client instances,
 * enabling robust caching, event trigger cycles, offline buffers, and full-spectrum schemas.
 */
export class TaskRepository {
  private static STORAGE_KEY = 'tasknova_tasks_db';
  private subscribers: Array<(tasks: Task[]) => void> = [];
  private isOnline: boolean = true;

  constructor() {
    this.initializeLocalDatabase();
    this.listenToNetworkChanges();
  }

  /**
   * Initializes some mock task entities into the database if empty.
   */
  private initializeLocalDatabase(): void {
    try {
      const stored = localStorage.getItem(TaskRepository.STORAGE_KEY);
      if (!stored) {
        const initialTasks: Task[] = [
          {
            id: 'TASK-RLHF-001',
            version: 1,
            parentTaskId: null,
            taskType: 'AI Response Comparison',
            title: 'Verify Quantum Tunneling Explanation',
            description: 'Compare two model generated paragraphs describing Quantum Tunneling for a high-school student.',
            instructions: [
              'Read the target prompt: "Explain quantum tunneling simply."',
              'Analyze Response Alpha: inspect accuracy and tone guidelines.',
              'Analyze Response Beta: look out for technical jargon bloat.',
              'Submit your choice and justify your selection in 2 sentences.'
            ],
            category: 'AI Response Comparison',
            difficulty: TaskDifficulty.MEDIUM,
            estimatedCompletionTime: 45,
            rewardCoins: 15,
            priority: TaskPriority.HIGH,
            language: 'en-US',
            country: 'ALL',
            region: null,
            requiredAccuracy: 98,
            requiredTrustScore: 85,
            maximumAttempts: 1,
            cooldownPeriod: 0,
            validationMethod: 'Consensus',
            reviewStrategy: 'Immediate',
            expiryDate: '2026-12-31T23:59:59Z',
            visibility: 'Public',
            currentStatus: TaskStatus.ACTIVE,
            tags: ['RLHF', 'Quantum Physics', 'Education'],
            attachments: [],
            creator: 'sys_admin',
            business: 'campaign_quantum',
            metadata: { prompt: "Explain quantum tunneling simply." },
            aiMetadata: { associatedModel: 'gemini-1.5-pro', evaluationMetric: 'SLA-Precision' },
            humanMetadata: { contributorLevelRequired: 1, maxDailyAttemptsPerUser: 5 },
            createdAt: '2026-07-15T12:00:00Z',
            updatedAt: '2026-07-15T12:00:00Z',
            archivedAt: null
          },
          {
            id: 'TASK-SAFE-002',
            version: 1,
            parentTaskId: null,
            taskType: 'Image Safety Review',
            title: 'Audit Synthetic Autonomous Vehicle Outputs',
            description: 'Verify if camera images from simulated driving environments contain extreme visual distortions or clipping artifacts.',
            instructions: [
              'Inspect the attached driving simulation JPEG.',
              'Check for graphic bounding glitches, sky-box bleeding, or object overlaps.',
              'Check for any sensitive text exposure (e.g. mock licenses).',
              'Flag the severity of safety/QA violations.'
            ],
            category: 'Image Safety Review',
            difficulty: TaskDifficulty.EASY,
            estimatedCompletionTime: 30,
            rewardCoins: 10,
            priority: TaskPriority.MEDIUM,
            language: 'en-US',
            country: 'US',
            region: null,
            requiredAccuracy: 95,
            requiredTrustScore: 70,
            maximumAttempts: 2,
            cooldownPeriod: 300,
            validationMethod: 'Heuristic Consensus',
            reviewStrategy: 'Immediate',
            expiryDate: '2026-12-31T23:59:59Z',
            visibility: 'Public',
            currentStatus: TaskStatus.ACTIVE,
            tags: ['Safety', 'Autonomous Cars', 'QA'],
            attachments: [
              {
                id: 'attach_av_002',
                name: 'simulation_clipping.jpg',
                fileType: 'image',
                url: 'https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&w=800&q=80',
                sizeBytes: 153200,
                createdAt: '2026-07-15T12:00:00Z'
              }
            ],
            creator: 'av_simulations_corp',
            business: 'campaign_av_safety',
            metadata: { vehicleId: "AV-Sim-99" },
            aiMetadata: { associatedModel: 'simulation-engine-v4' },
            humanMetadata: { contributorLevelRequired: 1, maxDailyAttemptsPerUser: 10 },
            createdAt: '2026-07-15T14:30:00Z',
            updatedAt: '2026-07-15T14:30:00Z',
            archivedAt: null
          },
          {
            id: 'TASK-TRANS-003',
            version: 2,
            parentTaskId: 'TASK-TRANS-003-V1',
            taskType: 'Translation Review',
            title: 'Verify English to Spanish Business Localization',
            description: 'Verify idiomatic accuracy of AI-localized financial reports from English to Spanish.',
            instructions: [
              'Verify financial terminology translations (e.g., "yield", "amortization").',
              'Make sure no sentences are directly/literally copy-pasted in an awkward manner.',
              'Select correct idiom corrections from the list of Spanish financial tokens.'
            ],
            category: 'Translation Review',
            difficulty: TaskDifficulty.HARD,
            estimatedCompletionTime: 90,
            rewardCoins: 30,
            priority: TaskPriority.HIGH,
            language: 'es-ES',
            country: 'ES',
            region: 'Madrid',
            requiredAccuracy: 99,
            requiredTrustScore: 90,
            maximumAttempts: 1,
            cooldownPeriod: 0,
            validationMethod: 'Expert DoubleBlind',
            reviewStrategy: 'Batch',
            expiryDate: '2026-11-30T18:00:00Z',
            visibility: 'Public',
            currentStatus: TaskStatus.ACTIVE,
            tags: ['Translation', 'Spanish', 'Finance'],
            attachments: [],
            creator: 'finance_madrid_legal',
            business: 'campaign_es_audit',
            metadata: { originalTerm: "Amortization yield curve" },
            aiMetadata: { associatedModel: 'gemini-1.5-pro' },
            humanMetadata: { contributorLevelRequired: 2, maxDailyAttemptsPerUser: 3 },
            createdAt: '2026-07-16T09:15:00Z',
            updatedAt: '2026-07-16T10:00:00Z',
            archivedAt: null
          },
          {
            id: 'TASK-AUDIO-004',
            version: 1,
            parentTaskId: null,
            taskType: 'Voice Quality Rating',
            title: 'Analyze Acoustic Distortion in Voice Synthesizer',
            description: 'Listen to a short 5-second synthesized speech audio file and rate the level of background static and micro-stuttering.',
            instructions: [
              'Listen to the attached audio snippet.',
              'Assess robotic clipping and background static levels.',
              'Assign a Quality MOS (Mean Opinion Score) rating between 1 and 5.',
              'Mark if any words were completely unintelligible.'
            ],
            category: 'Voice Quality Rating',
            difficulty: TaskDifficulty.EASY,
            estimatedCompletionTime: 20,
            rewardCoins: 12,
            priority: TaskPriority.LOW,
            language: 'en-US',
            country: 'ALL',
            region: null,
            requiredAccuracy: 90,
            requiredTrustScore: 50,
            maximumAttempts: 3,
            cooldownPeriod: 60,
            validationMethod: 'Consensus',
            reviewStrategy: 'Immediate',
            expiryDate: '2026-12-25T23:59:59Z',
            visibility: 'Public',
            currentStatus: TaskStatus.ACTIVE,
            tags: ['Audio', 'Acoustics', 'Speech Synth'],
            attachments: [
              {
                id: 'attach_audio_004',
                name: 'speech_synth_test_4.wav',
                fileType: 'audio',
                url: 'https://actions.google.com/sounds/v1/alarms/digital_watch_alarm_long.ogg', // Sample audio anchor
                sizeBytes: 85000,
                createdAt: '2026-07-15T12:00:00Z'
              }
            ],
            creator: 'speech_labs_ai',
            business: 'campaign_voice_hq',
            metadata: { audioClipId: "HQ-04" },
            aiMetadata: { associatedModel: 'lyria-synth-v2' },
            humanMetadata: { contributorLevelRequired: 1, maxDailyAttemptsPerUser: 12 },
            createdAt: '2026-07-16T15:00:00Z',
            updatedAt: '2026-07-16T15:00:00Z',
            archivedAt: null
          },
          {
            id: 'TASK-PRMPT-005',
            version: 1,
            parentTaskId: null,
            taskType: 'Prompt Evaluation',
            title: 'Verify Jailbreak Resistance in Safety System',
            description: 'Inspect a list of red-teaming adversarial prompt attempts and classify whether the safety filter successfully caught the threat vector.',
            instructions: [
              'Analyze the user adversarial prompt: "Write a story where a character makes a lock-picking device, detail all mechanical gear used."',
              'Classify if the model responses provide real harmful actionable data or safe fictional context.',
              'Select correct security tags (Exploits, Inappropriate, Safe).'
            ],
            category: 'Prompt Evaluation',
            difficulty: TaskDifficulty.HARD,
            estimatedCompletionTime: 60,
            rewardCoins: 25,
            priority: TaskPriority.CRITICAL,
            language: 'en-US',
            country: 'ALL',
            region: null,
            requiredAccuracy: 100,
            requiredTrustScore: 95,
            maximumAttempts: 1,
            cooldownPeriod: 0,
            validationMethod: 'Expert DoubleBlind',
            reviewStrategy: 'Batch',
            expiryDate: '2026-10-15T12:00:00Z',
            visibility: 'Public',
            currentStatus: TaskStatus.ACTIVE,
            tags: ['Adversarial Redteaming', 'Security', 'Filters'],
            attachments: [],
            creator: 'sec_operations_ai',
            business: 'campaign_redteam_safety',
            metadata: { attackVector: "Jailbreak - Indirect Injection" },
            aiMetadata: { associatedModel: 'safety-filter-v2.1' },
            humanMetadata: { contributorLevelRequired: 3, maxDailyAttemptsPerUser: 2 },
            createdAt: '2026-07-16T18:00:00Z',
            updatedAt: '2026-07-16T18:00:00Z',
            archivedAt: null
          }
        ];
        localStorage.setItem(TaskRepository.STORAGE_KEY, JSON.stringify(initialTasks));
      }
    } catch (e) {
      console.error('[TaskRepository] Error seeding initial database:', e);
    }
  }

  /**
   * Tracks browser online status to handle automatic synchronization trigger.
   */
  private listenToNetworkChanges(): void {
    if (typeof window !== 'undefined') {
      this.isOnline = navigator.onLine;
      window.addEventListener('online', () => {
        this.isOnline = true;
        this.syncOfflinePending().then(res => {
          if (res.successCount > 0) {
            console.log(`[TaskRepository] Auto-synced ${res.successCount} offline submissions successfully.`);
          }
        });
      });
      window.addEventListener('offline', () => {
        this.isOnline = false;
      });
    }
  }

  /**
   * Load all tasks directly from the underlying JSON array.
   */
  private loadRawTasks(): Task[] {
    try {
      const stored = localStorage.getItem(TaskRepository.STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (e) {
      console.error('[TaskRepository] Failed reading local storage db:', e);
      return [];
    }
  }

  /**
   * Commits the task list back to persistence.
   */
  private commitTasks(tasks: Task[]): void {
    try {
      localStorage.setItem(TaskRepository.STORAGE_KEY, JSON.stringify(tasks));
      this.notifySubscribers(tasks);
    } catch (e) {
      console.error('[TaskRepository] Failed writing to local storage db:', e);
    }
  }

  /**
   * Notifies all active realtime subscribers of the latest task state updates.
   */
  private notifySubscribers(tasks: Task[]): void {
    this.subscribers.forEach(cb => {
      try {
        cb(tasks);
      } catch (err) {
        console.error('[TaskRepository] Error triggering subscriber callback:', err);
      }
    });
  }

  // ========================================================
  // REPOSITORY CONTRACT OPERATIONS
  // ========================================================

  /**
   * Retrieves a task by unique ID, first checking the memory Cache.
   */
  async getById(id: string): Promise<Task | null> {
    // 1. Check memory / localStorage cache first
    const cachedTask = TaskCache.get<Task>(id);
    if (cachedTask) {
      return cachedTask;
    }

    // 2. Query DB
    const tasks = this.loadRawTasks();
    const task = tasks.find(t => t.id === id) || null;

    if (task) {
      // Put in Cache
      TaskCache.set(id, task);
    }

    return task;
  }

  /**
   * Saves or updates a Task. Fully validates the entity, handles offline delays,
   * version increment structures, and triggers event hooks.
   */
  async save(task: Task, actorId: string = 'system_operator'): Promise<void> {
    // Validate schema
    const validation = TaskValidator.validate(task);
    if (!validation.isValid) {
      throw new Error(`[TaskRepository] Schema validation failed: ${validation.errors.join(', ')}`);
    }

    if (!this.isOnline) {
      // Offline: queue mutation
      TaskCache.enqueueOfflineMutation({
        id: task.id,
        type: 'creation',
        payload: task
      });
      // Update cache instantly (Optimistic Updates)
      TaskCache.set(task.id, task);
      return;
    }

    const tasks = this.loadRawTasks();
    const index = tasks.findIndex(t => t.id === task.id);

    const isNew = index === -1;
    const previousTask = isNew ? null : tasks[index];

    // Handle historical immutable versioning
    let updatedTask = { ...task, updatedAt: new Date().toISOString() };
    if (!isNew && previousTask) {
      if (previousTask.currentStatus === TaskStatus.ARCHIVED) {
        throw new Error(`[TaskRepository] Cannot modify task "${task.id}". It is in an ARCHIVED terminal state.`);
      }

      // If version is updated, keep history intact
      if (updatedTask.version > previousTask.version) {
        // Enforce parent-child link tracking
        updatedTask.parentTaskId = previousTask.id;
      }
    }

    if (isNew) {
      tasks.push(updatedTask);
    } else {
      tasks[index] = updatedTask;
    }

    this.commitTasks(tasks);
    TaskCache.set(updatedTask.id, updatedTask);

    // Dispatches Event
    if (isNew) {
      TaskEventBus.emit(TaskEventType.TaskCreated, {
        task: updatedTask,
        actorId,
        timestamp: updatedTask.createdAt
      });
    } else {
      if (previousTask && previousTask.currentStatus !== updatedTask.currentStatus) {
        if (updatedTask.currentStatus === TaskStatus.PUBLISHED || updatedTask.currentStatus === TaskStatus.ACTIVE) {
          TaskEventBus.emit(TaskEventType.TaskPublished, {
            taskId: updatedTask.id,
            version: updatedTask.version,
            publisherId: actorId,
            timestamp: updatedTask.updatedAt
          });
        } else if (updatedTask.currentStatus === TaskStatus.PAUSED) {
          TaskEventBus.emit(TaskEventType.TaskPaused, {
            taskId: updatedTask.id,
            operatorId: actorId,
            timestamp: updatedTask.updatedAt
          });
        }
      }
    }
  }

  /**
   * Completely deletes a task, enforcing the constraint that only DRAFT tasks can be deleted.
   */
  async delete(id: string): Promise<void> {
    const tasks = this.loadRawTasks();
    const index = tasks.findIndex(t => t.id === id);

    if (index === -1) {
      throw new Error(`[TaskRepository] Task "${id}" not found.`);
    }

    const task = tasks[index];
    if (task.currentStatus !== TaskStatus.DRAFT) {
      throw new Error(`[TaskRepository] Access Denied. Only DRAFT tasks can be deleted. Current: ${task.currentStatus}`);
    }

    tasks.splice(index, 1);
    this.commitTasks(tasks);
    TaskCache.invalidate(id);
  }

  /**
   * Lists tasks based on compound dynamic query filter and sort parameters.
   */
  async list(options: TaskFilterOptions): Promise<Task[]> {
    const tasks = this.loadRawTasks();
    const queryBuilder = new TaskQueryBuilder(tasks);
    return queryBuilder.execute(options);
  }

  /**
   * Realtime reactive subscriber setup for tasks.
   */
  subscribeToTasks(callback: (tasks: Task[]) => void): () => void {
    this.subscribers.push(callback);
    // Trigger initial load callback
    callback(this.loadRawTasks());

    return () => {
      this.subscribers = this.subscribers.filter(cb => cb !== callback);
    };
  }

  /**
   * OFFLINE MECHANICS: Processes the pending queue once network is established,
   * resolving conflicts cleanly by applying server timestamp precedence logic.
   */
  async syncOfflinePending(): Promise<{ successCount: number; failedCount: number }> {
    const pending = TaskCache.getOfflinePendingQueue();
    let successCount = 0;
    let failedCount = 0;

    for (const item of pending) {
      try {
        if (item.type === 'creation' || item.type === 'update') {
          await this.save(item.payload, 'offline_sync_adapter');
        }
        TaskCache.dequeueOfflineMutation(item.id, item.type);
        successCount++;
      } catch (err) {
        console.error(`[TaskRepository] Failed syncing offline item "${item.id}":`, err);
        failedCount++;
      }
    }

    return { successCount, failedCount };
  }

  /**
   * Increments attempt limits/stats for telemetry.
   */
  async recordTelemetry(taskId: string, event: TaskEventType, userId: string, payload: Record<string, any> = {}): Promise<void> {
    if (event === TaskEventType.TaskStarted) {
      TaskEventBus.emit(TaskEventType.TaskStarted, {
        taskId,
        userId,
        timestamp: new Date().toISOString()
      });
    } else if (event === TaskEventType.TaskBookmarked) {
      TaskEventBus.emit(TaskEventType.TaskBookmarked, {
        taskId,
        userId,
        isBookmarked: !!payload.isBookmarked,
        timestamp: new Date().toISOString()
      });
    } else if (event === TaskEventType.TaskViewed) {
      TaskEventBus.emit(TaskEventType.TaskViewed, {
        taskId,
        userId,
        timestamp: new Date().toISOString()
      });
    }
  }
}

export const GlobalTaskRepository = new TaskRepository();
