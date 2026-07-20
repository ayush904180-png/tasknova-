# Repository-Driven Storage Layer

TaskNova AI relies on a modular Repository design pattern to decouple actual storage engines from application services.

## Interfaces
The core interface `IBillingRepository` defines the following methods:
- `getSubscription()` / `saveSubscription()`
- `getInvoices()` / `saveInvoice()`
- `getCreditState()` / `saveCreditState()`
- `getBudget()` / `saveBudget()`
- `getPaymentMethods()` / `savePaymentMethods()`
- `getUsageMetrics()` / `saveUsageMetrics()`
- `getFinancialAnalytics()`

## Local Storage & Offline Cache
During MVP or local environments, `LocalBillingRepository` utilizes `localStorage` for high-fidelity offline survival. Updates are mirrored asynchronously to the cloud storage simulator.
This architecture makes it trivial to replace the local mock storage with real Firestore or SQL repositories.
