# TaskNova AI Core Task Engine Overview
---
## Architectural Overview

The Core Task Engine represents the heart of TaskNova AI, coordinating high-throughput validator actions, micro-task assignments, and automated consensus tracking. Designed for massive scalability, the engine isolates core application mechanics from raw database and environment instances.

```
       [ React UI Screens / Sandbox Workspace ]
                          │
                  ( useTasks Hook )
                          │
              [ TaskService Facade ]
              /                    \
             /                      \
   [ TaskEventBus ]         [ TaskRepository ]
                                 │
                     ┌───────────┴───────────┐
                     ▼                       ▼
               [ TaskCache ]         [ TaskMapper ]
              (Offline Queue)        (Firestore Spec)
```

### Core Design Patterns & SOLID Compliance

1. **Repository Pattern (`TaskRepository`)**:
   Decouples data sourcing (whether SQLite, Firestore, or memory local caches) from client-side execution boundaries.
   
2. **Facade Pattern (`TaskService`)**:
   Coordinates multiple sub-systems (e.g. loading tasks, saving work, triggering analytics, linking Drive attachments, preparing export schemas) into unified methods for consumer components.

3. **Registry Pattern (`TaskTypeRegistry`)**:
   Provides an open-closed (`OCP`) interface for dynamically loading human-in-the-loop task plugins. It pre-registers the 18 essential system categories.

4. **Observer Pattern (`TaskEventBus`)**:
   Dispatches loose events across isolated modules (e.g. `TaskCreated`, `TaskCompleted`, `TaskStarted`) without requiring tight class linkages.

5. **Single Responsibility Principle (`SRP`)**:
   - `TaskValidator`: Responsible solely for checking entity schema invariants.
   - `TaskCache`: Focuses exclusively on memory TTL boundaries and offline queues.
   - `TaskAdapter`: Specializes in third-party integrations (Sheets row conversions & Drive file mappings).
