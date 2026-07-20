/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BillingEvent, BillingEventType } from '../types';

type BillingEventListener = (event: BillingEvent) => void;

/**
 * Enterprise Event Bus for Billing and Subscription events.
 */
export class BillingEventBus {
  private static listeners: Map<BillingEventType, Set<BillingEventListener>> = new Map();
  private static globalListeners: Set<BillingEventListener> = new Set();
  private static eventHistory: BillingEvent[] = [];

  /**
   * Subscribe to a specific Billing Event.
   */
  public static subscribe(type: BillingEventType, listener: BillingEventListener): () => void {
    if (!this.listeners.has(type)) {
      this.listeners.set(type, new Set());
    }
    this.listeners.get(type)!.add(listener);

    return () => {
      const active = this.listeners.get(type);
      if (active) {
        active.delete(listener);
      }
    };
  }

  /**
   * Subscribe to all Billing Events (perfect for compliance logging / audit trails / analytics).
   */
  public static subscribeAll(listener: BillingEventListener): () => void {
    this.globalListeners.add(listener);
    return () => {
      this.globalListeners.delete(listener);
    };
  }

  /**
   * Publish a billing event.
   */
  public static emit(type: BillingEventType, payload: Record<string, any>): void {
    const event: BillingEvent = {
      id: `evt_bill_${Math.random().toString(36).substring(2, 12)}`,
      type,
      timestamp: new Date().toISOString(),
      payload
    };

    this.eventHistory.push(event);
    if (this.eventHistory.length > 500) {
      this.eventHistory.shift(); // Bound memory footprint
    }

    // Notify specific type listeners
    const typedListeners = this.listeners.get(type);
    if (typedListeners) {
      typedListeners.forEach(listener => {
        try {
          listener(event);
        } catch (e) {
          console.error(`[BillingEventBus] Error in typed listener for event ${type}:`, e);
        }
      });
    }

    // Notify global listeners
    this.globalListeners.forEach(listener => {
      try {
        listener(event);
      } catch (e) {
        console.error(`[BillingEventBus] Error in global listener:`, e);
      }
    });
  }

  /**
   * Get historical events for auditing/telemetry.
   */
  public static getHistory(): BillingEvent[] {
    return [...this.eventHistory];
  }

  /**
   * Clear event history.
   */
  public static clearHistory(): void {
    this.eventHistory = [];
  }
}
