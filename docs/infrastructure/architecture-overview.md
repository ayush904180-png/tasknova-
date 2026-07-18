# TaskNova AI Infrastructure: Architecture Overview

TaskNova AI implements a multi-tiered, zero-trust cloud data architecture utilizing the Google Ecosystem as its primary backbone. The architecture prioritizes strict decoupling of user interfaces from backend services, type safety, regional resilience, and defensive payload constraints.

## System Topology

```
+-------------------------------------------------------+
|                       UI Layer                        |
|   (React 18 + Vite Components & Navigation Framework)  |
+-------------------------------------------+-----------+
                                            |
                                            v  (Strict Abstraction)
+-------------------------------------------------------+
|                Infrastructure Providers               |
|      (Exposes Unified Repositories & Services)        |
+-----+----------------+------------------+-------------+
      |                |                  |
      v                v                  v
+-----------+    +-----------+      +-----------+
| Repos     |    | Services  |      | Cache     |
| (Mappers) |    | (Adapters)|      | (Local)   |
+-----+-----+    +-----+-----+      +-----+-----+
      |                |                  |
      +--------+-------+------------------+
               |
               v (Transport Security Layer)
+--------------+----------------------------------------+
|                   Google Cloud Core                   |
+-----+------------------+------------------+-----------+
      |                  |                  |
      v                  v                  v
+-----------+      +-----------+      +-----------+
| Firebase  |      | Google    |      | Google    |
| Cloud     |      | Sheets    |      | Drive     |
| Firestore |      | Workspace |      | Corporate |
+-----------+      +-----------+      +-----------+
```

## Architectural Decoupling Policies

1. **No UI-to-Firestore Direct Piping**: No component is permitted to call Firestore SDK queries (`doc()`, `collection()`, `getDocs()`, etc.) directly. All mutations must route through `useInfrastructure()`.
2. **Defensive Payload Constraints**: Entities are mapped at the repository boundaries (`toFirestore()` and `toDomain()`) via deterministic `Mappers`. Optional values are handled explicitly, and strict type casting is enforced.
3. **Optimistic Caching & Offline Continuity**: Reads default to the `LocalCache` engine. Writes queue in localStorage if connection degradation occurs, ensuring 100% operational uptime in offline microtasking states.
4. **Unified Error Handling Protocol**: Errors are intercepted by repositories and cast to structured `FirestoreErrorInfo` payloads, preventing raw exception leaks and accelerating developer debugging loops.
