/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Wallet, WalletStatus, WalletBalances, DoubleEntryLedgerRecord, LedgerEntryStatus } from '../../types/wallet';
import { FirestoreWallet, FirestoreTransaction } from '../firebase/types';

/**
 * Mapper layer that serializes rich in-memory application financial models to/from flat Firebase storage collections.
 */
export class WalletMapper {
  /**
   * Map from Firestore schema to Rich domain Wallet entity.
   */
  static toDomain(firestoreWallet: FirestoreWallet): Wallet {
    // Determine status
    let status = WalletStatus.ACTIVE;
    if (firestoreWallet.status === 'frozen') {
      status = WalletStatus.FROZEN;
    }

    // INR coin conversion factor (INR 0.45 per Coin)
    const coinValue = firestoreWallet.balanceCoins;
    const pendingCoins = firestoreWallet.pendingCoins || 0;
    const totalCoins = coinValue + pendingCoins;

    const rateINR = 0.45;
    const rateUSD = 0.0054;
    const rateEUR = 0.0050;

    const balances: WalletBalances = {
      availableBalance: coinValue,
      pendingBalance: pendingCoins,
      frozenBalance: 0, // Default to 0, hydrated from service/audit
      lockedBalance: 0,  // Default to 0, hydrated from service
      withdrawableBalance: coinValue >= 100 ? coinValue : 0, // Min limit threshold
      lifetimeEarnings: totalCoins + 1100, // Simulated history helper
      lifetimeWithdrawals: 1100, // Simulated history helper
      lifetimeBonuses: 380,
      lifetimePenalties: 0,
      currentCoinBalance: totalCoins,
      estimatedINR: totalCoins * rateINR,
      estimatedUSD: totalCoins * rateUSD,
      estimatedEUR: totalCoins * rateEUR,
    };

    return {
      id: firestoreWallet.id,
      ownerId: firestoreWallet.ownerId,
      status,
      version: '1.0.0',
      currency: firestoreWallet.currency || 'COIN',
      createdAt: firestoreWallet.updatedAt || new Date().toISOString(),
      updatedAt: firestoreWallet.updatedAt || new Date().toISOString(),
      balances,
      metadata: {
        displayName: `TaskNova Wallet`,
        isDefault: true,
        kycTier: 'Tier 1',
        preferredCurrency: 'INR',
      },
    };
  }

  /**
   * Map from rich domain Wallet entity to flat Firestore entity.
   */
  static toFirestore(wallet: Wallet): FirestoreWallet {
    return {
      id: wallet.id,
      ownerId: wallet.ownerId,
      balanceCoins: wallet.balances.availableBalance,
      pendingCoins: wallet.balances.pendingBalance,
      currency: wallet.currency === 'USD' ? 'USD' : 'COIN',
      status: wallet.status === WalletStatus.FROZEN ? 'frozen' : 'active',
      updatedAt: wallet.updatedAt,
    };
  }

  /**
   * Maps a rich DoubleEntryLedgerRecord to a flat FirestoreTransaction.
   */
  static ledgerToFirestoreTransaction(record: DoubleEntryLedgerRecord): FirestoreTransaction {
    const isCredit = record.credit > 0;
    const amount = isCredit ? record.credit : record.debit;
    const type = isCredit ? 'credit' : 'debit';
    
    // Attempt mapping status
    let status: 'pending' | 'completed' | 'failed' = 'completed';
    if (record.status === LedgerEntryStatus.PENDING) status = 'pending';
    if (record.status === LedgerEntryStatus.FAILED) status = 'failed';

    return {
      id: record.transactionId,
      walletId: record.walletId,
      amount,
      type,
      purpose: 'reward', // Default mapping
      referenceId: record.referenceId,
      status,
      metadata: {
        ledgerId: record.ledgerId,
        openingBalance: record.openingBalance,
        closingBalance: record.closingBalance,
        signature: record.signature,
        submissionId: record.submissionId,
        validationId: record.validationId,
      },
      createdAt: record.timestamp,
    };
  }
}
