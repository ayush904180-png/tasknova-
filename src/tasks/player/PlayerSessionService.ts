/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { PlayerSession, PlayerState, PlayerEventType } from '../../types/player';
import { Task } from '../../types/tasks';
import { PlayerEventBus } from './PlayerEventBus';

const LOCAL_STORAGE_KEY_PREFIX = 'tasknova_session_';
const SESSION_QUEUE_KEY = 'tasknova_offline_sessions_queue';

/**
 * Service manager for creating, recovering, auto-saving, and submitting player task sessions.
 */
export class TaskPlayerSessionService {
  private activeSessions: Map<string, PlayerSession> = new Map();

  /**
   * Initializes or restores a task session.
   */
  async startSession(task: Task, userId: string = 'validator_contributor_1'): Promise<PlayerSession> {
    const existing = this.getSavedSession(task.id, userId);
    if (existing) {
      // Restore cached state
      PlayerEventBus.emit(PlayerEventType.SessionStarted, {
        session: existing,
        timestamp: new Date().toISOString()
      });
      return existing;
    }

    const deviceAndBrowser = this.detectDeviceAndBrowser();
    const now = new Date().toISOString();

    const newSession: PlayerSession = {
      sessionId: `SESS-${Math.random().toString(36).substring(2, 11).toUpperCase()}`,
      userId,
      taskId: task.id,
      taskVersion: task.version,
      startedAt: now,
      lastSaved: now,
      completedAt: null,
      elapsedTime: 0,
      remainingTime: task.estimatedCompletionTime || 120,
      pauseCount: 0,
      resumeCount: 0,
      submissionState: 'draft',
      offlineState: !navigator.onLine,
      deviceInformation: deviceAndBrowser.device,
      browserInformation: deviceAndBrowser.browser,
      language: navigator.language || 'en-US',
      country: task.country || 'US',
      trustSnapshot: {
        currentScore: 92.5,
        accuracy: 94.0,
        speedIndex: 12.4,
        spamProbability: 0.01,
        flaggedAttemptsCount: 0
      },
      answers: {},
      metadata: {
        networkFlickers: 0,
        validationAttempts: 0
      }
    };

    this.saveSessionToStorage(newSession);
    PlayerEventBus.emit(PlayerEventType.SessionStarted, {
      session: newSession,
      timestamp: now
    });

    return newSession;
  }

  /**
   * Performs an automated autosave.
   */
  autoSave(sessionId: string, answers: Record<string, any>, elapsed: number): PlayerSession {
    const session = this.getSessionById(sessionId);
    if (!session) {
      throw new Error(`Session ID ${sessionId} not active.`);
    }

    const updated: PlayerSession = {
      ...session,
      answers,
      elapsedTime: elapsed,
      remainingTime: Math.max(0, session.remainingTime - (elapsed - session.elapsedTime)),
      lastSaved: new Date().toISOString()
    };

    this.saveSessionToStorage(updated);
    
    PlayerEventBus.emit(PlayerEventType.AutoSaved, {
      sessionId,
      session: updated,
      timestamp: updated.lastSaved
    });

    return updated;
  }

  /**
   * Suspends session (Pause state).
   */
  pauseSession(sessionId: string): PlayerSession {
    const session = this.getSessionById(sessionId);
    if (!session) throw new Error(`Session not found.`);

    const updated = {
      ...session,
      pauseCount: session.pauseCount + 1,
      lastSaved: new Date().toISOString()
    };

    this.saveSessionToStorage(updated);
    PlayerEventBus.emit(PlayerEventType.SessionPaused, {
      sessionId,
      pauseCount: updated.pauseCount,
      timestamp: updated.lastSaved
    });

    return updated;
  }

  /**
   * Resumes a suspended session.
   */
  resumeSession(sessionId: string): PlayerSession {
    const session = this.getSessionById(sessionId);
    if (!session) throw new Error(`Session not found.`);

    const updated = {
      ...session,
      resumeCount: session.resumeCount + 1,
      lastSaved: new Date().toISOString()
    };

    this.saveSessionToStorage(updated);
    PlayerEventBus.emit(PlayerEventType.SessionResumed, {
      sessionId,
      resumeCount: updated.resumeCount,
      timestamp: updated.lastSaved
    });

    return updated;
  }

  /**
   * Records change of answer payload.
   */
  changeAnswers(sessionId: string, answers: Record<string, any>): void {
    const session = this.getSessionById(sessionId);
    if (!session) return;

    session.answers = answers;
    this.saveSessionToStorage(session);

    PlayerEventBus.emit(PlayerEventType.AnswerChanged, {
      sessionId,
      answers,
      timestamp: new Date().toISOString()
    });
  }

  /**
   * Completes and signs off session validation work.
   */
  async submitSession(sessionId: string, coinsEarned: number): Promise<PlayerSession> {
    const session = this.getSessionById(sessionId);
    if (!session) throw new Error(`Session not found.`);

    const now = new Date().toISOString();
    const completed: PlayerSession = {
      ...session,
      completedAt: now,
      submissionState: 'submitted',
      lastSaved: now
    };

    // Remove from active workspace draft storage
    this.removeSessionFromStorage(completed.taskId, completed.userId);

    // Save into completed queue / buffer
    if (!navigator.onLine) {
      this.enqueueOfflineSubmission(completed);
    }

    PlayerEventBus.emit(PlayerEventType.SessionCompleted, {
      sessionId,
      session: completed,
      coinsEarned,
      timestamp: now
    });

    return completed;
  }

  /**
   * Discards / Cancels an ongoing task player session.
   */
  cancelSession(sessionId: string): void {
    const session = this.getSessionById(sessionId);
    if (!session) return;

    this.removeSessionFromStorage(session.taskId, session.userId);
    PlayerEventBus.emit(PlayerEventType.SessionCancelled, {
      sessionId,
      timestamp: new Date().toISOString()
    });
  }

  /**
   * Restores a session from local storage by criteria keys.
   */
  getSavedSession(taskId: string, userId: string): PlayerSession | null {
    try {
      const serialized = localStorage.getItem(`${LOCAL_STORAGE_KEY_PREFIX}${taskId}_${userId}`);
      if (serialized) {
        const parsed = JSON.parse(serialized) as PlayerSession;
        this.activeSessions.set(parsed.sessionId, parsed);
        return parsed;
      }
    } catch (e) {
      console.error('[TaskPlayerSessionService] Read failed:', e);
    }
    return null;
  }

  private getSessionById(sessionId: string): PlayerSession | null {
    let session = this.activeSessions.get(sessionId);
    if (!session) {
      // Fallback search across storage
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith(LOCAL_STORAGE_KEY_PREFIX)) {
          try {
            const parsed = JSON.parse(localStorage.getItem(key)!) as PlayerSession;
            if (parsed.sessionId === sessionId) {
              this.activeSessions.set(sessionId, parsed);
              return parsed;
            }
          } catch {}
        }
      }
    }
    return session || null;
  }

  private saveSessionToStorage(session: PlayerSession): void {
    this.activeSessions.set(session.sessionId, session);
    try {
      localStorage.setItem(
        `${LOCAL_STORAGE_KEY_PREFIX}${session.taskId}_${session.userId}`,
        JSON.stringify(session)
      );
    } catch (e) {
      console.error('[TaskPlayerSessionService] Write failed:', e);
    }
  }

  private removeSessionFromStorage(taskId: string, userId: string): void {
    try {
      localStorage.removeItem(`${LOCAL_STORAGE_KEY_PREFIX}${taskId}_${userId}`);
    } catch {}
  }

  private enqueueOfflineSubmission(session: PlayerSession): void {
    try {
      const raw = localStorage.getItem(SESSION_QUEUE_KEY);
      const queue = raw ? JSON.parse(raw) : [];
      queue.push(session);
      localStorage.setItem(SESSION_QUEUE_KEY, JSON.stringify(queue));
    } catch {}
  }

  private detectDeviceAndBrowser(): { device: string; browser: string } {
    const userAgent = typeof navigator !== 'undefined' ? navigator.userAgent : 'Unknown';
    let device = 'Desktop';
    if (/Mobi|Android|iPhone|iPad/i.test(userAgent)) {
      device = 'Mobile';
    }
    let browser = 'Chrome';
    if (/Firefox/i.test(userAgent)) browser = 'Firefox';
    else if (/Safari/i.test(userAgent) && !/Chrome/i.test(userAgent)) browser = 'Safari';
    else if (/Edge/i.test(userAgent)) browser = 'Edge';

    return { device, browser };
  }
}

export const GlobalPlayerSessionService = new TaskPlayerSessionService();
export default GlobalPlayerSessionService;
