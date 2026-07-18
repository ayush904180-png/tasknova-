/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';

/**
 * All possible operational states of the Task Player Session.
 */
export enum PlayerState {
  LOADING = 'Loading',
  PREPARING = 'Preparing',
  READY = 'Ready',
  PLAYING = 'Playing',
  PAUSED = 'Paused',
  OFFLINE = 'Offline',
  RECONNECTING = 'Reconnecting',
  SAVING = 'Saving',
  SUBMITTING = 'Submitting',
  COMPLETED = 'Completed',
  EXPIRED = 'Expired',
  CANCELLED = 'Cancelled',
  ERROR = 'Error'
}

/**
 * Trust snapshot interface representing validator compliance markers.
 */
export interface TrustSnapshot {
  currentScore: number;
  accuracy: number;
  speedIndex: number;          // Completion speed (seconds per alignment)
  spamProbability: number;     // Estimated spam risk (%)
  flaggedAttemptsCount: number;
}

/**
 * Comprehensive enterprise-ready Player Session Model.
 */
export interface PlayerSession {
  sessionId: string;
  userId: string;
  taskId: string;
  taskVersion: number;
  startedAt: string;           // ISO 8601 string
  lastSaved: string;           // ISO 8601 string
  completedAt: string | null;  // ISO 8601 string
  elapsedTime: number;         // In seconds
  remainingTime: number;       // In seconds (derived from estimatedCompletionTime & countdown)
  pauseCount: number;
  resumeCount: number;
  submissionState: 'draft' | 'ready' | 'submitted';
  offlineState: boolean;
  deviceInformation: string;
  browserInformation: string;
  language: string;
  country: string;
  trustSnapshot: TrustSnapshot;
  answers: Record<string, any>; // Dynamic answers provided by player plugins
  metadata: Record<string, any>; // Operational telemetry data
}

/**
 * Registry plugin interface for task renderers.
 */
export interface TaskPlayerPlugin {
  type: string;
  name: string;
  description: string;
  renderAnswerPanel: (props: {
    task: any;
    answers: Record<string, any>;
    onChange: (answers: Record<string, any>) => void;
    disabled?: boolean;
  }) => React.ReactNode;
  validateAnswers: (task: any, answers: Record<string, any>) => { isValid: boolean; error?: string };
  defaultAnswers: (task: any) => Record<string, any>;
}

/**
 * Event bus payloads dispatched during active sessions.
 */
export enum PlayerEventType {
  SessionStarted = 'SessionStarted',
  SessionPaused = 'SessionPaused',
  SessionResumed = 'SessionResumed',
  AnswerChanged = 'AnswerChanged',
  AutoSaved = 'AutoSaved',
  SubmissionReady = 'SubmissionReady',
  SessionCompleted = 'SessionCompleted',
  SessionExpired = 'SessionExpired',
  SessionCancelled = 'SessionCancelled'
}

export interface PlayerEvent {
  type: PlayerEventType;
  sessionId: string;
  userId: string;
  taskId: string;
  timestamp: string;
  payload: Record<string, any>;
}
