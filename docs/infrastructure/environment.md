# Environment Gating and Workspace Configuration

This document specifies the naming conventions, storage rules, and validation paradigms for TaskNova AI configurations.

## Workspace Environment Variables

We keep all API keys, client identifiers, and workspace target IDs inside `.env` configurations.

### Configuration Properties

* **`VITE_FIREBASE_API_KEY`**: Client browser credential allowing safe read/write matching Firestore security rules.
* **`VITE_FIREBASE_AUTH_DOMAIN`**: Auth domain setup for Google login popups.
* **`VITE_FIREBASE_PROJECT_ID`**: Identifies target Google Cloud resources.
* **`VITE_FIREBASE_STORAGE_BUCKET`**: Firebase Storage target location.
* **`VITE_FIREBASE_APP_ID`**: Registers client telemetry.
* **`VITE_GOOGLE_SHEET_ID`**: Sheet ID pointing to reporting spread formats.
* **`VITE_GOOGLE_DRIVE_FOLDER_ID`**: Drive Folder ID housing archives and folder structures.

## Safety & Non-Exposure Mandates

1. **VITE_ Prefixes**: Only variables prefixed with `VITE_` are compiled into browser client bundles.
2. **Server Secrets Isolation**: Secret API keys (such as `GEMINI_API_KEY`, Stripe Secrets, or Service Account Keys) must **never** be prefixed with `VITE_`.
3. **Local Exclude**: `.env` is declared in the `.gitignore` block to block accidental public commits.
4. **Bootstrapping Fallback**: The codebase includes the `getEnvConfig()` utility to gracefully detect missing configurations and fallback to sandboxed memory operations instead of throwing fatal exceptions during app load!
