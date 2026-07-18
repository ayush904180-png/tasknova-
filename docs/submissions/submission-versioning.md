# Submission Versioning

The Submission Engine uses a strict **Double-Versioning Architecture** to ensure long-term database stability, robust client-backend contracts, and 100% backward compatibility as plugins and task configurations evolve.

## The Versioning Pillars

1. **Submission Format Version (`submissionVersion`)**: 
   - Tracks the structural schema signature of the `Submission` domain record.
   - Ensures that when new telemetry snapshots or security blocks are added, legacy migration functions can safely parse old data.
   - Initialized at version `1`.

2. **Task Configuration Version (`taskVersion`)**:
   - Captures the exact version of the micro-task definition at the instant the contributor acquired the reservation lock.
   - Prevents issues where a creator changes task instructions while a user is mid-session, ensuring they are only audited against the rules they actively agreed to.

## Immutable Historical Records

- Once written, historical submissions **must never be modified** in terms of user responses or structural fields.
- Updates can only modify administrative tracking parameters (like `submissionStatus`, `validationStatus`, `reviewStatus`, `humanMetadata`, or `updatedAt`).
- This safeguards the platform from retrospection issues where historical accuracy scores or speed indexes could be manipulated.
