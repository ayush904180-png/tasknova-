# Enterprise AI Task Generation Engine Architecture

The Enterprise AI Task Generation Engine is a high-performance system designed to automatically convert approved corporate datasets into structured human microtasks. 

## 🏗️ Core Architecture Flow

```
+------------------------------------------------------------+
|                       Dataset Source                       |
+-----------------------------+------------------------------+
                              |
                              v
+-----------------------------+------------------------------+
|               12-Step Ingestion & Inference                |
|  1. Ingestion        5. Classification  9. QA Validation   |
|  2. Analysis         6. Difficulty      10. Hum. Review    |
|  3. Schema Detect    7. Reward Calc     11. Generation     |
|  4. Chunking         8. Priority Calc   12. Publish Market |
+-----------------------------+------------------------------+
                              |
                              v
+-----------------------------+------------------------------+
|                  Task Generation Event Bus                 |
|       Dispatches real-time telemetry log segments.         |
+-----------------------------+------------------------------+
                              |
                              v
+-----------------------------+------------------------------+
|            Task Generation Context & Repository            |
|       Local memory database with LocalStorage backup.       |
+-----------------------------+------------------------------+
                              |
                              v
+-----------------------------+------------------------------+
|                    Marketplace Publisher                   |
|        Approved tasks hot-swapped into live stream.        |
+------------------------------------------------------------+
```

## 🛠️ Key Components & Integrations

- **Types (`types/index.ts`)**: Models for `TaskGenPipeline`, `GeneratedTaskEntity`, `DatasetChunk`, and `TaskTemplate`.
- **Event Bus (`events/TaskGenerationEventBus.ts`)**: Loose-coupled real-time telemetry emitter using typed Node pattern callback hooks.
- **Cache (`cache/TaskGenerationCache.ts`)**: Active memory cache maps, standard TTL expiry thresholds, and offline operation sync buffers.
- **Adapters (`adapters/GCloudAdapters.ts`)**: Clean stubs and configurations mapping pipeline components to Cloud Storage, Firestore, Google Sheets, and Drive APIs.
- **Validators (`validators/TaskGenerationValidator.ts`)**: Strict field audit tests, duplication risk detectors, safety score checkers, and currency economics checks.
- **Chunking Engine (`utils/ChunkingEngine.ts`)**: Structured segmentation parser for CSV (row splits), JSON objects, large PDF texts, and media indexes (images, audio, video).
- **Service (`services/TaskGenerationService.ts`)**: Process orchestrator executing async pipelines and publishing results directly to the live task stream.
- **React State Context (`context/TaskGenerationContext.tsx`)**: Global UI hook system linking active screens to real-time events, network monitors, and background sync events.
- **Saved Filters Shortcut Panel**: Customizable search bookmarks for fast sorting of complex outlier attributes.
