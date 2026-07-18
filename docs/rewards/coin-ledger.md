# Immutable Coin Ledger

The Coin Ledger is designed as a secure, sequential append-only ledger that tracks historical movements of reward coins.

## Transaction Classifications
- **Credit**: Approved task submissions.
- **Debit**: Disbursals, holdings clearance.
- **Adjustment**: Administrative manual overrides.
- **Bonus**: Streak achievements, level-up packages.
- **Penalty**: Verified quality regressions or compliance breaches.
- **Correction**: Reconciliation adjustments.

## Integrity Signature Check
Every transaction records a cryptographic signature hash:
```
signature = Hash(TransactionID + UserID + Amount + TransactionType + Timestamp)
```
The auditing controller checks the signature of each transaction on startup. If any record's value has been altered without regenerating the signature (tampering attempt), the system highlights the infraction immediately and blocks payouts.
