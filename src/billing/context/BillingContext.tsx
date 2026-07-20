/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  Subscription,
  Invoice,
  CreditState,
  Budget,
  UsageMetric,
  FinancialAnalytics,
  BillingRole,
  PlanTier,
  BillingCycle,
  CreditType,
  PaymentMethod,
  PaymentMethodType
} from '../types';
import { BillingService } from '../services/BillingService';
import { globalBillingRepository } from '../repositories/BillingRepository';
import { globalBillingCache } from '../cache/BillingCache';

interface BillingContextProps {
  subscription: Subscription;
  invoices: Invoice[];
  creditState: CreditState;
  budget: Budget;
  usageMetrics: UsageMetric;
  analytics: FinancialAnalytics;
  role: BillingRole;
  paymentMethods: PaymentMethod[];
  changePlan: (tier: PlanTier, cycle: BillingCycle) => void;
  toggleAutoRenew: () => void;
  payInvoice: (invoiceId: string, method: PaymentMethodType) => void;
  applyCreditsToInvoice: (invoiceId: string, amount: number) => void;
  addCredits: (amount: number, type: CreditType, reason: string) => void;
  updateBudget: (updates: Partial<Budget>) => void;
  addPaymentMethod: (type: PaymentMethodType, details: any) => void;
  deletePaymentMethod: (id: string) => void;
  setDefaultPaymentMethod: (id: string) => void;
  simulateUsage: (increment: Partial<UsageMetric>) => void;
  setRole: (role: BillingRole) => void;
}

const BillingContext = createContext<BillingContextProps | undefined>(undefined);

export function BillingProvider({ children }: { children: ReactNode }) {
  const billingService = BillingService.getInstance();

  const [subscription, setSubscription] = useState<Subscription>(() => globalBillingRepository.getSubscription());
  const [invoices, setInvoices] = useState<Invoice[]>(() => globalBillingRepository.getInvoices());
  const [creditState, setCreditState] = useState<CreditState>(() => globalBillingRepository.getCreditState());
  const [budget, setBudget] = useState<Budget>(() => globalBillingRepository.getBudget());
  const [usageMetrics, setUsageMetrics] = useState<UsageMetric>(() => globalBillingRepository.getUsageMetrics());
  const [analytics, setAnalytics] = useState<FinancialAnalytics>(() => globalBillingRepository.getFinancialAnalytics());
  const [role, setRoleState] = useState<BillingRole>(() => billingService.getRole());
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>(() => globalBillingRepository.getPaymentMethods());

  // Background Sync retry queue check on startup
  useEffect(() => {
    const queue = globalBillingCache.getRetryQueue();
    if (queue.length > 0) {
      console.log('[BillingProvider] Synchronizing offline queue: ', queue.length, 'pending transactions.');
      // Process offline retries
      queue.forEach((tx: any) => {
        try {
          if (tx.type === 'pay_invoice') {
            billingService.payInvoice(tx.invoiceId, tx.paymentMethodType);
          }
        } catch (e) {
          console.error('[BillingProvider] Failed offline sync retry:', e);
        }
      });
      globalBillingCache.clearRetryQueue();
      // Reload states
      reloadAllStates();
    }
  }, []);

  const reloadAllStates = () => {
    setSubscription(globalBillingRepository.getSubscription());
    setInvoices(globalBillingRepository.getInvoices());
    setCreditState(globalBillingRepository.getCreditState());
    setBudget(globalBillingRepository.getBudget());
    setUsageMetrics(globalBillingRepository.getUsageMetrics());
    setAnalytics(globalBillingRepository.getFinancialAnalytics());
    setPaymentMethods(globalBillingRepository.getPaymentMethods());
  };

  const changePlan = (tier: PlanTier, cycle: BillingCycle) => {
    try {
      billingService.changeSubscription(tier, cycle);
      reloadAllStates();
    } catch (e: any) {
      alert(e.message || 'Failed to update subscription.');
    }
  };

  const toggleAutoRenew = () => {
    billingService.toggleAutoRenew();
    reloadAllStates();
  };

  const payInvoice = (invoiceId: string, method: PaymentMethodType) => {
    try {
      if (!navigator.onLine) {
        // Queue offline transaction
        globalBillingCache.addToRetryQueue({ type: 'pay_invoice', invoiceId, paymentMethodType: method });
        // Optimistic update
        const updated = invoices.map(inv => inv.id === invoiceId ? { ...inv, status: 'Paid' as any } : inv);
        setInvoices(updated);
        alert('Offline Mode: Payment queued. Will sync automatically once reconnected.');
        return;
      }

      billingService.payInvoice(invoiceId, method);
      reloadAllStates();
    } catch (e: any) {
      alert(e.message || 'Payment failed.');
    }
  };

  const applyCreditsToInvoice = (invoiceId: string, amount: number) => {
    try {
      billingService.applyCreditsToInvoice(invoiceId, amount);
      reloadAllStates();
    } catch (e: any) {
      alert(e.message || 'Failed to apply credits.');
    }
  };

  const addCredits = (amount: number, type: CreditType, reason: string) => {
    try {
      billingService.addCredits(amount, type, reason);
      reloadAllStates();
    } catch (e: any) {
      alert(e.message || 'Failed to add credits.');
    }
  };

  const updateBudget = (updates: Partial<Budget>) => {
    try {
      billingService.updateBudget(updates);
      reloadAllStates();
    } catch (e: any) {
      alert(e.message || 'Failed to update budget.');
    }
  };

  const addPaymentMethod = (type: PaymentMethodType, details: any) => {
    billingService.addPaymentMethod(type, details);
    reloadAllStates();
  };

  const deletePaymentMethod = (id: string) => {
    billingService.deletePaymentMethod(id);
    reloadAllStates();
  };

  const setDefaultPaymentMethod = (id: string) => {
    billingService.setDefaultPaymentMethod(id);
    reloadAllStates();
  };

  const simulateUsage = (increment: Partial<UsageMetric>) => {
    billingService.recordUsage(increment);
    reloadAllStates();
  };

  const setRole = (newRole: BillingRole) => {
    billingService.setRole(newRole);
    setRoleState(newRole);
  };

  return (
    <BillingContext.Provider
      value={{
        subscription,
        invoices,
        creditState,
        budget,
        usageMetrics,
        analytics,
        role,
        paymentMethods,
        changePlan,
        toggleAutoRenew,
        payInvoice,
        applyCreditsToInvoice,
        addCredits,
        updateBudget,
        addPaymentMethod,
        deletePaymentMethod,
        setDefaultPaymentMethod,
        simulateUsage,
        setRole
      }}
    >
      {children}
    </BillingContext.Provider>
  );
}

export function useBilling() {
  const context = useContext(BillingContext);
  if (!context) {
    throw new Error('useBilling must be used within a BillingProvider');
  }
  return context;
}
