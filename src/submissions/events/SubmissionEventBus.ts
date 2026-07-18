/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { SubmissionEventType, SubmissionEventPayloads } from '../../types/submission';

type SubmissionEventCallback<T extends SubmissionEventType> = (payload: SubmissionEventPayloads[T]) => void;

/**
 * Enterprise Submission Event Bus.
 * Dispatches status updates, sync triggers, and QA pipeline alerts to decoupled modules.
 */
class CoreSubmissionEventBus {
  private listeners: { [K in SubmissionEventType]?: Array<SubmissionEventCallback<K>> } = {};

  /**
   * Subscribes to a submission pipeline event.
   */
  on<T extends SubmissionEventType>(event: T, callback: SubmissionEventCallback<T>): () => void {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event]!.push(callback as any);
    return () => this.off(event, callback);
  }

  /**
   * Unsubscribes from a submission pipeline event.
   */
  off<T extends SubmissionEventType>(event: T, callback: SubmissionEventCallback<T>): void {
    if (!this.listeners[event]) return;
    this.listeners[event] = this.listeners[event]!.filter(cb => cb !== callback) as any;
  }

  /**
   * Dispatches event payloads to all active subscribers.
   */
  emit<T extends SubmissionEventType>(event: T, payload: SubmissionEventPayloads[T]): void {
    const subscribers = this.listeners[event];
    if (!subscribers) return;
    subscribers.forEach(cb => {
      try {
        cb(payload);
      } catch (err) {
        console.error(`[SubmissionEventBus] Error executing listener on "${event}":`, err);
      }
    });
  }
}

export const SubmissionEventBus = new CoreSubmissionEventBus();
