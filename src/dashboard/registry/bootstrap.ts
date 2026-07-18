/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { WidgetRegistry } from './WidgetRegistry';
import { WidgetSize, WidgetCategory } from '../types/widgets';
import { UserRole } from '../../auth/types';

import { ProfileWidget } from '../components/widgets/ProfileWidget';
import { WalletWidget } from '../components/widgets/WalletWidget';
import { TaskWidget } from '../components/widgets/TaskWidget';
import { ActivityWidget } from '../components/widgets/ActivityWidget';
import { NotificationWidget } from '../components/widgets/NotificationWidget';
import { LeaderboardWidget } from '../components/widgets/LeaderboardWidget';
import { BusinessWidget } from '../components/widgets/BusinessWidget';
import { CreatorWidget } from '../components/widgets/CreatorWidget';
import { AnalyticsWidget } from '../components/widgets/AnalyticsWidget';
import { RecommendationWidget } from '../components/widgets/RecommendationWidget';

/**
 * Bootstraps the dynamic registry catalogs.
 * Solves the dynamic dashboard discovery mandate cleanly.
 */
export function bootstrapWidgets() {
  WidgetRegistry.register({
    metadata: {
      id: 'profile-widget',
      name: 'Validator Identity',
      description: 'Onboarding level, XP progress, and core metadata.',
      category: WidgetCategory.PROFILE,
      defaultSize: WidgetSize.MEDIUM,
      allowedSizes: [WidgetSize.SMALL, WidgetSize.MEDIUM],
      minRole: UserRole.CONTRIBUTOR,
    },
    component: ProfileWidget,
  });

  WidgetRegistry.register({
    metadata: {
      id: 'wallet-widget',
      name: 'Nova Holding Ledger',
      description: 'Spendable wallet ledger and frozen escrow counters.',
      category: WidgetCategory.FINANCE,
      defaultSize: WidgetSize.SMALL,
      allowedSizes: [WidgetSize.SMALL, WidgetSize.MEDIUM],
      minRole: UserRole.CONTRIBUTOR,
    },
    component: WalletWidget,
  });

  WidgetRegistry.register({
    metadata: {
      id: 'task-widget',
      name: 'High-Priority Open Tasks',
      description: 'Human-intelligence microtasks awaiting validation.',
      category: WidgetCategory.TASKS,
      defaultSize: WidgetSize.MEDIUM,
      allowedSizes: [WidgetSize.MEDIUM, WidgetSize.LARGE, WidgetSize.FULL],
      minRole: UserRole.CONTRIBUTOR,
    },
    component: TaskWidget,
  });

  WidgetRegistry.register({
    metadata: {
      id: 'activity-widget',
      name: 'Recent Node Activities',
      description: 'Live timeline logs auditing recent ledger operations.',
      category: WidgetCategory.UTILITY,
      defaultSize: WidgetSize.MEDIUM,
      allowedSizes: [WidgetSize.SMALL, WidgetSize.MEDIUM, WidgetSize.LARGE],
      minRole: UserRole.CONTRIBUTOR,
    },
    component: ActivityWidget,
  });

  WidgetRegistry.register({
    metadata: {
      id: 'notification-widget',
      name: 'Alerts & System Bulletins',
      description: 'Broadcast notifications and campaign alerts.',
      category: WidgetCategory.UTILITY,
      defaultSize: WidgetSize.SMALL,
      allowedSizes: [WidgetSize.SMALL, WidgetSize.MEDIUM],
      minRole: UserRole.CONTRIBUTOR,
    },
    component: NotificationWidget,
  });

  WidgetRegistry.register({
    metadata: {
      id: 'leaderboard-widget',
      name: 'Global Validator Rankings',
      description: 'Active weekly XP rankings of top alignment nodes.',
      category: WidgetCategory.COMMUNITY,
      defaultSize: WidgetSize.SMALL,
      allowedSizes: [WidgetSize.SMALL, WidgetSize.MEDIUM],
      minRole: UserRole.CONTRIBUTOR,
    },
    component: LeaderboardWidget,
  });

  WidgetRegistry.register({
    metadata: {
      id: 'business-widget',
      name: 'Business Campaign Escrow',
      description: 'Enterprise budget campaigns and datasets deployment tracking.',
      category: WidgetCategory.FINANCE,
      defaultSize: WidgetSize.MEDIUM,
      allowedSizes: [WidgetSize.MEDIUM, WidgetSize.LARGE, WidgetSize.FULL],
      minRole: UserRole.BUSINESS,
    },
    component: BusinessWidget,
  });

  WidgetRegistry.register({
    metadata: {
      id: 'creator-widget',
      name: 'Creator Campaign Matrix',
      description: 'Custom creators deployment pipelines and calibration limits.',
      category: WidgetCategory.ANALYTICS,
      defaultSize: WidgetSize.MEDIUM,
      allowedSizes: [WidgetSize.MEDIUM, WidgetSize.LARGE, WidgetSize.FULL],
      minRole: UserRole.CREATOR,
    },
    component: CreatorWidget,
  });

  WidgetRegistry.register({
    metadata: {
      id: 'analytics-widget',
      name: 'Validator SLA Analytics & Yield',
      description: 'Full width area performance telemetry logs and charts.',
      category: WidgetCategory.ANALYTICS,
      defaultSize: WidgetSize.FULL,
      allowedSizes: [WidgetSize.LARGE, WidgetSize.FULL],
      minRole: UserRole.CONTRIBUTOR,
    },
    component: AnalyticsWidget,
  });

  WidgetRegistry.register({
    metadata: {
      id: 'recommendation-widget',
      name: 'Nova AI Matching Recommendations',
      description: 'Personalized alignment tasks matching validation history.',
      category: WidgetCategory.TASKS,
      defaultSize: WidgetSize.MEDIUM,
      allowedSizes: [WidgetSize.SMALL, WidgetSize.MEDIUM, WidgetSize.LARGE],
      minRole: UserRole.CONTRIBUTOR,
    },
    component: RecommendationWidget,
  });
}
