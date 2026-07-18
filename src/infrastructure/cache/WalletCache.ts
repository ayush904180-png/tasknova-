/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { LocalCache, CacheOptions } from './LocalCache';
import { Wallet, DoubleEntryLedgerRecord } from '../../types/wallet';

/**
 * Cache module specializing in high-speed, secure financial ledger storage and retrievals.
 * Utilizes TTL (Time-To-Live) evictions and persistent local states to support Offline-Ready work.
 */
export class WalletCache {
  private static WALLET_CACHE_PREFIX = 'fn_wallet_';
  private static LEDGER_CACHE_PREFIX = 'fn_ledger_';

  /**
   * Caches a Wallet entity in memory and optionally persists to local storage for offline use.
   */
  static cacheWallet(wallet: Wallet, options?: CacheOptions): void {
    const key = `${this.WALLET_CACHE_PREFIX}${wallet.ownerId}`;
    LocalCache.set<Wallet>(key, wallet, {
      ttlMs: options?.ttlMs ?? 60 * 1000, // Default 1 minute for volatile financial data
      persistent: options?.persistent ?? true,
    });
  }

  /**
   * Retrieves a cached Wallet by the owner's user ID.
   */
  static getCachedWallet(ownerId: string): Wallet | null {
    const key = `${this.WALLET_CACHE_PREFIX}${ownerId}`;
    return LocalCache.get<Wallet>(key);
  }

  /**
   * Evicts a Wallet from cache (useful when balances change and we need fresh DB queries).
   */
  static evictWallet(ownerId: string): void {
    const key = `${this.WALLET_CACHE_PREFIX}${ownerId}`;
    LocalCache.evict(key);
  }

  /**
   * Caches a series of immutable ledger records.
   */
  static cacheLedgerRecords(walletId: string, records: DoubleEntryLedgerRecord[]): void {
    const key = `${this.LEDGER_CACHE_PREFIX}${walletId}`;
    LocalCache.set<DoubleEntryLedgerRecord[]>(key, records, {
      ttlMs: 3 * 60 * 1000, // 3 minutes TTL
      persistent: true,
    });
  }

  /**
   * Retrieves cached ledger records for a wallet.
   */
  static getCachedLedgerRecords(walletId: string): DoubleEntryLedgerRecord[] | null {
    const key = `${this.LEDGER_CACHE_PREFIX}${walletId}`;
    return LocalCache.get<DoubleEntryLedgerRecord[]>(key);
  }

  /**
   * Invalidates ledger record cache for a specific wallet.
   */
  static evictLedger(walletId: string): void {
    const key = `${this.LEDGER_CACHE_PREFIX}${walletId}`;
    LocalCache.evict(key);
  }
}
