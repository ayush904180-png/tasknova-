# Future Cloud Functions Architecture

Proposed serverless triggers for handling high-frequency ledger processing and validation.

## 1. `processCampaignCostEstimation`
- **Trigger**: Pub/Sub on draft updates.
- **Function**: Re-calculates and caches platform fees in Firestore.

## 2. `runDatasetQualityValidation`
- **Trigger**: Cloud Storage bucket uploads.
- **Function**: Extracts headers, runs corrupt-pixel audits, and updates `dataset_validation` state in Firestore.

## 3. `syncCampaignLedgerToSheets`
- **Trigger**: Campaign status updates.
- **Function**: Streams ledger transaction rows directly to Google Sheets using service account keys.
