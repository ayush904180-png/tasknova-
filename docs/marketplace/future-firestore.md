# Future Google Firestore Migration Plan

This document details the schema mappings, collection boundaries, and composite indices required when migrating the local repository to Google Cloud Firestore.

## Proposed Collection Structure

### 1. `collections/profiles/{userId}`
Holds contributor details, historic performance, and capability matrix.

```json
{
  "userId": "ayush_contributor",
  "displayName": "Ayush",
  "skills": ["RLHF", "Translation"],
  "trustScore": 94,
  "accuracy": 96.5,
  "languages": ["en-US", "es-ES"],
  "country": "US",
  "deviceCapabilities": ["Desktop", "Mobile"],
  "level": 3,
  "xpProgress": 680,
  "streakDays": 4,
  "createdAt": "TIMESTAMP",
  "updatedAt": "TIMESTAMP"
}
```

### 2. `collections/reservations/{reservationId}`
Tracks active leases, leaseholders, and expiration indices.

```json
{
  "reservationId": "res_91823912a",
  "taskId": "TASK-RLHF-001",
  "userId": "ayush_contributor",
  "reservedAt": "TIMESTAMP",
  "expiresAt": "TIMESTAMP",
  "status": "Active"
}
```

## Security Rules (`firestore.rules`)

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /profiles/{userId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
    match /reservations/{resId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null && request.resource.data.userId == request.auth.uid;
      allow update, delete: if request.auth != null && resource.data.userId == request.auth.uid;
    }
  }
}
```

## Required Composite Indices

To support efficient filtering of tasks based on matching scores and statuses, create these composite indices in the Firebase Console:

| Collection | Fields | Order |
| :--- | :--- | :--- |
| `reservations` | `userId` (Ascending), `status` (Ascending), `expiresAt` (Descending) | Composite Index |
| `tasks` | `currentStatus` (Ascending), `requiredTrustScore` (Ascending) | Composite Index |
