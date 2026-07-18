# Architectural Specifications & Caching

Our backend architecture implements clean, decoupled, SOLID domain designs prepared for production Cloud Run/Firestore scalability.

## 1. Directory Structure

```
src/
├── types/
│   └── wallet.ts                       # Core entities, states, and telemetry typings
└── infrastructure/
    ├── repositories/
    │   ├── WalletRepository.ts         # Handles wallet database operations
    │   └── LedgerRepository.ts         # Handles append-only ledger entries
    ├── cache/
    │   └── WalletCache.ts              # Local write-through cache engine
    ├── mappers/
    │   └── WalletMapper.ts             # Domain to Firestore entity mapping schema
    ├── validators/
    │   └── WalletValidator.ts          # Chain audit validator and hash sealer
    └── adapters/
        └── WalletAdapter.ts            # Drive/Sheets tabular formatting adapter
```

## 2. Local Multi-Tier Cache

`WalletCache` provides high-performance local write-through caching to shield database infrastructure from massive querying:
- **Write-Through**: When updating a wallet or appending a ledger block, the cache is instantly updated or evicted.
- **Offline Support**: If Firestore is temporarily disconnected, the cache acts as a fast fallback read target.

## 3. Serialization and Firestore Mapping

`WalletMapper` handles parsing complex types to flat schemas matching target Firestore schemas:
- Implements strict type mappings between JS domain models and native Firestore document models.
- Serializes dates and balances cleanly, keeping the domain logic separated from database schema formats.
