/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { createContext, useContext, useState, useMemo } from 'react';
import { isInfrastructureConfigured } from '../environment/EnvConfig';
import {
  ConcreteUserRepository,
  ConcreteProfileRepository,
  ConcreteTaskRepository,
  ConcreteTaskSubmissionRepository,
  ConcreteWalletRepository,
  ConcreteTransactionRepository,
  ConcreteCampaignRepository,
  ConcreteAuditLogRepository,
} from '../repositories/ConcreteRepositories';
import { SheetsExportService, DriveStorageService } from '../services/WorkspaceServices';
import { StorageService } from '../storage/StorageService';
import { BackupService } from '../backup/BackupService';

/**
 * Interface mapping all initialized infrastructure components.
 */
export interface InfrastructureContextProps {
  isLiveMode: boolean;
  users: ConcreteUserRepository;
  profiles: ConcreteProfileRepository;
  tasks: ConcreteTaskRepository;
  submissions: ConcreteTaskSubmissionRepository;
  wallets: ConcreteWalletRepository;
  transactions: ConcreteTransactionRepository;
  campaigns: ConcreteCampaignRepository;
  auditLogs: ConcreteAuditLogRepository;
  sheetsExport: SheetsExportService;
  driveStorage: DriveStorageService;
  storage: StorageService;
  backup: BackupService;
}

const InfrastructureContext = createContext<InfrastructureContextProps | undefined>(undefined);

/**
 * Global provider bootstraps the entire Google ecosystem client facades and adapters.
 * Ensures strict decoupling: NO client UI component may invoke Firestore SDKs directly.
 */
export const InfrastructureProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // If required environment vars exist in workspace, toggle Live Mode flags
  const [isLiveMode] = useState<boolean>(isInfrastructureConfigured());

  // Instantiate clean singletons of repositories and services
  const value = useMemo<InfrastructureContextProps>(() => {
    return {
      isLiveMode,
      users: new ConcreteUserRepository(),
      profiles: new ConcreteProfileRepository(),
      tasks: new ConcreteTaskRepository(),
      submissions: new ConcreteTaskSubmissionRepository(),
      wallets: new ConcreteWalletRepository(),
      transactions: new ConcreteTransactionRepository(),
      campaigns: new ConcreteCampaignRepository(),
      auditLogs: new ConcreteAuditLogRepository(),
      sheetsExport: new SheetsExportService(),
      driveStorage: new DriveStorageService(),
      storage: new StorageService(),
      backup: new BackupService(),
    };
  }, [isLiveMode]);

  return (
    <InfrastructureContext.Provider value={value}>
      {children}
    </InfrastructureContext.Provider>
  );
};

/**
 * Access hook for UI components to retrieve the abstracted data layer.
 */
export const useInfrastructure = (): InfrastructureContextProps => {
  const context = useContext(InfrastructureContext);
  if (!context) {
    throw new Error('useInfrastructure must be executed within an InfrastructureProvider block.');
  }
  return context;
};
