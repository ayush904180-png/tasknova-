# TaskNova Enterprise Admin Control Center

An enterprise-grade platform Operational Headquarters designed according to Stripe Dashboard, Vercel, and Linear design paradigms.

## Module Directory Structure

```
/src/admin/
├── types/
│   └── index.ts         # Domain models (RBAC, health logs, threat structures, payouts, audits)
├── repositories/
│   └── AdminRepository.ts # Local Storage TTL wrapper, offline queuing engine
├── services/
│   └── AdminService.ts  # Administrative business rules, telemetry sim tickers
├── context/
│   └── AdminContext.tsx # Shared React context, state propagation, simulation loops
├── components/
│   ├── OverviewTab.tsx  # Executive dashboard, GCP services, stream ticker
│   ├── UserManagementTab.tsx   # User status freeze, reputation scoring
│   ├── BusinessManagementTab.tsx # Credit limits, API checks, billing freeze
│   ├── ContentModerationTab.tsx  # AI slang/prompt reviews, image tagging
│   ├── SecurityCenterTab.tsx    # WAF logs, proxy blocks, bot velocity Resolvers
│   ├── WithdrawalTab.tsx        # UPI, Bank wire payout dispatches
│   ├── AuditTab.tsx             # Immutable SHA ledger index
│   ├── NotificationCommandTab.tsx # Push targeted scheduler with live preview
│   ├── PlatformConfigTab.tsx    # XP rewards slopes, WAF bypass, Maintenance toggles
│   └── AnalyticsTab.tsx         # Recharts MRR lines, latency throughput indexes
└── pages/
    └── AdminConsolePage.tsx     # Master viewport controller, Global Command Search, RBAC Selectors
```

## Core Architectural Concepts

### 1. Robust Repository Pattern (`IAdminRepository`)
- Separates physical storage from administrative business services.
- Extends native `localStorage` with offline-first capabilities.
- Actions executed during intermittent internet periods are queued inside `tasknova_admin_offline_queue`. On reconnection, changes are synced with the backend Server using transactional resolution algorithms.

### 2. Service Layer Orchestration (`AdminService`)
- Encapsulates and implements strict business policies (calculating client risk profiles, verifying credential block constraints).
- Standardizes auditable entries—dispatching security telemetry indicators directly to the global Event Bus.

### 3. Role-Based Access Control (RBAC Matrix)
The portal limits edit permissions depending on the active administrative role:
- **Owner**: Full write clearance across billing, budgets, payouts, security overrides, and maintenance settings.
- **Finance Admin**: Clear write permission on financial withdrawals (UPI, Bank payouts) and corporate client budgets. Excluded from credentials resets.
- **Security Admin**: Exclusive credentials resets, whitelists IP subnets, and resolves WAF threats. Locked out of budget increases.
- **Moderator**: Access to Content Moderation queue only.
- **Auditor / Read Only**: Full view clearance, all buttons and state changes restricted.

## Operational Playbook

### Broadcasting MASS Notifications
1. Select the preconfigured notification template.
2. Input the template body content.
3. Check the desired delivery pipeline (SMS, In-App, Email, Push).
4. Specify target demographics (e.g., Creator role only, Hindi languages only).
5. Slide the "Schedule" toggle to park the campaign in Cloud Tasks queues, or deploy instantly.

### Approving Financial Payouts
1. Select UPI, Bank, or International queues depending on transfer channels.
2. Verify beneficiary audit trails (reputation XP alignments).
3. Input the banking transaction reference number.
4. Hit "Approve & Pay" to update the immutable wallet balance.
