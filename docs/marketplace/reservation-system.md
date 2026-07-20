# Distributed Reservation System

To prevent hoarder behavior and coordinate high-concurrency micro-tasks, TaskNova integrates a rigorous lease-locking reservation pipeline.

## Lease Constraints

- **Single Lease Lock**: A contributor can hold a maximum of 3 active reserved tasks simultaneously.
- **Reservation Timer**: Standard leases last for 30 minutes (1800 seconds).
- **Expiration Hooks**: A background ticker evaluates active leases every 5 seconds. If the expiration timestamp is breached, the status is set to `Expired` and the distributed lock is released automatically.
- **Collision Shielding**: Atomic locks prevent other contributors from reserving the same task if someone has an active lease.

## Offline Capabilities

- **Queued Operations**: When network connectivity is lost, the reservation system queues the action locally in the offline buffer.
- **Background Synchronization**: Once network status shifts back to online, the queue automatically syncs, acquiring official cloud leases or handling conflict resolution smoothly.
- **Retry Queue**: Failed transactions are placed on a retry loop with exponential back-off limit controls.
