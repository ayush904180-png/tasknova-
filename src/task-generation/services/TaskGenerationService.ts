/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { TaskGenPipeline, GeneratedTaskEntity, DatasetChunk, TaskGenPipelineStatus, GeneratedTaskStatus, TaskTemplate } from '../types';
import { GlobalTaskGenerationRepository } from '../repositories/TaskGenerationRepository';
import { ChunkingEngine } from '../utils/ChunkingEngine';
import { TaskGenerationValidator } from '../validators/TaskGenerationValidator';
import { TaskGenerationMapper } from '../mappers/TaskGenerationMapper';
import { TaskGenerationEventBus, TaskGenEventType } from '../events/TaskGenerationEventBus';
import { GlobalTaskRepository } from '../../tasks/repositories/TaskRepository';
import { TaskDifficulty, TaskPriority } from '../../types/tasks';

export class TaskGenerationService {
  /**
   * Spawns a background simulated thread to analyze datasets, create chunks,
   * predict parameters, validate quality, and output pending review microtasks.
   */
  async runInferencePipeline(
    name: string,
    datasetId: string,
    datasetName: string,
    taskType: string,
    templateId: string,
    sourceContent: string,
    customMediaUrls: string[] = []
  ): Promise<string> {
    const pipelineId = `PIPE-INFERENCE-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

    // Load template
    const templates = GlobalTaskGenerationRepository.loadTemplates();
    const template = templates.find(t => t.id === templateId);

    // Initial Pipeline config
    const pipeline: TaskGenPipeline = {
      id: pipelineId,
      name,
      datasetId,
      datasetName,
      status: TaskGenPipelineStatus.ANALYZING,
      taskType,
      templateId,
      chunkSize: 1,
      totalRows: 0,
      generatedCount: 0,
      approvedCount: 0,
      rejectedCount: 0,
      avgDifficulty: template?.difficulty || TaskDifficulty.EASY,
      avgRewardCoins: template?.rewardCoins || 10,
      estimatedCost: 0,
      progressPercentage: 5,
      telemetryLogs: [`[${new Date().toLocaleTimeString()}] Pipeline triggered.`],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    // Save initial pipeline record
    await GlobalTaskGenerationRepository.createPipeline(pipeline);

    // Run Asynchronously/Simulated Step-by-Step with logs
    setTimeout(async () => {
      try {
        // Step 1: Dataset Analysis
        await GlobalTaskGenerationRepository.updatePipelineStatus(
          pipelineId, 
          TaskGenPipelineStatus.ANALYZING, 
          'Step 1/12: Running high-speed statistical scan over dataset records...'
        );
        TaskGenerationEventBus.emit(TaskGenEventType.DatasetAnalyzed, {
          pipelineId,
          rowCount: customMediaUrls.length > 0 ? customMediaUrls.length : 15,
          columnCount: 5,
          timestamp: new Date().toISOString()
        });

        // Step 2: Schema Detection
        await sleep(1000);
        await GlobalTaskGenerationRepository.updatePipelineStatus(
          pipelineId, 
          TaskGenPipelineStatus.ANALYZING, 
          'Step 2/12: Identifying data schemas, field constraints and key bounds.'
        );

        // Step 3: Content Chunking
        await sleep(1000);
        await GlobalTaskGenerationRepository.updatePipelineStatus(
          pipelineId, 
          TaskGenPipelineStatus.CHUNKING, 
          'Step 3/12: Chunking files into isolated independent microtask contexts...'
        );

        let chunks: DatasetChunk[] = [];
        if (customMediaUrls && customMediaUrls.length > 0) {
          const type = taskType.toLowerCase().includes('image') ? 'image' : 
                       taskType.toLowerCase().includes('voice') || taskType.toLowerCase().includes('audio') ? 'audio' : 'video';
          chunks = ChunkingEngine.chunkMedia(customMediaUrls, pipelineId, type);
        } else if (sourceContent && sourceContent.trim().length > 0) {
          if (sourceContent.startsWith('[') || sourceContent.startsWith('{')) {
            chunks = ChunkingEngine.chunkJSON(sourceContent, pipelineId);
          } else if (sourceContent.includes(',') && sourceContent.includes('\n')) {
            chunks = ChunkingEngine.chunkCSV(sourceContent, pipelineId);
          } else {
            chunks = ChunkingEngine.chunkTextOrPDF(sourceContent, pipelineId);
          }
        }

        // Fallback mock seeds if no content or parsed empty
        if (chunks.length === 0) {
          const sampleMimes = ['image/png', 'application/json', 'text/csv'];
          for (let i = 0; i < 8; i++) {
            const rowContent = `Row record entry data indices #${i} placeholder`;
            chunks.push({
              id: `chunk-mock-${pipelineId}-${i}`,
              pipelineId,
              index: i,
              content: rowContent,
              mimeType: sampleMimes[i % sampleMimes.length],
              hash: ChunkingEngine.generateHash(rowContent),
              createdAt: new Date().toISOString()
            });
          }
        }

        // Log chunk completions
        chunks.forEach(c => {
          TaskGenerationEventBus.emit(TaskGenEventType.ChunkCreated, { chunk: c, timestamp: new Date().toISOString() });
        });

        // Update total rows count
        const pipelines = GlobalTaskGenerationRepository.loadPipelines();
        const pIdx = pipelines.findIndex(p => p.id === pipelineId);
        if (pIdx !== -1) {
          pipelines[pIdx].totalRows = chunks.length;
          pipelines[pIdx].progressPercentage = 30;
          GlobalTaskGenerationRepository.savePipelines(pipelines);
        }

        // Step 4-7: AI Parameter estimation, safety analysis, classification
        await sleep(1200);
        await GlobalTaskGenerationRepository.updatePipelineStatus(
          pipelineId, 
          TaskGenPipelineStatus.CLASSIFYING, 
          'Step 4/12: Classifying semantic properties and filtering out offensive records.'
        );

        await sleep(1000);
        await GlobalTaskGenerationRepository.updatePipelineStatus(
          pipelineId, 
          TaskGenPipelineStatus.ESTIMATING, 
          'Step 5/12: Estimating completion complexity scores and predicting reward models.'
        );

        // Map and Generate Tasks
        const generatedTasks: GeneratedTaskEntity[] = chunks.map((chunk, index) => {
          // Task attributes predicted by smart engine
          const anomalyScore = parseFloat((Math.random() * 0.15).toFixed(3));
          const confidence = parseFloat((0.85 + Math.random() * 0.14).toFixed(3));
          const indexNum = index + 1;

          // Resolve variables from template
          const baseCoins = template?.rewardCoins || 12;
          const finalCoins = Math.round(baseCoins * (1 + (anomalyScore > 0.1 ? 0.2 : 0))); // Bonus for anomaly review tasks

          // Create complete task entity
          const taskEntity: GeneratedTaskEntity = {
            id: `GENTASK-${pipelineId}-V1-${indexNum}`,
            pipelineId,
            datasetId,
            chunkId: chunk.id,
            taskType,
            title: `${template?.name || taskType} Candidate - Case #${indexNum}`,
            description: `${template?.description || 'Review and annotate provided chunk dataset elements.'} (Chunk hash: ${chunk.hash.substring(0, 8)})`,
            instructions: template?.instructions || ['Analyze provided chunk detail parameters and record correct annotation labels.'],
            difficulty: template?.difficulty || TaskDifficulty.EASY,
            estimatedCompletionTime: template?.estimatedCompletionTime || 30,
            contributorLevelRequired: template?.difficulty === TaskDifficulty.HARD ? 2 : 1,
            minimumTrustScore: template?.difficulty === TaskDifficulty.HARD ? 85 : 75,
            requiredAccuracy: 95,
            estimatedConsensusCount: 3,
            qualityThreshold: 90,
            rewardCoins: finalCoins,
            priority: anomalyScore > 0.12 ? TaskPriority.HIGH : TaskPriority.MEDIUM,
            expectedCost: finalCoins,
            language: template?.language || 'en-US',
            country: template?.country || 'ALL',
            status: GeneratedTaskStatus.PENDING,
            validationRules: template?.validationRules || { threshold: 0.7 },
            attachments: chunk.mediaUrl ? [
              {
                id: `attach-${pipelineId}-${indexNum}`,
                name: `source_image_${indexNum}.jpg`,
                fileType: 'image',
                url: chunk.mediaUrl,
                sizeBytes: 154000,
                createdAt: new Date().toISOString()
              }
            ] : [],
            metadata: { 
              chunkValue: chunk.content, 
              originalIndex: chunk.index, 
              hash: chunk.hash 
            },
            aiMetadata: {
              associatedModel: 'gemini-1.5-flash',
              anomalyScore,
              duplicateScore: 0.02,
              confidenceScore: confidence,
              validationFeedback: 'Telemetry: Schema matched cleanly.'
            },
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          };

          // Step 8: Reward Calculation Telemetry
          TaskGenerationEventBus.emit(TaskGenEventType.RewardCalculated, {
            taskId: taskEntity.id,
            originalCoins: baseCoins,
            calculatedCoins: finalCoins,
            priorityBonus: finalCoins - baseCoins,
            timestamp: new Date().toISOString()
          });

          // Step 9: QA Validation Checks
          const validation = TaskGenerationValidator.validate(taskEntity);
          TaskGenerationEventBus.emit(TaskGenEventType.TaskValidated, {
            taskId: taskEntity.id,
            isValid: validation.isValid,
            warnings: validation.warnings,
            timestamp: new Date().toISOString()
          });

          // Emit task creation
          TaskGenerationEventBus.emit(TaskGenEventType.TaskCreated, { task: taskEntity, timestamp: new Date().toISOString() });

          return taskEntity;
        });

        // Add generated tasks to repository
        await GlobalTaskGenerationRepository.addGeneratedTasks(generatedTasks);

        // Update Pipeline stats
        const currentPipelines = GlobalTaskGenerationRepository.loadPipelines();
        const curIdx = currentPipelines.findIndex(p => p.id === pipelineId);
        if (curIdx !== -1) {
          const estimatedCost = generatedTasks.reduce((sum, t) => sum + t.expectedCost, 0);
          currentPipelines[curIdx].generatedCount = generatedTasks.length;
          currentPipelines[curIdx].estimatedCost = estimatedCost;
          currentPipelines[curIdx].progressPercentage = 100;
          currentPipelines[curIdx].status = TaskGenPipelineStatus.REVIEW_PENDING;
          currentPipelines[curIdx].updatedAt = new Date().toISOString();
          currentPipelines[curIdx].telemetryLogs.push(`[${new Date().toLocaleTimeString()}] Generation completed successfully.`);
          GlobalTaskGenerationRepository.savePipelines(currentPipelines);
        }

        // Step 10: Generation completed event
        TaskGenerationEventBus.emit(TaskGenEventType.GenerationCompleted, {
          pipelineId,
          totalCreated: generatedTasks.length,
          successRate: 100,
          timestamp: new Date().toISOString()
        });

      } catch (err: any) {
        console.error('[TaskGenerationService] Failure during pipeline processing:', err);
        await GlobalTaskGenerationRepository.updatePipelineStatus(
          pipelineId, 
          TaskGenPipelineStatus.FAILED, 
          `Pipeline failed: ${err?.message || 'Unknown processing anomaly'}`
        );
      }
    }, 100);

    return pipelineId;
  }

  /**
   * Publishes an approved generated task straight to the public task marketplace database,
   * triggering real-time subscribers inside Task Context without breaking compatibility.
   */
  async publishTaskToMarketplace(id: string, actorId = 'operator'): Promise<boolean> {
    const genTasks = GlobalTaskGenerationRepository.loadTasks();
    const taskIndex = genTasks.findIndex(t => t.id === id);

    if (taskIndex === -1) {
      throw new Error(`[TaskGenerationService] Task "${id}" not found.`);
    }

    const genTask = genTasks[taskIndex];
    if (genTask.status === GeneratedTaskStatus.PUBLISHED) {
      return false; // Already published
    }

    // Convert and save inside Marketplace TaskRepository
    const marketplaceTask = TaskGenerationMapper.toMarketplaceTask(genTask);
    await GlobalTaskRepository.save(marketplaceTask, actorId);

    // Update status in local generator
    genTasks[taskIndex].status = GeneratedTaskStatus.PUBLISHED;
    genTasks[taskIndex].publishedTaskId = marketplaceTask.id;
    genTasks[taskIndex].updatedAt = new Date().toISOString();
    GlobalTaskGenerationRepository.saveTasks(genTasks);

    // Update Pipeline counters
    const pipelines = GlobalTaskGenerationRepository.loadPipelines();
    const pipeIdx = pipelines.findIndex(p => p.id === genTask.pipelineId);
    if (pipeIdx !== -1) {
      pipelines[pipeIdx].approvedCount += 1;
      // If all tasks are approved/published, mark pipeline published
      const pipeTasks = genTasks.filter(t => t.pipelineId === genTask.pipelineId);
      const nonPublished = pipeTasks.filter(t => t.status !== GeneratedTaskStatus.PUBLISHED && t.status !== GeneratedTaskStatus.REJECTED);
      if (nonPublished.length === 0) {
        pipelines[pipeIdx].status = TaskGenPipelineStatus.PUBLISHED;
      }
      GlobalTaskGenerationRepository.savePipelines(pipelines);
    }

    // Trigger Telemetry
    TaskGenerationEventBus.emit(TaskGenEventType.TaskPublished, {
      taskId: id,
      marketplaceTaskId: marketplaceTask.id,
      publisherId: actorId,
      timestamp: new Date().toISOString()
    });

    return true;
  }

  /**
   * Bulk publishes selected tasks
   */
  async bulkPublish(ids: string[], actorId = 'bulk_operator'): Promise<{ successCount: number; failedCount: number }> {
    let successCount = 0;
    let failedCount = 0;

    for (const id of ids) {
      try {
        const ok = await this.publishTaskToMarketplace(id, actorId);
        if (ok) successCount++;
        else failedCount++;
      } catch (e) {
        console.error(`[TaskGenerationService] Bulk publish failed for task ${id}`, e);
        failedCount++;
      }
    }

    return { successCount, failedCount };
  }
}

function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export const GlobalTaskGenerationService = new TaskGenerationService();
