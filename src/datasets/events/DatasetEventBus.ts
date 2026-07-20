/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { DatasetLifecycle } from '../types';

export type DatasetEventType =
  | 'DatasetCreated'
  | 'UploadStarted'
  | 'UploadCompleted'
  | 'ValidationStarted'
  | 'ValidationFinished'
  | 'QualityCalculated'
  | 'DatasetApproved'
  | 'DatasetPublished'
  | 'DatasetArchived'
  | 'DatasetDeleted';

export interface DatasetEventPayload {
  datasetId: string;
  datasetName: string;
  timestamp: string;
  userId: string;
  userName: string;
  comment?: string;
  meta?: any;
}

export type DatasetEventListener = (payload: DatasetEventPayload) => void;

export class DatasetEventBus {
  private static listeners = new Map<DatasetEventType, Set<DatasetEventListener>>();

  /**
   * Subscribe to a specific event
   */
  static subscribe(event: DatasetEventType, listener: DatasetEventListener): () => void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event)!.add(listener);

    // Return unsubscribe function
    return () => {
      const set = this.listeners.get(event);
      if (set) {
        set.delete(listener);
        if (set.size === 0) {
          this.listeners.delete(event);
        }
      }
    };
  }

  /**
   * Publish an event to all subscribers
   */
  static publish(event: DatasetEventType, payload: DatasetEventPayload): void {
    console.log(`[Dataset Event Bus] PUBLISH: "${event}"`, payload);
    
    // Log in local system event stream
    this.saveToEventStream(event, payload);

    const set = this.listeners.get(event);
    if (set) {
      set.forEach((listener) => {
        try {
          listener(payload);
        } catch (err) {
          console.error(`Error in event listener for "${event}"`, err);
        }
      });
    }
  }

  /**
   * Save to system event stream audit ledger
   */
  private static saveToEventStream(type: DatasetEventType, payload: DatasetEventPayload) {
    try {
      const savedStreamStr = localStorage.getItem('tasknova_dataset_event_stream');
      const stream = savedStreamStr ? JSON.parse(savedStreamStr) : [];
      
      const newEntry = {
        id: `ev_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        type,
        ...payload
      };

      stream.unshift(newEntry);
      
      // Limit to 100 historical logs
      localStorage.setItem('tasknova_dataset_event_stream', JSON.stringify(stream.slice(0, 100)));
    } catch (e) {
      console.error('Failed writing to event stream ledger', e);
    }
  }

  /**
   * Read the event stream ledger
   */
  static getEventStreamLogs(): Array<any> {
    try {
      const savedStreamStr = localStorage.getItem('tasknova_dataset_event_stream');
      return savedStreamStr ? JSON.parse(savedStreamStr) : [];
    } catch (e) {
      return [];
    }
  }

  /**
   * Clear logs
   */
  static clearEventStreamLogs(): void {
    localStorage.removeItem('tasknova_dataset_event_stream');
  }
}
