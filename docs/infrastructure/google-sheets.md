# Google Sheets Workspace Integration Architecture

To optimize operating expenses and increase immediate financial clarity for executive, compliance, and auditing teams, TaskNova AI integrates with the Google Sheets API. 

> [!NOTE]
> Google Sheets is **never** utilized as a main application database. It serves solely as an analytical reporting sink, manual QA audit playground, and visual dashboard feeding mechanism.

## Integrated Reporting Sinks

1. **Daily Activity Report Sheet**:
   * **Trigger**: CRON scheduler daily at 23:55 UTC.
   * **Data Exposes**: Active user count, completed micro-tasks count, categories split (RLHF vs Tagging), and gross system coin velocity.
2. **Revenue Ledger Export**:
   * **Trigger**: On-demand or weekly on Sundays.
   * **Data Exposes**: Deposits, corporate campaign billing logs, credit-card settlements, and gross recurring margins.
3. **Payout Reports & Processing**:
   * **Trigger**: Monthly payout cycles.
   * **Data Exposes**: Ledger debits, contributor coin cashouts, routing parameters, and compliance processing states.
4. **Manual QA Review Queue**:
   * **Trigger**: Real-time webhook when a contributor disputes a rejected task.
   * **Data Exposes**: Contributor payload, original instructions, reviewer feedback, and override actions.

## Authentication & Transport Flow

All integrations with Google Sheets utilize the **Google Workspace OAuth client credentials** provisioned through the platform's `set_up_oauth` mechanism or restricted service account keys.
* **Scope**: `https://www.googleapis.com/auth/spreadsheets`
* **Transport**: API requests are executed exclusively on the server-side proxy route (`/api/workspace/sheets`) to protect sensitive system keys and OAuth tokens from the client browser.
