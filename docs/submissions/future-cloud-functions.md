# Future Cloud Functions Integration

This document outlines the design contracts and API schema specifications for future backend Google Cloud Functions that will inherit work from the Submission Engine.

## 1. Cloud Function: `submitConsensusNode`

- **Trigger**: HTTP POST /api/v1/submission/submit
- **Responsibility**: Authenticates contributor session, executes remote validation schema checks, and writes final submission blocks to Firestore.

### Request Body Schema

```json
{
  "sessionId": "SESS-8F92-A3B1",
  "taskId": "task_image_safety_av_0",
  "answers": {
    "safetyClassification": "safe",
    "comment": "No rendering clippings detected."
  },
  "elapsedTime": 14,
  "clientSignature": "SIG-SHA256-EF8D2B",
  "nonce": "NONCE-17180000-8F92"
}
```

### Process Sequence

1. Authenticates active session token inside Cloud IAM.
2. Assesses speed velocity bounds (throws `400 Bad Request` if speeding).
3. Re-calculates and verifies the cryptographic `clientSignature` against the answers.
4. Performs query on double-submission locks to prevent double-spending replay attempts.
5. Writes submission object to `/submissions/{submissionId}`.
6. Increases counter on `/tasks/{taskId}/submissionCount`.

---

## 2. Cloud Function: `executeAIEvaluation`

- **Trigger**: Firestore Document Create on `/submissions/{submissionId}`
- **Responsibility**: Listens to new submissions, coordinates automated Gemini API grading assessments, and updates validation codes.

### Response Flow

1. Extracts answers from the newly created document.
2. Invokes Gemini API via the modern `@google/genai` SDK.
3. Requests structured JSON outputs to grade the contributor's response against reference ground truths.
4. Updates the document fields:
   - `submissionStatus = "AI Reviewing"` (during call)
   - `submissionStatus = "Approved" | "Rejected" | "Human Review"`
   - `validationStatus = "Passed" | "Failed" | "Flagged"`
   - `qualityScorePlaceholder = score (0 to 100)`
5. If score is low or flagged, transitions status to `Human Review` for operator intervention.
