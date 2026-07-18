/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { ValidationRecord, HumanReviewItem, ValidationFilterOptions } from '../../types/validation';
import { Submission } from '../../types/submission';
import { GlobalValidationRepository } from '../repositories/ValidationRepository';
import { GlobalValidationService } from '../services/ValidationService';

export interface ValidationContextProps {
  validationRecords: ValidationRecord[];
  humanReviews: HumanReviewItem[];
  telemetry: {
    avgValidationTimeMs: number;
    approvalRate: number;
    rejectRate: number;
    humanReviewRate: number;
    avgConfidence: number;
    avgQuality: number;
    avgRisk: number;
    falsePositiveRatePlaceholder: number;
    falseNegativeRatePlaceholder: number;
  };
  validateSubmission: (submission: Submission) => Promise<ValidationRecord>;
  assignReviewer: (reviewId: string, reviewerId: string) => Promise<HumanReviewItem>;
  finalizeValidation: (validationId: string, decision: 'Approved' | 'Rejected', comments: string) => Promise<ValidationRecord>;
  queryValidations: (options: ValidationFilterOptions) => Promise<ValidationRecord[]>;
  generateAuditTrail: (validationId: string) => Promise<string[]>;
}

const ValidationContext = createContext<ValidationContextProps | undefined>(undefined);

/**
 * Enterprise Validation Provider.
 * Integrates the AI Validation Engine, scoring metrics, and audit queues reactively.
 */
export const ValidationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [validationRecords, setValidationRecords] = useState<ValidationRecord[]>([]);
  const [humanReviews, setHumanReviews] = useState<HumanReviewItem[]>([]);
  const [telemetry, setTelemetry] = useState<ValidationContextProps['telemetry']>({
    avgValidationTimeMs: 0,
    approvalRate: 0,
    rejectRate: 0,
    humanReviewRate: 0,
    avgConfidence: 0,
    avgQuality: 0,
    avgRisk: 0,
    falsePositiveRatePlaceholder: 0.02,
    falseNegativeRatePlaceholder: 0.01
  });

  // Hydrate lists and subscribe to changes
  useEffect(() => {
    const unsubVal = GlobalValidationRepository.subscribe((records) => {
      setValidationRecords(records);
      GlobalValidationService.compileTelemetry().then(setTelemetry);
    });

    const unsubRev = GlobalValidationRepository.subscribeReviews((reviews) => {
      setHumanReviews(reviews);
    });

    return () => {
      unsubVal();
      unsubRev();
    };
  }, []);

  const value = useMemo<ValidationContextProps>(() => {
    return {
      validationRecords,
      humanReviews,
      telemetry,

      validateSubmission: async (submission: Submission) => {
        const res = await GlobalValidationService.validateSubmission(submission);
        // Refresh local listings and telemetry
        const latestVals = await GlobalValidationRepository.list({});
        setValidationRecords(latestVals);
        const tel = await GlobalValidationService.compileTelemetry();
        setTelemetry(tel);
        return res;
      },

      assignReviewer: async (reviewId: string, reviewerId: string) => {
        const res = await GlobalValidationService.assignReviewer(reviewId, reviewerId);
        const latestRevs = await GlobalValidationRepository.listReviews();
        setHumanReviews(latestRevs);
        return res;
      },

      finalizeValidation: async (validationId: string, decision: 'Approved' | 'Rejected', comments: string) => {
        const res = await GlobalValidationService.finalizeValidation(validationId, decision, comments);
        const latestVals = await GlobalValidationRepository.list({});
        setValidationRecords(latestVals);
        const latestRevs = await GlobalValidationRepository.listReviews();
        setHumanReviews(latestRevs);
        const tel = await GlobalValidationService.compileTelemetry();
        setTelemetry(tel);
        return res;
      },

      queryValidations: async (options: ValidationFilterOptions) => {
        return GlobalValidationRepository.list(options);
      },

      generateAuditTrail: async (validationId: string) => {
        return GlobalValidationService.generateAudit(validationId);
      }
    };
  }, [validationRecords, humanReviews, telemetry]);

  return (
    <ValidationContext.Provider value={value}>
      {children}
    </ValidationContext.Provider>
  );
};

/**
 * Access hook for React components.
 */
export const useValidation = (): ValidationContextProps => {
  const context = useContext(ValidationContext);
  if (!context) {
    throw new Error('useValidation must be executed within an active ValidationProvider block.');
  }
  return context;
};
export default ValidationProvider;
