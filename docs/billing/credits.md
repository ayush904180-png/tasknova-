# Credit System and Ledgering

The platform implements a Credit System designed to offset recurring renewal invoices automatically.

## Credit Categories
1. **Platform Credits**: Base credits distributed for platform interactions.
2. **Promotional Credits**: Expiring vouchers issued to stimulate contributor/creator engagement.
3. **Bonus Credits**: Loyalty additions granted on renewal anniversaries.
4. **Purchased Credits**: Top-up bundles acquired via card/UPI gateways.
5. **Refund Credits**: Issued in lieu of direct gateway reversals to keep funds in the ecosystem.

## Double-Entry Ledger Principles
All credit updates write a non-editable record into the Ledger:
- **Type**: `credit` (increases balance) or `debit` (reduces balance).
- **Reason**: Concise explanation for the ledger log.
- **Timestamp & Expiration**: Clear tracking to prevent expired promo credit use.
- **Audit Trails**: Non-modifiable, preventing administrative credit tampering.
