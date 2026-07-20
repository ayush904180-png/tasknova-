# Production Hardening Checklist

Guidelines for securing, optimizing, and deploying TaskNova campaign systems.

## 1. Soft Delete Enforcement

No campaign or dataset should ever be deleted from database tables permanently. Soft delete is enforced via the `deleted_at` timestamp field.
Queries MUST filter `deleted_at IS NULL` globally.

## 2. API Security Controls

- **Access Controls**: Role-based access control (RBAC) checked on every api boundary.
- **Rate Limiting**: Custom token bucket filters (max 120 requests/min per company IP).
- **No Client Secrets**: API keys must be kept entirely server-side in Secret Manager.

## 3. Input Validation

- Strict XSS cleaning on campaign names and descriptions using markdown sanitizers.
- Enforce strict size validation limits (max 500MB per dataset payload).
