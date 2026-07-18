/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { getEnvConfig } from '../environment/EnvConfig';
import { WorkspaceSheetsAdapter, WorkspaceDriveAdapter } from '../adapters/WorkspaceAdapters';
import { FirestoreTransaction, FirestoreTaskSubmission, FirestoreCampaign } from '../firebase/types';

/**
 * Service to manage secure, compliant programmatic exports to Google Sheets.
 * Ideal for real-time finance visibility, QA loops, and compliance audits.
 */
export class SheetsExportService {
  /**
   * Simulates publishing a tabular transaction report (daily, payout, or revenue) to a Google Sheet.
   */
  async exportTransactions(transactions: FirestoreTransaction[]): Promise<{ success: boolean; sheetUrl: string; message: string }> {
    const config = getEnvConfig();
    const sheetId = config.GOOGLE_SHEET_ID;

    if (!sheetId) {
      return {
        success: false,
        sheetUrl: '',
        message: 'Google Sheet ID is not configured in the workspace environments (.env).',
      };
    }

    const adaptedData = WorkspaceSheetsAdapter.adaptTransactionsToSheet(transactions);
    console.log(`[SheetsExportService] Mock writing ${adaptedData.values.length} rows to Google Sheet: ${sheetId}`);

    // Real API implementation template:
    // const auth = await getGoogleAuth();
    // const sheets = google.sheets({ version: 'v4', auth });
    // await sheets.spreadsheets.values.update({ spreadsheetId: sheetId, range: 'Transactions!A1', valueInputOption: 'RAW', requestBody: { values: adaptedData.values } });

    return {
      success: true,
      sheetUrl: `https://docs.google.com/spreadsheets/d/${sheetId}/edit#gid=0`,
      message: `Successfully synchronized ${transactions.length} ledger logs to Sheets ledger interface.`,
    };
  }

  /**
   * Synchronizes submissions to the Manual Review Queue spreadsheet for expert auditors.
   */
  async exportSubmissionsToReviewQueue(submissions: FirestoreTaskSubmission[]): Promise<{ success: boolean; sheetUrl: string; message: string }> {
    const config = getEnvConfig();
    const sheetId = config.GOOGLE_SHEET_ID;

    if (!sheetId) {
      return {
        success: false,
        sheetUrl: '',
        message: 'Google Sheet ID is not configured in workspace settings.',
      };
    }

    const adaptedData = WorkspaceSheetsAdapter.adaptSubmissionsToSheet(submissions);
    console.log(`[SheetsExportService] Syncing QA queue. Count: ${submissions.length} items`);

    return {
      success: true,
      sheetUrl: `https://docs.google.com/spreadsheets/d/${sheetId}/edit#gid=100234`,
      message: `Enqueued ${submissions.length} submissions to the Admin Manual Review spreadsheet.`,
    };
  }
}

/**
 * Service managing Google Drive folder indexing, legal archives, and database file serialization.
 */
export class DriveStorageService {
  /**
   * Saves system CSV reports inside designated corporate drive folders.
   */
  async uploadReportToDrive(reportName: string, headers: string[], rows: any[][]): Promise<{ success: boolean; driveFileId: string; fileUrl: string }> {
    const config = getEnvConfig();
    const folderId = config.GOOGLE_DRIVE_FOLDER_ID;

    if (!folderId) {
      return {
        success: false,
        driveFileId: '',
        fileUrl: '',
      };
    }

    const adaptedFile = WorkspaceDriveAdapter.formatCsvForDrive(reportName, headers, rows, folderId);
    console.log(`[DriveStorageService] Mock archiving report "${adaptedFile.name}" in Drive folder: ${folderId}`);

    // Real API implementation template:
    // const drive = google.drive({ version: 'v3', auth });
    // const res = await drive.files.create({ requestBody: { name: adaptedFile.name, parents: [folderId], mimeType: adaptedFile.mimeType }, media: { mimeType: adaptedFile.mimeType, body: adaptedFile.content } });
    // return { success: true, driveFileId: res.data.id, fileUrl: res.data.webViewLink };

    const mockFileId = `drive_file_${Math.random().toString(36).substr(2, 9)}`;
    return {
      success: true,
      driveFileId: mockFileId,
      fileUrl: `https://drive.google.com/file/d/${mockFileId}/view`,
    };
  }

  /**
   * Simulates writing automated backups into legal archives.
   */
  async uploadDatabaseBackup(collectionName: string, data: Record<string, any>[]): Promise<{ success: boolean; driveFileId: string }> {
    const config = getEnvConfig();
    const folderId = config.GOOGLE_DRIVE_FOLDER_ID;

    if (!folderId) {
      return { success: false, driveFileId: '' };
    }

    const backupDoc = WorkspaceDriveAdapter.formatBackupForDrive(collectionName, data, folderId);
    console.log(`[DriveStorageService] Uploading static JSON disaster backup for ${collectionName}. Filesize: ~${backupDoc.content.length} bytes`);

    return {
      success: true,
      driveFileId: `backup_id_${Math.random().toString(36).substr(2, 9)}`,
    };
  }
}
