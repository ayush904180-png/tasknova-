# Data Layer Performance and Resource Optimization

TaskNova AI implements optimal query patterns to ensure response speeds under 100ms, even with over 10 million registered users.

## Strategic Guidelines

### 1. Unified Pagination (`startAfterId`)
Fetching thousands of tasks or transaction entries in a single request crashes consumer browsers and spikes database read quotas.
* **Paradigm**: All collections feeds utilize cursor-based pagination.
* **Mechanism**: Use Firestore's `.startAfter(lastVisibleDocument)` to retrieve standard chunk limits (e.g. 25 records per load page).

### 2. Client-Side Batch Buffering
To prevent Denial of Wallet quota failures from write overheads:
* **Task Submissions**: Verified submissions are written individually, but daily statistics counters are compiled into memory and synchronized as single-document batched writes or transactions.
* **Transactions**: Financial mutations are wrapped in Firestore atomic transactions (`runTransaction()`) to guarantee consistency and block double-spending exploits.

### 3. Smart Index Optimizations
To avoid un-indexed query errors:
* Custom compound indexes are registered on search paths like `status` + `categoryId` + `createdAt`.
* Single-field index exclusions are set on massive unstructured fields (e.g. instructions, response payloads) to reduce unnecessary storage and index overhead.

### 4. Memory Eviction Policy
* Volatile caches inside `LocalCache` expire automatically using active TTL bounds (5 minutes for task feeds, 1 minute for wallet balances).
* Purges are automatically executed on component unmounts to prevent memory leaks.
