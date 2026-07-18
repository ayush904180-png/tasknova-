/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { UserRole } from '../../auth/types';

/**
 * Standard sizes supported in our Responsive Bento Grid layout engine.
 */
export enum WidgetSize {
  SMALL = 'small',   // 1x1 grid cell
  MEDIUM = 'medium', // 2x1 grid cell (wide)
  LARGE = 'large',   // 2x2 grid cell (tall & wide)
  FULL = 'full',     // Span entire grid row
}

/**
 * Categories to group bento-grid widgets.
 */
export enum WidgetCategory {
  PROFILE = 'profile',
  FINANCE = 'finance',
  TASKS = 'tasks',
  COMMUNITY = 'community',
  ANALYTICS = 'analytics',
  UTILITY = 'utility',
}

/**
 * Metadata configuration for widgets, used in customization menus or registries.
 */
export interface WidgetMetadata {
  id: string;
  name: string;
  description: string;
  category: WidgetCategory;
  defaultSize: WidgetSize;
  allowedSizes: WidgetSize[];
  minRole: UserRole | 'moderator' | 'developer';
  isDraggable?: boolean;
  isResizable?: boolean;
}

/**
 * Real-time context state made available to individual widgets.
 */
export interface WidgetContextProps {
  size: WidgetSize;
  isOffline: boolean;
  isRealtime: boolean;
  featureFlags: Record<string, boolean>;
  onEventTrigger: (eventName: string, data: any) => void;
}

/**
 * The standard interface every Widget must implement.
 */
export interface IDashboardWidget {
  metadata: WidgetMetadata;
  component: React.ComponentType<WidgetContextProps>;
}

/**
 * Dynamic visibility rules based on roles, achievements, feature flags, or custom logic.
 */
export interface WidgetVisibilityRule {
  featureFlag?: string;
  requiredRole?: UserRole | 'moderator' | 'developer';
  customRule?: (state: any) => boolean;
}

/**
 * Saved widget coordinates/layout properties.
 */
export interface UserWidgetConfig {
  id: string;
  size: WidgetSize;
  order: number;
  visible: boolean;
}
