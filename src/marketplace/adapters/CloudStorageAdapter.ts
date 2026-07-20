/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Adapter for Google Cloud Storage. Handles asset storage and signed URL generation.
 */
export class CloudStorageAdapter {
  private static mockLatency() {
    return new Promise(resolve => setTimeout(resolve, 60));
  }

  /**
   * Generates a signed URL for secure client-side direct uploads to a GCS bucket.
   */
  public async generateSignedUploadUrl(
    bucketName: string,
    objectPath: string,
    contentType: string,
    expiresInSeconds = 900
  ): Promise<string> {
    await CloudStorageAdapter.mockLatency();
    const cleanBucket = bucketName.replace(/[^a-zA-Z0-9-_]/g, '');
    const cleanPath = encodeURIComponent(objectPath);
    const mockUrl = `https://storage.googleapis.com/${cleanBucket}/${cleanPath}?GoogleAccessId=tasknova-sa%40gcp-prod.iam.gserviceaccount.com&Expires=${Math.floor(Date.now() / 1000) + expiresInSeconds}&Signature=mock_gcs_signature`;
    console.info(`[CloudStorageAdapter] Generated signed upload URL for GCS bucket "${bucketName}" at path "${objectPath}"`);
    return mockUrl;
  }

  /**
   * Uploads raw JSON or metadata payloads directly to Cloud Storage as backup archives.
   */
  public async uploadJsonToBucket(
    bucketName: string,
    objectPath: string,
    data: Record<string, any>
  ): Promise<{ success: boolean; gcsPath: string }> {
    await CloudStorageAdapter.mockLatency();
    const gcsPath = `gs://${bucketName}/${objectPath}`;
    console.info(`[CloudStorageAdapter] Successfully archived payload data to GCS object reference: ${gcsPath}`);
    return { success: true, gcsPath };
  }
}

export const GlobalCloudStorageAdapter = new CloudStorageAdapter();
