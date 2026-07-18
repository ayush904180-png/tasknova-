/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { getEnvConfig } from '../environment/EnvConfig';

export interface StorageUploadResult {
  success: boolean;
  fileUrl: string;
  storagePath: string;
  sizeBytes: number;
  message?: string;
}

/**
 * Service to orchestrate assets, documents, and media uploads inside Firebase Storage.
 * Restricts unvalidated file structures and mitigates Denial of Wallet risks by enforcing sizes and MIME rules.
 */
export class StorageService {
  /**
   * Pre-defined upload size limits and allowed MIME types per folder directory.
   */
  private static folderConstraints: Record<string, { maxSizeMb: number; allowedMimes: string[] }> = {
    'avatars/': {
      maxSizeMb: 2,
      allowedMimes: ['image/jpeg', 'image/png', 'image/webp'],
    },
    'banners/': {
      maxSizeMb: 5,
      allowedMimes: ['image/jpeg', 'image/png', 'image/webp'],
    },
    'task-images/': {
      maxSizeMb: 10,
      allowedMimes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
    },
    'campaign-assets/': {
      maxSizeMb: 15,
      allowedMimes: ['image/jpeg', 'image/png', 'application/pdf', 'application/json'],
    },
    'business-documents/': {
      maxSizeMb: 20,
      allowedMimes: ['application/pdf', 'image/jpeg', 'image/png'],
    },
    'creator-assets/': {
      maxSizeMb: 25,
      allowedMimes: ['image/jpeg', 'image/png', 'application/zip', 'text/plain'],
    },
    'reports/': {
      maxSizeMb: 15,
      allowedMimes: ['text/csv', 'application/pdf', 'application/json'],
    },
    'exports/': {
      maxSizeMb: 50,
      allowedMimes: ['application/zip', 'text/csv', 'application/json'],
    },
    'temporary/': {
      maxSizeMb: 100, // Large temp files (purged automatically in lifecycle)
      allowedMimes: ['*/*'],
    },
    'backups/': {
      maxSizeMb: 500, // Massive DB exports (requires lifecycle tiered backups)
      allowedMimes: ['application/json', 'application/gzip'],
    },
  };

  /**
   * Evaluates if a proposed upload adheres to size limitations and naming safety bounds.
   */
  static validateUpload(folder: string, fileName: string, sizeBytes: number, mimeType: string): { isValid: boolean; reason?: string } {
    const constraint = this.folderConstraints[folder];
    if (!constraint) {
      return { isValid: false, reason: `Proposed storage bucket directory "${folder}" is unregistered or forbidden.` };
    }

    // Name sanitization checks
    if (!/^[a-zA-Z0-9_\-\.]+$/.test(fileName)) {
      return { isValid: false, reason: 'Filename contains forbidden characters. Use alphanumerics, hyphens, and dots.' };
    }

    // Size check
    const maxBytes = constraint.maxSizeMb * 1024 * 1024;
    if (sizeBytes > maxBytes) {
      return { isValid: false, reason: `File size exceeds limits for folder "${folder}". Max is ${constraint.maxSizeMb}MB.` };
    }

    // MIME check
    if (!constraint.allowedMimes.includes('*/*') && !constraint.allowedMimes.includes(mimeType)) {
      return { isValid: false, reason: `MIME type "${mimeType}" is forbidden in directory "${folder}".` };
    }

    return { isValid: true };
  }

  /**
   * Simulates uploading a file to Firebase Storage with strict validation checks.
   */
  async uploadFile(
    folder: 'avatars/' | 'banners/' | 'task-images/' | 'campaign-assets/' | 'business-documents/' | 'creator-assets/' | 'reports/' | 'exports/' | 'temporary/' | 'backups/',
    fileName: string,
    fileBlob: Blob,
    uploaderId: string
  ): Promise<StorageUploadResult> {
    const config = getEnvConfig();
    const storageBucket = config.FIREBASE_STORAGE_BUCKET;

    if (!storageBucket) {
      return {
        success: false,
        fileUrl: '',
        storagePath: '',
        sizeBytes: fileBlob.size,
        message: 'Firebase Storage Bucket is not configured.',
      };
    }

    // 1. Perform client-side validation
    const check = StorageService.validateUpload(folder, fileName, fileBlob.size, fileBlob.type);
    if (!check.isValid) {
      throw new Error(`Upload Rejected: ${check.reason}`);
    }

    // 2. Generate path adhering to standard conventions
    const extension = fileName.substring(fileName.lastIndexOf('.'));
    const uniqueName = `${uploaderId}_${Date.now()}_${Math.random().toString(36).substring(2, 7)}${extension}`;
    const storagePath = `${folder}${uniqueName}`;

    console.log(`[StorageService] Simulating upload of ${fileBlob.size} bytes to bucket gs://${storageBucket}/${storagePath}`);

    // Real API implementation template:
    // const storageRef = ref(storage, storagePath);
    // await uploadBytes(storageRef, fileBlob);
    // const downloadUrl = await getDownloadURL(storageRef);

    const mockDownloadUrl = `https://firebasestorage.googleapis.com/v0/b/${storageBucket}/o/${encodeURIComponent(storagePath)}?alt=media`;

    return {
      success: true,
      fileUrl: mockDownloadUrl,
      storagePath,
      sizeBytes: fileBlob.size,
      message: 'Upload completed and validated successfully.',
    };
  }
}
