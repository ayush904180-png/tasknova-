# Google Sheets Submission Reports

The Submission Engine exposes specialized **Sheets Adapters** that format raw, nested JSON database entries into flat, two-dimensional tabular arrays suitable for Google Sheets import and live dashboard metrics.

## Supported Report Types

### 1. General Submission Report (`Submission_Reports_Active`)
Maps active user task completions for general dashboard list rendering.

- **Columns**: `Submission ID`, `Task ID`, `User ID`, `Completed At`, `Elapsed Time (s)`, `Status`, `Sync Status`, `Offline`

### 2. Validation Audit Report (`Validation_Reports_Pipeline`)
Provides details of the dynamic validation pipeline, trust levels, and security signatures.

- **Columns**: `Submission ID`, `Task ID`, `Validation Status`, `Accuracy Score`, `Spam Probability`, `Speed Index`, `Signature Status`

### 3. Quality Assurance Report (`QA_Reports_Manual`)
Contains operator reviews and notes for manual verifications.

- **Columns**: `Submission ID`, `Review Status`, `Validator Comments`, `Escalated`, `Device Category`, `Operating System`, `Browser Version`

### 4. Business Campaign Report (`Business_Reports_Financial`)
Tracks duration weights and localization boundaries for campaign billing and budget evaluations.

- **Columns**: `Submission ID`, `Task ID`, `Estimated Duration (s)`, `Actual Duration (s)`, `Coin Multiplier Weight`, `Territory ISO`, `Language constraints`

### 5. Administrative Operations Report (`Admin_Operations_Master`)
Provides security nonces, system versioning, and AI guardrail matches for operator diagnostics.

- **Columns**: `Submission ID`, `Task Version`, `Player Version`, `Submission Version`, `Nonce Timestamp`, `AI Guardrail Violations`, `Created At`, `Last Mutated`
