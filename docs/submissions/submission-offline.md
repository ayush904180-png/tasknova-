# Submission Offline Architecture

TaskNova AI implements a multi-tier local queuing system to enable offline task completions without losing user data or breaking consensus records.

## The Queue Matrix

1. **Offline Queue**: 
   - Temporarily stages finalized task submissions completed while offline.
   - Saves records inside `localStorage` under `tasknova_submissions_offline_queue`.

2. **Priority Queue**:
   - Items labeled with high or critical priority (e.g., high reward budgets or urgent SLAs) are prioritized first when the platform comes back online.

3. **Retry Queue (with Exponential Backoff)**:
   - Tracks sync attempts and latency. If sync fails due to rate limits or transient errors, backoff wait cycles are enforced.

4. **Conflict Resolution (Timestamp Precedence)**:
   - Resolves concurrency conflicts when the same submission is found on multiple clients.
   - Uses **Last-Write-Wins (Timestamp Precedence)** to safely merge details.

5. **Recovery Queue**:
   - Automatically repairs malformed structural nodes where schema changes occurred mid-session.

6. **Dead Letter Queue (DLQ)**:
   - Records that fail to synchronize more than **3 times** are isolated into a separate DLQ namespace (`tasknova_submissions_dead_letter_queue`).
   - Prevents blocking main pipelines with corrupt payloads, holding them for manual operator inspection.
