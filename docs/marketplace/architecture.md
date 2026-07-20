# Marketplace Architecture Spec

This page details the strict architectural structure and decoupled design of the TaskNova Marketplace module.

## Directory Structure

```text
src/marketplace/
├── types/          # Domain model interfaces, enums, event types
├── validators/     # Eligibility checkers, structural validators
├── repositories/   # Storage coordination, profile prefs, core bindings
├── services/       # Smart Matching & Reservation locking services
├── context/        # Main state provider, monitors, event handlers
├── events/         # Decoupled pub/sub event bus
├── analytics/      # Analytical compilations & health scoring
├── cache/          # TTL, local preferences, offline operation queues
├── mappers/        # DTO mapping layer
├── adapters/       # Cloud adapters (Firestore, Sheets, Drive, etc.)
├── hooks/          # useMarketplace state hook
├── utils/          # Formatting & countdown helpers
├── components/     # High-density bento grid dashboard visual nodes
└── pages/          # Unified page shell combining panels
```

## Data-Flow Topology

1. **Subscribing to Core Ledgers**
   The `MarketplaceContext` initializes and listens to the central `TaskRepository` data stream, projecting changes onto local filters.

2. **Smart Scoring Pipeline**
   Whenever the tasks list updates or filters modify, the system recalculates compatible scores using the user's loaded `ContributorProfile` via `MatchingEngineService`.

3. **Distributed Locking Transaction**
   - User clicks **Reserve**.
   - `ReservationService` validates eligibility (trust, accuracy, language bounds).
   - The engine checks for duplicate active leases or hoarder thresholds.
   - It performs an atomic distributed check via `FirestoreAdapter` (or falls back to local SQLite buffers if offline).
   - Once acquired, it writes lock indicators to prevent collision.
   - Broadcasts `TaskReserved` on the global Event Bus.

4. **Event Decoupling**
   All core mutations (reservations, completions, releases, bookmark toggles) pass through the `MarketplaceEventBus`, enabling non-blocking background synchronization and analytical telemetry recording.
