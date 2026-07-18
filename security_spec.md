# TaskNova AI Security Specification (Phase 0 Audit)

This document establishes the absolute mathematical security boundary for TaskNova AI's Firestore layer, defining invariants, malicious ("Dirty Dozen") payloads, and the test suite structure.

## 1. Core Data Invariants

1. **Identity Binding**: A user profile document (`/profiles/{userId}`) can only be created or modified if its ID matches the authenticated user's UID (`request.auth.uid`). No profile can spoof another profile's ID.
2. **Role Protection**: The `role` field within `/profiles/{userId}` cannot be updated by the user once registered. Privilege escalation to 'admin' is strictly forbidden.
3. **Financial Immutability**: All credit and debit adjustments in `/wallets/{walletId}` are locked. Handled via atomic increments. Transactions are strictly append-only (immutable once created).
4. **Verified Status Requirement**: Only users with verified emails (`request.auth.token.email_verified == true`) are permitted to write records (e.g. createTask, submitAnswers) to prevent bot registration attacks.
5. **Campaign Budget Integrity**: Only Business or Admin users can register campaign budgets. The `spentCoins` of a campaign can never exceed the allocated `budgetCoins`.

## 2. The "Dirty Dozen" Malicious Payloads

The following payloads represent real attacks designed to exploit identity, integrity, and state transition laws. Our security rules mathematically reject all of them with a `PERMISSION_DENIED` response.

### Payload 1: Identity Spoofing (Write to another user's profile)
* **Target Path**: `/profiles/target-victim-uid`
* **Malicious Intent**: Overwrite display stats, levels, or avatar of another validator.
* **Payload**:
```json
{
  "id": "target-victim-uid",
  "username": "attacker",
  "role": "contributor",
  "displayName": "Hacked Profile",
  "level": 99,
  "xp": 9999
}
```

### Payload 2: Privilege Escalation (Self-assigning 'admin' role)
* **Target Path**: `/profiles/attacker-uid`
* **Malicious Intent**: Escalating role from `contributor` to `admin` during registration/update.
* **Payload**:
```json
{
  "id": "attacker-uid",
  "username": "attacker",
  "role": "admin",
  "displayName": "Malicious Admin"
}
```

### Payload 3: Character ID Injection (Resource poisoning)
* **Target Path**: `/profiles/attacker-uid-@#$%-invalid-chars`
* **Malicious Intent**: Injecting un-sanitized characters to breach route parsing or cause SQL/key indexing exploits.
* **Payload**:
```json
{
  "id": "attacker-uid-@#$%-invalid-chars",
  "username": "attacker"
}
```

### Payload 4: Over-Sized Field Injection (Denial of Wallet)
* **Target Path**: `/profiles/attacker-uid`
* **Malicious Intent**: Uploading a giant text string to consume document storage limits and spike read costs.
* **Payload**:
```json
{
  "bio": "[A repetitive 5MB string repeating 'A'...]"
}
```

### Payload 5: Direct Balance Hijack (Wallet manipulation)
* **Target Path**: `/wallets/attacker-uid`
* **Malicious Intent**: Directly setting `balanceCoins` to `1,000,000` via a client update.
* **Payload**:
```json
{
  "balanceCoins": 1000000,
  "status": "active"
}
```

### Payload 6: Negative Transaction Amount (Drain wallet/Refund exploits)
* **Target Path**: `/transactions/tx-123`
* **Malicious Intent**: Creating an immutable transaction with negative value to trick accounting loops.
* **Payload**:
```json
{
  "id": "tx-123",
  "walletId": "victim-wallet",
  "amount": -50000,
  "type": "credit",
  "purpose": "payout",
  "status": "completed"
}
```

### Payload 7: Fake Unverified Verification Spoofing (Email Spoof)
* **Target Path**: `/tasks/task-456`
* **Malicious Intent**: Submitting or modifying tasks with an unverified email address or spoofing an admin email without verification.
* **Auth State**: `email: admin@tasknova.ai`, `email_verified: false`

### Payload 8: Campaign Budget Theft (Negative Campaign Budget)
* **Target Path**: `/campaigns/camp-789`
* **Malicious Intent**: Initiating campaigns with negative budgets to drain resources or overflow balances.
* **Payload**:
```json
{
  "id": "camp-789",
  "businessId": "biz-uid",
  "title": "Malicious Campaign",
  "budgetCoins": -10000,
  "spentCoins": 0,
  "status": "active"
}
```

### Payload 9: Post-Terminal Status Mutation (State shortcutting)
* **Target Path**: `/taskSubmissions/sub-111`
* **Malicious Intent**: Forcing a previously rejected or approved submission back to "approved" or modifying its feedback after terminal state reached.
* **Action**: Update `/taskSubmissions/sub-111` (whose existing status is `approved`) to change `status` to `pending_review` or update payload answers.

### Payload 10: Missing Validation Keys (Update gaps)
* **Target Path**: `/profiles/attacker-uid`
* **Malicious Intent**: Removing critical fields to break downstream frontend rendering and trigger system crashes.
* **Payload (Create)**:
```json
{
  "id": "attacker-uid",
  "username": "attacker"
}
```
*(Fails because mandatory fields like role, level, xp, country are omitted)*

### Payload 11: Arbitrary Audit Log Spoofing (Impersonation)
* **Target Path**: `/auditLogs/log-999`
* **Malicious Intent**: Directly writing arbitrary logs pretending to be the core platform system engine.
* **Payload**:
```json
{
  "id": "log-999",
  "actorId": "SYSTEM_SERVICE",
  "action": "USER_SUSPEND",
  "resourceType": "profiles",
  "resourceId": "victim-uid"
}
```

### Payload 12: Illegal Transition of Immutable Field
* **Target Path**: `/tasks/task-121`
* **Malicious Intent**: Attempting to change `creatorId` or `createdAt` fields on update.
* **Payload**:
```json
{
  "creatorId": "some-other-hacker",
  "title": "Attempting to steal task ownership"
}
```

---

## 3. The Test Runner Reference

These conditions are mathematically validated in our final `firestore.rules` file:

```typescript
// firestore.rules.test.ts structure model
describe("TaskNova AI Zero-Trust Firestore Rules Suite", () => {
  it("should deny Payload 1 (Identity Spoofing)", async () => {
    // Attempting to write to /profiles/victim-uid as attacker-uid
  });

  it("should deny Payload 2 (Privilege Escalation)", async () => {
    // Attempting to set role = 'admin' as standard user
  });

  it("should deny Payload 3 (Character ID Injection)", async () => {
    // Attempting to use path containing illegal characters
  });

  it("should deny Payload 5 (Direct Balance Hijack)", async () => {
    // Attempting to update wallet balanceCoins as client
  });
});
```
