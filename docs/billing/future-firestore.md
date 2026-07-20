# Future Firestore Migration Specification

This document details the direct mappings and rules when migrating the `LocalBillingRepository` to a live production Firebase Firestore environment.

## Firestore Schemas

### 1. `subscriptions` Collection
- **Path**: `subscriptions/{userId}`
- **Document Schema**:
```json
{
  "id": "sub_default_01",
  "tier": "Starter",
  "cycle": "Monthly",
  "price": 29.00,
  "startDate": "2026-07-01T00:00:00Z",
  "endDate": "2026-07-31T00:00:00Z",
  "status": "Active",
  "autoRenew": true
}
```

### 2. `invoices` Collection
- **Path**: `invoices/{invoiceId}`
- **Document Schema**:
```json
{
  "id": "inv_1001",
  "invoiceNumber": "INV-2026-001",
  "userId": "usr_789123",
  "businessDetails": {
    "name": "Acme Robotics",
    "address": "123 Main St",
    "email": "billing@acme.com"
  },
  "items": [
    { "description": "Starter Plan Subscription", "amount": 29.00 }
  ],
  "subtotal": 29.00,
  "tax": 5.22,
  "discount": 0.00,
  "creditsApplied": 0.00,
  "grandTotal": 34.22,
  "status": "Paid"
}
```

## Security Rules (`firestore.rules`)
To protect against invoice tempering, duplicate credit applications, and subscription abuse, write secure Firestore rules:
```javascript
service cloud.firestore {
  match /databases/{database}/documents {
    match /subscriptions/{userId} {
      allow read: if request.auth != null && request.auth.uid == userId;
      allow write: if request.auth != null && request.auth.token.role in ['admin', 'owner'];
    }
    match /invoices/{invoiceId} {
      allow read: if request.auth != null && (resource.data.userId == request.auth.uid || request.auth.token.role in ['finance', 'billing_manager']);
      allow write: if request.auth != null && request.auth.token.role in ['finance', 'admin'];
    }
  }
}
```
Using the repository-driven pattern, migrating only requires implementing the `IBillingRepository` interface using the Firebase Web SDK!
