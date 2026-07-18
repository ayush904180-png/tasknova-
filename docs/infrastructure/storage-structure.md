# TaskNova AI Google Cloud Storage Structure

This document establishes the architecture, directory organization, upload policies, and lifecycles of Firebase Cloud Storage buckets within TaskNova AI.

## Bucket Directory Trees

```
gs://tasknova-ai-storage-bucket/
├── avatars/                # Creator and contributor profile icons
├── banners/                # Creator portfolio or campaign custom hero banners
├── task-images/            # RLHF canvas assets, prompt evaluation reference pictures
├── campaign-assets/        # Business raw data files, JSON specs, PDFs
├── business-documents/     # Verification tax licenses, business registration certs
├── creator-assets/         # Portfolio datasets, certified language CVs
├── reports/                # Daily corporate CSV/PDF analytics summaries
├── exports/                # Aggregated user bulk task submission archives
├── temporary/              # Volatile upload buffers (auto-purged)
└── backups/                # Disaster recovery Firestore collection snap backups
```

## Security & Access Policies

All directories utilize Attribute-Based Access Control (ABAC) via standard Firebase Storage Rules:
* **Private Writes / Public Reads**: `avatars/`, `banners/` (Owner can write up to 2MB, anyone can read).
* **Owner-Only Read/Write**: `business-documents/`, `creator-assets/` (Restricted entirely to uploader ID).
* **Admin-Only Access**: `reports/`, `backups/` (Restricted to verified Admin roles).
* **Write Once, Read Ever**: `exports/` (System writes and provides signed link; users download).

## Volumetric Constraints

| Folder | Max Size | Allowed MIME Types |
|---|---|---|
| `avatars/` | 2 MB | `image/jpeg`, `image/png`, `image/webp` |
| `banners/` | 5 MB | `image/jpeg`, `image/png`, `image/webp` |
| `task-images/` | 10 MB | `image/jpeg`, `image/png`, `image/gif`, `image/webp` |
| `campaign-assets/` | 15 MB | `image/jpeg`, `image/png`, `application/pdf`, `application/json` |
| `business-documents/` | 20 MB | `application/pdf`, `image/jpeg`, `image/png` |
| `creator-assets/` | 25 MB | `image/jpeg`, `image/png`, `application/zip` |
| `reports/` | 15 MB | `text/csv`, `application/pdf`, `application/json` |
| `exports/` | 50 MB | `application/zip`, `text/csv` |
| `temporary/` | 100 MB | Any (`*/*`) |
| `backups/` | 500 MB | `application/json`, `application/gzip` |

## File Naming Standard

File names must remain strictly alphanumeric, including only underscores and hyphens to block directory injection attempts:
* Template: `{folder_name}/{userId}_{timestamp}_{random_hash}.{ext}`
* Example: `avatars/usr_8f81a_17823901_a9f81.png`

## Lifecycle Policy (Storage Classes)

1. **`temporary/` Directory**: Auto-delete files older than 14 days. Uses Nearline Storage Class.
2. **`backups/` Directory**:
   * Auto-move backups to Coldline Storage Class after 30 days.
   * Auto-move backups to Archive Storage Class after 90 days.
   * Delete files after 365 days.
3. **`reports/` Directory**:
   * Move to Nearline after 180 days.
   * Purge after 3 years.
