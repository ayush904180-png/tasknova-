/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { DatasetSchema, DatasetStatistics, DatasetQuality } from '../types';

export class DatasetValidator {
  /**
   * Validate a text row parse array against expected schema fields
   */
  static validateSchemaCompliance(
    rows: Record<string, any>[],
    expectedSchema: DatasetSchema
  ): {
    isValid: boolean;
    missingColumns: string[];
    brokenRowCount: number;
    emptyCells: number;
  } {
    const missingColumns = new Set<string>();
    let brokenRowCount = 0;
    let emptyCells = 0;

    const fields = expectedSchema.fields;

    rows.forEach((row) => {
      let isRowBroken = false;
      fields.forEach((field) => {
        const val = row[field.name];
        
        // 1. Check if column exists
        if (val === undefined) {
          missingColumns.add(field.name);
          isRowBroken = true;
          emptyCells++;
        } else if (val === null) {
          emptyCells++;
          if (!field.isNullable) {
            isRowBroken = true;
          }
        } else {
          // 2. Type validation checks
          const actualType = typeof val;
          if (field.type === 'array' && !Array.isArray(val)) {
            isRowBroken = true;
          } else if (field.type === 'object' && (actualType !== 'object' || Array.isArray(val))) {
            isRowBroken = true;
          } else if (field.type !== 'array' && field.type !== 'object' && actualType !== field.type) {
            isRowBroken = true;
          }
        }
      });

      if (isRowBroken) {
        brokenRowCount++;
      }
    });

    return {
      isValid: brokenRowCount === 0 && missingColumns.size === 0,
      missingColumns: Array.from(missingColumns),
      brokenRowCount,
      emptyCells,
    };
  }

  /**
   * Automatic schema detection engine (heuristic parsing)
   */
  static detectSchemaFromData(rows: Record<string, any>[]): DatasetSchema {
    if (rows.length === 0) {
      return {
        id: `sch_${Date.now()}`,
        fields: [],
        confidenceScore: 0,
        detectedAt: new Date().toISOString(),
      };
    }

    // Capture all keys and compute their modal type
    const keyTypes = new Map<string, Map<string, number>>();

    rows.forEach((row) => {
      Object.entries(row).forEach(([key, val]) => {
        if (!keyTypes.has(key)) {
          keyTypes.set(key, new Map());
        }
        const typesMap = keyTypes.get(key)!;
        let typeStr: string = typeof val;
        
        if (val === null) {
          typeStr = 'null';
        } else if (Array.isArray(val)) {
          typeStr = 'array';
        }

        typesMap.set(typeStr, (typesMap.get(typeStr) || 0) + 1);
      });
    });

    const fields = Array.from(keyTypes.entries()).map(([name, typesMap]) => {
      // Find the most frequent type
      let bestType: any = 'string';
      let maxCount = -1;
      let hasNull = false;

      typesMap.forEach((count, typeName) => {
        if (typeName === 'null') {
          hasNull = true;
        } else if (count > maxCount) {
          maxCount = count;
          bestType = typeName;
        }
      });

      return {
        name,
        type: bestType as any,
        isNullable: hasNull,
        description: `Auto-scanned field of type ${bestType}`,
        sampleValue: rows[0][name] !== undefined ? String(rows[0][name]) : undefined,
      };
    });

    return {
      id: `sch_auto_${Date.now()}`,
      fields,
      confidenceScore: fields.length > 0 ? 98.4 : 0,
      detectedAt: new Date().toISOString(),
    };
  }

  /**
   * Scans a file name and predicts category
   */
  static estimateCategoryByFilename(filename: string): string {
    const name = filename.toLowerCase();
    if (name.includes('prompt') || name.includes('dialogue') || name.includes('toxic') || name.includes('gpt')) {
      return 'NLP / Text Corpus';
    }
    if (name.includes('image') || name.includes('scan') || name.includes('dicom') || name.includes('box') || name.includes('pixel')) {
      return 'Computer Vision';
    }
    if (name.includes('audio') || name.includes('wav') || name.includes('speech')) {
      return 'Audio / Speech';
    }
    if (name.includes('rlhf') || name.includes('preference') || name.includes('comparison')) {
      return 'RLHF Alignments';
    }
    return 'Tabular Structured';
  }
}
