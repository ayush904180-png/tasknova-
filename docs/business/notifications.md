# Smart Notifications Engine

The Corporate Notification Center delivers real-time system alerts to multiple workspace roles.

## Notification Categories

- **CAMPAIGN_PUBLISHED**: Notifies project administrators that the campaign has completed AI pre-validation and is live.
- **CAMPAIGN_PAUSED**: Warns managers that a campaign has been paused (either manually or via auto-halt rule).
- **BUDGET_LOW**: Alerts finance operators when the coin balance falls below 15% of the initial allocation.
- **DATASET_ERROR**: Notifies analysts of schema mismatches or corrupted file payloads.
- **APPROVAL_REQUIRED**: Urgently alerts administrators when a campaign is queued in `Submitted` or `Pending Admin Review`.
- **CAMPAIGN_COMPLETED**: Notifies all roles of successful pipeline completion.
- **FRAUD_ALERT**: Triggers immediately if worker collusions or repetitive bot patterns are flagged.
- **INVOICE_READY**: Alerts finance that a deposit wire has settled and a PDF ledger is available.
- **EXPORT_FINISHED**: Notifies the exporting analyst that CSV/JSON datasets are archived and synced.
