# Player Telemetry Specification
Version 1.0.0 | Performance & Behavioral Analytics

Client-side interaction metrics provide crucial insight into task complexity, UX bottlenecks, and system drop-offs.

## 1. Tracked Events
The Telemetry Tracker logs specific milestones:
* **`start`**: Triggered when a player session is initialized.
* **`complete`**: Triggered upon successful submission.
* **`cancel`**: Triggered if a contributor cancels their work or exits the workspace early.
* **`restore`**: Triggered when a user recovers their state from an auto-save draft.

## 2. Compile Report Analytics
The following high-level metrics are computed dynamically:
* **Completion Rate**: `(completions / initiated) * 100` (%)
* **Drop Rate**: `(cancellations / initiated) * 100` (%)
* **Offline Utilization Rate**: Percentage of sessions completed while offline.
* **Recovery Rate**: Percentage of sessions successfully restored from localStorage drafts.

These analytics are formatted and ready to be compiled into operational spreadsheets for administrative reviews.
