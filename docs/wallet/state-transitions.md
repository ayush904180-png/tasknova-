# Wallet State Transitions & Suspensions

Our wallet architecture is governed by a state machine that handles compliance levels, security flags, and administrative holds.

## 1. Supported Operational States

A wallet can transition through the following states defined in `WalletStatus`:

- **Active**: Fully functional state. All available balances are withdrawable. New credits can be deposited instantly.
- **Frozen**: Restricts all outbound transactions. Available balances are swept to frozen vaults.
- **Suspended**: Full operational block. Deposition and withdrawal of coins are blocked.
- **Pending Verification**: Initial status during KYC audits or tier upgrades.
- **Under Review**: Triggered by fraud flag detection or unusual velocity parameters.
- **Closed**: Terminated account status. Immutable ledger logs remain archived indefinitely for compliance.

## 2. Transition Rules

```
       ┌─────────────────┐
       │   Pending KYC   │
       └────────┬────────┘
                │ (Verify KYC)
                ▼
       ┌─────────────────┐
 ┌────►│     Active      │◄────┐
 │     └────────┬────────┘     │
 │              │              │
 │ (Reactivate) │ (Freeze)     │ (Activate)
 │              ▼              │
 │     ┌─────────────────┐     │
 └─────┤     Frozen      ├─────┘
       └────────┬────────┘
                │ (Suspend)
                ▼
       ┌─────────────────┐
       │    Suspended    │
       └─────────────────┘
```

- **Wallet Freezing**: All Available balances are immediately moved into a `frozenBalance` container, setting `withdrawableBalance` to 0. A semantic reason string and freeze timestamp are added to metadata.
- **Wallet Reactivation**: Recomputes historical double-entry logs. Restores `frozenBalance` into the available pool.
