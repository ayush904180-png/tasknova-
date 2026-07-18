/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Task } from '../../types/tasks';

export enum TaskEventType {
  TaskCreated = 'TaskCreated',
  TaskPublished = 'TaskPublished',
  TaskStarted = 'TaskStarted',
  TaskPaused = 'TaskPaused',
  TaskResumed = 'TaskResumed',
  TaskCompleted = 'TaskCompleted',
  TaskRejected = 'TaskRejected',
  TaskExpired = 'TaskExpired',
  TaskBookmarked = 'TaskBookmarked',
  TaskViewed = 'TaskViewed',
  TaskShared = 'TaskShared',
  TaskReported = 'TaskReported',
}

export interface TaskEventMap {
  [TaskEventType.TaskCreated]: { task: Task; actorId: string; timestamp: string };
  [TaskEventType.TaskPublished]: { taskId: string; version: number; publisherId: string; timestamp: string };
  [TaskEventType.TaskStarted]: { taskId: string; userId: string; timestamp: string };
  [TaskEventType.TaskPaused]: { taskId: string; operatorId: string; timestamp: string };
  [TaskEventType.TaskResumed]: { taskId: string; operatorId: string; timestamp: string };
  [TaskEventType.TaskCompleted]: { taskId: string; userId: string; submissionId: string; rewardCoins: number; timestamp: string };
  [TaskEventType.TaskRejected]: { taskId: string; userId: string; submissionId: string; reason: string; timestamp: string };
  [TaskEventType.TaskExpired]: { taskId: string; expirationDate: string; timestamp: string };
  [TaskEventType.TaskBookmarked]: { taskId: string; userId: string; isBookmarked: boolean; timestamp: string };
  [TaskEventType.TaskViewed]: { taskId: string; userId: string; timestamp: string };
  [TaskEventType.TaskShared]: { taskId: string; userId: string; platform: string; timestamp: string };
  [TaskEventType.TaskReported]: { taskId: string; userId: string; category: string; description: string; timestamp: string };
}

type TaskEventCallback<T extends TaskEventType> = (payload: TaskEventMap[T]) => void;

/**
 * Event Broker for isolated, decoupled task engine mechanics.
 */
class CoreTaskEventBus {
  private listeners: { [K in TaskEventType]?: Array<TaskEventCallback<K>> } = {};

  /**
   * Registers a listener callback for a TaskEvent.
   */
  on<T extends TaskEventType>(event: T, callback: TaskEventCallback<T>): () => void {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event]!.push(callback as any);
    return () => this.off(event, callback);
  }

  /**
   * Unregisters a listener callback.
   */
  off<T extends TaskEventType>(event: T, callback: TaskEventCallback<T>): void {
    if (!this.listeners[event]) return;
    this.listeners[event] = this.listeners[event]!.filter(cb => cb !== callback) as any;
  }

  /**
   * Synchronously dispatches the event payload to all active subscribers.
   */
  emit<T extends TaskEventType>(event: T, payload: TaskEventMap[T]): void {
    const subscribers = this.listeners[event];
    if (!subscribers) return;
    subscribers.forEach(cb => {
      try {
        cb(payload);
      } catch (err) {
        console.error(`[TaskEventBus] Error executing listener on "${event}":`, err);
      }
    });
  }
}

export const TaskEventBus = new CoreTaskEventBus();
