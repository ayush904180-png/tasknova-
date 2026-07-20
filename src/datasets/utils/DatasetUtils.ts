/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export class DatasetUtils {
  /**
   * Generates a mock cryptographic checksum for a file or a string
   */
  static generateSHA256Checksum(name: string, bytes: number): string {
    const salt = `${name}_${bytes}_${Date.now()}`;
    let hash = 0;
    for (let i = 0; i < salt.length; i++) {
      const char = salt.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash |= 0; // Convert to 32bit integer
    }
    const hex = Math.abs(hash).toString(16).padStart(8, '0');
    return `sha256-${hex}b825dc98a284c1737e3d1685dc3c99a8966c43d002fcfbc40428fa6b98e2${hex}`;
  }

  /**
   * Predict processing latency based on file size and category
   */
  static estimateValidationDuration(bytes: number, rowCount: number): number {
    // Basic scaling factor: 1 ms per 100 bytes + 0.1 ms per row
    const sizeFactor = bytes / 100000; // per 100KB
    const rowFactor = rowCount / 1000;   // per 1K rows
    const rawSeconds = (sizeFactor * 0.8) + (rowFactor * 0.5);
    return Math.max(1.5, parseFloat(Math.min(30, rawSeconds).toFixed(1)));
  }

  /**
   * Humanize seconds remaining
   */
  static formatDurationRemaining(seconds: number): string {
    if (seconds <= 0) return 'Complete';
    if (seconds < 60) return `${Math.ceil(seconds)}s remaining`;
    const mins = Math.floor(seconds / 60);
    const secs = Math.round(seconds % 60);
    return `${mins}m ${secs}s remaining`;
  }

  /**
   * Random sample datasets mock-generator
   */
  static generateRandomDatasetRows(rowCount: number, schemaFieldsCount: number): Array<Record<string, any>> {
    const categories = ['toxic_jailbreak', 'logical_fallacy', 'sql_injection_payload', 'medical_consult_raw'];
    return Array.from({ length: Math.min(25, rowCount) }).map((_, idx) => {
      return {
        id: `row_sample_${idx + 1}`,
        instruction_raw: `User prompt probe query payload sequence: ${categories[idx % categories.length]} #${idx * 7 + 101}`,
        label_confidence: parseFloat((0.85 + (idx * 0.01) % 0.14).toFixed(3)),
        is_adversarial: idx % 2 === 0,
        threat_score: Math.round(15 + (idx * 13) % 75),
      };
    });
  }
}
