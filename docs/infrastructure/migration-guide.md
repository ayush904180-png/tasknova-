# Schema Migration and Version Control Playbook

As the TaskNova platform scales, database schema variations will occur. This playbook details zero-downtime database upgrade strategies.

## Schema Versioning Paradigms

Every database document includes a standard system version metadata key:
```json
{
  "_schemaVersion": 1
}
```

## Migration Protocols

### Strategy A: Lazy Migrations (On-The-Fly)
Highly efficient for non-critical additions. Reduces read/write costs by avoiding massive background write sweeps.
* **Mechanism**: When a document is read, the database `Mapper` class identifies the version. If the version is outdated, the mapper fills missing fields with defaults.
* **Commit**: When the document is subsequently updated or saved, it is written back in the new version format.

### Strategy B: Active Background Migrations
Required for breaking changes or new database constraints that require complete backfills.
* **Mechanism**: A trusted Node.js administrative script reads documents in chunks (using cursor pagination to stay within limits).
* **Execution**: It validates structural shape, transforms payloads, updates the `_schemaVersion` value, and writes items back in batched segments (max 500 documents per batch).
* **Log**: Progress is logged inside `/auditLogs`.
