/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { DatasetEntity, DatasetLifecycle, DatasetCategory, DatasetPermissionRole } from '../types';

/**
 * Interface representing the Dataset Repository API.
 * This abstracts database operations for future-proofing Firestore/Cloud SQL integrations.
 */
export interface IDatasetRepository {
  getAll(): Promise<DatasetEntity[]>;
  getById(id: string): Promise<DatasetEntity | null>;
  save(entity: DatasetEntity): Promise<void>;
  delete(id: string): Promise<void>;
}

// Memory database key for client-side storage & state synchronization
const STORAGE_KEY = 'tasknova_enterprise_datasets';

export class DatasetRepository implements IDatasetRepository {
  private inMemoryCache: DatasetEntity[] = [];

  constructor() {
    this.initializeData();
  }

  private initializeData() {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        this.inMemoryCache = JSON.parse(saved);
        return;
      } catch (e) {
        console.error('Failed parsing saved datasets from storage, re-seeding.', e);
      }
    }

    this.inMemoryCache = this.getSeedData();
    this.persist();
  }

  private persist() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(this.inMemoryCache));
  }

  private getSeedData(): DatasetEntity[] {
    const now = new Date();
    
    return [
      {
        id: 'ds_01',
        name: 'LLM Reinforcement Learning Safety Red-Teaming Baseline',
        category: DatasetCategory.REINFORCEMENT_LEARNING,
        lifecycle: DatasetLifecycle.PUBLISHED,
        createdAt: new Date(now.getTime() - 15 * 24 * 3600 * 1000).toISOString(),
        updatedAt: new Date(now.getTime() - 2 * 24 * 3600 * 1000).toISOString(),
        currentVersionId: 'ver_01_v1.0.0',
        metadata: {
          description: 'A premium instruction-tuning prompt corpus containing red-teaming adversarial payloads designed to align models against toxic jailbreaks, prompt injections, and indirect training data poisoning.',
          creatorId: 'user_researcher_alpha',
          creatorName: 'Dr. Evelyn Carter',
          organizationId: 'org_cyber_sec_ai',
          licensing: 'Apache-2.0 Enterprise Use Licence',
          language: 'English (US)',
          country: 'United States',
          isConfidential: true,
          complianceLabels: ['SOC-2 Type II', 'EU AI Act High-Risk Compliant', 'NIST AI RMF'],
          tags: [
            { id: 't1', name: 'Safety', color: 'bg-rose-500/10 text-rose-400 border-rose-500/20' },
            { id: 't2', name: 'Alignment', color: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20' },
            { id: 't3', name: 'Red-Teaming', color: 'bg-amber-500/10 text-amber-400 border-amber-500/20' }
          ]
        },
        statistics: {
          rowCount: 48500,
          columnCount: 5,
          fileSizeInBytes: 15414000, // 14.7 MB
          missingCellsCount: 12,
          duplicateRowsCount: 0,
          invalidValuesCount: 2,
          densityScore: 99.98,
          averageRowLength: 324
        },
        quality: {
          qualityScore: 97.4,
          integrityScore: 99.8,
          consistencyScore: 96.5,
          completenessScore: 99.9,
          confidenceScore: 98.2,
          riskScore: 4.2, // Very low residual risk
          warnings: [
            'Found 2 rows with anomalous high length values in payload field.',
            '12 optional metadata fields are null. Default values applied during parsing.'
          ],
          recommendations: [
            'Increase reinforcement density in the multilingual jailbreak prompt set.',
            'Regularly run bias audits against conversational responses.'
          ],
          potentialProblems: [
            'Minor cluster similarity in adversarial category #12 might cause localized over-fitting.'
          ]
        },
        health: {
          status: 'optimal',
          uptimePercentage: 100.0,
          lastValidationTimestamp: new Date(now.getTime() - 3600 * 1000).toISOString(),
          activeScanUptimeSec: 432000,
          redundancyFactor: 3,
          errorRate: 0.00
        },
        versions: [
          {
            id: 'ver_01_v1.0.0',
            versionString: 'v1.0.0',
            changelog: 'Initial golden baseline release. Scanned for jailbreak density and validated with 98.2% safety confidence.',
            createdAt: new Date(now.getTime() - 15 * 24 * 3600 * 1000).toISOString(),
            createdById: 'user_researcher_alpha',
            createdByName: 'Dr. Evelyn Carter',
            statistics: {
              rowCount: 48500,
              columnCount: 5,
              fileSizeInBytes: 15414000,
              missingCellsCount: 12,
              duplicateRowsCount: 0,
              invalidValuesCount: 2,
              densityScore: 99.98
            },
            quality: {
              qualityScore: 97.4,
              integrityScore: 99.8,
              consistencyScore: 96.5,
              completenessScore: 99.9,
              confidenceScore: 98.2,
              riskScore: 4.2,
              warnings: [],
              recommendations: [],
              potentialProblems: []
            },
            schema: {
              id: 'sch_v1',
              confidenceScore: 100,
              detectedAt: new Date(now.getTime() - 15 * 24 * 3600 * 1000).toISOString(),
              fields: [
                { name: 'payload_id', type: 'string', isNullable: false, description: 'Unique cryptographic identifier of prompt' },
                { name: 'instruction_adversarial', type: 'string', isNullable: false, description: 'Adversarial jailbreak instruction text' },
                { name: 'context_jailbreak_vector', type: 'string', isNullable: true, description: 'Categorical label of threat vector used' },
                { name: 'safety_alignment_target', type: 'string', isNullable: false, description: 'Target alignment guidelines text' },
                { name: 'confidence_score', type: 'number', isNullable: false, description: 'AI assessment validation confidence score' }
              ]
            },
            files: [
              {
                id: 'file_01',
                name: 'safety_jailbreak_baseline.json',
                extension: 'json',
                sizeInBytes: 15414000,
                rowCount: 48500,
                checksum: 'sha256-4b825dc98a284c1737e3d1685dc3c99a8966c43d002fcfbc40428fa6b98e2ac0',
                status: 'completed',
                uploadProgress: 100,
                uploadedAt: new Date(now.getTime() - 15 * 24 * 3600 * 1000).toISOString()
              }
            ]
          }
        ],
        attachments: [
          {
            id: 'attach_01',
            name: 'Dataset_Audit_Report_NIST.pdf',
            url: '#',
            sizeInBytes: 1420000,
            uploadedAt: new Date(now.getTime() - 15 * 24 * 3600 * 1000).toISOString()
          }
        ],
        permissions: [
          {
            userId: 'user_researcher_alpha',
            userName: 'Dr. Evelyn Carter',
            role: DatasetPermissionRole.OWNER,
            grantedAt: new Date(now.getTime() - 15 * 24 * 3600 * 1000).toISOString(),
            grantedBy: 'Admin Authority'
          },
          {
            userId: 'user_reviewer_beta',
            userName: 'Alex Mercer',
            role: DatasetPermissionRole.REVIEWER,
            grantedAt: new Date(now.getTime() - 14 * 24 * 3600 * 1000).toISOString(),
            grantedBy: 'Dr. Evelyn Carter'
          }
        ]
      },
      {
        id: 'ds_02',
        name: 'Radiology Multi-Modal Scan Analysis Library',
        category: DatasetCategory.MEDICAL_AI,
        lifecycle: DatasetLifecycle.SCHEMA_VALIDATION,
        createdAt: new Date(now.getTime() - 3 * 24 * 3600 * 1000).toISOString(),
        updatedAt: new Date(now.getTime() - 1 * 24 * 3600 * 1000).toISOString(),
        currentVersionId: 'ver_02_v0.1.0',
        metadata: {
          description: 'A multi-modal oncology radiology dataset mapping high-resolution imaging coordinates to automated diagnostic text logs to train visual-medical transformer models.',
          creatorId: 'user_researcher_medical',
          creatorName: 'Dr. Sarah Lin',
          organizationId: 'org_health_ai_research',
          licensing: 'Nongovernmental HIPAA-Regulated Research License',
          language: 'English (US)',
          country: 'Canada',
          isConfidential: true,
          complianceLabels: ['HIPAA Compliant', 'PHIPA Secure', 'FDA Title 21 CFR Part 11'],
          tags: [
            { id: 't4', name: 'Medical', color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' },
            { id: 't5', name: 'Computer-Vision', color: 'bg-purple-500/10 text-purple-400 border-purple-500/20' },
            { id: 't6', name: 'HIPAA', color: 'bg-blue-500/10 text-blue-400 border-blue-500/20' }
          ]
        },
        statistics: {
          rowCount: 12500,
          columnCount: 8,
          fileSizeInBytes: 125829120, // 120 MB
          missingCellsCount: 340,
          duplicateRowsCount: 18,
          invalidValuesCount: 140,
          densityScore: 96.6,
          averageRowLength: 812
        },
        quality: {
          qualityScore: 78.5,
          integrityScore: 89.4,
          consistencyScore: 82.1,
          completenessScore: 92.5,
          confidenceScore: 88.0,
          riskScore: 24.5, // HIPAA boundary concerns
          warnings: [
            'Found 340 null values in patient_age field (imputed as median).',
            '18 duplicate entries found based on imaging hash key.'
          ],
          recommendations: [
            'Strictly purge any diagnostic notes that mention local hospital zip codes.',
            'Run deep deduplication matching the image array checksums.'
          ],
          potentialProblems: [
            'Corrupted pixel coordinates detected in DICOM image reference #419.'
          ]
        },
        health: {
          status: 'degraded',
          uptimePercentage: 98.4,
          lastValidationTimestamp: new Date(now.getTime() - 12 * 3600 * 1000).toISOString(),
          activeScanUptimeSec: 259200,
          redundancyFactor: 2,
          errorRate: 0.012
        },
        versions: [
          {
            id: 'ver_02_v0.1.0',
            versionString: 'v0.1.0',
            changelog: 'Draft ingestion from clinical imaging archive. Scanning for HIPAA compliance leak risks.',
            createdAt: new Date(now.getTime() - 3 * 24 * 3600 * 1000).toISOString(),
            createdById: 'user_researcher_medical',
            createdByName: 'Dr. Sarah Lin',
            statistics: {
              rowCount: 12500,
              columnCount: 8,
              fileSizeInBytes: 125829120,
              missingCellsCount: 340,
              duplicateRowsCount: 18,
              invalidValuesCount: 140,
              densityScore: 96.6
            },
            quality: {
              qualityScore: 78.5,
              integrityScore: 89.4,
              consistencyScore: 82.1,
              completenessScore: 92.5,
              confidenceScore: 88.0,
              riskScore: 24.5,
              warnings: [],
              recommendations: [],
              potentialProblems: []
            },
            schema: {
              id: 'sch_v2',
              confidenceScore: 94.2,
              detectedAt: new Date(now.getTime() - 3 * 24 * 3600 * 1000).toISOString(),
              fields: [
                { name: 'dicom_hash', type: 'string', isNullable: false, description: 'Cryptographic hash of imaging file' },
                { name: 'image_reference_uri', type: 'string', isNullable: false, description: 'Secured cloud bucket pointer link' },
                { name: 'anatomical_site', type: 'string', isNullable: false, description: 'Medical segment of body being analyzed' },
                { name: 'findings_log_raw', type: 'string', isNullable: false, description: 'Raw textual notes from primary radiologist' },
                { name: 'severity_rank', type: 'number', isNullable: false, description: '1-10 severity score indicator' }
              ]
            },
            files: [
              {
                id: 'file_02_img',
                name: 'radiology_images_dicom.zip',
                extension: 'zip',
                sizeInBytes: 121000000,
                rowCount: 12500,
                checksum: 'sha256-abc825dc98a284c1737e3d1685dc3c99a8966c43d002fcfbc40428fa6b98e2d4d',
                status: 'completed',
                uploadProgress: 100,
                uploadedAt: new Date(now.getTime() - 3 * 24 * 3600 * 1000).toISOString()
              },
              {
                id: 'file_02_meta',
                name: 'radiology_findings_metadata.csv',
                extension: 'csv',
                sizeInBytes: 4829120,
                rowCount: 12500,
                checksum: 'sha256-ff425dc98a284c1737e3d1685dc3c99a8966c43d002fcfbc40428fa6b98e2b8c',
                status: 'completed',
                uploadProgress: 100,
                uploadedAt: new Date(now.getTime() - 3 * 24 * 3600 * 1000).toISOString()
              }
            ]
          }
        ],
        attachments: [],
        permissions: [
          {
            userId: 'user_researcher_medical',
            userName: 'Dr. Sarah Lin',
            role: DatasetPermissionRole.OWNER,
            grantedAt: new Date(now.getTime() - 3 * 24 * 3600 * 1000).toISOString(),
            grantedBy: 'Medical Board'
          }
        ]
      },
      {
        id: 'ds_03',
        name: 'Conversational Dialogue Jailbreak Probes',
        category: DatasetCategory.NLP_TEXT,
        lifecycle: DatasetLifecycle.DRAFT,
        createdAt: new Date(now.getTime() - 1 * 24 * 3600 * 1000).toISOString(),
        updatedAt: new Date(now.getTime() - 12 * 3600 * 1000).toISOString(),
        currentVersionId: 'ver_03_v0.0.1',
        metadata: {
          description: 'A sandbox prompt set created to document and benchmark complex multi-turn jailbreak attempts on conversational chat assistants.',
          creatorId: 'user_researcher_alpha',
          creatorName: 'Dr. Evelyn Carter',
          organizationId: 'org_cyber_sec_ai',
          licensing: 'CC0 Public Domain',
          language: 'English',
          country: 'Global',
          isConfidential: false,
          complianceLabels: [],
          tags: [
            { id: 't1', name: 'Safety', color: 'bg-rose-500/10 text-rose-400 border-rose-500/20' }
          ]
        },
        statistics: {
          rowCount: 450,
          columnCount: 3,
          fileSizeInBytes: 245000, // 245 KB
          missingCellsCount: 0,
          duplicateRowsCount: 0,
          invalidValuesCount: 0,
          densityScore: 100.0,
          averageRowLength: 120
        },
        quality: {
          qualityScore: 99.0,
          integrityScore: 100.0,
          consistencyScore: 98.0,
          completenessScore: 100.0,
          confidenceScore: 99.5,
          riskScore: 92.5, // Highly risky test corpus
          warnings: [],
          recommendations: ['Do not use this dataset on production models without specialized guardrails.'],
          potentialProblems: []
        },
        health: {
          status: 'optimal',
          uptimePercentage: 100.0,
          lastValidationTimestamp: new Date().toISOString(),
          activeScanUptimeSec: 3600,
          redundancyFactor: 1,
          errorRate: 0.00
        },
        versions: [
          {
            id: 'ver_03_v0.0.1',
            versionString: 'v0.0.1',
            changelog: 'Initial rough list of conversational jailbreaks.',
            createdAt: new Date(now.getTime() - 1 * 24 * 3600 * 1000).toISOString(),
            createdById: 'user_researcher_alpha',
            createdByName: 'Dr. Evelyn Carter',
            statistics: {
              rowCount: 450,
              columnCount: 3,
              fileSizeInBytes: 245000,
              missingCellsCount: 0,
              duplicateRowsCount: 0,
              invalidValuesCount: 0,
              densityScore: 100.0
            },
            quality: {
              qualityScore: 99.0,
              integrityScore: 100.0,
              consistencyScore: 98.0,
              completenessScore: 100.0,
              confidenceScore: 99.5,
              riskScore: 92.5,
              warnings: [],
              recommendations: [],
              potentialProblems: []
            },
            schema: {
              id: 'sch_v3',
              confidenceScore: 100,
              detectedAt: new Date(now.getTime() - 1 * 24 * 3600 * 1000).toISOString(),
              fields: [
                { name: 'probe_id', type: 'string', isNullable: false },
                { name: 'input_text', type: 'string', isNullable: false },
                { name: 'threat_rating', type: 'number', isNullable: false }
              ]
            },
            files: [
              {
                id: 'file_03',
                name: 'jailbreak_conversations.json',
                extension: 'json',
                sizeInBytes: 245000,
                rowCount: 450,
                checksum: 'sha256-da825dc98a284c1737e3d1685dc3c99a8966c43d002fcfbc40428fa6b98e2b67',
                status: 'completed',
                uploadProgress: 100,
                uploadedAt: new Date(now.getTime() - 1 * 24 * 3600 * 1000).toISOString()
              }
            ]
          }
        ],
        attachments: [],
        permissions: [
          {
            userId: 'user_researcher_alpha',
            userName: 'Dr. Evelyn Carter',
            role: DatasetPermissionRole.OWNER,
            grantedAt: new Date(now.getTime() - 1 * 24 * 3600 * 1000).toISOString(),
            grantedBy: 'Admin Authority'
          }
        ]
      }
    ];
  }

  async getAll(): Promise<DatasetEntity[]> {
    return [...this.inMemoryCache];
  }

  async getById(id: string): Promise<DatasetEntity | null> {
    const item = this.inMemoryCache.find((d) => d.id === id);
    return item ? { ...item } : null;
  }

  async save(entity: DatasetEntity): Promise<void> {
    const idx = this.inMemoryCache.findIndex((d) => d.id === entity.id);
    if (idx >= 0) {
      this.inMemoryCache[idx] = entity;
    } else {
      this.inMemoryCache.push(entity);
    }
    this.persist();
  }

  async delete(id: string): Promise<void> {
    this.inMemoryCache = this.inMemoryCache.filter((d) => d.id !== id);
    this.persist();
  }
}
