# Google Drive Workspace Integration Architecture

TaskNova AI integrates with Google Drive for cold storage, compliance archiving, bulk data exports, and relational JSON disaster recovery backups.

## Folder Hierarchy Scheme

The Corporate Google Drive is mapped deterministically using parent folder IDs defined dynamically in `.env` configurations:

```
Shared Google Drive Root (VITE_GOOGLE_DRIVE_FOLDER_ID)
├── 📂 Legal & Agreements/
│   ├── 📂 Contributor KYC Verification Records/
│   └── 📂 Corporate Business Contracts/
├── 📂 Backups & Archives/
│   ├── 📂 Database Cold Backups (Daily JSON snapshots)/
│   └── 📂 System Log Audits (Weekly Gzip exports)/
└── 📂 Export Packages/
    ├── 📂 Campaign Dataset Deliverables (CSV, JSON-L for RLHF)/
    └── 📂 Finance PDF Ledgers/
```

## Storage Formats

1. **Analytical Datasets**: Exported as flat `.csv` or newline-delimited JSON (`.jsonl`), ready to be imported into downstream data analytics platforms (e.g. BigQuery).
2. **Disaster Backups**: Bundled as compressed JSON arrays grouped by collection name and snapshot date.
3. **Contracts & KYC**: Exported as securely encrypted PDFs with audit headers.

## Security Policies

* **Folder Lockdowns**: Write access is restricted to the TaskNova automated service accounts.
* **Audit Logs**: Every document creation or read triggers a entry in the internal `auditLogs` collection.
* **Link Privileges**: Documents are shared exclusively via domain-restricted workspace accounts. External sharing is blocked by default.
