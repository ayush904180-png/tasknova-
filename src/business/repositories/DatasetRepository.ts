/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { FirestoreRepository, MemoryDatabase } from '../../infrastructure/repositories/FirestoreRepository';
import { Dataset } from '../types';

export class DatasetRepository extends FirestoreRepository<Dataset> {
  constructor() {
    super('datasets');
    this.seedInitialData();
  }

  private seedInitialData() {
    const existing = MemoryDatabase.list('datasets');
    if (existing && existing.length > 0) {
      return;
    }

    const mockDatasets: Dataset[] = [
      {
        id: 'ds_openai_gpt5_prompts',
        name: 'GPT-5 Adv reasoning prompt list.json',
        type: 'json',
        size: '14.2 MB',
        rowCount: 45000,
        status: 'valid',
        brokenFilesCount: 0,
        missingColumnsCount: 0,
        detectedSchema: ['prompt_id', 'prompt_text', 'system_context', 'difficulty_rating', 'domain_category'],
        createdAt: new Date(Date.now() - 40 * 3600 * 1000).toISOString(),
      },
      {
        id: 'ds_deepmind_gemini_scenes',
        name: 'Gemini Ultra Scene bounding boxes.csv',
        type: 'csv',
        size: '38.6 MB',
        rowCount: 128000,
        status: 'valid',
        brokenFilesCount: 0,
        missingColumnsCount: 0,
        detectedSchema: ['frame_id', 'image_url', 'annotator_id', 'box_coordinates_xywh', 'confidence_threshold'],
        createdAt: new Date(Date.now() - 20 * 3600 * 1000).toISOString(),
      },
      {
        id: 'ds_anthropic_code_evals',
        name: 'Claude 4 preference coding challenges.zip',
        type: 'zip',
        size: '112.5 MB',
        rowCount: 12000,
        status: 'invalid', // Demonstrating dirty dataset
        brokenFilesCount: 14,
        missingColumnsCount: 2,
        detectedSchema: ['challenge_id', 'programming_lang', 'test_suite_js', 'solution_a_ts', 'solution_b_ts'],
        createdAt: new Date(Date.now() - 50 * 3600 * 1000).toISOString(),
      },
      {
        id: 'ds_meta_safety_prompts',
        name: 'Llama 4 redteaming toxic baseline.json',
        type: 'json',
        size: '4.8 MB',
        rowCount: 15000,
        status: 'valid',
        brokenFilesCount: 0,
        missingColumnsCount: 0,
        detectedSchema: ['exploit_id', 'vector_type', 'query_payload', 'expected_containment_log'],
        createdAt: new Date(Date.now() - 5 * 3600 * 1000).toISOString(),
      },
    ];

    mockDatasets.forEach((ds) => {
      MemoryDatabase.set('datasets', ds.id, ds);
    });
  }
}
