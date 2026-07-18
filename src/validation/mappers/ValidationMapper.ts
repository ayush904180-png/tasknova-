/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ValidationRecord, QualityScoreModel, ConfidenceModel, RiskModel, TrustEngineRecord } from '../../types/validation';

/**
 * Bidirectional Domain Mapper for Validation Records.
 * Isolates memory states from persistence schemas and converts raw JSON objects to domain entities.
 */
export class ValidationMapper {
  
  /**
   * Translates a raw database JSON payload into a type-safe ValidationRecord.
   */
  static toDomain(raw: any): ValidationRecord {
    return {
      validationId: String(raw.validationId || ''),
      submissionId: String(raw.submissionId || ''),
      taskId: String(raw.taskId || ''),
      userId: String(raw.userId || ''),
      validationStatus: raw.validationStatus || 'Pending',
      decision: raw.decision || 'Human Review Queue',
      startedAt: raw.startedAt || new Date().toISOString(),
      completedAt: raw.completedAt || null,
      elapsedMs: Number(raw.elapsedMs || 0),
      steps: Array.isArray(raw.steps) ? raw.steps.map((s: any) => ({
        type: s.type,
        name: s.name,
        status: s.status,
        startedAt: s.startedAt,
        completedAt: s.completedAt,
        error: s.error,
        output: s.output
      })) : [],
      qualityScores: this.mapQualityScores(raw.qualityScores),
      confidence: this.mapConfidence(raw.confidence),
      riskScores: this.mapRiskScores(raw.riskScores),
      trustState: this.mapTrustState(raw.trustState),
      signature: String(raw.signature || ''),
      auditTrail: Array.isArray(raw.auditTrail) ? raw.auditTrail.map(String) : []
    };
  }

  /**
   * Serializes a type-safe ValidationRecord domain entity into a raw JSON object for persistence.
   */
  static toPersistence(record: ValidationRecord): Record<string, any> {
    return {
      validationId: record.validationId,
      submissionId: record.submissionId,
      taskId: record.taskId,
      userId: record.userId,
      validationStatus: record.validationStatus,
      decision: record.decision,
      startedAt: record.startedAt,
      completedAt: record.completedAt,
      elapsedMs: record.elapsedMs,
      steps: record.steps,
      qualityScores: record.qualityScores,
      confidence: record.confidence,
      riskScores: record.riskScores,
      trustState: record.trustState,
      signature: record.signature,
      auditTrail: record.auditTrail,
      schemaVersion: 1, // Dynamic model schema version
      persistedAt: new Date().toISOString()
    };
  }

  private static mapQualityScores(raw: any): QualityScoreModel {
    const data = raw || {};
    return {
      accuracyScore: Number(data.accuracyScore ?? 0),
      consistencyScore: Number(data.consistencyScore ?? 0),
      instructionFollowingScore: Number(data.instructionFollowingScore ?? 0),
      completenessScore: Number(data.completenessScore ?? 0),
      speedScore: Number(data.speedScore ?? 0),
      trustModifier: Number(data.trustModifier ?? 0),
      finalQualityScore: Number(data.finalQualityScore ?? 0)
    };
  }

  private static mapConfidence(raw: any): ConfidenceModel {
    const data = raw || {};
    return {
      confidencePercent: Number(data.confidencePercent ?? 0),
      confidenceLevel: data.confidenceLevel || 'Low',
      decisionThresholds: {
        autoApproveThreshold: Number(data.decisionThresholds?.autoApproveThreshold ?? 85),
        autoRejectThreshold: Number(data.decisionThresholds?.autoRejectThreshold ?? 30)
      }
    };
  }

  private static mapRiskScores(raw: any): RiskModel {
    const data = raw || {};
    return {
      spamRisk: Number(data.spamRisk ?? 0),
      fraudRisk: Number(data.fraudRisk ?? 0),
      duplicateRisk: Number(data.duplicateRisk ?? 0),
      automationRisk: Number(data.automationRisk ?? 0),
      botRisk: Number(data.botRisk ?? 0),
      velocityRisk: Number(data.velocityRisk ?? 0),
      behaviorRisk: Number(data.behaviorRisk ?? 0),
      deviceRisk: Number(data.deviceRisk ?? 0),
      networkRisk: Number(data.networkRisk ?? 0),
      aiRisk: Number(data.aiRisk ?? 0),
      aggregateRiskScore: Number(data.aggregateRiskScore ?? 0)
    };
  }

  private static mapTrustState(raw: any): TrustEngineRecord {
    const data = raw || {};
    return {
      trustSnapshot: {
        currentScore: Number(data.trustSnapshot?.currentScore ?? 100),
        accuracy: Number(data.trustSnapshot?.accuracy ?? 100),
        speedIndex: Number(data.trustSnapshot?.speedIndex ?? 1.0),
        spamProbability: Number(data.trustSnapshot?.spamProbability ?? 0.0),
        flaggedAttemptsCount: Number(data.trustSnapshot?.flaggedAttemptsCount ?? 0)
      },
      trustHistory: Array.isArray(data.trustHistory) ? data.trustHistory.map(Number) : [],
      trustDelta: Number(data.trustDelta ?? 0),
      trustLevel: data.trustLevel || 'Medium',
      trustTrend: data.trustTrend || 'Stable'
    };
  }
}
export default ValidationMapper;
