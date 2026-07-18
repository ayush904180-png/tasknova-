/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ValidationEventType, ValidationEventPayloads } from '../../types/validation';

type ValidationEventCallback<T extends ValidationEventType> = (payload: ValidationEventPayloads[T]) => void;

/**
 * Enterprise Validation Event Bus.
 * Dispatches and bridges AI Validation Engine events to decoupled subscribers.
 */
class CoreValidationEventBus {
  private listeners: { [K in ValidationEventType]?: Array<ValidationEventCallback<K>> } = {};

  /**
   * Subscribes to a validation pipeline event.
   */
  on<T extends ValidationEventType>(event: T, callback: ValidationEventCallback<T>): () => void {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event]!.push(callback as any);
    return () => this.off(event, callback);
  }

  /**
   * Unsubscribes from a validation pipeline event.
   */
  off<T extends ValidationEventType>(event: T, callback: ValidationEventCallback<T>): void {
    if (!this.listeners[event]) return;
    this.listeners[event] = this.listeners[event]!.filter(cb => cb !== callback) as any;
  }

  /**
   * Dispatches validation event payloads to all active subscribers.
   */
  emit<T extends ValidationEventType>(event: T, payload: ValidationEventPayloads[T]): void {
    const subscribers = this.listeners[event];
    if (!subscribers) return;
    subscribers.forEach(cb => {
      try {
        cb(payload);
      } catch (err) {
        console.error(`[ValidationEventBus] Error executing listener on "${event}":`, err);
      }
    });
  }
}

export const ValidationEventBus = new CoreValidationEventBus();
export default ValidationEventBus;
