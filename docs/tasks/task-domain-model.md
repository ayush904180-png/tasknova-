# Task Domain Model Specification
---

## Core Task Schema

The domain models are defined in `/src/types/tasks.ts`. Every Micro-task is represented as a structured entity containing geographical limits, linguistic constraints, financial incentives, and quality SLA constraints.

```typescript
export interface Task {
  id: string;                      // Unique machine identity
  version: number;                 // Monotonically increasing version
  parentTaskId: string | null;     // Reference linking back to historical parent
  taskType: string;                // Specific registry plugin type
  title: string;                   // Concise validator name
  description: string;             // Broad overview
  instructions: string[];          // Validator guidelines
  category: string;                // Parent category group
  difficulty: TaskDifficulty;      // EASY, MEDIUM, HARD
  estimatedCompletionTime: number; // Duration in seconds
  rewardCoins: number;             // Financial credit payout
  priority: TaskPriority;          // LOW, MEDIUM, HIGH, CRITICAL
  language: string;                // Standard BCP-47 locale code
  country: string;                 // ISO 3166 country target restriction
  region: string | null;           // Regional subdivision limit
  requiredAccuracy: number;        // Threshold validation target (%)
  requiredTrustScore: number;      // Contributor trust target (%)
  maximumAttempts: number;         // Max retries allowed per participant
  cooldownPeriod: number;          // Buffer time between repeats in seconds
  validationMethod: string;        // Consensus | Heuristic | Expert review
  reviewStrategy: string;          // Immediate | Batch
  expiryDate: string | null;       // ISO date string
  visibility: string;              // Public | Private
  currentStatus: TaskStatus;       // Lifecycle state machine
  tags: string[];                  // Discovery tags
  attachments: TaskAttachment[];   // External assets linked from Drive
  creator: string;                 // Project creator identity
  business: string | null;         // Corporate campaign reference
  metadata: Record<string, any>;   // Dynamic operational payload
  aiMetadata: TaskAIMetadata;      // Model specific metrics (associated models, etc)
  humanMetadata: TaskHumanMetadata;// Participant constraints (XP levels, etc)
  createdAt: string;               // ISO date
  updatedAt: string;               // ISO date
  archivedAt: string | null;       // Archival time lock
}
```

### Immutable Versioning & Parent References

To preserve complete quality audits, tasks in the system are treated as immutable records. When a business edits a published task, the engine:
1. Clones the existing task.
2. Increments the `version` field.
3. Sets `parentTaskId` pointing directly to the previous task ID.
4. Marks the previous task as `ARCHIVED`, freezing it from future edits.

### AI and Human Metadata Decoupling

- **`aiMetadata`**: Contains fields like `associatedModel` and `evaluationMetric` representing the model under training.
- **`humanMetadata`**: Restricts participation parameters based on user metrics (e.g. `contributorLevelRequired`, `maxDailyAttemptsPerUser`).
