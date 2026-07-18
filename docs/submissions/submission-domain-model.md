# Submission Domain Model

The **Submission Domain Model** establishes a unified, structured representation for all completed human-intelligence tasks, capturing comprehensive technical metadata, telemetry snapshots, localization parameters, and validation codes.

## The `Submission` Interface

```typescript
export interface Submission {
  submissionId: string;               // Cryptographically unique token prefixed with "SUB-"
  submissionVersion: number;          // Target schema specification version tracking
  taskId: string;                     // Core micro-task reference
  taskVersion: number;                // Permanent reference of task version at submission lock
  playerSessionId: string;            // Source player session reference
  userId: string;                     // Contributor user account ID
  role: 'contributor' | 'expert' | 'verifier' | 'admin';
  answers: Record<string, any>;       // Pure, structured response payloads captured from isolated plugins
  attachmentsMetadata: DriveAttachmentMetadata[]; // Secure links referencing assets (e.g. in Google Drive)
  startedAt: string;                  // ISO 8601 string
  completedAt: string;                // ISO 8601 string
  elapsedTime: number;                // Total focused clock seconds elapsed during validation work
  submissionStatus: SubmissionStatus;
  trustSnapshot: TrustSnapshot;       // Trust level snapshot evaluated prior to validation pipelines
  deviceSnapshot: ClientDeviceSnapshot;
  browserSnapshot: string;            // Simple browser string (e.g. "Chrome 114.0.0")
  country: string;                    // Target country boundaries (e.g. "US", "IN")
  language: string;                   // Localized language code constraints
  offlineFlag: boolean;               // Indicates if task completion was locked during disconnected states
  syncStatus: 'synced' | 'pending' | 'conflict_resolved' | 'failed';
  validationStatus: ValidationStatus;
  reviewStatus: ReviewStatus;
  qualityScorePlaceholder: number | null; // Nullable placeholder for future automated grading models
  rewardPlaceholder: number | null;      // Nullable placeholder for future XP/coin allocations
  metadata: Record<string, any>;      // Custom key-value extensions
  aiMetadata: {
    promptInjectionsDetected?: boolean;
    autoHateSpeechFlag?: boolean;
    heuristicRelevanceScore?: number;
    modelAssessmentNotes?: string;
  };
  humanMetadata: {
    reviewerComments?: string;
    escalationTriggered?: boolean;
    verificationBatchId?: string;
  };
  createdAt: string;                  // ISO 8601 creation record
  updatedAt: string;                  // ISO 8601 mutation record
}
```

## Immutable Fields

Once a submission transitions into a terminal state (`Approved`, `Rejected`, or `Archived`), all values inside `answers`, `elapsedTime`, `trustSnapshot`, and `deviceSnapshot` become strictly immutable. This prevents retrofitted reward tampering or validation manipulation.
