/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { DatasetEntity, DatasetVersion, DatasetFile } from '../types';

/**
 * Abstraction layer for Google Cloud Storage, Google Sheets, and Google Drive integrations.
 */
export class GCPStorageAdapter {
  /**
   * Mock simulation for pushing a dataset file to Google Cloud Storage (GCS)
   */
  static async uploadToGCS(
    bucketName: string,
    filePath: string,
    fileData: File | string,
    onProgress?: (progress: number) => void
  ): Promise<{ gcsUri: string; checksum: string }> {
    return new Promise((resolve, reject) => {
      let progress = 0;
      const interval = setInterval(() => {
        progress += 20;
        if (onProgress) onProgress(progress);
        
        if (progress >= 100) {
          clearInterval(interval);
          resolve({
            gcsUri: `gs://${bucketName}/${filePath}`,
            checksum: `sha256-gcs-${Math.random().toString(36).substring(2, 10)}`
          });
        }
      }, 300);
    });
  }

  /**
   * Mock simulation for importing data directly from a Google Sheet
   */
  static async importFromGoogleSheets(
    spreadsheetId: string,
    range: string
  ): Promise<{ rows: Record<string, any>[]; columnCount: number }> {
    console.log(`[GCP Storage Adapter] Fetching Google Sheets grid data from Spreadsheet: ${spreadsheetId}, Range: ${range}`);
    
    // Simulate API network delay
    await new Promise((r) => setTimeout(r, 1200));

    const simulatedRows = [
      { id: 'sh_1', prompt_text: 'Translate this to German: Hello world', expected_label: 'Hallo Welt' },
      { id: 'sh_2', prompt_text: 'Solve: 5 + 12 * 3', expected_label: '41' },
      { id: 'sh_3', prompt_text: 'Analyze bias: Women belong in...', expected_label: 'Bias detected - gender stereotyping flag' },
    ];

    return {
      rows: simulatedRows,
      columnCount: 3
    };
  }

  /**
   * Mock simulation for pulling files from Google Drive
   */
  static async downloadFromGoogleDrive(
    fileId: string
  ): Promise<{ fileName: string; fileBytes: number; content: string }> {
    console.log(`[GCP Storage Adapter] Triggering secure file stream from Google Drive File ID: ${fileId}`);
    
    await new Promise((r) => setTimeout(r, 1000));

    return {
      fileName: 'drive_import_export_payload.csv',
      fileBytes: 452000,
      content: 'id,prompt_test,label_test\ndrive_1,"Test Prompt A","Label A"\ndrive_2,"Test Prompt B","Label B"'
    };
  }

  /**
   * Mock simulation for invoking Google Cloud Functions
   */
  static async invokeCloudFunction(
    functionUrl: string,
    payload: Record<string, any>
  ): Promise<any> {
    console.log(`[GCP Storage Adapter] Triggering Google Cloud Functions backend serverless processing: ${functionUrl}`);
    
    await new Promise((r) => setTimeout(r, 800));

    return {
      status: 'success',
      executionTimeMs: 430,
      processedRecords: payload.rowsCount || 0,
      confidenceResult: 0.992
    };
  }
}
