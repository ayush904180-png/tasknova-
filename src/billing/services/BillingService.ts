/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  SubscriptionPlan,
  PlanTier,
  SupportLevel,
  Subscription,
  BillingCycle,
  Invoice,
  InvoiceStatus,
  PaymentMethodType,
  UsageMetric,
  CreditState,
  CreditType,
  CreditLedgerEntry,
  Budget,
  FinancialAnalytics,
  BillingRole,
  BillingEventType,
  PaymentMethod
} from '../types';
import { globalBillingRepository } from '../repositories/BillingRepository';
import { BillingValidator } from '../validators/BillingValidator';
import { BillingEventBus } from '../events/BillingEventBus';
import { globalPaymentRegistry } from '../adapters/PaymentGatewayAdapters';

/**
 * Registry of Standard Subscription Plans
 */
export const PLANS_REGISTRY: Record<PlanTier, SubscriptionPlan> = {
  [PlanTier.FREE]: {
    tier: PlanTier.FREE,
    priceMonthly: 0,
    priceYearly: 0,
    trialDays: 0,
    limits: { apiLimits: 1000, storageGb: 1, campaignLimits: 1, datasetLimits: 1, taskLimits: 50 },
    supportLevel: SupportLevel.BASIC,
    features: {
      hasAdvancedAnalytics: false,
      hasBulkTaskUpload: false,
      hasCustomValidators: false,
      hasTeamCollaboration: false,
      hasSsoSaml: false,
      hasAuditLogs: false
    }
  },
  [PlanTier.STARTER]: {
    tier: PlanTier.STARTER,
    priceMonthly: 29,
    priceYearly: 290,
    trialDays: 14,
    limits: { apiLimits: 10000, storageGb: 10, campaignLimits: 5, datasetLimits: 5, taskLimits: 1000 },
    supportLevel: SupportLevel.BASIC,
    features: {
      hasAdvancedAnalytics: true,
      hasBulkTaskUpload: false,
      hasCustomValidators: false,
      hasTeamCollaboration: false,
      hasSsoSaml: false,
      hasAuditLogs: false
    }
  },
  [PlanTier.GROWTH]: {
    tier: PlanTier.GROWTH,
    priceMonthly: 99,
    priceYearly: 990,
    trialDays: 14,
    limits: { apiLimits: 50000, storageGb: 50, campaignLimits: 15, datasetLimits: 15, taskLimits: 5000 },
    supportLevel: SupportLevel.STANDARD,
    features: {
      hasAdvancedAnalytics: true,
      hasBulkTaskUpload: true,
      hasCustomValidators: false,
      hasTeamCollaboration: true,
      hasSsoSaml: false,
      hasAuditLogs: false
    }
  },
  [PlanTier.BUSINESS]: {
    tier: PlanTier.BUSINESS,
    priceMonthly: 299,
    priceYearly: 2990,
    trialDays: 30,
    limits: { apiLimits: 250000, storageGb: 250, campaignLimits: 50, datasetLimits: 50, taskLimits: 25000 },
    supportLevel: SupportLevel.PRIORITY,
    features: {
      hasAdvancedAnalytics: true,
      hasBulkTaskUpload: true,
      hasCustomValidators: true,
      hasTeamCollaboration: true,
      hasSsoSaml: false,
      hasAuditLogs: true
    }
  },
  [PlanTier.ENTERPRISE]: {
    tier: PlanTier.ENTERPRISE,
    priceMonthly: 999,
    priceYearly: 9990,
    trialDays: 30,
    limits: { apiLimits: 1000000, storageGb: 1000, campaignLimits: 200, datasetLimits: 200, taskLimits: 100000 },
    supportLevel: SupportLevel.PRIORITY,
    features: {
      hasAdvancedAnalytics: true,
      hasBulkTaskUpload: true,
      hasCustomValidators: true,
      hasTeamCollaboration: true,
      hasSsoSaml: true,
      hasAuditLogs: true
    }
  },
  [PlanTier.CUSTOM]: {
    tier: PlanTier.CUSTOM,
    priceMonthly: 2500,
    priceYearly: 25000,
    trialDays: 30,
    limits: { apiLimits: 10000000, storageGb: 10000, campaignLimits: 1000, datasetLimits: 1000, taskLimits: 1000000 },
    supportLevel: SupportLevel.DEDICATED,
    features: {
      hasAdvancedAnalytics: true,
      hasBulkTaskUpload: true,
      hasCustomValidators: true,
      hasTeamCollaboration: true,
      hasSsoSaml: true,
      hasAuditLogs: true
    }
  }
};

export class BillingService {
  private static instance: BillingService;

  public static getInstance(): BillingService {
    if (!BillingService.instance) {
      BillingService.instance = new BillingService();
    }
    return BillingService.instance;
  }

  // Current user RBAC (Default to OWNER for preview sandbox control)
  private currentRole: BillingRole = BillingRole.OWNER;

  public getRole(): BillingRole {
    return this.currentRole;
  }

  public setRole(role: BillingRole): void {
    this.currentRole = role;
  }

  // ==========================================
  // SUBSCRIPTION ENGINE
  // ==========================================

  public changeSubscription(tier: PlanTier, cycle: BillingCycle): Subscription {
    if (!BillingValidator.validateRbacPermission(this.currentRole, [BillingRole.OWNER, BillingRole.ADMIN, BillingRole.BILLING_MANAGER])) {
      throw new Error('Unauthorized: Insufficient permissions to change subscriptions.');
    }

    const currentSub = globalBillingRepository.getSubscription();
    const plan = PLANS_REGISTRY[tier];
    const price = cycle === BillingCycle.MONTHLY ? plan.priceMonthly : plan.priceYearly;

    const updatedSub: Subscription = {
      id: currentSub.id,
      tier,
      cycle,
      price,
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date(Date.now() + (cycle === BillingCycle.MONTHLY ? 30 : 365) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      trialEndDate: null,
      status: 'Active',
      autoRenew: true
    };

    globalBillingRepository.saveSubscription(updatedSub);

    // Emit event
    const eventType = price > currentSub.price ? BillingEventType.PLAN_UPGRADED : BillingEventType.PLAN_DOWNGRADED;
    BillingEventBus.emit(eventType, {
      oldPlan: currentSub.tier,
      newPlan: tier,
      price,
      cycle
    });

    BillingEventBus.emit(BillingEventType.SUBSCRIPTION_CHANGED, {
      subscriptionId: updatedSub.id,
      tier,
      cycle
    });

    // Auto generate new invoice for pro-rata charge
    if (price > 0) {
      this.generateInvoiceForPlan(updatedSub);
    }

    return updatedSub;
  }

  public toggleAutoRenew(): Subscription {
    const sub = globalBillingRepository.getSubscription();
    sub.autoRenew = !sub.autoRenew;
    globalBillingRepository.saveSubscription(sub);
    return sub;
  }

  // ==========================================
  // INVOICE ENGINE
  // ==========================================

  private generateInvoiceForPlan(sub: Subscription): Invoice {
    const invoices = globalBillingRepository.getInvoices();
    const nextInvNumber = `INV-2026-00${invoices.length + 1}`;

    const subtotal = sub.price;
    const tax = Number((subtotal * 0.18).toFixed(2)); // 18% GST/Tax
    const discount = 0;
    const creditsApplied = 0;
    const grandTotal = subtotal + tax;

    const newInvoice: Invoice = {
      id: `inv_${Math.random().toString(36).substring(2, 8)}`,
      invoiceNumber: nextInvNumber,
      businessDetails: {
        name: 'TaskNova AI Enterprises LLC',
        address: '100 Innovation Way, Suite 400, San Francisco, CA',
        gstin: 'GSTIN94A827103',
        email: 'billing@tasknova.ai'
      },
      date: new Date().toISOString().split('T')[0],
      dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      items: [
        { description: `Subscription Plan Access - ${sub.tier} (${sub.cycle})`, amount: subtotal }
      ],
      subtotal,
      tax,
      gstAmount: tax,
      discount,
      creditsApplied,
      grandTotal,
      status: InvoiceStatus.PENDING
    };

    if (!BillingValidator.validateInvoiceTotals(newInvoice)) {
      throw new Error('Invoice security violation: totals do not balance correctly.');
    }

    globalBillingRepository.saveInvoice(newInvoice);
    BillingEventBus.emit(BillingEventType.INVOICE_GENERATED, { invoiceId: newInvoice.id, total: grandTotal });

    return newInvoice;
  }

  public payInvoice(invoiceId: string, paymentMethodType: PaymentMethodType): Invoice {
    const invoices = globalBillingRepository.getInvoices();
    const invoice = invoices.find(i => i.id === invoiceId);

    if (!invoice) {
      throw new Error(`Invoice with ID ${invoiceId} not found.`);
    }

    if (invoice.status === InvoiceStatus.PAID) {
      return invoice;
    }

    // Process via adapter
    const adapter = globalPaymentRegistry.getAdapter(paymentMethodType);
    console.log(`[BillingService] Dispatching payment to adapter ${paymentMethodType} for invoice ${invoiceId}`);

    // Simulate payment transaction
    const transactionId = `txn_${Math.random().toString(36).substring(2, 10)}`;

    invoice.status = InvoiceStatus.PAID;
    invoice.transactionReference = transactionId;
    invoice.paymentMethodType = paymentMethodType;

    globalBillingRepository.saveInvoice(invoice);

    BillingEventBus.emit(BillingEventType.INVOICE_PAID, {
      invoiceId: invoice.id,
      paymentMethodType,
      transactionReference: transactionId
    });

    return invoice;
  }

  // ==========================================
  // CREDIT SYSTEM
  // ==========================================

  public addCredits(amount: number, creditType: CreditType, reason: string): CreditState {
    if (!BillingValidator.validateRbacPermission(this.currentRole, [BillingRole.OWNER, BillingRole.FINANCE, BillingRole.BILLING_MANAGER])) {
      throw new Error('Unauthorized: Insufficient permissions to grant/add credits.');
    }

    if (!BillingValidator.validateCreditOperation(amount, 'credit')) {
      throw new Error('Invalid credit amount or formatting.');
    }

    const state = globalBillingRepository.getCreditState();
    const newEntry: CreditLedgerEntry = {
      id: `cred_ld_${Math.random().toString(36).substring(2, 8)}`,
      amount,
      type: 'credit',
      creditType,
      reason,
      timestamp: new Date().toISOString(),
      expirationDate: creditType === CreditType.PROMOTIONAL
        ? new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString() // 90 days expiration for promo
        : null
    };

    state.balance = Number((state.balance + amount).toFixed(2));
    state.ledger.unshift(newEntry);

    globalBillingRepository.saveCreditState(state);

    BillingEventBus.emit(BillingEventType.CREDITS_ADDED, {
      amount,
      creditType,
      newBalance: state.balance
    });

    return state;
  }

  public applyCreditsToInvoice(invoiceId: string, amountToApply: number): Invoice {
    const state = globalBillingRepository.getCreditState();
    const invoices = globalBillingRepository.getInvoices();
    const invoice = invoices.find(i => i.id === invoiceId);

    if (!invoice) {
      throw new Error(`Invoice with ID ${invoiceId} not found.`);
    }

    if (amountToApply <= 0 || amountToApply > state.balance) {
      throw new Error('Insufficient credit balance or invalid amount.');
    }

    const maxApply = invoice.subtotal - invoice.discount + invoice.tax;
    const actualApplied = Math.min(amountToApply, maxApply);

    // Update state
    state.balance = Number((state.balance - actualApplied).toFixed(2));
    const ledgerEntry: CreditLedgerEntry = {
      id: `cred_ld_${Math.random().toString(36).substring(2, 8)}`,
      amount: actualApplied,
      type: 'debit',
      creditType: CreditType.PLATFORM,
      reason: `Applied credits to invoice ${invoice.invoiceNumber}`,
      timestamp: new Date().toISOString(),
      expirationDate: null
    };
    state.ledger.unshift(ledgerEntry);
    globalBillingRepository.saveCreditState(state);

    // Update invoice
    invoice.creditsApplied = actualApplied;
    invoice.grandTotal = Number((maxApply - actualApplied).toFixed(2));

    if (invoice.grandTotal === 0) {
      invoice.status = InvoiceStatus.PAID;
      invoice.transactionReference = `credits_applied_${ledgerEntry.id}`;
      BillingEventBus.emit(BillingEventType.INVOICE_PAID, { invoiceId: invoice.id, paymentMethodType: 'Credits' });
    }

    globalBillingRepository.saveInvoice(invoice);

    BillingEventBus.emit(BillingEventType.CREDITS_USED, {
      amount: actualApplied,
      invoiceId: invoice.id,
      remainingCredits: state.balance
    });

    return invoice;
  }

  // ==========================================
  // USAGE METERING
  // ==========================================

  public recordUsage(increment: Partial<UsageMetric>): UsageMetric {
    const current = globalBillingRepository.getUsageMetrics();

    const updated: UsageMetric = {
      datasetsCount: current.datasetsCount + (increment.datasetsCount ?? 0),
      campaignsCount: current.campaignsCount + (increment.campaignsCount ?? 0),
      generatedTasksCount: current.generatedTasksCount + (increment.generatedTasksCount ?? 0),
      publishedTasksCount: current.publishedTasksCount + (increment.publishedTasksCount ?? 0),
      completedTasksCount: current.completedTasksCount + (increment.completedTasksCount ?? 0),
      storageUsedGb: Number((current.storageUsedGb + (increment.storageUsedGb ?? 0)).toFixed(2)),
      bandwidthGb: Number((current.bandwidthGb + (increment.bandwidthGb ?? 0)).toFixed(2)),
      apiCallsCount: current.apiCallsCount + (increment.apiCallsCount ?? 0),
      aiValidationRunsCount: current.aiValidationRunsCount + (increment.aiValidationRunsCount ?? 0),
      rewardDistributedCoins: current.rewardDistributedCoins + (increment.rewardDistributedCoins ?? 0),
      walletUsageCoins: current.walletUsageCoins + (increment.walletUsageCoins ?? 0),
    };

    globalBillingRepository.saveUsageMetrics(updated);

    // Check budget thresholds against usage if applicable
    this.evaluateBudgetSpent();

    return updated;
  }

  // ==========================================
  // BUDGET MANAGEMENT
  // ==========================================

  public updateBudget(updates: Partial<Budget>): Budget {
    if (!BillingValidator.validateRbacPermission(this.currentRole, [BillingRole.OWNER, BillingRole.FINANCE])) {
      throw new Error('Unauthorized: Insufficient permissions to change financial budgets.');
    }

    const current = globalBillingRepository.getBudget();
    const updated: Budget = {
      ...current,
      ...updates
    };

    if (!BillingValidator.validateBudget(updated)) {
      throw new Error('Invalid budget configuration values.');
    }

    globalBillingRepository.saveBudget(updated);
    return updated;
  }

  private evaluateBudgetSpent(): void {
    const budget = globalBillingRepository.getBudget();
    const metrics = globalBillingRepository.getUsageMetrics();

    // Estimate dynamic spent based on API calls ($0.01 per 10 calls) + storage ($0.05 per GB) + AI validation runs ($0.05 per run)
    const spent = (metrics.apiCallsCount / 1000) * 1.0 + metrics.storageUsedGb * 0.05 + metrics.aiValidationRunsCount * 0.02;

    const pct = (spent / budget.monthlyBudget) * 100;

    budget.thresholds.forEach(threshold => {
      if (pct >= threshold && (pct - threshold) < 5) {
        // Trigger alert
        BillingEventBus.emit(BillingEventType.BUDGET_EXCEEDED, {
          threshold,
          currentSpend: spent,
          budgetLimit: budget.monthlyBudget
        });

        if (threshold >= 100 && budget.autoPause) {
          BillingEventBus.emit(BillingEventType.BUDGET_PAUSED, {
            currentSpend: spent,
            budgetLimit: budget.monthlyBudget
          });
        }
      }
    });
  }

  // ==========================================
  // PAYMENT METHOD CONFIG
  // ==========================================

  public addPaymentMethod(type: PaymentMethodType, details: any): PaymentMethod[] {
    const list = globalBillingRepository.getPaymentMethods();
    const newPm: PaymentMethod = {
      id: `pm_${Math.random().toString(36).substring(2, 8)}`,
      type,
      isDefault: list.length === 0,
      details,
      createdAt: new Date().toISOString()
    };

    list.push(newPm);
    globalBillingRepository.savePaymentMethods(list);
    return list;
  }

  public deletePaymentMethod(id: string): PaymentMethod[] {
    let list = globalBillingRepository.getPaymentMethods();
    const target = list.find(pm => pm.id === id);
    if (target?.isDefault && list.length > 1) {
      // Set another default
      const nextDefault = list.find(pm => pm.id !== id);
      if (nextDefault) nextDefault.isDefault = true;
    }
    list = list.filter(pm => pm.id !== id);
    globalBillingRepository.savePaymentMethods(list);
    return list;
  }

  public setDefaultPaymentMethod(id: string): PaymentMethod[] {
    const list = globalBillingRepository.getPaymentMethods();
    list.forEach(pm => {
      pm.isDefault = pm.id === id;
    });
    globalBillingRepository.savePaymentMethods(list);
    return list;
  }
}
