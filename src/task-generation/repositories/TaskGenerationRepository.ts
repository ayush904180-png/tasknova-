/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { TaskGenPipeline, GeneratedTaskEntity, TaskTemplate, TaskGenPipelineStatus, GeneratedTaskStatus } from '../types';
import { TaskGenerationCache } from '../cache/TaskGenerationCache';
import { TaskGenerationEventBus, TaskGenEventType } from '../events/TaskGenerationEventBus';
import { TaskDifficulty, TaskPriority } from '../../types/tasks';

export class TaskGenerationRepository {
  private static STORAGE_PIPELINES_KEY = 'tasknova_gen_pipelines';
  private static STORAGE_TASKS_KEY = 'tasknova_gen_tasks';
  private static STORAGE_TEMPLATES_KEY = 'tasknova_gen_templates';

  private subscribers: Array<() => void> = [];

  constructor() {
    this.initializeLocalDatabase();
  }

  private initializeLocalDatabase(): void {
    try {
      // 1. Initialize Reusable Templates
      const storedTemplates = localStorage.getItem(TaskGenerationRepository.STORAGE_TEMPLATES_KEY);
      if (!storedTemplates) {
        const defaultTemplates: TaskTemplate[] = [
          {
            id: 'TEMP-RLHF',
            name: 'RLHF Pairwise Ranking Model Feedback',
            description: 'Evaluate and rank model outputs based on truthfulness, helpfulness, and safety guidelines.',
            taskType: 'RLHF Ranking',
            instructions: [
              'Carefully review the prompt context.',
              'Compare Response A and Response B closely.',
              'Assess hallucination risks and helpfulness scores.',
              'Select the preferred response and write a short justification.'
            ],
            examples: [
              { input: 'Prompt: What is water made of?', output: 'Response A is direct. Response B is overly complicated. Select Response A.' }
            ],
            acceptedAnswers: ['Response A Preferred', 'Response B Preferred', 'Equally High Quality', 'Equally Low Quality'],
            validationRules: { consensusThreshold: 0.7 },
            attachments: [],
            language: 'en-US',
            country: 'ALL',
            difficulty: TaskDifficulty.MEDIUM,
            estimatedCompletionTime: 45,
            rewardCoins: 15
          },
          {
            id: 'TEMP-CV-SAFETY',
            name: 'Autonomous Vehicle Visual Safety Audit',
            description: 'Audit computer vision images for artifacts, safety warning violations, or camera blurs.',
            taskType: 'Image Safety Review',
            instructions: [
              'Examine the attached camera frame.',
              'Determine if there are camera visual occlusions (rain, smudge, glare).',
              'Check for synthetic anomalies or clipping.',
              'Tag severity level: Clean, Low Artifacts, Critical Glitch.'
            ],
            examples: [],
            acceptedAnswers: ['Clean', 'Low Artifacts', 'Critical Glitch'],
            validationRules: { requiredAccuracy: 98 },
            attachments: [],
            language: 'en-US',
            country: 'US',
            difficulty: TaskDifficulty.EASY,
            estimatedCompletionTime: 20,
            rewardCoins: 10
          },
          {
            id: 'TEMP-TEXT-SESS',
            name: 'Multilingual Document Translation Audit',
            description: 'Review AI translated business files to verify spelling, dialect localization, and phrasing alignment.',
            taskType: 'Translation Review',
            instructions: [
              'Inspect original language paragraph and localized target translation.',
              'Highlight any awkwardly direct words.',
              'Provide dialectal correction suggestions.'
            ],
            examples: [],
            acceptedAnswers: ['Approved - High Quality', 'Rejected - Needs Revision', 'Contains Slang Anomalies'],
            validationRules: { minScoreRequired: 85 },
            attachments: [],
            language: 'es-ES',
            country: 'ES',
            difficulty: TaskDifficulty.HARD,
            estimatedCompletionTime: 90,
            rewardCoins: 30
          }
        ];
        localStorage.setItem(TaskGenerationRepository.STORAGE_TEMPLATES_KEY, JSON.stringify(defaultTemplates));
      }

      // 2. Initialize Pipelines
      const storedPipelines = localStorage.getItem(TaskGenerationRepository.STORAGE_PIPELINES_KEY);
      if (!storedPipelines) {
        const initialPipelines: TaskGenPipeline[] = [
          {
            id: 'PIPE-RLHF-001',
            name: 'Continuous Model Guardrails RLHF pipeline',
            datasetId: 'DATA-NLP-001',
            datasetName: 'Quantum Explanations V1 Feedback',
            status: TaskGenPipelineStatus.PUBLISHED,
            taskType: 'RLHF Ranking',
            templateId: 'TEMP-RLHF',
            chunkSize: 1,
            totalRows: 50,
            generatedCount: 50,
            approvedCount: 45,
            rejectedCount: 5,
            avgDifficulty: TaskDifficulty.MEDIUM,
            avgRewardCoins: 15,
            estimatedCost: 750,
            progressPercentage: 100,
            telemetryLogs: [
              'Pipeline initialized with dataset ID DATA-NLP-001.',
              'Schema validation: NLP text layout detected.',
              'Generated 50 microtask candidate chunks.',
              'Smart AI analysis finished: medium complexity assigned.',
              'SOC-2 continuous audit verification completed successfully.'
            ],
            createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
            updatedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString()
          },
          {
            id: 'PIPE-CV-002',
            name: 'Autonomous Driving Image Artifact audit',
            datasetId: 'DATA-CV-002',
            datasetName: 'Synthetic Roadway Simulation Assets',
            status: TaskGenPipelineStatus.REVIEW_PENDING,
            taskType: 'Image Safety Review',
            templateId: 'TEMP-CV-SAFETY',
            chunkSize: 1,
            totalRows: 15,
            generatedCount: 15,
            approvedCount: 0,
            rejectedCount: 0,
            avgDifficulty: TaskDifficulty.EASY,
            avgRewardCoins: 10,
            estimatedCost: 150,
            progressPercentage: 100,
            telemetryLogs: [
              'Pipeline configured. Connecting Unsplash/Drive reference indices.',
              'Analyzing camera feeds dataset...',
              'Completed 15 target chunk allocations without overlaps.',
              'AI Difficulty predicting: Easy scale.',
              'Ready for final human evaluation review.'
            ],
            createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
            updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
          }
        ];
        localStorage.setItem(TaskGenerationRepository.STORAGE_PIPELINES_KEY, JSON.stringify(initialPipelines));
      }

      // 3. Initialize Generated Tasks
      const storedTasks = localStorage.getItem(TaskGenerationRepository.STORAGE_TASKS_KEY);
      if (!storedTasks) {
        const initialTasks: GeneratedTaskEntity[] = [];
        
        // Let's populate mock tasks for PIPE-CV-002 to show in Review Center!
        for (let i = 1; i <= 15; i++) {
          initialTasks.push({
            id: `GENTASK-CV-002-SUB-${i}`,
            pipelineId: 'PIPE-CV-002',
            datasetId: 'DATA-CV-002',
            chunkId: `chunk-media-image-PIPE-CV-002-${i}`,
            taskType: 'Image Safety Review',
            title: `Audit Simulation Camera Frame #${i}`,
            description: `Verify visual safety alignment and camera rendering glitch rates on synthetic autonomous vehicle simulation feed sample #${i}.`,
            instructions: [
              'Review the attached simulation scene snapshot.',
              'Assess rendering glitch levels (bounding boxes overlaps, sky box bleeding, blocky segments).',
              'Rate severity classification appropriately.'
            ],
            difficulty: TaskDifficulty.EASY,
            estimatedCompletionTime: 20,
            contributorLevelRequired: 1,
            minimumTrustScore: 70,
            requiredAccuracy: 95,
            estimatedConsensusCount: 3,
            qualityThreshold: 90,
            rewardCoins: 10,
            priority: TaskPriority.MEDIUM,
            expectedCost: 10,
            language: 'en-US',
            country: 'US',
            status: GeneratedTaskStatus.PENDING,
            validationRules: { consensusNeeded: 3 },
            attachments: [
              {
                id: `attach-gen-cv-${i}`,
                name: `frame_${i}.jpg`,
                fileType: 'image',
                url: `https://images.unsplash.com/photo-${1600000000000 + i * 50000}?auto=format&fit=crop&w=800&q=80`,
                sizeBytes: 245000,
                createdAt: new Date().toISOString()
              }
            ],
            metadata: { frameIndex: i, environment: 'Rainy Night Cityscape' },
            aiMetadata: {
              associatedModel: 'gemini-2.0-flash',
              anomalyScore: 0.12,
              duplicateScore: 0.05,
              confidenceScore: 0.94,
              validationFeedback: 'Pass - Visual parameters clear'
            },
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          });
        }

        // Add pre-published tasks of PIPE-RLHF-001
        for (let i = 1; i <= 50; i++) {
          initialTasks.push({
            id: `GENTASK-RLHF-001-SUB-${i}`,
            pipelineId: 'PIPE-RLHF-001',
            datasetId: 'DATA-NLP-001',
            chunkId: `chunk-json-PIPE-RLHF-001-${i}`,
            taskType: 'RLHF Ranking',
            title: `Evaluate NLP Model output consistency #${i}`,
            description: `Audit and score pairwise generated text responses on quantum physics. Check for factual correctness and simplicity.`,
            instructions: [
              'Analyze the prompt request.',
              'Verify response A and response B technical claims.',
              'Identify preferred option and justify.'
            ],
            difficulty: TaskDifficulty.MEDIUM,
            estimatedCompletionTime: 45,
            contributorLevelRequired: 2,
            minimumTrustScore: 85,
            requiredAccuracy: 98,
            estimatedConsensusCount: 5,
            qualityThreshold: 95,
            rewardCoins: 15,
            priority: TaskPriority.HIGH,
            expectedCost: 15,
            language: 'en-US',
            country: 'ALL',
            status: GeneratedTaskStatus.PUBLISHED,
            validationRules: { threshold: 0.8 },
            attachments: [],
            metadata: { index: i },
            aiMetadata: {
              associatedModel: 'gemini-1.5-pro',
              confidenceScore: 0.97
            },
            publishedTaskId: `TASK-RLHF-${100 + i}`,
            createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
            updatedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString()
          });
        }

        localStorage.setItem(TaskGenerationRepository.STORAGE_TASKS_KEY, JSON.stringify(initialTasks));
      }
    } catch (e) {
      console.error('[TaskGenerationRepository] DB Init error:', e);
    }
  }

  // Raw DB interactions with cache fallback
  loadPipelines(): TaskGenPipeline[] {
    const cached = TaskGenerationCache.get<TaskGenPipeline[]>('pipelines');
    if (cached) return cached;
    
    const stored = localStorage.getItem(TaskGenerationRepository.STORAGE_PIPELINES_KEY);
    const parsed = stored ? JSON.parse(stored) : [];
    TaskGenerationCache.set('pipelines', parsed);
    return parsed;
  }

  savePipelines(pipelines: TaskGenPipeline[]): void {
    localStorage.setItem(TaskGenerationRepository.STORAGE_PIPELINES_KEY, JSON.stringify(pipelines));
    TaskGenerationCache.set('pipelines', pipelines);
    this.notifySubscribers();
  }

  loadTasks(): GeneratedTaskEntity[] {
    const cached = TaskGenerationCache.get<GeneratedTaskEntity[]>('tasks');
    if (cached) return cached;

    const stored = localStorage.getItem(TaskGenerationRepository.STORAGE_TASKS_KEY);
    const parsed = stored ? JSON.parse(stored) : [];
    TaskGenerationCache.set('tasks', parsed);
    return parsed;
  }

  saveTasks(tasks: GeneratedTaskEntity[]): void {
    localStorage.setItem(TaskGenerationRepository.STORAGE_TASKS_KEY, JSON.stringify(tasks));
    TaskGenerationCache.set('tasks', tasks);
    this.notifySubscribers();
  }

  loadTemplates(): TaskTemplate[] {
    const cached = TaskGenerationCache.get<TaskTemplate[]>('templates');
    if (cached) return cached;

    const stored = localStorage.getItem(TaskGenerationRepository.STORAGE_TEMPLATES_KEY);
    const parsed = stored ? JSON.parse(stored) : [];
    TaskGenerationCache.set('templates', parsed);
    return parsed;
  }

  saveTemplates(templates: TaskTemplate[]): void {
    localStorage.setItem(TaskGenerationRepository.STORAGE_TEMPLATES_KEY, JSON.stringify(templates));
    TaskGenerationCache.set('templates', templates);
    this.notifySubscribers();
  }

  // REALTIME SUBSCRIPTIONS
  subscribe(callback: () => void): () => void {
    this.subscribers.push(callback);
    return () => {
      this.subscribers = this.subscribers.filter(cb => cb !== callback);
    };
  }

  private notifySubscribers(): void {
    this.subscribers.forEach(cb => cb());
  }

  // PIPELINE OPERATIONS
  async createPipeline(pipeline: TaskGenPipeline): Promise<void> {
    const pipelines = this.loadPipelines();
    pipelines.unshift(pipeline);
    this.savePipelines(pipelines);

    TaskGenerationEventBus.emit(TaskGenEventType.GenerationStarted, {
      pipeline,
      actorId: 'enterprise_api_key',
      timestamp: new Date().toISOString()
    });
  }

  async getPipelineById(id: string): Promise<TaskGenPipeline | null> {
    const pipelines = this.loadPipelines();
    return pipelines.find(p => p.id === id) || null;
  }

  async updatePipelineStatus(id: string, status: TaskGenPipelineStatus, log?: string): Promise<void> {
    const pipelines = this.loadPipelines();
    const idx = pipelines.findIndex(p => p.id === id);
    if (idx !== -1) {
      pipelines[idx].status = status;
      pipelines[idx].updatedAt = new Date().toISOString();
      if (log) {
        pipelines[idx].telemetryLogs.push(`[${new Date().toLocaleTimeString()}] ${log}`);
      }
      this.savePipelines(pipelines);
    }
  }

  // GENERATED TASK OPERATIONS
  async addGeneratedTasks(newTasks: GeneratedTaskEntity[]): Promise<void> {
    const tasks = this.loadTasks();
    tasks.push(...newTasks);
    this.saveTasks(tasks);
  }

  async updateGeneratedTaskStatus(id: string, status: GeneratedTaskStatus, notes?: string, actorId = 'reviewer'): Promise<void> {
    const tasks = this.loadTasks();
    const idx = tasks.findIndex(t => t.id === id);
    if (idx !== -1) {
      tasks[idx].status = status;
      tasks[idx].updatedAt = new Date().toISOString();
      if (notes) {
        tasks[idx].reviewNotes = notes;
      }
      tasks[idx].reviewedBy = actorId;
      tasks[idx].reviewedAt = new Date().toISOString();

      this.saveTasks(tasks);

      if (status === GeneratedTaskStatus.APPROVED) {
        TaskGenerationEventBus.emit(TaskGenEventType.TaskApproved, {
          taskId: id,
          reviewerId: actorId,
          timestamp: new Date().toISOString()
        });
      } else if (status === GeneratedTaskStatus.REJECTED) {
        TaskGenerationEventBus.emit(TaskGenEventType.TaskRejected, {
          taskId: id,
          reviewerId: actorId,
          reason: notes || 'Rejected without notes',
          timestamp: new Date().toISOString()
        });
      }
    }
  }

  async bulkUpdateTasks(ids: string[], status: GeneratedTaskStatus, notes?: string): Promise<void> {
    const tasks = this.loadTasks();
    let modified = false;
    ids.forEach(id => {
      const idx = tasks.findIndex(t => t.id === id);
      if (idx !== -1) {
        tasks[idx].status = status;
        tasks[idx].updatedAt = new Date().toISOString();
        if (notes) tasks[idx].reviewNotes = notes;
        tasks[idx].reviewedBy = 'bulk_system';
        tasks[idx].reviewedAt = new Date().toISOString();
        modified = true;
      }
    });
    if (modified) {
      this.saveTasks(tasks);
    }
  }

  async bulkDeleteTasks(ids: string[]): Promise<void> {
    const tasks = this.loadTasks();
    const filtered = tasks.filter(t => !ids.includes(t.id));
    if (tasks.length !== filtered.length) {
      this.saveTasks(filtered);
    }
  }
}

export const GlobalTaskGenerationRepository = new TaskGenerationRepository();
