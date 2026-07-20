# Real-time Usage Metering

The metering engine collects telemetry across server-side and client-side actions.

## Metered Dimensions
1. **Datasets Count**: Total structured training directories.
2. **Campaigns Count**: Total active human intelligence pools.
3. **Generated / Published / Completed Tasks**: Telemetry tracking human annotation counts.
4. **Storage Used**: Persistent bytes stored in Cloud Storage (in GB).
5. **Bandwidth Transferred**: Egress networking volumes.
6. **API Calls**: Server endpoints requested.
7. **AI Validation Runs**: LLM validator checks triggered.
8. **Wallet / Reward Distributions**: Monetary logs tracked.

## Performance and Scaling
Instead of querying heavy transactional databases on every API request:
- Metering aggregates usage in a high-speed **TTL cache**.
- Periodically, or when specific thresholds are breached, the cache syncs to Firestore or streams to Google BigQuery.
- This hybrid architecture ensures that counting millions of API requests has near-zero performance overhead on the core client-side UX.
