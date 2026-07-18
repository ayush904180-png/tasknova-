# TaskNova AI Backup & Disaster Recovery Strategy

This document details the multi-tiered automated backup system, cold storage archive strategies, emergency system restore guides, and rollback recovery protocols.

## Backup Schedules

| Tier | Frequency | Scope | Storage Location | Retention |
|---|---|---|---|---|
| **Daily Incremental** | Every 24 hours (02:00 UTC) | All mutant records in past 24 hours | Google Drive + Nearline Storage | 30 Days |
| **Weekly Full** | Every Sunday (03:00 UTC) | Complete database snapshot | Coldline Storage | 90 Days |
| **Monthly Archive** | 1st of each month | Compressed complete collections | Archive Storage Class | 7 Years |

## Disaster Recovery Checkpoints (RTO & RPO)

* **Recovery Point Objective (RPO)**: Under 24 hours. Max data age is bounded by the daily backup scheduler.
* **Recovery Time Objective (RTO)**: Under 2 hours. In an emergency, the infrastructure team can trigger manual hot-swaps using restore CLI tools.

## Disaster Recovery & Restore Playbook

In the event of database poisoning (e.g. malicious actor bypassing rules or developer bug mutating states):

### Phase 1: Isolation
1. Flip the `SYSTEM_MAINTENANCE` global feature flag to `true` inside `systemConfigs/limits`.
2. This locks out all users, disabling active writes to Firestore.

### Phase 2: Extraction
1. Locate the latest uncorrupted Weekly or Daily JSON backup inside Google Drive (`📂 Backups & Archives/Database Cold Backups`).
2. Download the compressed file.

### Phase 3: Rollback Execute
1. Execute the `emergencyRestoreCollection` protocol via administrative CLI.
2. The restore engine purges poisoned collections and re-populates entries with identical IDs.

### Phase 4: Validation & Re-Entry
1. Run structural schemas audits against restored databases.
2. Flip the `SYSTEM_MAINTENANCE` flag to `false`.
3. Unlock the portal and log the action inside `auditLogs`.
