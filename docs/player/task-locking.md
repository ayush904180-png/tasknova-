# Task Locking & Reservation Specification
Version 1.0.0 | Transactional Integrity

To coordinate thousands of concurrent contributors working on a single pool of micro-tasks, TaskNova AI implements a distributed, lease-based task locking mechanism. This guarantees that duplicate validation credits are never paid out for the same alignment segment.

## 1. Reservation Leases
Before the player loads a task workspace, it must claim an exclusive lease.
* **Duration**: 15 minutes (`15 * 60 * 1000` ms).
* **Identifier**: A unique client cryptographic token prefixed with `LOCK-`.

## 2. Lock Expiry & Automatic Releases
If a contributor closes their browser, experiences a computer crash, or leaves their desk without completing the task:
1. The lock automatically expires after 15 minutes.
2. The `TaskLockManager` frees up the reservation on the global queue.
3. Another contributor can now reserve and work on the task.

If the contributor is actively working and the timer is close to expiring, the lease is automatically extended upon any auto-save trigger to prevent sudden lock-loss.

## 3. Double-Commit Prevention
Submissions are guarded against double-submission at both the player shell level and the database repository level:
1. When a task is selected, the player secures a lock.
2. If another tab tries to open the same task, `acquireLock` rejects the request with a `Reservation Lock Conflict` message.
3. Submitting the task immediately releases the reservation lock.
