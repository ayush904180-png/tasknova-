/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Wallet, WalletStatus, WalletBalances } from '../../types/wallet';
import { MemoryDatabase } from './FirestoreRepository';
import { WalletCache } from '../cache/WalletCache';
import { WalletValidator } from '../validators/WalletValidator';

/**
 * Repository interface for Wallet data operations.
 */
export interface WalletRepositoryInterface {
  getById(walletId: string): Promise<Wallet | null>;
  getByOwner(ownerId: string): Promise<Wallet | null>;
  save(wallet: Wallet): Promise<void>;
  updateBalances(walletId: string, balances: WalletBalances): Promise<void>;
  updateStatus(walletId: string, status: WalletStatus): Promise<void>;
}

/**
 * Concrete implementation of the WalletRepository.
 * Manages cache-layer interception and mock Firestore data operations.
 */
export class WalletRepository implements WalletRepositoryInterface {
  private collectionName = 'wallets_v2';

  constructor() {
    MemoryDatabase.init();
  }

  /**
   * Retrieves a wallet by its ID, checking cache first.
   */
  async getById(walletId: string): Promise<Wallet | null> {
    // 1. Check all memory collections in simulated database
    const raw = MemoryDatabase.get(this.collectionName, walletId);
    if (!raw) return null;
    return raw as Wallet;
  }

  /**
   * Retrieves a wallet associated with a specific user owner. Checks cache first.
   */
  async getByOwner(ownerId: string): Promise<Wallet | null> {
    // 1. Intercept with Cache Layer
    const cached = WalletCache.getCachedWallet(ownerId);
    if (cached) {
      return cached;
    }

    // 2. Fallback to database query
    const list = MemoryDatabase.getCollection(this.collectionName);
    const wallets = Object.values(list) as Wallet[];
    const wallet = wallets.find(w => w.ownerId === ownerId) || null;

    // 3. Cache result for subsequent reads
    if (wallet) {
      WalletCache.cacheWallet(wallet);
      return wallet;
    }

    // 4. Lazy initialize a default wallet for the owner if not found
    return this.initializeDefaultWallet(ownerId);
  }

  /**
   * Commits a Wallet entity to the database and invalidates its cache.
   */
  async save(wallet: Wallet): Promise<void> {
    // Validate balances first
    const validation = WalletValidator.validateBalances(wallet);
    if (!validation.isValid) {
      throw new Error(`Wallet balance integrity check failed: ${validation.errors.join(', ')}`);
    }

    wallet.updatedAt = new Date().toISOString();
    
    // Save to simulated Firestore
    MemoryDatabase.set(this.collectionName, wallet.id, wallet);
    MemoryDatabase.persist();

    // Cache write-through
    WalletCache.cacheWallet(wallet);
  }

  /**
   * Directly updates a wallet's balances and invalidates cache.
   */
  async updateBalances(walletId: string, balances: WalletBalances): Promise<void> {
    const wallet = await this.getById(walletId);
    if (!wallet) throw new Error(`Wallet ${walletId} does not exist.`);

    const updatedWallet: Wallet = {
      ...wallet,
      balances,
      updatedAt: new Date().toISOString(),
    };

    await this.save(updatedWallet);
  }

  /**
   * Directly updates a wallet's status and invalidates cache.
   */
  async updateStatus(walletId: string, status: WalletStatus): Promise<void> {
    const wallet = await this.getById(walletId);
    if (!wallet) throw new Error(`Wallet ${walletId} does not exist.`);

    const transition = WalletValidator.validateStatusTransition(wallet.status, status);
    if (!transition.isValid) {
      throw new Error(`Invalid status transition: ${transition.errors.join(', ')}`);
    }

    const updatedWallet: Wallet = {
      ...wallet,
      status,
      updatedAt: new Date().toISOString(),
    };

    await this.save(updatedWallet);
  }

  /**
   * Creates and persists a clean default wallet for a new contributor.
   */
  private async initializeDefaultWallet(ownerId: string): Promise<Wallet> {
    const walletId = `wlt_${ownerId.substring(0, 5)}_${Math.random().toString(36).substr(2, 5)}`;
    
    // Default initial seed: 380 Available coins, lifetime earned: 1480 (matches UI legacy starting point)
    const initialCoins = 380;
    const rateINR = 0.45;
    const rateUSD = 0.0054;
    const rateEUR = 0.0050;

    const defaultBalances: WalletBalances = {
      availableBalance: initialCoins,
      pendingBalance: 120, // Seeds some pending coins to make UI rich
      frozenBalance: 0,
      lockedBalance: 0,
      withdrawableBalance: initialCoins,
      lifetimeEarnings: 1480,
      lifetimeWithdrawals: 980,
      lifetimeBonuses: 380,
      lifetimePenalties: 0,
      currentCoinBalance: initialCoins + 120,
      estimatedINR: (initialCoins + 120) * rateINR,
      estimatedUSD: (initialCoins + 120) * rateUSD,
      estimatedEUR: (initialCoins + 120) * rateEUR,
    };

    const defaultWallet: Wallet = {
      id: walletId,
      ownerId,
      status: WalletStatus.ACTIVE,
      version: '1.0.0',
      currency: 'COIN',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      balances: defaultBalances,
      metadata: {
        displayName: 'Primary Contributor Ledger Wallet',
        isDefault: true,
        kycTier: 'Tier 1',
        preferredCurrency: 'INR',
        linkedUpiId: 'ayush904180@okaxis', // Mock default UPI to make UI rich
      },
    };

    // Save to DB and cache
    MemoryDatabase.set(this.collectionName, walletId, defaultWallet);
    MemoryDatabase.persist();
    
    WalletCache.cacheWallet(defaultWallet);
    return defaultWallet;
  }
}
