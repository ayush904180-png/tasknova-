# Player Session Model Specification
Version 1.0.0 | Core Architecture

Every micro-task validation session initialized in TaskNova AI is governed by a fully serializable, Firestore-compliant `PlayerSession` schema.

## 1. Schema Properties Specification

| Field Name | Type | Description |
| :--- | :--- | :--- |
| `sessionId` | `string` | Unique cryptographically randomized session token prefixed with `SESS-`. |
| `userId` | `string` | Authenticated validator contributor identifier. |
| `taskId` | `string` | Target micro-task identifier from the global database queue. |
| `taskVersion` | `number` | Version signature of the task to verify schema compliance. |
| `startedAt` | `string (ISO)` | Precise timestamp when task was locked and loaded into memory. |
| `lastSaved` | `string (ISO)` | Timestamp of the most recent auto-save draft sync. |
| `completedAt` | `string \| null` | Commit timestamp (null if still active draft). |
| `elapsedTime` | `number` | Total active focus duration in seconds (stops when paused). |
| `remainingTime` | `number` | Time limit remaining until reservation release (seconds). |
| `pauseCount` | `number` | Count of times the validator suspended execution. |
| `resumeCount` | `number` | Count of times the validator resumed execution. |
| `submissionState` | `'draft' \| 'ready' \| 'submitted'` | State of the consensus ledger commit pipeline. |
| `offlineState` | `boolean` | Network connectivity status flag at submission time. |
| `deviceInformation` | `string` | Client form-factor mapping (`Desktop` \| `Mobile`). |
| `browserInformation` | `string` | Client browser agent signature (e.g., `Chrome`, `Firefox`, `Safari`). |
| `language` | `string` | User language code (e.g., `en-US`, `es-ES`). |
| `country` | `string` | Target geographic locale boundary for the task. |
| `trustSnapshot` | `object` | Snapshot of validator credit values prior to evaluation. |
| `answers` | `object` | Raw key-value response payload created by the plugin. |
| `metadata` | `object` | Operational tracking parameters. |

## 2. Serialization & Storage Lifecycle
To prevent state bloating and memory leaks, sessions are stored in an in-memory active list (`Map`) during active gameplay, and mirrored automatically into client-local memory storage. Upon submission, the active draft is destroyed, and the final payload is transmitted to the consensus synchronization queue.
