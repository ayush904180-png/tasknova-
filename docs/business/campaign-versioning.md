# Campaign Version Control & Immutable Sandboxing

This document details the campaign versioning engine.

## Revision Specifications

Every enterprise campaign records automatic version states (e.g., `v1`, `v2`, `v3`) with distinct SHA-256 state-hashes. 

## Version Sandbox Actions

- **Clone**: Create a duplicate campaign draft from any historical baseline version.
- **Restore / Rollback**: Restore a previous version's configuration variables (budget, target audience, quality controls) into a new active draft version.
- **Compare (Diff Engine)**: High-resolution property comparison tool between consecutive or custom versions.
- **Publish Specific Version**: Roll back or fast-forward active pipelines to a specific snapshot state without restarting contributor intake queues.

## Schema Collection Schema (`campaign_versions`)

```json
{
  "id": "v_uuid_109283",
  "campaignId": "camp_gpt5_rlhf",
  "version": 4,
  "snapshot": {
    "name": "GPT-5 Safety Audits",
    "budget": { "coins": 2500000, "multiplier": 1.5 },
    "qualityRules": { "requiredAccuracy": 96 }
  },
  "updatedAt": "2026-07-20T05:22:00Z",
  "updatedBy": "ayush904180@gmail.com",
  "changeLog": "Elevated quality threshold from 92% to 96% accuracy rules."
}
```
