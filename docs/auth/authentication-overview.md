# Authentication System Overview

Welcome to the **TaskNova AI Authentication System Documentation**. This architecture forms the core security layer governing identity, authorization, and permission node access throughout the TaskNova human intelligence network.

## Core Identity Principles

The authentication architecture is built on a **Zero-Trust, Role-Based Access Control (RBAC)** philosophy designed to:

1. **Verify Identity and Integrity**: Ensure all participant nodes are mapped to authenticated human beings or authorized enterprise partners.
2. **Strict Attribute Clearance**: Map users to one of four distinct platform profiles with strict functional and data boundaries.
3. **Defense-in-Depth Verification**: Enforce mandatory email verification guidelines prior to high-tier or financial operations (e.g. coin ledger withdrawals).
4. **Platform Agnostic & Ready**: Mirror the Firebase Authentication SDK exact schema footprints for instant runtime activation.

---

## Architectural File Layout

The authentication system is modularly organized in `/src/auth/` to isolate concern layers:

```text
/src/auth/
├── components/          # Reusable, accessible UI credential cards & status displays
├── constants/           # RegEx, error lists, role config mappings
├── hooks/               # useAuth consumer hooks
├── providers/           # Session state context providers
├── routes/              # Client-side protected & guest route wrappers
├── services/            # Cryptographic identity APIs & Firebase handshakes
├── types/               # Strict TypeScript roles, capabilities, and configurations
└── utils/               # Regular expression credentials validators
```

---

## Interactive Playroom Integration

A fully functioning, highly interactive **Authentication Gateway** has been built directly into the codebase. It simulates validation check-states, allows live role mapping switches, and includes:

* **Instant Developer Node Overrides**: Rapid simulation buttons to experience the platform as a Contributor, Creator, Business, or Admin.
* **Verification Status Monitors**: Toggle simulated verification parameters to observe state transitions on protected views.
* **Real-Time Permission Audit Logs**: Visualized list of capabilities active on your simulation node.
