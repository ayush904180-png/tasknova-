/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { MarketplaceEvent, MarketplaceEventType } from '../types';

type MarketplaceEventListener = (event: MarketplaceEvent) => void;

/**
 * Decentralized Event Bus for Marketplace interactions, telemetry, and analytics sync.
 */
export class MarketplaceEventBus {
  private static listeners: Map<MarketplaceEventType, Set<MarketplaceEventListener>> = new Map();
  private static globalListeners: Set<MarketplaceEventListener> = new Set();
  private static eventHistory: MarketplaceEvent[] = [];

  /**
   * Registers a callback for a specific event type.
   */
  public static subscribe(type: MarketplaceEventType, listener: MarketplaceEventListener): () => void {
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
   * Registers a callback for all event emissions (useful for global telemetry logging/analytics).
   */
  public static subscribeAll(listener: MarketplaceEventListener): () => void {
    this.globalListeners.add(listener);
    return () => {
      this.globalListeners.delete(listener);
    };
  }

  /**
   * Publishes an event to all appropriate subscribers and archives it in history.
   */
  public static emit(type: MarketplaceEventType, userId: string, payload: Record<string, any>): void {
    const event: MarketplaceEvent = {
      type,
      userId,
      timestamp: new Date().toISOString(),
      payload
    };

    // Store in history
    this.eventHistory.push(event);
    if (this.eventHistory.length > 200) {
      this.eventHistory.shift(); // Bound memory footprint
    }

    // Trigger specific listeners
    const listeners = this.listeners.get(type);
    if (listeners) {
      listeners.forEach(cb => {
        try {
          cb(event);
        } catch (err) {
          console.error(`[MarketplaceEventBus] Error in subscription callback for event ${type}:`, err);
        }
      });
    }

    // Trigger global listeners
    this.globalListeners.forEach(cb => {
      try {
        cb(event);
      } catch (err) {
        console.error(`[MarketplaceEventBus] Error in global callback for event ${type}:`, err);
      }
    });
  }

  /**
   * Gets the recent event logs.
   */
  public static getHistory(): MarketplaceEvent[] {
    return [...this.eventHistory];
  }

  /**
   * Clears historical buffers.
   */
  public static clearHistory(): void {
    this.eventHistory = [];
  }
}
