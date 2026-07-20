# Future Cloud Functions Migration Specification

To automate monthly invoice generation, credit expiration checks, and third-party payment gateway callbacks, several Google Cloud Functions are specified.

## Scheduled Cron Triggers (Pub/Sub)

### 1. `cron-generate-monthly-invoices`
- **Trigger**: `0 0 1 * *` (First day of every month)
- **Action**: Queries all active subscriptions in Firestore whose `endDate` is approaching, calculates pro-rata renewal prices, applies available credit offsets, and writes a pending invoice.

### 2. `cron-expire-credits`
- **Trigger**: `0 0 * * *` (Daily)
- **Action**: Queries the `credits` ledgers for entries where `expirationDate` <= current date, debits the balance, and registers an `expired_credits` transaction log.

## HTTPS Webhook Handlers (Integration Triggers)

### 3. `webhook-stripe-callback`
- **Trigger**: HTTPS POST from Stripe Gateway
- **Action**: Authenticates Stripe webhook signature, parses `invoice.payment_succeeded` payload, extracts internal invoice IDs, and resolves the invoice status to `Paid` inside Firestore while emitting `InvoicePaid` on the PubSub topic.

### 4. `webhook-razorpay-callback`
- **Trigger**: HTTPS POST from Razorpay Gateway
- **Action**: Implements Razorpay HMAC signature checks and updates corresponding invoice ledger states.
