/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export enum DatasetLifecycle {
  DRAFT = 'Draft',
  UPLOADING = 'Uploading',
  UPLOADED = 'Uploaded',
  SCANNING = 'Scanning',
  SCHEMA_VALIDATION = 'Schema Validation',
  QUALITY_INSPECTION = 'Quality Inspection',
  DUPLICATE_DETECTION = 'Duplicate Detection',
  HUMAN_QA = 'Human QA',
  APPROVED = 'Approved',
  PUBLISHED = 'Published',
  ARCHIVED = 'Archived',
  DELETED = 'Deleted',
}

export enum DatasetCategory {
  NLP_TEXT = 'NLP / Text Corpus',
  COMPUTER_VISION = 'Computer Vision',
  AUDIO_SPEECH = 'Audio / Speech',
  REINFORCEMENT_LEARNING = 'RLHF Alignments',
  TABULAR_STRUCT = 'Tabular Structured',
  MULTIMODAL = 'Multimodal Context',
  MEDICAL_AI = 'Healthcare & Bio',
  CODE_GENERATION = 'Code & Algorithms',
}

export enum DatasetPermissionRole {
  OWNER = 'Owner',
  RESEARCHER = 'Researcher',
  REVIEWER = 'Reviewer',
  BUSINESS = 'Business',
  AUDITOR = 'Auditor',
  ADMIN = 'Admin',
  DEVELOPER = 'Developer',
}

export interface DatasetTag {
  id: string;
  name: string;
  color?: string;
}

export interface DatasetMetadata {
  description: string;
  creatorId: string;
  creatorName: string;
  organizationId: string;
  licensing: string;
  language: string;
  country: string;
  tags: DatasetTag[];
  isConfidential: boolean;
  complianceLabels: string[];
}

export interface DatasetSchemaField {
  name: string;
  type: 'string' | 'number' | 'boolean' | 'array' | 'object' | 'null';
  isNullable: boolean;
  description?: string;
  sampleValue?: string;
}

export interface DatasetSchema {
  id: string;
  fields: DatasetSchemaField[];
  primaryKey?: string;
  confidenceScore: number;
  detectedAt: string;
}

export interface DatasetStatistics {
  rowCount: number;
  columnCount: number;
  fileSizeInBytes: number;
  missingCellsCount: number;
  duplicateRowsCount: number;
  invalidValuesCount: number;
  densityScore: number; // Percentage of non-null values
  averageRowLength?: number;
}

export interface DatasetQuality {
  qualityScore: number;      // 0 to 100
  integrityScore: number;    // 0 to 100
  consistencyScore: number;  // 0 to 100
  completenessScore: number; // 0 to 100
  confidenceScore: number;   // 0 to 100
  riskScore: number;         // 0 to 100 (security / safety / leak risk)
  warnings: string[];
  recommendations: string[];
  potentialProblems: string[];
}

export interface DatasetHealth {
  status: 'optimal' | 'degraded' | 'critical';
  uptimePercentage: number;
  lastValidationTimestamp: string;
  activeScanUptimeSec: number;
  redundancyFactor: number;
  errorRate: number;
}

export interface DatasetFile {
  id: string;
  name: string;
  extension: string;
  sizeInBytes: number;
  rowCount: number;
  checksum: string;
  status: 'pending' | 'uploading' | 'completed' | 'failed';
  uploadProgress: number; // 0 to 100
  uploadedAt?: string;
}

export interface DatasetVersion {
  id: string;
  versionString: string; // e.g. "v1.0.0"
  changelog: string;
  createdAt: string;
  createdById: string;
  createdByName: string;
  statistics: DatasetStatistics;
  quality: DatasetQuality;
  schema: DatasetSchema;
  files: DatasetFile[];
}

export interface DatasetAttachment {
  id: string;
  name: string;
  url: string;
  sizeInBytes: number;
  uploadedAt: string;
}

export interface DatasetAuditLog {
  id: string;
  datasetId: string;
  timestamp: string;
  userId: string;
  userName: string;
  userRole: DatasetPermissionRole;
  previousState: DatasetLifecycle;
  newState: DatasetLifecycle;
  comment: string;
  ipAddress?: string;
}

export interface DatasetPermission {
  userId: string;
  userName: string;
  role: DatasetPermissionRole;
  grantedAt: string;
  grantedBy: string;
}

export interface DatasetExport {
  id: string;
  datasetId: string;
  versionId: string;
  format: 'csv' | 'json' | 'parquet' | 'tfrecord' | 'h5';
  status: 'processing' | 'ready' | 'failed';
  downloadUrl?: string;
  requestedAt: string;
  requestedBy: string;
  expiresAt: string;
}

export interface DatasetEntity {
  id: string;
  name: string;
  category: DatasetCategory;
  lifecycle: DatasetLifecycle;
  metadata: DatasetMetadata;
  statistics: DatasetStatistics;
  quality: DatasetQuality;
  health: DatasetHealth;
  currentVersionId: string;
  versions: DatasetVersion[];
  attachments: DatasetAttachment[];
  permissions: DatasetPermission[];
  createdAt: string;
  updatedAt: string;
}
