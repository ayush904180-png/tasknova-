/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { FirestoreTransaction, FirestoreTaskSubmission, FirestoreCampaign } from '../firebase/types';

/**
 * Format structure for Google Sheets values arrays.
 */
export interface SheetRowData {
  values: any[][];
}

/**
 * Workspace Adapter: Standardizes translations of domain entities to flat tabular datasets
 * required for automated Google Sheets reports or analytics extraction.
 */
export class WorkspaceSheetsAdapter {
  /**
   * Adapts active system transactions into tabular row data for Revenue / Payout Reports.
   */
  static adaptTransactionsToSheet(transactions: FirestoreTransaction[]): SheetRowData {
    const headers = ['Transaction ID', 'Wallet ID', 'Amount', 'Type', 'Purpose', 'Reference ID', 'Status', 'Timestamp'];
    const rows = transactions.map(t => [
      t.id,
      t.walletId,
      t.amount,
      t.type.toUpperCase(),
      t.purpose.toUpperCase(),
      t.referenceId || 'N/A',
      t.status.toUpperCase(),
      t.createdAt,
    ]);

    return {
      values: [headers, ...rows],
    };
  }

  /**
   * Adapts micro-task submissions to Google Sheets flat data for Quality Assurance / Manual Review queues.
   */
  static adaptSubmissionsToSheet(submissions: FirestoreTaskSubmission[]): SheetRowData {
    const headers = ['Submission ID', 'Task ID', 'Contributor ID', 'Duration (Sec)', 'Status', 'Submitted At', 'Payload Preview'];
    const rows = submissions.map(s => [
      s.id,
      s.taskId,
      s.userId,
      s.durationSeconds,
      s.status.toUpperCase(),
      s.createdAt,
      JSON.stringify(s.responsePayload).slice(0, 150), // Truncate long payloads safely
    ]);

    return {
      values: [headers, ...rows],
    };
  }

  /**
   * Adapts Business Campaigns to a standard sheet format.
   */
  static adaptCampaignsToSheet(campaigns: FirestoreCampaign[]): SheetRowData {
    const headers = ['Campaign ID', 'Business ID', 'Title', 'Budget Coins', 'Spent Coins', 'Status', 'Target Languages', 'Created At'];
    const rows = campaigns.map(c => [
      c.id,
      c.businessId,
      c.title,
      c.budgetCoins,
      c.spentCoins,
      c.status.toUpperCase(),
      c.targetCriteria.languages?.join(', ') || 'All',
      c.createdAt,
    ]);

    return {
      values: [headers, ...rows],
    };
  }
}

/**
 * Format structure for Google Drive document representation.
 */
export interface DriveDocumentUpload {
  name: string;
  mimeType: string;
  parentId: string;
  content: string; // Plaintext, CSV string or Base64 binary
}

/**
 * Workspace Drive Adapter: Formats documents, archives, and system files
 * into correct naming patterns, MIME types, and folder assignments.
 */
export class WorkspaceDriveAdapter {
  /**
   * Formats backup archives for disaster recovery exports.
   */
  static formatBackupForDrive(collectionName: string, data: Record<string, any>[], folderId: string): DriveDocumentUpload {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `backup_${collectionName}_${timestamp}.json`;
    return {
      name: filename,
      mimeType: 'application/json',
      parentId: folderId,
      content: JSON.stringify({ collection: collectionName, backupAt: new Date().toISOString(), data }, null, 2),
    };
  }

  /**
   * Formats tabular sheet-data as comma-separated values (CSV) for quick analytical exports.
   */
  static formatCsvForDrive(reportName: string, headers: string[], rows: any[][], folderId: string): DriveDocumentUpload {
    const timestamp = new Date().toISOString().split('T')[0];
    const filename = `report_${reportName.toLowerCase().replace(/\s+/g, '_')}_${timestamp}.csv`;
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => {
        const str = String(cell).replace(/"/g, '""');
        return str.includes(',') || str.includes('\n') ? `"${str}"` : str;
      }).join(',')),
    ].join('\n');

    return {
      name: filename,
      mimeType: 'text/csv',
      parentId: folderId,
      content: csvContent,
    };
  }
}
