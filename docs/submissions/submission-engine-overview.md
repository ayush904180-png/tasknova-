# Universal Submission Engine Overview

The **Universal Submission Engine** is the core operational layer in the TaskNova AI ecosystem responsible for capturing, validating, packaging, securing, and preparing completed micro-tasks before future AI consensus evaluation and reward ledger settlements.

## Design Goals

1. **Strict Separation of Concerns (SOLID)**: Decouples user-plugin feedback capture from downstream database schemas and payment consensus nodes.
2. **100% Offline-First Availability**: Features multi-tier local queues (Priority, Retry, DLQ) that operate uninterrupted during transient network dropouts.
3. **Rigorous Quality & Security Audits**: Evaluates submissions against real-time keyboard pattern mashing, speed velocity traps, replay attack vectors, and client checksum validation.
4. **Extensible Dynamic Formats**: Adapts raw JSON payload data into Google Sheets analytical grids or exports them cleanly into Google Drive structures.

## System Architecture Flow

```
┌────────────────────────┐      ┌───────────────────────────┐      ┌─────────────────────────────┐
│   Task Player UI       │ ───> │  SubmissionService        │ ───> │  SubmissionValidator         │
│  (Isolated Plugins)    │      │  (Orchestrator / Mapper)  │      │  (Signature/Spam Check)     │
└────────────────────────┘      └───────────────────────────┘      └─────────────────────────────┘
                                              │                                   │
                                              v                                   v
┌────────────────────────┐      ┌───────────────────────────┐      ┌─────────────────────────────┐
│  SubmissionProvider    │ <─── │  SubmissionRepository     │ <─── │  SubmissionEventBus         │
│  (React Context/Flow)  │      │  (Local Cache / Storage)  │      │  (Broker Dispatcher)        │
└────────────────────────┘      └───────────────────────────┘      └─────────────────────────────┘
                                              │
                                              ▼
                               ┌───────────────────────────┐
                               │  Offline Queue Matrix     │
                               │  (Retry, Priority, DLQ)   │
                               └───────────────────────────┘
```

## Modular Directory Map

- `/src/types/submission.ts`: Standard enum codes (14 states) and Type interfaces.
- `/src/submissions/events/SubmissionEventBus.ts`: Type-safe publish/subscribe event dispatcher.
- `/src/submissions/utils/SubmissionValidator.ts`: Spam checks, velocity limits, and signatures.
- `/src/submissions/utils/SubmissionQueryBuilder.ts`: Dynamic multi-filter and sort pagination.
- `/src/submissions/mappers/SubmissionMapper.ts`: Bidirectional domain serialization.
- `/src/submissions/adapters/SubmissionAdapter.ts`: Tabular formats for Google Workspace.
- `/src/submissions/repositories/SubmissionRepository.ts`: Caching, Storage, and queue matrices.
- `/src/submissions/services/SubmissionService.ts`: System orchestrator and telemetry metrics.
- `/src/submissions/context/SubmissionContext.tsx`: React reactive binding state.
- `/src/submissions/components/`: Reusable, fully accessible WCAG AA visual layouts.
