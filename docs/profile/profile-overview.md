# User Profile Overview Architecture

This documentation describes the TaskNova User Profile subsystem, which serves as the global identity layer across the platform.

## Architecture & Domain Model

The profile domain model balances active performance tracking (for ML alignment validation metrics) with standard preference configurations and security state audits.

### Structure of `UserProfile`

The state interface is defined in `/src/profile/types/index.ts`:

- **Identity Nodes**: Display Name, Username, avatar gradient style keys, custom bio.
- **Account status**: Standard validation states (`ACTIVE`, `PENDING_REVIEW`, `SUSPENDED`).
- **Audit Levels**: Verification badge statuses (`VERIFIED`, `PENDING`, `UNVERIFIED`).
- **Temporal Metrics**: Registration timestamp records.
- **Feature Modules**: Badges, stats, preferences, security, session tracking audits.

---

## Data Flow Isolation (Strict Layer Separation)

The profile subsystem isolates UI components from downstream Firestore databases using clean abstraction layers:

1. **Domain Model (`types/`)**: Declares standard TypeScript types for the client.
2. **Mock Memory (`mocks/`)**: Locally caches snapshot changes using `localStorage` for responsive prototyping.
3. **Mappers (`mappers/`)**: Transforms database record shape keys (using snake_case) into domain model properties.
4. **Adapters (`adapters/`)**: Cleans form input parameters, formats usernames, and caps bio text lengths.
5. **Repositories (`repositories/`)**: Encapsulates persistence interactions, preventing any UI file from directly using DB interfaces.
6. **Services (`services/`)**: Orchestrates analytic trackers, verifies active feature flags, and updates data back into repositories.
