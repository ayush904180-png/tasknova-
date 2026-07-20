/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { TaskGenPipeline, GeneratedTaskEntity, DatasetChunk } from '../types';

export enum TaskGenEventType {
  GenerationStarted = 'GenerationStarted',
  DatasetAnalyzed = 'DatasetAnalyzed',
  ChunkCreated = 'ChunkCreated',
  TaskCreated = 'TaskCreated',
  TaskValidated = 'TaskValidated',
  RewardCalculated = 'RewardCalculated',
  TaskApproved = 'TaskApproved',
  TaskRejected = 'TaskRejected',
  TaskPublished = 'TaskPublished',
  GenerationCompleted = 'GenerationCompleted',
}

export interface TaskGenEventMap {
  [TaskGenEventType.GenerationStarted]: { pipeline: TaskGenPipeline; actorId: string; timestamp: string };
  [TaskGenEventType.DatasetAnalyzed]: { pipelineId: string; rowCount: number; columnCount: number; timestamp: string };
  [TaskGenEventType.ChunkCreated]: { chunk: DatasetChunk; timestamp: string };
  [TaskGenEventType.TaskCreated]: { task: GeneratedTaskEntity; timestamp: string };
  [TaskGenEventType.TaskValidated]: { taskId: string; isValid: boolean; warnings: string[]; timestamp: string };
  [TaskGenEventType.RewardCalculated]: { taskId: string; originalCoins: number; calculatedCoins: number; priorityBonus: number; timestamp: string };
  [TaskGenEventType.TaskApproved]: { taskId: string; reviewerId: string; timestamp: string };
  [TaskGenEventType.TaskRejected]: { taskId: string; reviewerId: string; reason: string; timestamp: string };
  [TaskGenEventType.TaskPublished]: { taskId: string; marketplaceTaskId: string; publisherId: string; timestamp: string };
  [TaskGenEventType.GenerationCompleted]: { pipelineId: string; totalCreated: number; successRate: number; timestamp: string };
}

type TaskGenEventCallback<T extends TaskGenEventType> = (payload: TaskGenEventMap[T]) => void;

class CoreTaskGenerationEventBus {
  private listeners: { [K in TaskGenEventType]?: Array<TaskGenEventCallback<K>> } = {};

  on<T extends TaskGenEventType>(event: T, callback: TaskGenEventCallback<T>): () => void {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event]!.push(callback as any);
    return () => this.off(event, callback);
  }

  off<T extends TaskGenEventType>(event: T, callback: TaskGenEventCallback<T>): void {
    if (!this.listeners[event]) return;
    this.listeners[event] = this.listeners[event]!.filter(cb => cb !== callback) as any;
  }

  emit<T extends TaskGenEventType>(event: T, payload: TaskGenEventMap[T]): void {
    const subscribers = this.listeners[event];
    if (!subscribers) return;
    subscribers.forEach(cb => {
      try {
        cb(payload);
      } catch (err) {
        console.error(`[TaskGenerationEventBus] Error in subscriber of "${event}":`, err);
      }
    });
  }
}

export const TaskGenerationEventBus = new CoreTaskGenerationEventBus();
