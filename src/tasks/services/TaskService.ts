/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Task, TaskStatus, TaskDifficulty, TaskAttachment } from '../../types/tasks';
import { GlobalTaskRepository, TaskRepository } from '../repositories/TaskRepository';
import { TaskAdapter } from '../adapters/TaskAdapter';
import { TaskEventBus, TaskEventType } from '../events/TaskEventBus';
import { TaskCache } from '../cache/TaskCache';

/**
 * Coordination Service coordinating Task operations, Workspace integrations,
 * telemetry, rewards scoring, and Cloud Function contract preparation.
 */
export class TaskService {
  private repository: TaskRepository;

  constructor(repository: TaskRepository = GlobalTaskRepository) {
    this.repository = repository;
  }

  /**
   * Retrieves a task by unique ID.
   */
  async getTask(id: string): Promise<Task | null> {
    return this.repository.getById(id);
  }

  /**
   * Lists tasks with rich filters.
   */
  async getTasks(filters: any = {}): Promise<Task[]> {
    return this.repository.list(filters);
  }

  /**
   * Submits validators answers, triggers reward calculations, logs audit trails,
   * updates XP level progressions, and dispatches the TaskCompleted event.
   */
  async submitTaskWork(
    taskId: string,
    userId: string,
    responsePayload: Record<string, any>,
    durationSeconds: number
  ): Promise<{ success: boolean; coinsEarned: number; message: string; submissionId: string }> {
    const task = await this.repository.getById(taskId);
    if (!task) {
      throw new Error(`[TaskService] Task "${taskId}" does not exist.`);
    }

    // Telemetry trace: Log that the user started work
    await this.repository.recordTelemetry(taskId, TaskEventType.TaskStarted, userId);

    const submissionId = `sub_${Math.random().toString(36).substr(2, 9)}`;
    const rewardCoins = task.rewardCoins;

    // Simulate online/offline pathways
    const isOnline = typeof navigator !== 'undefined' ? navigator.onLine : true;

    if (!isOnline) {
      // Offline queue
      TaskCache.enqueueOfflineMutation({
        id: submissionId,
        type: 'submission',
        payload: { taskId, userId, responsePayload, durationSeconds, rewardCoins }
      });

      return {
        success: true,
        coinsEarned: rewardCoins,
        message: 'Saved offline. Your progress will automatically sync upon coming online.',
        submissionId
      };
    }

    // Trigger completion event across systems
    TaskEventBus.emit(TaskEventType.TaskCompleted, {
      taskId,
      userId,
      submissionId,
      rewardCoins,
      timestamp: new Date().toISOString()
    });

    return {
      success: true,
      coinsEarned: rewardCoins,
      message: `Task successfully submitted! +${rewardCoins} Coins credited.`,
      submissionId
    };
  }

  /**
   * Simulates a Cloud Function trigger: ValidateTask
   */
  async cloudFunctionValidateTask(taskId: string): Promise<{ isHealthy: boolean; issues: string[] }> {
    const task = await this.repository.getById(taskId);
    if (!task) {
      return { isHealthy: false, issues: ['Task does not exist.'] };
    }

    const issues: string[] = [];
    if (task.instructions.length < 3) {
      issues.push('Weak UX: We recommend at least 3 detail steps in instructions.');
    }
    if (task.rewardCoins < 5) {
      issues.push('Low Incentive: Coins reward lies below optimal participant thresh.');
    }
    if (task.requiredAccuracy < 90) {
      issues.push('Quality Warning: Target alignment accuracy should lie above 90%.');
    }

    return {
      isHealthy: issues.length === 0,
      issues
    };
  }

  /**
   * Simulates a Cloud Function trigger: GenerateTaskAnalytics
   */
  async cloudFunctionGenerateTaskAnalytics(taskId: string): Promise<{
    taskId: string;
    completionRate: number;
    averageTimeSeconds: number;
    accuracyMOS: number;
    dropRatePercentage: number;
  }> {
    // Generates simulated aggregate analytical data for dashboard charts
    const baseHash = taskId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const completionRate = 85 + (baseHash % 12);
    const averageTimeSeconds = 25 + (baseHash % 40);
    const accuracyMOS = 92 + (baseHash % 7);
    const dropRatePercentage = 4 + (baseHash % 8);

    return {
      taskId,
      completionRate: Math.min(100, completionRate),
      averageTimeSeconds,
      accuracyMOS: Math.min(100, accuracyMOS),
      dropRatePercentage
    };
  }

  /**
   * Simulates a Google Sheets export process. Returns formatted row matrices and headers.
   */
  async generateSheetsExport(
    reportType: 'Task' | 'Category' | 'Completion' | 'Quality' | 'Business' | 'Admin'
  ): Promise<{ headers: string[]; rows: any[][] }> {
    const tasks = await this.repository.list({ status: undefined }); // Fetch all regardless of status
    const headers = TaskAdapter.getSheetsHeaders(reportType);
    const rows = tasks.map(t => TaskAdapter.exportToSheetsRow(t, reportType));

    return { headers, rows };
  }

  /**
   * Attaches a Google Drive file reference to a Task.
   */
  async attachGoogleDriveFile(
    taskId: string,
    fileMeta: { id: string; name: string; mimeType: string; sizeBytes: number; webViewLink: string }
  ): Promise<TaskAttachment> {
    const task = await this.repository.getById(taskId);
    if (!task) {
      throw new Error(`[TaskService] Task "${taskId}" not found.`);
    }

    const newAttachment = TaskAdapter.mapDriveFileToAttachment(fileMeta);
    task.attachments.push(newAttachment);
    task.updatedAt = new Date().toISOString();

    await this.repository.save(task, 'drive_workspace_agent');

    return newAttachment;
  }
}

export const GlobalTaskService = new TaskService();
