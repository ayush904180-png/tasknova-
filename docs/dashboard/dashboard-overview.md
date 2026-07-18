# Dashboard Engine Overview

This document describes the design architecture, directory separations, and engineering standards that power the TaskNova Control Console & Dashboard Engine.

## Architectural Objectives

1. **Decoupled Isolation**: No widget directly calls external Firestore queries or binds to any private SDK initialization. All operations flow through `useInfrastructure()` and the central `DashboardProvider`.
2. **Standardized Registry**: Widgets are registered dynamically on startup inside a central memory catalog (`WidgetRegistry`) instead of being hardcoded inside grid layouts.
3. **Event-Driven Communication**: Components converse completely asynchronously using a strongly typed `GlobalEventBus` instead of direct prop drilling or context syncing.
4. **Resilient Local Caching**: Reading operations pull from the write-through `LocalCache` to minimize cloud egress cost explosions and provide reliable offline fallback support.

## Folder Directory Structure

```text
src/dashboard/
├── components/          # High-fidelity Bento layout containers and overlays
│   ├── widgets/         # Core widgets implementing expected repository contracts
│   └── DashboardShell.tsx
├── context/             # Orchestrates loading, caching, and connectivity parameters
│   └── DashboardContext.tsx
├── events/              # Decoupled message emitters
│   └── EventBus.ts
├── registry/            # Customization menus and catalog registrations
│   ├── bootstrap.ts
│   └── WidgetRegistry.ts
└── types/               # Sizing, metrics, and visibility rules
    └── widgets.ts
```

## SOLID Principles in Practice

- **Single Responsibility**: `EventBus` manages communications, `LocalCache` manages read pools, `WidgetRegistry` handles catalog authorization, and `DashboardContext` tracks interface configurations.
- **Open-Closed**: Adding a new widget requires zero modifications to the grid container. You register the new configuration inside `bootstrap.ts` and the system discovers and renders it on screen automatically.
- **Interface Segregation**: All widgets obey the `IDashboardWidget` and `WidgetMetadata` types, exposing expected repository hooks, models, and connection points clearly.
