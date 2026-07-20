/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BusinessRole, PermissionMatrix } from '../types';

export const ROLE_PERMISSIONS: Record<BusinessRole, PermissionMatrix> = {
  [BusinessRole.ADMIN]: {
    canCreateCampaign: true,
    canEditCampaign: true,
    canPublishCampaign: true,
    canPauseCampaign: true,
    canDeleteCampaign: true,
    canViewAnalytics: true,
    canManageBilling: true,
    canViewBilling: true,
    canUploadDataset: true,
    canRunStressTest: true,
  },
  [BusinessRole.CAMPAIGN_MANAGER]: {
    canCreateCampaign: true,
    canEditCampaign: true,
    canPublishCampaign: true,
    canPauseCampaign: true,
    canDeleteCampaign: false,
    canViewAnalytics: true,
    canManageBilling: false,
    canViewBilling: true,
    canUploadDataset: true,
    canRunStressTest: false,
  },
  [BusinessRole.ANALYST]: {
    canCreateCampaign: false,
    canEditCampaign: false,
    canPublishCampaign: false,
    canPauseCampaign: false,
    canDeleteCampaign: false,
    canViewAnalytics: true,
    canManageBilling: false,
    canViewBilling: false,
    canUploadDataset: false,
    canRunStressTest: false,
  },
  [BusinessRole.FINANCE]: {
    canCreateCampaign: false,
    canEditCampaign: false,
    canPublishCampaign: false,
    canPauseCampaign: false,
    canDeleteCampaign: false,
    canViewAnalytics: true,
    canManageBilling: true,
    canViewBilling: true,
    canUploadDataset: false,
    canRunStressTest: false,
  },
  [BusinessRole.VIEWER]: {
    canCreateCampaign: false,
    canEditCampaign: false,
    canPublishCampaign: false,
    canPauseCampaign: false,
    canDeleteCampaign: false,
    canViewAnalytics: true,
    canManageBilling: false,
    canViewBilling: false,
    canUploadDataset: false,
    canRunStressTest: false,
  },
};

export function hasPermission(role: BusinessRole, permission: keyof PermissionMatrix): boolean {
  return ROLE_PERMISSIONS[role]?.[permission] ?? false;
}
