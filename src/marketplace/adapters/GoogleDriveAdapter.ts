/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Adapter for Google Drive API. Manages access permissions, attachment linkage, and folders.
 */
export class GoogleDriveAdapter {
  private static mockLatency() {
    return new Promise(resolve => setTimeout(resolve, 75));
  }

  /**
   * Links an existing Google Drive file identifier to a task as an attachment.
   */
  public async linkDriveFileToTask(
    fileId: string,
    taskId: string
  ): Promise<{ linked: boolean; fileName: string; sizeBytes: number }> {
    await GoogleDriveAdapter.mockLatency();
    console.info(`[GoogleDriveAdapter] Link query: checked fileId "${fileId}" and bound reference to Task "${taskId}"`);
    return {
      linked: true,
      fileName: `drive_asset_${fileId.substr(0, 4)}.pdf`,
      sizeBytes: 1048576 // 1MB placeholder
    };
  }

  /**
   * Generates a shared link for the contributor to view instructions or assets securely.
   */
  public async setFilePermissionsForContributor(
    fileId: string,
    contributorEmail: string,
    role: 'reader' | 'writer' = 'reader'
  ): Promise<boolean> {
    await GoogleDriveAdapter.mockLatency();
    console.info(`[GoogleDriveAdapter] Granting ${role} access on Drive file "${fileId}" to "${contributorEmail}"`);
    return true;
  }
}

export const GlobalGoogleDriveAdapter = new GoogleDriveAdapter();
