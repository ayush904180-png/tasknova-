/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { CoinLedgerEntry, RewardRule } from '../../types/rewards';

/**
 * Cache policy wrapper for optimizing memory and repository lookups.
 */
export class RewardCache {
  private cacheStore = new Map<string, { data: any; expiry: number }>();
  private defaultTtlMs = 60000; // 1 minute default

  public set(key: string, data: any, ttlMs = this.defaultTtlMs): void {
    this.cacheStore.set(key, {
      data,
      expiry: Date.now() + ttlMs
    });
  }

  public get<T>(key: string): T | null {
    const item = this.cacheStore.get(key);
    if (!item) return null;
    if (Date.now() > item.expiry) {
      this.cacheStore.delete(key);
      return null;
    }
    return item.data as T;
  }

  public invalidate(key: string): void {
    this.cacheStore.delete(key);
  }

  public clear(): void {
    this.cacheStore.clear();
  }
}

/**
 * Interface contract for Reward Coin Ledger operations.
 */
export interface IRewardRepository {
  saveTransaction(entry: CoinLedgerEntry): Promise<void>;
  getTransactionsByUserId(userId: string): Promise<CoinLedgerEntry[]>;
  getTransactionById(id: string): Promise<CoinLedgerEntry | null>;
  getAllTransactions(): Promise<CoinLedgerEntry[]>;
}

/**
 * Interface contract for Reward Rules configurations.
 */
export interface IRewardRuleRepository {
  getRuleById(id: string): Promise<RewardRule | null>;
  getAllRules(): Promise<RewardRule[]>;
  saveRule(rule: RewardRule): Promise<void>;
  deleteRule(id: string): Promise<void>;
}

/**
 * Concrete implementation of the Reward Repository using localStorage & memory buffer.
 */
export class RewardRepository implements IRewardRepository {
  private cache: RewardCache;
  private ledgerStorageKey = 'tasknova_reward_ledger';

  constructor(cache: RewardCache) {
    this.cache = cache;
  }

  private loadFromStorage(): CoinLedgerEntry[] {
    try {
      const serialized = localStorage.getItem(this.ledgerStorageKey);
      return serialized ? JSON.parse(serialized) : [];
    } catch (e) {
      console.error('Failed to parse rewards ledger from storage', e);
      return [];
    }
  }

  private saveToStorage(entries: CoinLedgerEntry[]) {
    try {
      localStorage.setItem(this.ledgerStorageKey, JSON.stringify(entries));
    } catch (e) {
      console.error('Failed to commit reward ledger to localStorage', e);
    }
  }

  public async saveTransaction(entry: CoinLedgerEntry): Promise<void> {
    const entries = this.loadFromStorage();
    // Prepend or update
    const index = entries.findIndex(e => e.id === entry.id);
    if (index >= 0) {
      entries[index] = entry;
    } else {
      entries.unshift(entry);
    }
    this.saveToStorage(entries);
    this.cache.invalidate('all_transactions');
    this.cache.invalidate(`user_tx_${entry.userId}`);
  }

  public async getTransactionsByUserId(userId: string): Promise<CoinLedgerEntry[]> {
    const cacheKey = `user_tx_${userId}`;
    const cached = this.cache.get<CoinLedgerEntry[]>(cacheKey);
    if (cached) return cached;

    const all = this.loadFromStorage();
    const userSpecific = all.filter(e => e.userId === userId);
    this.cache.set(cacheKey, userSpecific);
    return userSpecific;
  }

  public async getTransactionById(id: string): Promise<CoinLedgerEntry | null> {
    const all = this.loadFromStorage();
    return all.find(e => e.id === id) || null;
  }

  public async getAllTransactions(): Promise<CoinLedgerEntry[]> {
    const cacheKey = 'all_transactions';
    const cached = this.cache.get<CoinLedgerEntry[]>(cacheKey);
    if (cached) return cached;

    const all = this.loadFromStorage();
    this.cache.set(cacheKey, all);
    return all;
  }
}

/**
 * Concrete implementation of Reward Rules Repository.
 */
export class RewardRuleRepository implements IRewardRuleRepository {
  private cache: RewardCache;
  private rulesStorageKey = 'tasknova_reward_rules';

  constructor(cache: RewardCache) {
    this.cache = cache;
  }

  private loadFromStorage(): RewardRule[] {
    try {
      const serialized = localStorage.getItem(this.rulesStorageKey);
      return serialized ? JSON.parse(serialized) : [];
    } catch (e) {
      console.error('Failed to parse rules from storage', e);
      return [];
    }
  }

  private saveToStorage(rules: RewardRule[]) {
    try {
      localStorage.setItem(this.rulesStorageKey, JSON.stringify(rules));
    } catch (e) {
      console.error('Failed to save rules to storage', e);
    }
  }

  public async getRuleById(id: string): Promise<RewardRule | null> {
    const rules = this.loadFromStorage();
    return rules.find(r => r.id === id) || null;
  }

  public async getAllRules(): Promise<RewardRule[]> {
    const cacheKey = 'all_reward_rules';
    const cached = this.cache.get<RewardRule[]>(cacheKey);
    if (cached) return cached;

    const rules = this.loadFromStorage();
    if (rules.length === 0) {
      return []; // Return empty, allowing rules engine to supply defaults
    }

    this.cache.set(cacheKey, rules);
    return rules;
  }

  public async saveRule(rule: RewardRule): Promise<void> {
    const rules = this.loadFromStorage();
    const index = rules.findIndex(r => r.id === rule.id);
    if (index >= 0) {
      rules[index] = rule;
    } else {
      rules.push(rule);
    }
    this.saveToStorage(rules);
    this.cache.clear(); // invalidate all rule caches
  }

  public async deleteRule(id: string): Promise<void> {
    let rules = this.loadFromStorage();
    rules = rules.filter(r => r.id !== id);
    this.saveToStorage(rules);
    this.cache.clear();
  }
}

// Global Singletons configuration for simplified architecture access
const globalCache = new RewardCache();
export const GlobalRewardRepository = new RewardRepository(globalCache);
export const GlobalRewardRuleRepository = new RewardRuleRepository(globalCache);
