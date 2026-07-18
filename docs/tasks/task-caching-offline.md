# Task Caching and Offline Strategy
---

## Cache Layer Design

The system implements a dual-stage read-through caching pipeline inside `/src/tasks/cache/TaskCache.ts`.

### 1. Stage 1: In-Memory Cache (RAM)
- High-speed lookup using standard JS `Map` objects.
- Drastically reduces internal filesystem and local storage read latency during high-frequency list rendering.

### 2. Stage 2: Local Persistence Cache (localStorage)
- Persists cache entries across browser refreshes.
- Automatically synchronizes with the in-memory layer on bootstrap.

---

## Time-to-Live (TTL) Expiration

Every cache entry is saved with an absolute timestamp representing its death-clock:
$$\text{Timestamp} = \text{Current Epoch Time} + \text{TTL Duration}$$

When a query fetches an item:
1. The cache checks if $\text{Current Time} < \text{Expiry Timestamp}$.
2. If true, the entry is returned instantly.
3. If false, the cache invalidates the entry, purges it from local storage, and prompts the repository to execute a remote load fallback.

---

## Offline Queuing & Invariant Synchronization

When connectivity drops, the engine switches to a local buffer pathway to keep participants engaged:

1. **Optimistic Updates**:
   Mutations (e.g. creating tasks or submitting verified answers) are processed instantly in the cache to reflect immediately in the UI.

2. **Offline Mutation Queue**:
   The operation is serialized and appended to a persistent local storage queue (`tasknova_offline_pending_queue`).

3. **Reconciliation Pipeline**:
   The repository monitors the `online` event listener. Upon re-establishing a network connection:
   - The queue is parsed in chronological order.
   - Mutations are transmitted sequentially via the `TaskRepository.syncOfflinePending()` method.
   - Once successfully saved, items are dequeued cleanly.
