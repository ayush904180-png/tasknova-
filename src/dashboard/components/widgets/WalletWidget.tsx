/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import { WidgetShell } from './WidgetShell';
import { WidgetContextProps } from '../../types/widgets';
import { useInfrastructure } from '../../../infrastructure/providers/InfrastructureProvider';
import { useAuth } from '../../../auth/providers/AuthProvider';
import { FirestoreWallet } from '../../../infrastructure/firebase/types';
import { Coins, HelpCircle, Shield, ArrowUpRight } from 'lucide-react';

export const WalletWidget: React.FC<WidgetContextProps> = ({ size, isOffline, isRealtime }) => {
  const { wallets } = useInfrastructure();
  const { user } = useAuth();
  const [wallet, setWallet] = useState<FirestoreWallet | null>(null);

  useEffect(() => {
    let active = true;
    const fetchWallet = async () => {
      try {
        const userId = user?.uid || 'guest-calib-1';
        const data = await wallets.getWalletByOwner(userId);
        if (data && active) {
          setWallet(data);
        } else if (active) {
          setWallet({
            id: `wallet-${userId}`,
            ownerId: userId,
            balanceCoins: 4320,
            pendingCoins: 1250,
            currency: 'COIN',
            status: 'active',
            updatedAt: new Date().toISOString(),
          });
        }
      } catch (err) {
        console.error('Error fetching wallet:', err);
      }
    };

    fetchWallet();
    return () => { active = false; };
  }, [wallets, user]);

  return (
    <WidgetShell
      id="wallet-widget"
      title="Nova Holding Ledger"
      subtitle="Spendable and locked validation rewards"
      size={size}
      expectedRepository="WalletRepository"
      expectedModel="FirestoreWallet"
      expectedFields={['id', 'ownerId', 'balanceCoins', 'pendingCoins', 'currency', 'status']}
      futureConnectionPoint="const w = await useInfrastructure().wallets.getWalletByOwner(userId);"
      loadingStateSim="Subscribing to wallet balance snapshot..."
      emptyStateSim="Wallet ledger is uninitialized."
      errorStateSim="Access to financial record blocked by security rules."
    >
      {wallet && (
        <div className="space-y-4 mt-2">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400 dark:text-zinc-500">Spendable Balance</span>
              <div className="flex items-baseline gap-1.5 mt-0.5">
                <Coins className="h-4 w-4 text-amber-500" />
                <span className="font-display font-bold text-2xl text-slate-900 dark:text-white">
                  {wallet.balanceCoins.toLocaleString()}
                </span>
                <span className="text-[10px] font-mono text-indigo-500 dark:text-indigo-400 font-bold uppercase">
                  {wallet.currency}
                </span>
              </div>
            </div>

            <div className="h-8 w-8 rounded-full bg-slate-50 dark:bg-white/5 flex items-center justify-center border border-slate-100 dark:border-white/5">
              <Shield className="h-4 w-4 text-emerald-500" title="Active & Insured" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 dark:border-white/5 text-[10px]">
            <div>
              <span className="text-slate-400 block font-light">Escrow / Pending</span>
              <span className="font-mono font-medium text-slate-700 dark:text-zinc-300">
                {wallet.pendingCoins.toLocaleString()} COIN
              </span>
            </div>
            <div>
              <span className="text-slate-400 block font-light">Valuation rate</span>
              <span className="font-mono font-medium text-slate-700 dark:text-zinc-300">
                1000 COIN ≈ $10.00
              </span>
            </div>
          </div>
        </div>
      )}
    </WidgetShell>
  );
};
