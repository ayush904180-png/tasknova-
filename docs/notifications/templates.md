# Templates Management

TaskNova supports standardized HTML emails and device push notification copy.

## Injected Variables

The engine parses the following placeholders:

- `{{name}}`: Recipient name
- `{{workspaceId}}`: B2B billing node
- `{{ip}}` & `{{device}}`: Incident parameters
- `{{amount}}` & `{{taskId}}`: Contributor bounty payouts

## Preview Sandbox

The sandbox features real-time iframe generation (for HTML) or a device notification preview (for mobile push payloads).
