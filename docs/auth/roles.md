# Role System (RBAC)

TaskNova AI enforces a strict multi-tier Role-Based Access Control system. Users are classified under one of four organizational levels.

## Platform Roles

| Role | Access Level | Description | Core Capabilities |
| :--- | :---: | :--- | :--- |
| **Contributor** | `1` | Human Evaluator node | Can take evaluation micro-tasks, submit payloads, and claim ledger reward coins. |
| **Creator** | `3` | Campaign Developer | Full contributor capability plus creating task campaigns and auditing evaluation analytics. |
| **Business** | `5` | Enterprise Partner Node | Focuses on uploading evaluation payloads, funding campaigns, and auditing results. |
| **Admin** | `10` | Sovereign System Admin | Master access level across users, system configurations, and ledger audits. |

---

## Role Specifications and Mapping

```typescript
export enum UserRole {
  CONTRIBUTOR = 'contributor',
  BUSINESS = 'business',
  CREATOR = 'creator',
  ADMIN = 'admin',
}
```

Each role is assigned a list of distinct `AuthPermission` flags:

```typescript
export enum AuthPermission {
  TAKE_MICRO_TASKS = 'tasks:take',
  SUBMIT_MICRO_TASKS = 'tasks:submit',
  CLAIM_REWARDS = 'rewards:claim',
  VIEW_LEADERBOARD = 'leaderboard:view',
  CREATE_CAMPAIGN = 'campaigns:create',
  MANAGE_CAMPAIGN = 'campaigns:manage',
  VIEW_ANALYTICS = 'analytics:view',
  UPLOAD_PAYLOADS = 'payloads:upload',
  APPROVE_EVALUATIONS = 'evaluations:approve',
  FUND_CAMPAIGN = 'campaigns:fund',
  EXPORT_REPORTS = 'reports:export',
  MANAGE_USERS = 'users:manage',
  AUDIT_LEDGER = 'ledger:audit',
  SYSTEM_CONFIGURE = 'system:configure',
}
```
