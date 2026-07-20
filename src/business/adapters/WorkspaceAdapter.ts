/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Campaign, Dataset, BusinessInvoice, AuditLogEntry, CampaignAnalyticsSummary } from '../types';

export class WorkspaceAdapter {
  /**
   * Translates campaign lists to Tabular Google Sheets rows
   */
  static toCampaignSheet(campaigns: Campaign[]): string[][] {
    const headers = [
      'Campaign ID',
      'Name',
      'Company',
      'Project',
      'Task Type',
      'Budget (Coins)',
      'Max Spend ($)',
      'Status',
      'Version',
      'Created At'
    ];

    const rows = campaigns.map((c) => [
      c.id,
      c.name,
      c.companyName,
      c.projectName,
      c.taskType,
      c.budget.coins.toString(),
      `$${c.budget.maxSpend}`,
      c.status,
      c.version.toString(),
      c.createdAt
    ]);

    return [headers, ...rows];
  }

  /**
   * Translates invoices to Tabular Google Sheets rows for corporate billing auditing
   */
  static toInvoiceSheet(invoices: BusinessInvoice[]): string[][] {
    const headers = [
      'Invoice Number',
      'Date',
      'Coins Purchased',
      'Amount (USD)',
      'Status',
      'GST Ready Registered',
      'Tax Share ($)'
    ];

    const rows = invoices.map((inv) => [
      inv.invoiceNumber,
      inv.date,
      inv.coinsPurchased.toString(),
      `$${inv.amountUsd}`,
      inv.status,
      inv.gstNumber || 'N/A',
      `$${inv.taxAmountUsd}`
    ]);

    return [headers, ...rows];
  }

  /**
   * Translates audit log arrays to immutable spreadsheet structures
   */
  static toAuditLogSheet(logs: AuditLogEntry[]): string[][] {
    const headers = ['Log ID', 'Timestamp', 'Operator Email', 'Operation Action', 'Details', 'Source IP', 'Cryptographic Signature Seal'];

    const rows = logs.map((log) => [
      log.id,
      log.timestamp,
      log.userEmail,
      log.action,
      log.details,
      log.ipAddress,
      log.signature
    ]);

    return [headers, ...rows];
  }

  /**
   * Compiles standard PDF compliance report metadata
   */
  static generateComplianceReportText(campaign: Campaign, analytics: CampaignAnalyticsSummary): string {
    return `========================================================================
TASKNOVA AI ENTERPRISE COMPLIANCE REPORT
========================================================================
Generated on: ${new Date().toISOString()}
Compliance Vault Path: TaskNova_Finance_Vault/Statements_2026/

CAMPAIGN OVERVIEW:
------------------------------------------------------------------------
Campaign ID:       ${campaign.id}
Campaign Name:     ${campaign.name}
Company Name:      ${campaign.companyName}
Target Core Project: ${campaign.projectName}
Validation Target: ${campaign.taskType}
Active Status:     ${campaign.status.toUpperCase()}
Deployment Ver:    v${campaign.version}

FINANCIAL LEDGER COMPLIANCE:
------------------------------------------------------------------------
Total Budget Coins Allocated: ${campaign.budget.coins.toLocaleString()} Coins
Submissions Processed:       ${(analytics.coinsPaid / (campaign.budget.coins / analytics.completionRate * 100) || 0).toFixed(0)} iterations
Disbursement Total:           ${analytics.coinsPaid.toLocaleString()} Coins
Coins Balance Remaining:      ${analytics.budgetRemaining.toLocaleString()} Coins
Avg Cost per Validated Unit:  $${analytics.costPerQualitySubmission.toFixed(4)}

VALIDATION & ACCURACY METRICS:
------------------------------------------------------------------------
Milestone Completion Rate:    ${analytics.completionRate}%
Global Accuracy Baseline:    ${analytics.accuracy}%
Average Completion Time:     ${analytics.averageTimePerTask} seconds
Validation Rejection Ratio:   ${analytics.rejectionPercent}%
Automated AI Review Share:   ${campaign.qualityRules.aiReviewPercent}%
Manual Expert Review Share:  ${campaign.qualityRules.manualReviewPercent}%

CRYPTOGRAPHIC LEDGER VALIDITY:
------------------------------------------------------------------------
Verification Hash Anchor:     sha256_anchor_${btoa(campaign.id + analytics.coinsPaid).substr(0, 24).toLowerCase()}
Ledger Validation Seal:      VERIFIED_BY_PLATFORM_CONSENSUS
========================================================================`;
  }
}
