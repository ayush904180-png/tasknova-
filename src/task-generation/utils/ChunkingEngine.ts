/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { DatasetChunk } from '../types';

export class ChunkingEngine {
  /**
   * Generates a unique sha-256 style hash string from content for duplicate avoidance.
   */
  static generateHash(content: string): string {
    let hash = 0;
    for (let i = 0; i < content.length; i++) {
      const char = content.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash |= 0; // Convert to 32bit integer
    }
    return `hash_${Math.abs(hash).toString(16)}`;
  }

  /**
   * Chunks CSV file content. Split by records/lines while maintaining rows structure.
   */
  static chunkCSV(csvContent: string, pipelineId: string): DatasetChunk[] {
    const lines = csvContent.split(/\r?\n/).filter(line => line.trim() !== '');
    if (lines.length <= 1) return [];

    const header = lines[0];
    const dataLines = lines.slice(1);
    const chunks: DatasetChunk[] = [];

    dataLines.forEach((line, index) => {
      const chunkContent = `${header}\n${line}`;
      const hash = this.generateHash(chunkContent);
      chunks.push({
        id: `chunk-csv-${pipelineId}-${index}`,
        pipelineId,
        index,
        content: chunkContent,
        mimeType: 'text/csv',
        hash,
        createdAt: new Date().toISOString()
      });
    });

    return chunks;
  }

  /**
   * Chunks JSON array content. Ensures each object in the array becomes its own microtask chunk.
   */
  static chunkJSON(jsonContent: string, pipelineId: string): DatasetChunk[] {
    try {
      const parsed = JSON.parse(jsonContent);
      const items = Array.isArray(parsed) ? parsed : [parsed];
      const chunks: DatasetChunk[] = [];

      items.forEach((item, index) => {
        const chunkContent = JSON.stringify(item, null, 2);
        const hash = this.generateHash(chunkContent);
        chunks.push({
          id: `chunk-json-${pipelineId}-${index}`,
          pipelineId,
          index,
          content: chunkContent,
          mimeType: 'application/json',
          hash,
          createdAt: new Date().toISOString()
        });
      });

      return chunks;
    } catch (e) {
      console.error('[ChunkingEngine] Invalid JSON format for chunking', e);
      return [];
    }
  }

  /**
   * Chunks large TXT or simulated PDF content. Split by paragraphs or fixed length overlapping guards.
   */
  static chunkTextOrPDF(textContent: string, pipelineId: string, chunkSize = 1000): DatasetChunk[] {
    const paragraphs = textContent.split(/\n\s*\n/).filter(p => p.trim() !== '');
    const chunks: DatasetChunk[] = [];
    let index = 0;

    paragraphs.forEach((para) => {
      // If paragraphs are too large, slice them
      let start = 0;
      while (start < para.length) {
        const sliceContent = para.substring(start, start + chunkSize).trim();
        if (sliceContent.length > 5) {
          const hash = this.generateHash(sliceContent);
          chunks.push({
            id: `chunk-pdf-${pipelineId}-${index}`,
            pipelineId,
            index,
            content: sliceContent,
            mimeType: 'application/pdf',
            hash,
            createdAt: new Date().toISOString()
          });
          index++;
        }
        start += chunkSize;
      }
    });

    return chunks;
  }

  /**
   * Chunks list of Image files or video/audio clips references.
   * Maps each individual media reference to a dedicated task chunk.
   */
  static chunkMedia(mediaUrls: string[], pipelineId: string, type: 'image' | 'audio' | 'video'): DatasetChunk[] {
    const chunks: DatasetChunk[] = [];
    const mimeMap = {
      image: 'image/png',
      audio: 'audio/mpeg',
      video: 'video/mp4'
    };

    mediaUrls.forEach((url, index) => {
      const hash = this.generateHash(url);
      chunks.push({
        id: `chunk-media-${type}-${pipelineId}-${index}`,
        pipelineId,
        index,
        content: `Media Target Location: ${url}`,
        mediaUrl: url,
        mimeType: mimeMap[type] || 'application/octet-stream',
        hash,
        createdAt: new Date().toISOString()
      });
    });

    return chunks;
  }
}
