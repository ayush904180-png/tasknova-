# TaskNova AI Security, ABAC, and Hardening Protocols

This document provides complete structural patterns, security rules, and validation paradigms for Firestore, Auth, and Storage.

---

## Zero-Trust Attribute-Based Access Control (ABAC)

Access to data objects is determined dynamically using actor attributes (e.g., identity, role, verification status) rather than blanket roles, conforming strictly to the "Fortress" design.

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // 1. GLOBAL SAFETY NET (Default Deny Catch-all)
    match /{document=**} {
      allow read, write: if false;
    }

    // Global Reusable Security Primitives
    function isSignedIn() {
      return request.auth != null;
    }

    function isVerifiedUser() {
      return isSignedIn() && request.auth.token.email_verified == true;
    }

    function isOwner(userId) {
      return isVerifiedUser() && request.auth.uid == userId;
    }

    function isValidId(id) {
      return id is string && id.size() <= 128 && id.matches('^[a-zA-Z0-9_\\-]+$');
    }

    function incoming() {
      return request.resource.data;
    }

    function existing() {
      return resource.data;
    }

    // ==========================================
    // 2. USERS COLLECTION SECURITY
    // ==========================================
    match /users/{userId} {
      allow get: if isOwner(userId);
      allow create: if isOwner(userId) && isValidUserSchema(incoming());
      allow update: if isOwner(userId) && isValidUserSchema(incoming()) && (
        incoming().diff(existing()).affectedKeys().hasOnly(['lastActiveAt'])
      );
      allow delete: if false; // Account deletions go through admin queue
    }

    function isValidUserSchema(data) {
      return data.keys().hasAll(['id', 'email', 'emailVerified', 'status'])
        && data.id == request.auth.uid
        && data.email is string
        && data.email.size() <= 100
        && data.emailVerified is bool
        && data.status in ['active', 'suspended', 'pending'];
    }

    // ==========================================
    // 3. PROFILES COLLECTION SECURITY
    // ==========================================
    match /profiles/{profileId} {
      allow get: if isVerifiedUser();
      allow list: if isVerifiedUser() && resource.data.country == 'US'; // Query Enforcer constraint
      allow create: if isOwner(profileId) && isValidProfileSchema(incoming());
      allow update: if isOwner(profileId) && isValidProfileSchema(incoming()) && (
        // Protect RBAC fields: Owners can only edit bio/displayName, levels and roles are locked!
        incoming().diff(existing()).affectedKeys().hasOnly(['bio', 'displayName', 'avatarUrl', 'updatedAt'])
      );
    }

    function isValidProfileSchema(data) {
      return data.keys().hasAll(['id', 'username', 'role', 'displayName', 'level', 'xp'])
        && data.username.size() >= 3 && data.username.size() <= 25
        && data.displayName.size() >= 1 && data.displayName.size() <= 50
        && data.role in ['contributor', 'creator', 'business', 'admin']
        && data.level is int && data.level >= 1
        && data.xp is int && data.xp >= 0;
    }

    // ==========================================
    // 4. TASKS COLLECTION SECURITY
    // ==========================================
    match /tasks/{taskId} {
      allow read: if isVerifiedUser() && resource.data.status == 'active';
      allow create: if isVerifiedUser() && isValidTaskSchema(incoming());
      allow update: if isVerifiedUser() && (
        // Action: Submit Increment (Contributors can only touch submissionCount)
        (incoming().diff(existing()).affectedKeys().hasOnly(['submissionCount'])) ||
        // Action: Manage (Only owners can manage task parameters)
        (existing().creatorId == request.auth.uid && isValidTaskSchema(incoming()))
      );
    }

    function isValidTaskSchema(data) {
      return data.title.size() >= 5 && data.title.size() <= 100
        && data.description.size() >= 10 && data.description.size() <= 1000
        && data.rewardCoins is int && data.rewardCoins > 0 && data.rewardCoins <= 10000;
    }

    // ==========================================
    // 5. TRANSACTIONS & WALLETS (CLIENT-IMMUTABLE)
    // ==========================================
    match /wallets/{walletId} {
      allow get: if isOwner(existing().ownerId);
      allow write: if false; // Writes must only occur on server context
    }

    match /transactions/{txId} {
      allow get: if isVerifiedUser() && get(/databases/$(database)/documents/wallets/$(resource.data.walletId)).data.ownerId == request.auth.uid;
      allow write: if false; // Ledgers are fully immutable to clients
    }
  }
}
```

---

## Core Security Protocols

### 1. PII Separation Scheme
To adhere to GDPR, CCPA, and COPPA, personally identifiable information is never commingled with public user profiles.
* Public statistics and achievements live in the public `/profiles` directory.
* Legal identities, verified emails, and payment coordinates live in `/users/{userId}` or `/wallets/{walletId}` which are blocked from public scans.

### 2. Client Write Blockades (Immortal Ledgers)
Client SDKs are mathematically prevented from writing, updating, or deleting financial files (`wallets`, `transactions`). These collections are exclusively updated via trusted Cloud Run servers or Firebase Admin integrations.

### 3. ID Poisoning Safeguards
String lengths are bounded inside all Firestore rules to avoid malicious payload bloat (e.g., injecting 1MB strings inside simple status fields to trigger rapid database cost spikes).

### 4. Encryption Protocols
* **In-Transit**: Standard Google Cloud TLS 1.3 encryption across all request-response flows.
* **At-Rest**: Automatic AES-256 Firestore/Cloud Storage backend storage volume encryption.
* **PII Column Encryption**: Highly sensitive identifiers (e.g. payout tax parameters) are encrypted at the client level before transport.
