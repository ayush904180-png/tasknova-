# Wallet & Financial Ledger System Overview

Welcome to the TaskNova AI Master Wallet & Financial Ledger System documentation. This module serves as the single financial source of truth for the entire platform, powering all contributor reward settlements, withdrawal processing, and real-time ledger auditing.

## 1. Core Visual Design Systems

Our UI employs a custom, high-contrast dark visual design built on the **Cosmic Slate** layout framework:
- **Balance Cards (Primary Focus)**: A prominent, eye-safe, high-contrast balance grid showing available withdrawable balances, pending validation holds, and lifetime aggregates.
- **Conversion Calculations**: Real-time currency conversion showing Coin equivalence in Indian Rupees (INR), USD, and EUR.
- **Micro-Animations**: Uses `motion/react` animations for card loading, list expansions, and state switches to provide tactile user feedback.

## 2. Key Interactive Workflows

The module supports several high-fidelity user workflows designed for enterprise scale:
1. **Coin Disbursement & Withdrawal Loop**: Users submit withdrawal requests using their VPA/UPI address. The system validates holdings and posts a Debit entry to the Ledger.
2. **Cryptographic Integrity Auditing**: Users can trigger real-time ledger audits which traverse the entire transaction chain block-by-block, re-computing hash signatures on the fly.
3. **Workspace Exports**: Simulates corporate integration loops with Google Sheets for tabular ledger logs and Google Drive for statement archival.
4. **Interactive Sandbox Controls**: Enables administrators to simulate database tampering to test anti-fraud detection, inject manual bonuses, or suspend/unlock wallets.
