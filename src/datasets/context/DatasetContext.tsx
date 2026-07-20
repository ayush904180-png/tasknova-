/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
  DatasetEntity, DatasetLifecycle, DatasetCategory, DatasetPermissionRole, 
  DatasetVersion, DatasetFile, DatasetSchema, DatasetStatistics, DatasetQuality,
  DatasetHealth, DatasetMetadata, DatasetAuditLog, DatasetExport
} from '../types';
import { DatasetRepository } from '../repositories/DatasetRepository';
import { DatasetCache } from '../cache/DatasetCache';
import { DatasetEventBus } from '../events/DatasetEventBus';
import { DatasetValidator } from '../validators/DatasetValidator';
import { QualityEngine } from '../services/QualityEngine';
import { DatasetUtils } from '../utils/DatasetUtils';
import { DatasetMapper } from '../mappers/DatasetMapper';

interface DatasetContextType {
  datasets: DatasetEntity[];
  activeRole: DatasetPermissionRole;
  setActiveRole: (role: DatasetPermissionRole) => void;
  auditLogs: DatasetAuditLog[];
  exports: DatasetExport[];
  uploadQueue: DatasetFile[];
  activeUploadingDatasetId: string | null;
  
  // Actions
  createDataset: (name: string, category: DatasetCategory, description: string) => Promise<DatasetEntity>;
  startSimulatedFileUpload: (datasetId: string, file: File | { name: string; size: number }) => Promise<void>;
  updateLifecycle: (datasetId: string, nextState: DatasetLifecycle, comment: string) => Promise<void>;
  updateSchema: (datasetId: string, updatedFields: any) => Promise<void>;
  createNewVersion: (datasetId: string, versionString: string, changelog: string) => Promise<void>;
  triggerExport: (datasetId: string, format: 'csv' | 'json' | 'parquet') => Promise<DatasetExport>;
  deleteDataset: (id: string) => Promise<void>;
  grantPermission: (datasetId: string, userId: string, userName: string, role: DatasetPermissionRole) => Promise<void>;
  runImputationPipeline: (datasetId: string) => Promise<void>;
}

const DatasetContext = createContext<DatasetContextType | undefined>(undefined);

const repository = new DatasetRepository();

export const DatasetProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [datasets, setDatasets] = useState<DatasetEntity[]>([]);
  const [activeRole, setActiveRole] = useState<DatasetPermissionRole>(DatasetPermissionRole.OWNER);
  const [auditLogs, setAuditLogs] = useState<DatasetAuditLog[]>([]);
  const [exports, setExports] = useState<DatasetExport[]>([]);
  const [uploadQueue, setUploadQueue] = useState<DatasetFile[]>([]);
  const [activeUploadingDatasetId, setActiveUploadingDatasetId] = useState<string | null>(null);

  // Initial load
  useEffect(() => {
    const loadInitial = async () => {
      // 1. Try Cache first
      const cached = DatasetCache.get<DatasetEntity[]>('all_datasets_list');
      if (cached) {
        setDatasets(cached);
      } else {
        const list = await repository.getAll();
        setDatasets(list);
        DatasetCache.set('all_datasets_list', list);
      }

      // Load Audits
      const savedAudits = localStorage.getItem('tasknova_dataset_audits');
      if (savedAudits) {
        try {
          setAuditLogs(JSON.parse(savedAudits));
        } catch (e) {
          console.error(e);
        }
      }
    };
    loadInitial();
  }, []);

  // Save audit logs helper
  const addAuditEntry = (datasetId: string, prev: DatasetLifecycle, next: DatasetLifecycle, comment: string) => {
    const newEntry: DatasetAuditLog = {
      id: `aud_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      datasetId,
      timestamp: new Date().toISOString(),
      userId: 'usr_active_op',
      userName: 'Principal Staff Architect',
      userRole: activeRole,
      previousState: prev,
      newState: next,
      comment,
      ipAddress: '10.240.48.12'
    };

    setAuditLogs((prevList) => {
      const updated = [newEntry, ...prevList];
      localStorage.setItem('tasknova_dataset_audits', JSON.stringify(updated));
      return updated;
    });
  };

  // 1. Create Dataset Ingest Shell
  const createDataset = async (name: string, category: DatasetCategory, description: string): Promise<DatasetEntity> => {
    const nowStr = new Date().toISOString();
    const newId = `ds_${Date.now()}`;
    
    const newDataset: DatasetEntity = {
      id: newId,
      name,
      category,
      lifecycle: DatasetLifecycle.DRAFT,
      createdAt: nowStr,
      updatedAt: nowStr,
      currentVersionId: `ver_init_v0.1.0`,
      metadata: {
        description,
        creatorId: 'usr_active_op',
        creatorName: 'Principal Staff Architect',
        organizationId: 'org_tasknova_platform',
        licensing: 'MIT Standard Open Source License',
        language: 'English',
        country: 'Global',
        isConfidential: false,
        complianceLabels: ['Standard Scan Pending'],
        tags: [{ id: 't_init', name: 'Raw Ingest', color: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20' }]
      },
      statistics: {
        rowCount: 0,
        columnCount: 0,
        fileSizeInBytes: 0,
        missingCellsCount: 0,
        duplicateRowsCount: 0,
        invalidValuesCount: 0,
        densityScore: 100,
        averageRowLength: 0
      },
      quality: {
        qualityScore: 100,
        integrityScore: 100,
        consistencyScore: 100,
        completenessScore: 100,
        confidenceScore: 100,
        riskScore: 0,
        warnings: [],
        recommendations: ['Ingest first files to compute quality metrics.'],
        potentialProblems: []
      },
      health: {
        status: 'optimal',
        uptimePercentage: 100,
        lastValidationTimestamp: nowStr,
        activeScanUptimeSec: 0,
        redundancyFactor: 1,
        errorRate: 0
      },
      versions: [],
      attachments: [],
      permissions: [
        {
          userId: 'usr_active_op',
          userName: 'Principal Staff Architect',
          role: DatasetPermissionRole.OWNER,
          grantedAt: nowStr,
          grantedBy: 'Admin Root'
        }
      ]
    };

    const updated = [newDataset, ...datasets];
    setDatasets(updated);
    await repository.save(newDataset);
    DatasetCache.set('all_datasets_list', updated);

    // Publish event
    DatasetEventBus.publish('DatasetCreated', {
      datasetId: newId,
      datasetName: name,
      timestamp: nowStr,
      userId: 'usr_active_op',
      userName: 'Principal Staff Architect',
      comment: 'Initialized new corporate dataset container.'
    });

    addAuditEntry(newId, DatasetLifecycle.DRAFT, DatasetLifecycle.DRAFT, 'Created dataset metadata container shell.');

    return newDataset;
  };

  // 2. Simulated File Upload & Pipeline Ingestion state machine
  const startSimulatedFileUpload = async (datasetId: string, file: File | { name: string; size: number }) => {
    const ds = datasets.find(d => d.id === datasetId);
    if (!ds) return;

    setActiveUploadingDatasetId(datasetId);

    // Initial draft file model
    const fileId = `file_${Date.now()}`;
    const fileExt = file.name.split('.').pop() || 'json';
    const checksum = DatasetUtils.generateSHA256Checksum(file.name, file.size);

    const initialFile: DatasetFile = {
      id: fileId,
      name: file.name,
      extension: fileExt,
      sizeInBytes: file.size,
      rowCount: 0,
      checksum,
      status: 'pending',
      uploadProgress: 0
    };

    setUploadQueue([initialFile]);

    // TRANSITION: Draft -> Uploading
    await updateLifecycle(datasetId, DatasetLifecycle.UPLOADING, `Initiated file stream upload for "${file.name}".`);
    DatasetEventBus.publish('UploadStarted', {
      datasetId,
      datasetName: ds.name,
      timestamp: new Date().toISOString(),
      userId: 'usr_active_op',
      userName: 'Principal Staff Architect',
      comment: `Uploading file block ${file.name}`
    });

    // 1. SIMULATE UPLOAD (0 to 100%)
    for (let p = 10; p <= 100; p += 15) {
      await new Promise(r => setTimeout(r, 200));
      setUploadQueue(prev => prev.map(f => f.id === fileId ? { ...f, uploadProgress: Math.min(100, p), status: p >= 100 ? 'completed' : 'uploading' } : f));
    }

    const uploadedFile: DatasetFile = {
      ...initialFile,
      status: 'completed',
      uploadProgress: 100,
      uploadedAt: new Date().toISOString()
    };

    // TRANSITION: Uploading -> Uploaded
    await updateLifecycle(datasetId, DatasetLifecycle.UPLOADED, `Completed file upload of "${file.name}" with check-sum verification.`);
    DatasetEventBus.publish('UploadCompleted', {
      datasetId,
      datasetName: ds.name,
      timestamp: new Date().toISOString(),
      userId: 'usr_active_op',
      userName: 'Principal Staff Architect',
      comment: `Ingested ${DatasetMapper.formatBytes(file.size)} bytes securely.`
    });

    // 2. SIMULATE SCANNING (Anti-virus, safety, and formats)
    await updateLifecycle(datasetId, DatasetLifecycle.SCANNING, `Analyzing dataset headers, byte arrays, and safety vectors.`);
    DatasetEventBus.publish('ValidationStarted', {
      datasetId,
      datasetName: ds.name,
      timestamp: new Date().toISOString(),
      userId: 'usr_active_op',
      userName: 'Principal Staff Architect'
    });
    await new Promise(r => setTimeout(r, 1000));

    // Compute mock row stats and columns
    const predictedRows = Math.max(250, Math.round(file.size / 300));
    const randomCols = fileExt === 'csv' ? 5 : fileExt === 'json' ? 4 : 3;

    // Detect mock schema fields
    const mockRowData = DatasetUtils.generateRandomDatasetRows(predictedRows, randomCols);
    const autoSchema = DatasetValidator.detectSchemaFromData(mockRowData);

    // TRANSITION: Scanning -> Schema Validation
    await updateLifecycle(datasetId, DatasetLifecycle.SCHEMA_VALIDATION, `Auto-detected schema fields with ${autoSchema.confidenceScore}% confidence index.`);
    await new Promise(r => setTimeout(r, 1000));

    // Calculate quality heuristics based on category
    const stats: DatasetStatistics = {
      rowCount: predictedRows,
      columnCount: autoSchema.fields.length,
      fileSizeInBytes: file.size,
      missingCellsCount: Math.round(predictedRows * 0.01),
      duplicateRowsCount: fileExt === 'zip' ? Math.round(predictedRows * 0.08) : 0,
      invalidValuesCount: Math.round(predictedRows * 0.005),
      densityScore: 98.9,
      averageRowLength: fileExt === 'txt' ? 180 : 340
    };

    const calculatedQuality = QualityEngine.calculateDatasetQuality(stats, ds.metadata.isConfidential, fileExt);

    // TRANSITION: Schema Validation -> Quality Inspection
    await updateLifecycle(datasetId, DatasetLifecycle.QUALITY_INSPECTION, `Quality scan finalized with overall platform rating of ${calculatedQuality.qualityScore}/100.`);
    DatasetEventBus.publish('QualityCalculated', {
      datasetId,
      datasetName: ds.name,
      timestamp: new Date().toISOString(),
      userId: 'usr_active_op',
      userName: 'Principal Staff Architect',
      meta: { qualityScore: calculatedQuality.qualityScore }
    });
    await new Promise(r => setTimeout(r, 800));

    // TRANSITION: Quality Inspection -> Duplicate Detection
    await updateLifecycle(datasetId, DatasetLifecycle.DUPLICATE_DETECTION, `Executing LSH clustering duplicate search patterns.`);
    await new Promise(r => setTimeout(r, 800));

    // TRANSITION: Duplicate Detection -> Human QA
    await updateLifecycle(datasetId, DatasetLifecycle.HUMAN_QA, `Assigned review checklist queue for Researcher and Reviewer validation.`);

    // 3. Finalize Dataset Entity with Ingested data & initial version
    setDatasets(prevList => {
      const updated = prevList.map(item => {
        if (item.id === datasetId) {
          const firstVer: DatasetVersion = {
            id: `ver_${Date.now()}_v1_0_0`,
            versionString: 'v1.0.0',
            changelog: `Ingested initial dataset segment: ${file.name}`,
            createdAt: new Date().toISOString(),
            createdById: 'usr_active_op',
            createdByName: 'Principal Staff Architect',
            statistics: stats,
            quality: calculatedQuality,
            schema: autoSchema,
            files: [uploadedFile]
          };

          const mappedEntity: DatasetEntity = {
            ...item,
            lifecycle: DatasetLifecycle.HUMAN_QA,
            statistics: stats,
            quality: calculatedQuality,
            currentVersionId: firstVer.id,
            versions: [firstVer],
            updatedAt: new Date().toISOString()
          };

          repository.save(mappedEntity);
          return mappedEntity;
        }
        return item;
      });

      DatasetCache.set('all_datasets_list', updated);
      return updated;
    });

    setActiveUploadingDatasetId(null);
    setUploadQueue([]);
  };

  // 3. Simple lifecycle transition triggers
  const updateLifecycle = async (datasetId: string, nextState: DatasetLifecycle, comment: string) => {
    setDatasets(prevList => {
      const updated = prevList.map(item => {
        if (item.id === datasetId) {
          const prev = item.lifecycle;
          addAuditEntry(datasetId, prev, nextState, comment);

          // Custom business triggers
          if (nextState === DatasetLifecycle.PUBLISHED) {
            DatasetEventBus.publish('DatasetPublished', {
              datasetId,
              datasetName: item.name,
              timestamp: new Date().toISOString(),
              userId: 'usr_active_op',
              userName: 'Principal Staff Architect',
              comment
            });
          } else if (nextState === DatasetLifecycle.APPROVED) {
            DatasetEventBus.publish('DatasetApproved', {
              datasetId,
              datasetName: item.name,
              timestamp: new Date().toISOString(),
              userId: 'usr_active_op',
              userName: 'Principal Staff Architect',
              comment
            });
          } else if (nextState === DatasetLifecycle.ARCHIVED) {
            DatasetEventBus.publish('DatasetArchived', {
              datasetId,
              datasetName: item.name,
              timestamp: new Date().toISOString(),
              userId: 'usr_active_op',
              userName: 'Principal Staff Architect',
              comment
            });
          }

          const updatedEntity: DatasetEntity = {
            ...item,
            lifecycle: nextState,
            updatedAt: new Date().toISOString()
          };

          repository.save(updatedEntity);
          return updatedEntity;
        }
        return item;
      });

      DatasetCache.set('all_datasets_list', updated);
      return updated;
    });
  };

  // 4. Update dynamic schema fields
  const updateSchema = async (datasetId: string, updatedFields: any) => {
    setDatasets(prevList => {
      const updated = prevList.map(item => {
        if (item.id === datasetId && item.versions.length > 0) {
          const currentVer = item.versions.find(v => v.id === item.currentVersionId) || item.versions[0];
          
          const newVerList = item.versions.map(v => {
            if (v.id === currentVer.id) {
              return {
                ...v,
                schema: {
                  ...v.schema,
                  fields: updatedFields
                }
              };
            }
            return v;
          });

          addAuditEntry(datasetId, item.lifecycle, item.lifecycle, 'Manually modified schema field labels and types.');

          const updatedEntity = {
            ...item,
            versions: newVerList,
            updatedAt: new Date().toISOString()
          };
          repository.save(updatedEntity);
          return updatedEntity;
        }
        return item;
      });

      DatasetCache.set('all_datasets_list', updated);
      return updated;
    });
  };

  // 5. Create new Version (Timeline & rollback system)
  const createNewVersion = async (datasetId: string, versionString: string, changelog: string) => {
    setDatasets(prevList => {
      const updated = prevList.map(item => {
        if (item.id === datasetId) {
          const currentVer = item.versions.find(v => v.id === item.currentVersionId) || item.versions[0];

          const newVer: DatasetVersion = {
            ...currentVer,
            id: `ver_${Date.now()}_${versionString.replace(/\./g, '_')}`,
            versionString,
            changelog,
            createdAt: new Date().toISOString(),
            createdById: 'usr_active_op',
            createdByName: 'Principal Staff Architect',
          };

          const updatedEntity: DatasetEntity = {
            ...item,
            currentVersionId: newVer.id,
            versions: [newVer, ...item.versions],
            updatedAt: new Date().toISOString()
          };

          addAuditEntry(datasetId, item.lifecycle, item.lifecycle, `Created new system tag baseline: ${versionString}`);
          repository.save(updatedEntity);
          return updatedEntity;
        }
        return item;
      });

      DatasetCache.set('all_datasets_list', updated);
      return updated;
    });
  };

  // 6. Imputation / Cleaner pipeline simulator
  const runImputationPipeline = async (datasetId: string) => {
    setDatasets(prevList => {
      const updated = prevList.map(item => {
        if (item.id === datasetId) {
          const cleanedStats: DatasetStatistics = {
            ...item.statistics,
            missingCellsCount: 0,
            duplicateRowsCount: 0,
            invalidValuesCount: 0,
            densityScore: 100
          };

          const improvedQuality = QualityEngine.calculateDatasetQuality(cleanedStats, item.metadata.isConfidential, 'csv');

          addAuditEntry(datasetId, item.lifecycle, item.lifecycle, 'Executed AI cleaner imputation. Deduplicated 100% of row conflicts.');

          const updatedEntity: DatasetEntity = {
            ...item,
            statistics: cleanedStats,
            quality: improvedQuality,
            updatedAt: new Date().toISOString()
          };

          repository.save(updatedEntity);
          return updatedEntity;
        }
        return item;
      });

      DatasetCache.set('all_datasets_list', updated);
      return updated;
    });
  };

  // 7. Trigger file export
  const triggerExport = async (datasetId: string, format: 'csv' | 'json' | 'parquet'): Promise<DatasetExport> => {
    const ds = datasets.find(d => d.id === datasetId);
    
    const newExport: DatasetExport = {
      id: `exp_${Date.now()}`,
      datasetId,
      versionId: ds?.currentVersionId || 'v1.0.0',
      format,
      status: 'processing',
      requestedAt: new Date().toISOString(),
      requestedBy: 'Principal Staff Architect',
      expiresAt: new Date(Date.now() + 24 * 3600 * 1000).toISOString()
    };

    setExports(prev => [newExport, ...prev]);

    // Simulate completion
    setTimeout(() => {
      setExports(prevList => prevList.map(exp => exp.id === newExport.id ? {
        ...exp,
        status: 'ready',
        downloadUrl: `https://storage.googleapis.com/tasknova_secure_exports/${exp.id}_export.${format}`
      } : exp));
    }, 1500);

    return newExport;
  };

  // 8. Delete dataset
  const deleteDataset = async (id: string) => {
    const ds = datasets.find(d => d.id === id);
    if (!ds) return;

    const updated = datasets.filter(d => d.id !== id);
    setDatasets(updated);
    await repository.delete(id);
    DatasetCache.set('all_datasets_list', updated);

    DatasetEventBus.publish('DatasetDeleted', {
      datasetId: id,
      datasetName: ds.name,
      timestamp: new Date().toISOString(),
      userId: 'usr_active_op',
      userName: 'Principal Staff Architect',
      comment: 'Purged dataset archive securely.'
    });

    // Remove audits for safety
    setAuditLogs(prev => prev.filter(l => l.datasetId !== id));
  };

  // 9. Grant Permission RBAC
  const grantPermission = async (datasetId: string, userId: string, userName: string, role: DatasetPermissionRole) => {
    setDatasets(prevList => {
      const updated = prevList.map(item => {
        if (item.id === datasetId) {
          const isExisting = item.permissions.some(p => p.userId === userId);
          const newPerms = isExisting
            ? item.permissions.map(p => p.userId === userId ? { ...p, role, grantedAt: new Date().toISOString() } : p)
            : [...item.permissions, { userId, userName, role, grantedAt: new Date().toISOString(), grantedBy: 'Principal Staff Architect' }];

          addAuditEntry(datasetId, item.lifecycle, item.lifecycle, `Modified access parameters for ${userName} to ${role}.`);

          const updatedEntity = {
            ...item,
            permissions: newPerms,
            updatedAt: new Date().toISOString()
          };
          repository.save(updatedEntity);
          return updatedEntity;
        }
        return item;
      });

      DatasetCache.set('all_datasets_list', updated);
      return updated;
    });
  };

  return (
    <DatasetContext.Provider value={{
      datasets,
      activeRole,
      setActiveRole,
      auditLogs,
      exports,
      uploadQueue,
      activeUploadingDatasetId,
      createDataset,
      startSimulatedFileUpload,
      updateLifecycle,
      updateSchema,
      createNewVersion,
      triggerExport,
      deleteDataset,
      grantPermission,
      runImputationPipeline
    }}>
      {children}
    </DatasetContext.Provider>
  );
};

export const useDatasets = () => {
  const ctx = useContext(DatasetContext);
  if (!ctx) throw new Error('useDatasets must be executed within a DatasetProvider block.');
  return ctx;
};
