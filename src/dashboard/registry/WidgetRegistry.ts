/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { IDashboardWidget, WidgetSize, WidgetCategory } from '../types/widgets';
import { UserRole } from '../../auth/types';

/**
 * Global Widget Registry coordinates all widget instances available for loading.
 * Ensures zero-hardcoded coupling: new widgets are discovered dynamically.
 */
class DashboardWidgetRegistry {
  private widgets = new Map<string, IDashboardWidget>();

  /**
   * Registers a widget in the global memory context.
   */
  register(widget: IDashboardWidget): void {
    if (this.widgets.has(widget.metadata.id)) {
      console.warn(`[WidgetRegistry] Widget with ID "${widget.metadata.id}" already registered. Overwriting.`);
    }
    this.widgets.set(widget.metadata.id, widget);
  }

  /**
   * Retrieves a specific widget.
   */
  get(id: string): IDashboardWidget | undefined {
    return this.widgets.get(id);
  }

  /**
   * Returns all currently registered widgets.
   */
  getAll(): IDashboardWidget[] {
    return Array.from(this.widgets.values());
  }

  /**
   * Filters widgets dynamically based on user role, feature flags, and permissions.
   */
  getAuthorizedWidgets(
    role: UserRole | 'moderator' | 'developer',
    featureFlags: Record<string, boolean>
  ): IDashboardWidget[] {
    return this.getAll().filter(widget => {
      // 1. Check feature flag gating (e.g., wallet.enabled)
      const flagName = `${widget.metadata.id.split('-')[0]}.enabled`;
      if (featureFlags[flagName] === false) {
        return false;
      }

      // 2. Validate permission matrix mapping
      const requiredRole = widget.metadata.minRole;

      if (requiredRole === 'developer') {
        return role === 'developer';
      }

      if (requiredRole === 'moderator') {
        return role === 'admin' || role === 'developer' || role === 'moderator';
      }

      // Role hierarchy evaluation: admin has absolute access, then creator/business, then contributor
      if (role === 'admin' || role === 'developer') {
        return true;
      }

      if (requiredRole === UserRole.ADMIN) {
        return false; // already checked admin above
      }

      if (requiredRole === UserRole.CREATOR) {
        return role === UserRole.CREATOR;
      }

      if (requiredRole === UserRole.BUSINESS) {
        return role === UserRole.BUSINESS;
      }

      // If required is contributor, anyone can view it
      return true;
    });
  }
}

export const WidgetRegistry = new DashboardWidgetRegistry();
