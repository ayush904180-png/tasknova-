# Future Google Cloud Functions Architecture

This document describes the serverless backend functions triggered by contributor operations in the marketplace.

## Proposed Function Endpoints

### 1. `recalculateMatchingAffinity`
- **Trigger**: On-write update to a contributor profile in Firestore.
- **Runtime**: Node.js 20 / Python 3.11.
- **Functionality**: Pulls active task definitions and recomputes compatible alignment metrics. Updates the client-side TTL caches.

### 2. `evaluateConsensus`
- **Trigger**: HTTP POST or Pub/Sub trigger on task completion.
- **Runtime**: Node.js 20.
- **Functionality**: Aggregates submissions for a given `taskId`. Runs voting consensus logic (AI vs human responses), checks accuracy, and credits the winner's wallet.

### 3. `releaseExpiredReservations`
- **Trigger**: Cloud Scheduler Cron (Runs every 1 minute).
- **Runtime**: Node.js 20.
- **Functionality**: Runs a batch query for active reservations whose `expiresAt` < `now()`, marks them `Expired`, and releases the associated distributed task locks.
