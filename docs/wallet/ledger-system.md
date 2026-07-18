# Immutable Double-Entry Ledger System

Our ledger system implements strict industrial double-entry bookkeeping coupled with cryptographic ledger-chain hashing.

## 1. Double-Entry Mathematical Foundations

Every ledger record must represent an atomic balance shift. The balance transition from block $N-1$ to block $N$ is governed strictly by:

$$\text{ClosingBalance}_{N} = \text{OpeningBalance}_{N} + \text{Credit}_{N} - \text{Debit}_{N}$$

Where:
- $\text{OpeningBalance}_{N} = \text{ClosingBalance}_{N-1}$ (for all blocks where $N > 1$)
- $\text{Credit} \ge 0$
- $\text{Debit} \ge 0$
- Either $\text{Credit} = 0$ or $\text{Debit} = 0$ (single-direction ledger posting)

## 2. Append-Only Rule Enforcements

To protect the financial ledger from database poisoning or retroactive edits:
- **Write-Once (No Updates)**: The database layer blocks updates to existing Ledger IDs. If an entry is saved with a pre-existing key, the write is aborted.
- **No Deletes**: The repository throws a hard exception on delete operations.
- **Reversal Ledger Postings**: To adjust errors, the system appends a compensatory `REFUND` or `REVERSAL` block rather than modifying history.

## 3. Cryptographic Anti-Tampering Chain

Every block $N$ contains a SHA-256 style signature seal generated from:

$$\text{Signature}_{N} = \text{Hash}\Big(\text{LedgerId} \parallel \text{Timestamp} \parallel \text{Debit} \parallel \text{Credit} \parallel \text{OpeningBalance} \parallel \text{ClosingBalance} \parallel \text{ReferenceId}\Big)$$

The audit engine re-calculates this signature block-by-block. If a malicious attacker edits a transaction value (e.g. changing credit from 250 to 9999), the audit engine instantly flags the signature mismatch, marking the database as corrupt.
