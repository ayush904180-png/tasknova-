/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { MemoryDatabase } from '../../infrastructure/repositories/FirestoreRepository';
import { AuditLogEntry } from '../types';

export class AuditLogRepository {
  constructor() {
    this.seedInitialData();
  }

  private seedInitialData() {
    const existing = MemoryDatabase.list('business_audit_logs');
    if (existing && existing.length > 0) {
      return;
    }

    const initialLogs: AuditLogEntry[] = [
      {
        id: 'log_001',
        userId: 'usr_admin_01',
        userEmail: 'ayush904180@gmail.com',
        action: 'CAMPAIGN_PUBLISHED',
        details: 'Campaign "GPT-5 Reasoning Alignment & Safety RLHF" (camp_openai_gpt5_rlhf) published to public contributor pool.',
        timestamp: new Date(Date.now() - 36 * 3600 * 1000).toISOString(),
        ipAddress: '192.168.1.104',
        signature: 'sha256_sig_394a101b7cc5c18401f89ddde3e82',
      },
      {
        id: 'log_002',
        userId: 'usr_admin_01',
        userEmail: 'ayush904180@gmail.com',
        action: 'DATASET_UPLOADED',
        details: 'Dataset "Gemini Ultra Scene bounding boxes.csv" uploaded and schema auto-detected.',
        timestamp: new Date(Date.now() - 20 * 3600 * 1000).toISOString(),
        ipAddress: '192.168.1.104',
        signature: 'sha256_sig_a83109da3efc11a01b089c83271ae',
      },
      {
        id: 'log_003',
        userId: 'usr_manager_02',
        userEmail: 'manager@tasknova.ai',
        action: 'CAMPAIGN_PAUSED',
        details: 'Campaign "Claude 4 Pairwise Helpfulness Preference" paused due to quality review threshold triggers.',
        timestamp: new Date(Date.now() - 18 * 3600 * 1000).toISOString(),
        ipAddress: '10.150.2.14',
        signature: 'sha256_sig_0831a49dfef013214bc6c0137748c',
      }
    ];

    initialLogs.forEach((log) => {
      MemoryDatabase.set('business_audit_logs', log.id, log);
    });
  }

  async getLogs(): Promise<AuditLogEntry[]> {
    const list = MemoryDatabase.list('business_audit_logs') as AuditLogEntry[];
    return list.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }

  async createLog(entry: Omit<AuditLogEntry, 'id' | 'signature' | 'timestamp'>): Promise<AuditLogEntry> {
    const id = `log_${Math.random().toString(36).substr(2, 9)}`;
    const timestamp = new Date().toISOString();
    
    // Cryptographic anti-tamper signature simulation
    const signaturePayload = `${entry.userId}|${entry.action}|${timestamp}|${entry.details}`;
    const signature = `sha256_sig_${btoa(signaturePayload).substr(0, 32).toLowerCase()}`;

    const fullEntry: AuditLogEntry = {
      ...entry,
      id,
      timestamp,
      signature,
    };

    MemoryDatabase.set('business_audit_logs', id, fullEntry);
    return fullEntry;
  }
}
