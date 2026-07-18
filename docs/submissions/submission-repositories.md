# Submission Repositories

The **Submission Repository** is the clean abstraction layer responsible for all persistence and query execution, completely separating the UI components from underlying datastores.

## Key Architecture Patterns

- **Single Source of Truth**: All components fetch data through `GlobalSubmissionRepository`, which guarantees that local cache and persistent blocks remain unified.
- **In-Memory Caching**: Implements a highly performant map cache to fulfill repetitive requests instantly without hitting local disk I/O.
- **Disk Persistence**: Stores serializable JSON structures securely inside browser `localStorage` using the namespace key `tasknova_submissions_db`.

## Key Methods

- `getById(id: string): Promise<Submission | null>`: Resolves cache hits or hydrates from local storage.
- `list(options: SubmissionFilterOptions): Promise<Submission[]>`: Executes multi-field, compound dynamic queries.
- `save(submission: Submission): Promise<void>`: Inspects security checksums, executes validators, manages offline queues, and registers commits.
- `delete(id: string): Promise<void>`: Removes draft entries safely, ensuring terminal blocks are completely protected from deletion.
- `subscribe(callback: (subs: Submission[]) => void): () => void`: Registers real-time UI reactive listeners.
