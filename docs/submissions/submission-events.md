# Submission Events

The **Submission Event Bus** provides a type-safe, decoupled message broker that dispatches critical transaction notifications across the application without hard dependencies.

## Standard Dispatch Events

- **SubmissionCreated**: Dispatched when a fresh user-task block is packaged and registered on-disk.
- **SubmissionSaved**: Triggered when progress updates are saved (either online or staged in offline buffers).
- **SubmissionQueued**: Broadcasted when a completed task is put into a local queue.
- **SubmissionSynced**: Dispatched when offline submissions are successfully synchronized with the main ledger.
- **SubmissionValidationRequested**: Dispatched when automated pipeline models begin auditing answers.
- **SubmissionApproved**: Dispatched when an operator or model approves the consensus answers.
- **SubmissionRejected**: Broadcasted when a submission fails spam checks, speed velocity, or manual audit.
- **SubmissionArchived**: Triggered when completed transactions are placed into cold historical datasets.

## Payload Specifications

```typescript
export interface SubmissionEventPayloads {
  [SubmissionEventType.SubmissionCreated]: { submission: Submission; timestamp: string };
  [SubmissionEventType.SubmissionSaved]: { submissionId: string; status: SubmissionStatus; timestamp: string };
  [SubmissionEventType.SubmissionQueued]: { submissionId: string; queueType: 'offline' | 'priority' | 'retry'; timestamp: string };
  [SubmissionEventType.SubmissionSynced]: { submissionId: string; latencyMs: number; timestamp: string };
  [SubmissionEventType.SubmissionValidationRequested]: { submissionId: string; pipelineName: string; timestamp: string };
  [SubmissionEventType.SubmissionApproved]: { submissionId: string; reviewerId: string; score: number; timestamp: string };
  [SubmissionEventType.SubmissionRejected]: { submissionId: string; reviewerId: string; reason: string; timestamp: string };
  [SubmissionEventType.SubmissionArchived]: { submissionId: string; archiverId: string; timestamp: string };
}
```
