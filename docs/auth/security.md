# Security Foundation Guidelines

The security architecture of TaskNova AI Authentication maintains enterprise-grade standards across all communication nodes.

## 1. Zero-Trust Access Boundary
* Client-side validation is purely for improving user experience.
* **All critical operations must be checked server-side** in Cloud Functions or Database Security Rules (ABAC).
* Never rely on UI hidden tabs to protect data. A malicious actor can easily manipulate the DOM.

## 2. Strong Password Complexity Parameters
All standard user password credentials must adhere to the strong complexity expression:

* **Minimum Length**: 8 characters
* **Uppercase Characters**: Minimum 1
* **Lowercase Characters**: Minimum 1
* **Numerical Digits**: Minimum 1
* **Special Characters**: Minimum 1 (`@$!%*?&`)

```typescript
export const STRONG_PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
```

## 3. SLA Verification Constraints
* Ledger payouts, billing transfers, and core administrative configurations are strictly blocked if `emailVerified === false`.
* To help prevent automated bot farm sign-ups, email verification links must be dispatched immediately upon profile provisioning.
