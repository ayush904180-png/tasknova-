# Communication Architecture

This module follows a clean separation of concerns:

- `types/`: Strict type interfaces for channels, campaigns, templates, and automation rules.
- `constants/`: Base mock configurations for alerts, support representatives, and templates.
- `adapters/`: Stubs for Pub/Sub topic streaming, Firestore syncing, Google Sheets metrics Logging, and Drive backups.
- `context/`: Unified React Context orchestration, incorporating websocket heartbeats, typing simulations, and offline buffer queues.
- `components/`: UI segments styled to meet the design language of Stripe, Linear, and Slack.
- `pages/`: Console viewport with live role switches (RBAC).
