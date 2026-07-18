# Future Cloud Functions Readiness

The codebase is built on strict decoupled interfaces to ensure seamless deployment to serverless Cloud Functions.

## Cloud Function Integration Contracts

1. **CalculateReward()**
   - Trigger: HTTP/gRPC API or Firestore trigger on Submission validated.
   - Purpose: Process Rules Engine and Multiplier calculations.

2. **ApplyReward()**
   - Trigger: Cloud Function transaction handler.
   - Purpose: Commit signed transactions to Firestore `coin_ledger` collection.

3. **AwardXP()**
   - Trigger: Eventarc Pub/Sub topic.
   - Purpose: Increment user profile XP metrics.

4. **UnlockAchievement()**
   - Trigger: Pub/Sub topic on coin ledger credits.
   - Purpose: Scan rules and record dynamic achievement unlocks.

5. **GenerateRewardReport()**
   - Trigger: Cloud Scheduler cron job (daily/weekly).
   - Purpose: Stream ledger summaries to Google Sheets and compile PDFs into Google Drive.

6. **SyncRewardLedger()**
   - Trigger: Eventarc Firestore trigger.
   - Purpose: Synchronize transactions securely with client IndexedDB caches.
