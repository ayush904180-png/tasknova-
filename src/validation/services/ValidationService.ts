/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Submission, SubmissionStatus, ValidationStatus } from '../../types/submission';
import { 
  ValidationRecord, QualityScoreModel, ConfidenceModel, RiskModel, TrustEngineRecord, 
  HumanReviewItem, ValidationStepType, ValidationStepStatus, ConfidenceLevel, ReviewPriority,
  ValidationEventType, TrustLevel, TrustTrend
} from '../../types/validation';
import { GlobalValidationRepository } from '../repositories/ValidationRepository';
import { GlobalPluginRegistry } from '../plugins/TaskValidatorPlugins';
import { ValidationEventBus } from '../events/ValidationEventBus';
import { GlobalTelemetryTracker } from '../../tasks/player/TelemetryTracker';
import { GlobalSubmissionRepository } from '../../submissions/repositories/SubmissionRepository';

/**
 * Enterprise AI Validation & Quality Intelligence Orchestrator.
 * Excels in compiling micro-task compliance models, tracking telemetry metrics,
 * running the 14-step pipeline, and maintaining queue ledger alignments.
 */
export class ValidationService {

  // ==========================================
  // 1. PRIMARY ORCHESTRATION PIPELINE
  // ==========================================

  /**
   * Executes the full 14-step Validation Pipeline for a finished Submission.
   * Exposes HTTP Cloud Function ready contracts: validateSubmission()
   */
  async validateSubmission(submission: Submission): Promise<ValidationRecord> {
    const startedTime = Date.now();
    const validationId = `VAL-${Math.random().toString(36).substring(2, 10).toUpperCase()}`;
    const nowStr = new Date().toISOString();

    // Fire start event
    ValidationEventBus.emit(ValidationEventType.ValidationStarted, {
      validationId,
      submissionId: submission.submissionId,
      timestamp: nowStr
    });

    const steps: ValidationRecord['steps'] = [];
    const auditTrail: string[] = [];

    const addStep = (type: ValidationStepType, name: string) => {
      const step = {
        type,
        name,
        status: ValidationStepStatus.RUNNING,
        startedAt: new Date().toISOString(),
        completedAt: ''
      };
      steps.push(step);
      auditTrail.push(`[${step.startedAt}] Pipeline step "${name}" initiated.`);
      return step;
    };

    const completeStep = (step: any, status: ValidationStepStatus, output?: Record<string, any>, error?: string) => {
      step.status = status;
      step.completedAt = new Date().toISOString();
      step.output = output;
      step.error = error;
      auditTrail.push(`[${step.completedAt}] Step "${step.name}" finished with status: ${status}.`);
    };

    // Step 1: Submission Received
    const step1 = addStep(ValidationStepType.SCHEMA, 'Submission Received');
    completeStep(step1, ValidationStepStatus.COMPLETED, { submissionId: submission.submissionId });

    // Step 2: Schema Validation
    const step2 = addStep(ValidationStepType.SCHEMA, 'Schema Validation');
    const isSchemaValid = !!submission.submissionId && !!submission.taskId && !!submission.userId;
    completeStep(step2, isSchemaValid ? ValidationStepStatus.COMPLETED : ValidationStepStatus.FAILED, { isSchemaValid });

    if (!isSchemaValid) {
      throw new Error(`[ValidationService] Schema Validation failed for Submission ${submission.submissionId}`);
    }

    // Step 3: Payload Validation
    const step3 = addStep(ValidationStepType.PAYLOAD, 'Payload Validation');
    const hasAnswers = !!submission.answers && Object.keys(submission.answers).length > 0;
    completeStep(step3, hasAnswers ? ValidationStepStatus.COMPLETED : ValidationStepStatus.FAILED, { hasAnswers });

    // Step 4: Duplicate Detection
    const step4 = addStep(ValidationStepType.DUPLICATE, 'Duplicate Detection');
    const existingValidations = await GlobalValidationRepository.list({ submissionId: submission.submissionId });
    const isDuplicate = existingValidations.length > 0;
    completeStep(step4, ValidationStepStatus.COMPLETED, { isDuplicate, count: existingValidations.length });

    // Step 5: Spam Detection
    const step5 = addStep(ValidationStepType.SPAM, 'Spam Detection');
    let hasSpamWords = false;
    const answerText = JSON.stringify(submission.answers).toLowerCase();
    const spamPatterns = ['asdf', 'qwer', '1234', 'aaaa', 'test test'];
    if (spamPatterns.some(pat => answerText.includes(pat))) {
      hasSpamWords = true;
    }
    completeStep(step5, ValidationStepStatus.COMPLETED, { hasSpamWords });

    // Step 6: Trust Snapshot
    const step6 = addStep(ValidationStepType.TRUST, 'Trust Snapshot Retrieval');
    const reputationScore = submission.trustSnapshot?.currentScore ?? 80;
    completeStep(step6, ValidationStepStatus.COMPLETED, { reputationScore });

    // Step 7: Speed Analysis
    const step7 = addStep(ValidationStepType.SPEED, 'Speed Analysis');
    const isSpeeding = submission.elapsedTime < 3; // Finished under 3 seconds
    completeStep(step7, ValidationStepStatus.COMPLETED, { elapsedTime: submission.elapsedTime, isSpeeding });

    // Step 8: Consistency Analysis
    const step8 = addStep(ValidationStepType.CONSISTENCY, 'Consistency Analysis');
    const userHistory = await GlobalValidationRepository.list({ userId: submission.userId });
    const userPassRate = userHistory.length > 0 
      ? userHistory.filter(h => h.validationStatus === 'Passed').length / userHistory.length 
      : 1.0;
    completeStep(step8, ValidationStepStatus.COMPLETED, { userPassRate, totalCompleted: userHistory.length });

    // Step 9: AI Validation (using dynamically registered validator plugins)
    const step9 = addStep(ValidationStepType.AI, 'AI Plugin Validation');
    const plugin = GlobalPluginRegistry.get(submission.taskId); // Get validator plugin matching task category
    
    // Default mock reference layout
    const referenceMockPayload = {
      groundTruthText: 'The quick brown fox jumps over the lazy dog.',
      originalText: 'Bonjour le monde',
      targetLanguage: 'en'
    };

    let pluginResult: {
      isCompliant: boolean;
      accuracyScore: number;
      instructionFollowingScore: number;
      completenessScore: number;
      notes?: string;
    } = { isCompliant: true, accuracyScore: 90, instructionFollowingScore: 95, completenessScore: 85, notes: 'Fallback Validator' };
    if (plugin) {
      pluginResult = await plugin.validateAnswers(submission.answers, referenceMockPayload);
    }
    completeStep(step9, ValidationStepStatus.COMPLETED, pluginResult);

    // Prepare structural validation record to compute scores
    let record: Omit<ValidationRecord, 'signature'> = {
      validationId,
      submissionId: submission.submissionId,
      taskId: submission.taskId,
      userId: submission.userId,
      validationStatus: 'Pending',
      decision: 'Human Review Queue',
      startedAt: nowStr,
      completedAt: null,
      elapsedMs: Date.now() - startedTime,
      steps,
      qualityScores: {} as any,
      confidence: {} as any,
      riskScores: {} as any,
      trustState: {} as any,
      auditTrail
    };

    // Step 10 & 11 & 12: Calculate Risk, Confidence, Quality, Trust Delta
    // Step 10: Confidence Score (Exposes calculateConfidence() contract)
    const confidenceModel = this.calculateConfidence(record as any, pluginResult);
    record.confidence = confidenceModel;
    ValidationEventBus.emit(ValidationEventType.ConfidenceCalculated, {
      validationId,
      percent: confidenceModel.confidencePercent,
      level: confidenceModel.confidenceLevel,
      timestamp: new Date().toISOString()
    });

    // Step 11: Quality Score (Exposes calculateQuality() contract)
    const qualityModel = this.calculateQuality(record as any, pluginResult, submission.elapsedTime, reputationScore);
    record.qualityScores = qualityModel;
    ValidationEventBus.emit(ValidationEventType.QualityCalculated, {
      validationId,
      score: qualityModel.finalQualityScore,
      timestamp: new Date().toISOString()
    });

    // Step 12: Risk Score (Exposes calculateRisk() contract)
    const riskModel = this.calculateRisk(record as any, isDuplicate, hasSpamWords, isSpeeding);
    record.riskScores = riskModel;
    ValidationEventBus.emit(ValidationEventType.RiskCalculated, {
      validationId,
      riskScore: riskModel.aggregateRiskScore,
      timestamp: new Date().toISOString()
    });

    // Trust State compiles
    const trustDelta = qualityModel.finalQualityScore >= 70 ? 2.5 : -5.0;
    const currentTrustScore = Math.max(0, Math.min(100, reputationScore + trustDelta));
    let trustLevel = TrustLevel.MEDIUM;
    if (currentTrustScore >= 85) trustLevel = TrustLevel.HIGH;
    else if (currentTrustScore < 40) trustLevel = TrustLevel.SUSPICIOUS;

    const trustState: TrustEngineRecord = {
      trustSnapshot: {
        currentScore: currentTrustScore,
        accuracy: Math.round(userPassRate * 100),
        speedIndex: submission.trustSnapshot?.speedIndex ?? 1.2,
        spamProbability: riskModel.spamRisk,
        flaggedAttemptsCount: (submission.trustSnapshot?.flaggedAttemptsCount ?? 0) + (riskModel.aggregateRiskScore > 65 ? 1 : 0)
      },
      trustHistory: userHistory.map(h => h.qualityScores.finalQualityScore).slice(0, 10),
      trustDelta,
      trustLevel,
      trustTrend: trustDelta >= 0 ? TrustTrend.IMPROVING : TrustTrend.DECLINING
    };
    record.trustState = trustState;

    // Step 13 & 14: Decision Engine and Status Transitions
    const decisionStep = addStep(ValidationStepType.DECISION, 'Decision Engine Evaluation');
    
    let decision: ValidationRecord['decision'] = 'Human Review Queue';
    let valStatus: ValidationRecord['validationStatus'] = 'Pending';

    // Automated Decision Logic:
    // Approved if confidence is High/Medium, quality is robust, and risk is minimal.
    if (
      confidenceModel.confidenceLevel !== ConfidenceLevel.LOW && 
      qualityModel.finalQualityScore >= confidenceModel.decisionThresholds.autoApproveThreshold && 
      riskModel.aggregateRiskScore < 30
    ) {
      decision = 'Approved';
      valStatus = 'Passed';
    } 
    // Rejected if quality is extremely low or risk is very high
    else if (
      qualityModel.finalQualityScore < confidenceModel.decisionThresholds.autoRejectThreshold || 
      riskModel.aggregateRiskScore >= 70
    ) {
      decision = 'Rejected';
      valStatus = 'Failed';
    } 
    // Otherwise, falls back to the Human Review Queue
    else {
      decision = 'Human Review Queue';
      valStatus = 'Pending';
    }

    completeStep(decisionStep, ValidationStepStatus.COMPLETED, { decision, valStatus });

    record.validationStatus = valStatus;
    record.decision = decision;
    record.completedAt = new Date().toISOString();
    record.elapsedMs = Date.now() - startedTime;

    // Build the final signed record
    const sealedRecord: ValidationRecord = {
      ...record,
      signature: '' // Will be generated in repository.save()
    } as any;

    // Save to the validation ledger
    await GlobalValidationRepository.save(sealedRecord);

    // Manage Human Review queue and dispatch appropriate sync statuses back to submission engine
    if (decision === 'Human Review Queue') {
      await this.createReviewRequest(sealedRecord.validationId, submission.submissionId, riskModel.aggregateRiskScore);
      
      // Update Submission status
      const activeSub = await GlobalSubmissionRepository.getById(submission.submissionId);
      if (activeSub) {
        activeSub.submissionStatus = SubmissionStatus.HUMAN_REVIEW;
        activeSub.validationStatus = ValidationStatus.PENDING;
        await GlobalSubmissionRepository.save(activeSub);
      }
    } else {
      // Direct pass/fail status integration back to the Submission record
      const activeSub = await GlobalSubmissionRepository.getById(submission.submissionId);
      if (activeSub) {
        activeSub.submissionStatus = decision === 'Approved' ? SubmissionStatus.APPROVED : SubmissionStatus.REJECTED;
        activeSub.validationStatus = decision === 'Approved' ? ValidationStatus.PASSED : ValidationStatus.FAILED;
        activeSub.qualityScorePlaceholder = qualityModel.finalQualityScore;
        await GlobalSubmissionRepository.save(activeSub);
      }

      ValidationEventBus.emit(
        decision === 'Approved' ? ValidationEventType.ValidationPassed : ValidationEventType.ValidationFailed, 
        {
          validationId,
          submissionId: submission.submissionId,
          finalScore: qualityModel.finalQualityScore,
          reason: decision === 'Approved' ? 'Passed quality audits' : 'Failed velocity or quality checkpoints',
          timestamp: new Date().toISOString()
        } as any
      );
    }

    ValidationEventBus.emit(ValidationEventType.ValidationFinished, {
      validationId,
      submissionId: submission.submissionId,
      decision,
      timestamp: new Date().toISOString()
    });

    // Notify Contributor (Exposes notifyContributor() contract)
    await this.notifyContributor(submission.userId, validationId, decision);

    return await GlobalValidationRepository.getById(validationId) as ValidationRecord;
  }

  // ==========================================
  // 2. EXPOSED CALCULATION ENGINES
  // ==========================================

  /**
   * Evaluates and aggregates Quality metrics.
   * Exposes HTTP Cloud Function ready contracts: CalculateQuality()
   */
  calculateQuality(
    record: ValidationRecord, 
    pluginResult?: any, 
    elapsedTime: number = 20, 
    reputationScore: number = 80
  ): QualityScoreModel {
    const accuracy = pluginResult?.accuracyScore ?? 90;
    const instructionFollowing = pluginResult?.instructionFollowingScore ?? 90;
    const completeness = pluginResult?.completenessScore ?? 80;

    // Calculate normalized completion speed score (Target duration is 20s)
    let speedScore = 100;
    if (elapsedTime < 5) speedScore = 30; // Suspiciously fast
    else if (elapsedTime > 60) speedScore = 60; // Slower SLA response
    else speedScore = Math.round(100 - (Math.abs(20 - elapsedTime) / 20) * 30);

    // Consistency score mock matching historical contributor metrics
    const consistencyScore = reputationScore >= 70 ? 95 : 65;

    // Reputation-based Trust Modifier (-10 to +10)
    const trustModifier = Math.round((reputationScore - 50) / 5);

    // Weighted final quality score
    const finalQualityScore = Math.max(0, Math.min(100, Math.round(
      (accuracy * 0.4) + 
      (instructionFollowing * 0.25) + 
      (completeness * 0.15) + 
      (speedScore * 0.2) + 
      trustModifier
    )));

    return {
      accuracyScore: accuracy,
      consistencyScore,
      instructionFollowingScore: instructionFollowing,
      completenessScore: completeness,
      speedScore,
      trustModifier,
      finalQualityScore
    };
  }

  /**
   * Computes automated confidence indices.
   * Exposes HTTP Cloud Function ready contracts: CalculateConfidence()
   */
  calculateConfidence(record: ValidationRecord, pluginResult?: any): ConfidenceModel {
    const accuracy = pluginResult?.accuracyScore ?? 90;
    const isCompliant = pluginResult?.isCompliant ?? true;

    let confidencePercent = Math.round(isCompliant ? (accuracy * 0.95) : (accuracy * 0.5));
    
    let confidenceLevel = ConfidenceLevel.MEDIUM;
    if (confidencePercent >= 80) confidenceLevel = ConfidenceLevel.HIGH;
    else if (confidencePercent < 45) confidenceLevel = ConfidenceLevel.LOW;

    return {
      confidencePercent,
      confidenceLevel,
      decisionThresholds: {
        autoApproveThreshold: 80,
        autoRejectThreshold: 35
      }
    };
  }

  /**
   * Analyzes multi-tier malicious risk parameters.
   * Exposes HTTP Cloud Function ready contracts: CalculateRisk()
   */
  calculateRisk(
    record: ValidationRecord, 
    isDuplicate: boolean = false, 
    hasSpamWords: boolean = false, 
    isSpeeding: boolean = false
  ): RiskModel {
    const spamRisk = hasSpamWords ? 0.95 : 0.05;
    const fraudRisk = isSpeeding ? 0.8 : 0.1;
    const duplicateRisk = isDuplicate ? 0.99 : 0.01;
    const automationRisk = isSpeeding ? 0.9 : 0.05;
    const botRisk = isSpeeding && hasSpamWords ? 0.95 : 0.05;
    const velocityRisk = isSpeeding ? 0.85 : 0.1;
    const behaviorRisk = isSpeeding ? 0.6 : 0.15;
    const deviceRisk = 0.05; // Standard healthy client signatures
    const networkRisk = 0.05;
    const aiRisk = hasSpamWords ? 0.75 : 0.1;

    const aggregateRiskScore = Math.max(0, Math.min(100, Math.round(
      (spamRisk * 25) + 
      (fraudRisk * 15) + 
      (duplicateRisk * 20) + 
      (automationRisk * 15) + 
      (botRisk * 10) + 
      (velocityRisk * 5) + 
      (behaviorRisk * 10)
    )));

    return {
      spamRisk,
      fraudRisk,
      duplicateRisk,
      automationRisk,
      botRisk,
      velocityRisk,
      behaviorRisk,
      deviceRisk,
      networkRisk,
      aiRisk,
      aggregateRiskScore
    };
  }

  // ==========================================
  // 3. HUMAN REVIEW MANAGEMENT OPERATIONS
  // ==========================================

  private async createReviewRequest(validationId: string, submissionId: string, riskScore: number): Promise<HumanReviewItem> {
    const reviewId = `REV-${Math.random().toString(36).substring(2, 10).toUpperCase()}`;
    const deadlineStr = new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString(); // 48 hour SLA

    let priority = ReviewPriority.MEDIUM;
    if (riskScore >= 60) priority = ReviewPriority.HIGH;
    else if (riskScore < 30) priority = ReviewPriority.LOW;

    const review: HumanReviewItem = {
      reviewId,
      submissionId,
      status: 'Pending Review',
      priority,
      assignedReviewer: null,
      reviewDeadline: deadlineStr,
      reviewNotes: '',
      decision: null,
      escalationReason: null,
      history: [
        {
          timestamp: new Date().toISOString(),
          action: 'Created',
          actor: 'System Auto-Escalator',
          notes: `Automated audit assigned validation ${validationId} to human review due to Low Confidence or Risk scores.`
        }
      ]
    };

    await GlobalValidationRepository.saveReview(review);
    
    ValidationEventBus.emit(ValidationEventType.ReviewRequested, {
      reviewId,
      submissionId,
      priority,
      timestamp: new Date().toISOString()
    });

    return review;
  }

  /**
   * Assigns an expert reviewer to a pending audit block.
   * Exposes HTTP Cloud Function ready contracts: AssignReviewer()
   */
  async assignReviewer(reviewId: string, reviewerId: string): Promise<HumanReviewItem> {
    const review = await GlobalValidationRepository.getReviewById(reviewId);
    if (!review) throw new Error(`[ValidationService] Human review assignment failed. Review "${reviewId}" not found.`);

    review.status = 'Assigned Reviewer';
    review.assignedReviewer = reviewerId;
    review.history.push({
      timestamp: new Date().toISOString(),
      action: 'Reviewer Assigned',
      actor: 'System Dispatcher',
      notes: `Review assigned to expert operator: ${reviewerId}.`
    });

    await GlobalValidationRepository.saveReview(review);
    return review;
  }

  /**
   * Resolves a manual consensus review and updates appropriate ledgers.
   * Exposes HTTP Cloud Function ready contracts: FinalizeValidation()
   */
  async finalizeValidation(validationId: string, decision: 'Approved' | 'Rejected', reviewerComments: string): Promise<ValidationRecord> {
    const record = await GlobalValidationRepository.getById(validationId);
    if (!record) throw new Error(`[ValidationService] Finalize failure: Validation ID "${validationId}" not found.`);

    const now = new Date().toISOString();

    // 1. Mutate validation record
    record.decision = decision === 'Approved' ? 'Approved' : 'Rejected';
    record.validationStatus = decision === 'Approved' ? 'Passed' : 'Failed';
    record.completedAt = now;
    record.auditTrail.push(`[${now}] Final manual audit resolution locked: ${decision}. comments: "${reviewerComments}".`);

    await GlobalValidationRepository.save(record);

    // 2. Synchronize back with Submission state
    const sub = await GlobalSubmissionRepository.getById(record.submissionId);
    if (sub) {
      sub.submissionStatus = decision === 'Approved' ? SubmissionStatus.APPROVED : SubmissionStatus.REJECTED;
      sub.validationStatus = decision === 'Approved' ? ValidationStatus.PASSED : ValidationStatus.FAILED;
      sub.humanMetadata = {
        ...sub.humanMetadata,
        reviewerComments,
        escalationTriggered: false
      };
      await GlobalSubmissionRepository.save(sub);
    }

    // 3. Resolve review queue
    const reviews = await GlobalValidationRepository.listReviews();
    const relatedReview = reviews.find(r => r.submissionId === record.submissionId);
    if (relatedReview) {
      relatedReview.status = 'Completed';
      relatedReview.decision = decision;
      relatedReview.reviewNotes = reviewerComments;
      relatedReview.history.push({
        timestamp: now,
        action: 'Review Closed',
        actor: relatedReview.assignedReviewer || 'Expert Operator',
        notes: `Review audited. Manual decision committed: ${decision}. comments: ${reviewerComments}.`
      });
      await GlobalValidationRepository.saveReview(relatedReview);

      ValidationEventBus.emit(ValidationEventType.ReviewCompleted, {
        reviewId: relatedReview.reviewId,
        submissionId: record.submissionId,
        reviewer: relatedReview.assignedReviewer || 'Expert Operator',
        decision,
        timestamp: now
      });
    }

    ValidationEventBus.emit(
      decision === 'Approved' ? ValidationEventType.ValidationPassed : ValidationEventType.ValidationFailed,
      {
        validationId,
        submissionId: record.submissionId,
        finalScore: record.qualityScores.finalQualityScore,
        reason: reviewerComments,
        timestamp: now
      } as any
    );

    return record;
  }

  /**
   * Generates formatted audit logs for review files in Drive.
   * Exposes HTTP Cloud Function ready contracts: GenerateAudit()
   */
  async generateAudit(validationId: string): Promise<string[]> {
    const record = await GlobalValidationRepository.getById(validationId);
    if (!record) return ['Validation record not found.'];

    return [
      `=== TASKNOVA VALIDATION AUDIT LEDGER TRAIL ===`,
      `Validation ID: ${record.validationId}`,
      `Submission ID: ${record.submissionId}`,
      `Contributor ID: ${record.userId}`,
      `Task ID: ${record.taskId}`,
      `Status: ${record.validationStatus} | Decision: ${record.decision}`,
      `Quality Score: ${record.qualityScores.finalQualityScore}/100 (Accuracy: ${record.qualityScores.accuracyScore}, Speed: ${record.qualityScores.speedScore})`,
      `Confidence Level: ${record.confidence.confidenceLevel} (${record.confidence.confidencePercent}%)`,
      `Risk Score: ${record.riskScores.aggregateRiskScore}/100`,
      `Signature Checksum: ${record.signature}`,
      `----------------------------------------------`,
      `Audit Step Event Logs:`,
      ...record.auditTrail
    ];
  }

  /**
   * Communicates state changes to players.
   * Exposes HTTP Cloud Function ready contracts: NotifyContributor()
   */
  async notifyContributor(userId: string, validationId: string, decision: string): Promise<void> {
    // Standard mock dispatch pipeline
    console.log(`[ValidationService] Notification Dispatched: Sending alert to Contributor "${userId}" regarding validation ID ${validationId}. Status resolved: ${decision}`);
  }

  // ==========================================
  // 4. METRICS & TELEMETRY API
  // ==========================================

  /**
   * Compiles dynamic telemetry aggregates across the entire local database.
   */
  async compileTelemetry(): Promise<{
    avgValidationTimeMs: number;
    approvalRate: number;
    rejectRate: number;
    humanReviewRate: number;
    avgConfidence: number;
    avgQuality: number;
    avgRisk: number;
    falsePositiveRatePlaceholder: number;
    falseNegativeRatePlaceholder: number;
  }> {
    const list = await GlobalValidationRepository.list({});
    if (list.length === 0) {
      return {
        avgValidationTimeMs: 0,
        approvalRate: 0,
        rejectRate: 0,
        humanReviewRate: 0,
        avgConfidence: 0,
        avgQuality: 0,
        avgRisk: 0,
        falsePositiveRatePlaceholder: 0.02, // Standard industry metric
        falseNegativeRatePlaceholder: 0.01
      };
    }

    const total = list.length;
    let totalMs = 0;
    let approvals = 0;
    let rejections = 0;
    let reviewQueueCount = 0;
    let totalConf = 0;
    let totalQual = 0;
    let totalRisk = 0;

    list.forEach(r => {
      totalMs += r.elapsedMs;
      totalConf += r.confidence.confidencePercent;
      totalQual += r.qualityScores.finalQualityScore;
      totalRisk += r.riskScores.aggregateRiskScore;

      if (r.decision === 'Approved') approvals++;
      else if (r.decision === 'Rejected') rejections++;
      else if (r.decision === 'Human Review Queue') reviewQueueCount++;
    });

    return {
      avgValidationTimeMs: Math.round(totalMs / total),
      approvalRate: Math.round((approvals / total) * 100),
      rejectRate: Math.round((rejections / total) * 100),
      humanReviewRate: Math.round((reviewQueueCount / total) * 100),
      avgConfidence: Math.round(totalConf / total),
      avgQuality: Math.round(totalQual / total),
      avgRisk: Math.round(totalRisk / total),
      falsePositiveRatePlaceholder: 0.02,
      falseNegativeRatePlaceholder: 0.01
    };
  }
}

export const GlobalValidationService = new ValidationService();
export default GlobalValidationService;
