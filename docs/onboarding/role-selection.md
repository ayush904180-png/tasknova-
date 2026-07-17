# Role Selection & Security Policies

The account node selection restricts the interface structures visible to users.

## Role Definition

Onboarding options are restricted to three non-admin models:
- **Contributor**: For micro-task evaluation.
- **Creator**: For designing testing scenarios and grading.
- **Business**: For enterprise batch payloads.

## Security Constraints

- **Admin Isolation**: The `UserRole.ADMIN` is completely omitted from the selection array, preventing accidental elevation or exposure in client-facing elements.
- **Bypass Protections**: Developer step skipping and State Resets are gated behind a reactive `isDeveloperMode` flag, rendering shortcuts inactive in public builds.
- **Future Policy Extensions**:
  - **Invite Codes**: Restrict certain roles (e.g., Business/Enterprise Partner Nodes) to users presenting valid signature keys.
  - **Referral Loops**: Auto-assign partner bonuses on onboarding completion.
  - **Anonymous Sessions**: Allow users to explore evaluation widgets as guests before binding credentials.
