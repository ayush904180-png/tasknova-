# TaskNova AI Firestore Data Architecture Schema

This schema documents all 22 collections, subcollections, structures, indexes, and scalability characteristics.

---

## 1. users
* **Purpose**: Root authentication registration and core account state.
* **Relationships**: 1-to-1 with `profiles`, 1-to-1 with `wallets`.
* **Path**: `/users/{userId}`
* **Document Structure**:
```json
{
  "id": "string (uid)",
  "email": "string",
  "emailVerified": "boolean",
  "createdAt": "timestamp",
  "updatedAt": "timestamp",
  "lastActiveAt": "timestamp",
  "status": "string ('active' | 'suspended' | 'pending')"
}
```
* **Indexes**: Single-field index on `email`.
* **Security**: Read/Write restricted strictly to Owner (`userId == request.auth.uid`). No public reads.

---

## 2. profiles
* **Purpose**: User display profiles, xp, levels, stats.
* **Relationships**: 1-to-1 with `users`.
* **Path**: `/profiles/{profileId}`
* **Document Structure**:
```json
{
  "id": "string (uid)",
  "username": "string (3-25 chars)",
  "role": "string ('contributor' | 'creator' | 'business' | 'admin')",
  "displayName": "string (1-50 chars)",
  "avatarUrl": "string (optional)",
  "bio": "string (optional, max 300)",
  "country": "string",
  "skills": "array [string]",
  "level": "number",
  "xp": "number",
  "totalCoinsEarned": "number",
  "createdAt": "timestamp",
  "updatedAt": "timestamp"
}
```
* **Indexes**: Single-field unique index on `username`.
* **Security**: Read available to all authenticated users. Writes restricted strictly to the owner (`profileId == request.auth.uid`). Role changes are immutable to the client.

---

## 3. tasks
* **Purpose**: Holds Human Intelligence Tasks (HITs) or micro-tasks.
* **Relationships**: Belongs to `campaigns` or `creatorAccounts`. References `taskCategories`.
* **Path**: `/tasks/{taskId}`
* **Document Structure**:
```json
{
  "id": "string (uuid)",
  "title": "string (5-100 chars)",
  "description": "string (10-1000 chars)",
  "categoryId": "string",
  "campaignId": "string (optional)",
  "creatorId": "string (uid)",
  "difficulty": "string ('easy' | 'medium' | 'hard')",
  "rewardCoins": "number (1-10000)",
  "estimatedSeconds": "number",
  "instructions": "array [string, max 20 items]",
  "payloadTemplate": "map",
  "maxSubmissionsAllowed": "number",
  "submissionCount": "number",
  "status": "string ('draft' | 'active' | 'paused' | 'completed' | 'cancelled')",
  "createdAt": "timestamp",
  "updatedAt": "timestamp"
}
```
* **Indexes**: Compound index on `status` + `categoryId` + `createdAt` (for feed sorting).
* **Security**: Anyone can read 'active' tasks. Only 'creator' or 'admin' can write.

---

## 4. taskCategories
* **Purpose**: Master category list (RLHF, Prompt Evaluation, etc.).
* **Path**: `/taskCategories/{categoryId}`
* **Document Structure**:
```json
{
  "id": "string",
  "name": "string",
  "description": "string",
  "iconName": "string",
  "isActive": "boolean",
  "allowedDifficulties": "array [string]"
}
```
* **Security**: Public read-only. Write restricted strictly to Admins.

---

## 5. taskSubmissions
* **Purpose**: Tracks user micro-task answer submissions and reviews.
* **Relationships**: References `tasks` and `users`.
* **Path**: `/taskSubmissions/{submissionId}`
* **Document Structure**:
```json
{
  "id": "string (uuid)",
  "taskId": "string",
  "userId": "string (uid)",
  "campaignId": "string (optional)",
  "responsePayload": "map",
  "durationSeconds": "number",
  "status": "string ('pending_review' | 'approved' | 'rejected')",
  "reviewerFeedback": "string (optional)",
  "reviewedBy": "string (uid, optional)",
  "reviewedAt": "timestamp (optional)",
  "createdAt": "timestamp",
  "updatedAt": "timestamp"
}
```
* **Indexes**: Compound index on `userId` + `status` + `createdAt` (user dashboard history). Compound index on `taskId` + `status` + `createdAt` (admin review feed).
* **Security**: Owner can create and read their own submissions. Reviewers and Admins can update status.

---

## 6. wallets
* **Purpose**: User or Business account financial balance.
* **Relationships**: 1-to-1 with `users` or `businessAccounts`.
* **Path**: `/wallets/{walletId}`
* **Document Structure**:
```json
{
  "id": "string (uid)",
  "ownerId": "string (uid)",
  "balanceCoins": "number (double, >= 0)",
  "pendingCoins": "number (double, >= 0)",
  "currency": "string ('COIN' | 'USD')",
  "status": "string ('active' | 'frozen')",
  "updatedAt": "timestamp"
}
```
* **Security**: Owner can read. Write operations are restricted strictly to server integrations (no direct client writes!).

---

## 7. transactions
* **Purpose**: Immutable financial logging ledger.
* **Relationships**: Belongs to `wallets`.
* **Path**: `/transactions/{transactionId}`
* **Document Structure**:
```json
{
  "id": "string (uuid)",
  "walletId": "string",
  "amount": "number (positive)",
  "type": "string ('credit' | 'debit')",
  "purpose": "string ('reward' | 'payout' | 'deposit' | 'purchase' | 'refund')",
  "referenceId": "string (optional)",
  "status": "string ('pending' | 'completed' | 'failed')",
  "metadata": "map (optional)",
  "createdAt": "timestamp"
}
```
* **Indexes**: Compound index on `walletId` + `createdAt` (ledger list query).
* **Security**: Read restricted to wallet owner. Client writes are strictly forbidden (immutable).

---

## 8. notifications
* **Purpose**: Alerts, achievements notifications, and system notifications.
* **Path**: `/notifications/{notificationId}`
* **Document Structure**:
```json
{
  "id": "string",
  "userId": "string",
  "title": "string",
  "message": "string",
  "type": "string ('info' | 'reward' | 'badge' | 'system')",
  "isRead": "boolean",
  "createdAt": "timestamp"
}
```
* **Indexes**: Compound index on `userId` + `isRead` + `createdAt`.
* **Security**: Only the recipient user can read/update (`userId == request.auth.uid`).

---

## 9. badges
* **Purpose**: Master gamification badge catalog definitions.
* **Path**: `/badges/{badgeId}`
* **Document Structure**:
```json
{
  "id": "string",
  "name": "string",
  "description": "string",
  "iconName": "string",
  "category": "string ('accuracy' | 'volume' | 'speed' | 'social')"
}
```
* **Security**: Public read-only. Writes restricted to Admins.

---

## 10. achievements
* **Purpose**: Unlocked gamification record for users.
* **Relationships**: Links `users` to `badges`.
* **Path**: `/achievements/{achievementId}`
* **Document Structure**:
```json
{
  "id": "string",
  "userId": "string",
  "badgeId": "string",
  "unlockedAt": "timestamp",
  "claimedReward": "boolean"
}
```
* **Security**: Read allowed for anyone. Writes restricted to server logic or system admins.

---

## 11. leaderboards
* **Purpose**: Cached periodic ranking datasets (Weekly, Monthly, Categorical).
* **Path**: `/leaderboards/{leaderboardId}`
* **Document Structure**:
```json
{
  "id": "string (e.g. 'weekly_global')",
  "period": "string ('daily' | 'weekly' | 'monthly' | 'all_time')",
  "category": "string",
  "rankings": "array of maps [{ userId, username, score, rank }]",
  "updatedAt": "timestamp"
}
```
* **Security**: Public read-only.

---

## 12. businessAccounts
* **Purpose**: Enterprise / Corporate account metadata.
* **Path**: `/businessAccounts/{businessId}`
* **Document Structure**:
```json
{
  "id": "string",
  "userId": "string",
  "companyName": "string",
  "website": "string (optional)",
  "industry": "string",
  "verificationStatus": "string ('unverified' | 'pending' | 'verified' | 'rejected')",
  "taxId": "string (optional)",
  "createdAt": "timestamp"
}
```
* **Security**: Read allowed for verified businesses. Writes restricted to Admins or the registered business owner.

---

## 13. creatorAccounts
* **Purpose**: Advanced AI Creator certifications and specialties.
* **Path**: `/creatorAccounts/{creatorId}`
* **Document Structure**:
```json
{
  "id": "string",
  "userId": "string",
  "specialties": "array [string]",
  "portfolioUrls": "array [string]",
  "kycStatus": "string ('none' | 'pending' | 'verified')",
  "preferredLanguages": "array [string]",
  "createdAt": "timestamp"
}
```
* **Security**: Public read. Owner can modify specialties and languages. Admins manage KYC status.

---

## 14. campaigns
* **Purpose**: Corporate/Enterprise crowdsourcing budgets and task pools.
* **Relationships**: Owned by `businessAccounts`. Wraps several `tasks`.
* **Path**: `/campaigns/{campaignId}`
* **Document Structure**:
```json
{
  "id": "string",
  "businessId": "string",
  "title": "string",
  "description": "string",
  "budgetCoins": "number",
  "spentCoins": "number",
  "status": "string ('draft' | 'pending_approval' | 'active' | 'completed' | 'paused')",
  "targetCriteria": {
    "languages": "array [string]",
    "minAccuracy": "number",
    "requiredSkills": "array [string]"
  },
  "taskIds": "array [string]",
  "createdAt": "timestamp",
  "updatedAt": "timestamp"
}
```
* **Indexes**: Compound index on `businessId` + `status` + `createdAt`.
* **Security**: Read allowed to authenticated users. Write allowed to Business Owner or Admin.

---

## 15. reviews
* **Purpose**: Task QA reviews from expert evaluators or automated models.
* **Path**: `/reviews/{reviewId}`
* **Document Structure**:
```json
{
  "id": "string",
  "targetId": "string (submissionId)",
  "reviewerId": "string",
  "score": "number",
  "comments": "string (optional)",
  "status": "string ('accepted' | 'rejected')",
  "createdAt": "timestamp"
}
```
* **Security**: Reviewers and Admins can create/read. Task creators can read reviews on their tasks.

---

## 16. feedback
* **Purpose**: Standard in-app user feedback and bug logging.
* **Path**: `/feedback/{feedbackId}`
* **Document Structure**:
```json
{
  "id": "string",
  "userId": "string",
  "category": "string ('bug' | 'suggestion' | 'praise' | 'other')",
  "title": "string",
  "content": "string",
  "status": "string ('open' | 'investigating' | 'resolved' | 'closed')",
  "createdAt": "timestamp"
}
```
* **Security**: Owner can create and read. Admin can list/update status.

---

## 17. reports
* **Purpose**: Reporting toxic tasks, incorrect guidelines, or cheating contributors.
* **Path**: `/reports/{reportId}`
* **Document Structure**:
```json
{
  "id": "string",
  "reporterId": "string",
  "targetType": "string ('task' | 'profile' | 'submission')",
  "targetId": "string",
  "reason": "string",
  "comments": "string (optional)",
  "status": "string ('pending' | 'resolved' | 'dismissed')",
  "createdAt": "timestamp"
}
```
* **Security**: Authenticated users can create reports. Read/Update restricted strictly to Admins.

---

## 18. settings
* **Purpose**: User configuration preferences.
* **Path**: `/settings/{userId}`
* **Document Structure**:
```json
{
  "id": "string",
  "notifications": {
    "email": "boolean",
    "push": "boolean",
    "marketing": "boolean"
  },
  "interface": {
    "theme": "string ('light' | 'dark' | 'system')",
    "language": "string"
  },
  "privacy": {
    "showRankOnLeaderboard": "boolean",
    "publicProfile": "boolean"
  }
}
```
* **Security**: Restricted strictly to Owner.

---

## 19. featureFlags
* **Purpose**: Runtime feature gating, Canary deployments, and system toggles.
* **Path**: `/featureFlags/{flagKey}`
* **Document Structure**:
```json
{
  "id": "string (flag key)",
  "description": "string",
  "isEnabled": "boolean",
  "rolloutPercentage": "number (0-100)",
  "targetRoles": "array [string]"
}
```
* **Security**: Public read-only. Writes restricted to Admins.

---

## 20. analyticsEvents
* **Purpose**: Event logging for product optimization (no PII!).
* **Path**: `/analyticsEvents/{eventId}`
* **Document Structure**:
```json
{
  "id": "string",
  "userId": "string (optional)",
  "sessionId": "string",
  "eventName": "string",
  "parameters": "map",
  "deviceInfo": {
    "os": "string",
    "browser": "string",
    "isMobile": "boolean"
  },
  "timestamp": "timestamp"
}
```
* **Security**: Append-only for clients. Read/Query restricted to Admins.

---

## 21. auditLogs
* **Purpose**: Security auditing of administrative actions.
* **Path**: `/auditLogs/{logId}`
* **Document Structure**:
```json
{
  "id": "string",
  "actorId": "string",
  "action": "string",
  "resourceType": "string",
  "resourceId": "string",
  "preImage": "map (optional)",
  "postImage": "map (optional)",
  "ipAddress": "string (optional)",
  "timestamp": "timestamp"
}
```
* **Security**: Read/Write restricted strictly to Security Admins/Server Services.

---

## 22. systemConfigs
* **Purpose**: Global rates, coin limits, transaction rules.
* **Path**: `/systemConfigs/{domainId}`
* **Document Structure**:
```json
{
  "id": "string",
  "values": "map",
  "updatedAt": "timestamp",
  "updatedBy": "string"
}
```
* **Security**: Public read. Admin-only write.

---

## Subcollection Design Patterns

* **`users/{userId}/sessions`**: Records active device sessions and login locations.
* **`users/{userId}/devices`**: Manages push token registers.
* **`wallets/{walletId}/transactions`**: Read-optimized subcollection mirroring main `transactions` collection for ultra-fast customer bill statements.
* **`campaigns/{campaignId}/submissions`**: Fast indexing of tasks submitted specifically under the business contract campaign.
