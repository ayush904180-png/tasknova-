/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { PlayerEventType, PlayerSession } from '../../types/player';

export interface PlayerEventMap {
  [PlayerEventType.SessionStarted]: { session: PlayerSession; timestamp: string };
  [PlayerEventType.SessionPaused]: { sessionId: string; pauseCount: number; timestamp: string };
  [PlayerEventType.SessionResumed]: { sessionId: string; resumeCount: number; timestamp: string };
  [PlayerEventType.AnswerChanged]: { sessionId: string; answers: Record<string, any>; timestamp: string };
  [PlayerEventType.AutoSaved]: { sessionId: string; session: PlayerSession; timestamp: string };
  [PlayerEventType.SubmissionReady]: { sessionId: string; session: PlayerSession; timestamp: string };
  [PlayerEventType.SessionCompleted]: { sessionId: string; session: PlayerSession; coinsEarned: number; timestamp: string };
  [PlayerEventType.SessionExpired]: { sessionId: string; timestamp: string };
  [PlayerEventType.SessionCancelled]: { sessionId: string; timestamp: string };
}

type PlayerEventCallback<T extends PlayerEventType> = (payload: PlayerEventMap[T]) => void;

/**
 * Event Broker for the decoupling of Universal Task Player events.
 */
class TaskPlayerEventBus {
  private listeners: { [K in PlayerEventType]?: Array<PlayerEventCallback<K>> } = {};

  /**
   * Registers a callback listener for a Task Player session event.
   */
  on<T extends PlayerEventType>(event: T, callback: PlayerEventCallback<T>): () => void {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event]!.push(callback as any);
    return () => this.off(event, callback);
  }

  /**
   * Unregisters a callback listener.
   */
  off<T extends PlayerEventType>(event: T, callback: PlayerEventCallback<T>): void {
    if (!this.listeners[event]) return;
    this.listeners[event] = this.listeners[event]!.filter(cb => cb !== callback) as any;
  }

  /**
   * Dispatches the event payload to all registered observers.
   */
  emit<T extends PlayerEventType>(event: T, payload: PlayerEventMap[T]): void {
    const subscribers = this.listeners[event];
    if (!subscribers) return;
    subscribers.forEach(cb => {
      try {
        cb(payload);
      } catch (err) {
        console.error(`[PlayerEventBus] Error executing handler for event "${event}":`, err);
      }
    });
  }
}

export const PlayerEventBus = new TaskPlayerEventBus();
export default PlayerEventBus;
