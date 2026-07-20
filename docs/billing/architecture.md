# Billing Platform Architecture

The TaskNova AI Billing Platform adheres strictly to modular, decoupled, and testable design principles, separating views from repository data stores and gateways.

```
       +-----------------------------------+
       |     React UI components & Tabs     |
       +-----------------+-----------------+
                         |
                         v
       +-----------------+-----------------+
       |         BillingProvider           |
       +-----------------+-----------------+
                         |
                         v
       +-----------------+-----------------+
       |          BillingService           |
       +-----+-----------+-----------+-----+
             |           |           |
             v           v           v
    +--------+----+ +----+----+ +----+--------+
    | Validators  | | Cache   | | Event Bus  |
    +-------------+ +---------+ +------------+
                         |
                         v
       +-----------------+-----------------+
       |        BillingRepository          |
       +-----+-----------------------+-----+
             |                       |
             v                       v
    +--------+----+         +--------+-------+
    | Pluggable   |         | Google Cloud   |
    | Gateways    |         | Operations     |
    | (Stripe,    |         | (Firestore,    |
    |  UPI, etc)  |         |  BigQuery, etc)|
    +-------------+         +----------------+
```

## Architectural Decoupling
1. **Model separation (`types/`)**: Clear separation of database states and payload formats.
2. **Business logic (`services/`)**: Unified service engine orchestrating subscription adjustments, invoice totals, budget alerts, and credit ledger operations.
3. **Pluggable Adapters (`adapters/`)**: Concrete classes implementing generic `PaymentGatewayAdapter` or cloud operation contracts. Vendor-specific APIs are isolated.
4. **Offline Durability (`cache/`)**: TTL caches backed by Local Storage, coupled with offline action sync queues to retry failed transaction settlements when connectivity resumes.
