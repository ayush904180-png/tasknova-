# Google Drive Submission Integration

The Submission Engine prepares robust hierarchical folder and file layout specifications to archive user answers and uploaded assets inside Google Drive folder namespaces.

## Folder Hierarchy Structure

Files are systematically grouped inside Google Drive according to the category of the micro-task and the identifier of the contributor:

```
Google Drive Root
  └── TaskNova_Vault
        └── Submissions
              ├── ai_response_comparison
              │     ├── USR-1002
              │     │     └── submission_payload_SUB-A8B9_V1.json
              │     └── USR-1055
              └── translation_review
                    └── USR-1002
                          └── submission_payload_SUB-F4D2_V1.json
```

## JSON Metadata Payload Structure

Each synchronized file is named with the pattern: `submission_payload_<SUB_ID>_V<VERSION_NUMBER>.json`. It contains the following structured fields:

```json
{
  "submissionId": "SUB-A8B9",
  "associatedTaskType": "AI Response Comparison",
  "payload": {
    "answers": {
      "selection": "A",
      "comment": "Response A correctly references quantum probability densities."
    },
    "trustHeuristics": {
      "currentScore": 100,
      "accuracy": 100,
      "speedIndex": 1.2,
      "spamProbability": 0.05
    },
    "clientContext": {
      "deviceType": "Desktop",
      "operatingSystem": "macOS",
      "browserName": "Google Chrome",
      "screenResolution": "1920x1080"
    }
  },
  "archivedAt": "2026-07-18T10:00:00.000Z"
}
```
