/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  Subscription,
  PlanTier,
  BillingCycle,
  Invoice,
  InvoiceStatus,
  PaymentMethod,
  PaymentMethodType,
  CreditState,
  CreditType,
  Budget,
  UsageMetric,
  FinancialAnalytics,
  SupportLevel
} from '../types';
import { globalGcpOperationsAdapter } from '../adapters/GoogleCloudAdapters';

export interface IBillingRepository {
  getSubscription(): Subscription;
  saveSubscription(subscription: Subscription): void;
  getInvoices(): Invoice[];
  saveInvoice(invoice: Invoice): void;
  getCreditState(): CreditState;
  saveCreditState(state: CreditState): void;
  getBudget(): Budget;
  saveBudget(budget: Budget): void;
  getPaymentMethods(): PaymentMethod[];
  savePaymentMethods(methods: PaymentMethod[]): void;
  getUsageMetrics(): UsageMetric;
  saveUsageMetrics(metrics: UsageMetric): void;
  getFinancialAnalytics(): FinancialAnalytics;
}

export class LocalBillingRepository implements IBillingRepository {
  private static STORAGE_KEYS = {
    SUBSCRIPTION: 'tasknova_billing:subscription',
    INVOICES: 'tasknova_billing:invoices',
    CREDITS: 'tasknova_billing:credits',
    BUDGET: 'tasknova_billing:budget',
    PAYMENT_METHODS: 'tasknova_billing:payment_methods',
    USAGE_METRICS: 'tasknova_billing:usage_metrics'
  };

  constructor() {
    this.seedIfEmpty();
  }

  private seedIfEmpty(): void {
    if (!localStorage.getItem(LocalBillingRepository.STORAGE_KEYS.SUBSCRIPTION)) {
      const defaultSub: Subscription = {
        id: 'sub_default_01',
        tier: PlanTier.STARTER,
        cycle: BillingCycle.MONTHLY,
        price: 29,
        startDate: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        endDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        trialEndDate: null,
        status: 'Active',
        autoRenew: true
      };
      this.saveSubscription(defaultSub);
    }

    if (!localStorage.getItem(LocalBillingRepository.STORAGE_KEYS.INVOICES)) {
      const defaultInvoices: Invoice[] = [
        {
          id: 'inv_1001',
          invoiceNumber: 'INV-2026-001',
          businessDetails: {
            name: 'TaskNova AI Enterprises LLC',
            address: '100 Innovation Way, Suite 400, San Francisco, CA',
            gstin: 'GSTIN94A827103',
            email: 'billing@tasknova.ai'
          },
          date: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          dueDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          items: [
            { description: 'TaskNova AI Starter Plan - Monthly', amount: 29.00 },
            { description: 'Extra AI Validation Runs (2,500 runs)', amount: 15.00 }
          ],
          subtotal: 44.00,
          tax: 7.92,
          gstAmount: 7.92,
          discount: 5.00,
          creditsApplied: 0,
          grandTotal: 46.92,
          status: InvoiceStatus.PAID,
          transactionReference: 'txn_stripe_pay_908127',
          paymentMethodType: PaymentMethodType.STRIPE
        },
        {
          id: 'inv_1002',
          invoiceNumber: 'INV-2026-002',
          businessDetails: {
            name: 'TaskNova AI Enterprises LLC',
            address: '100 Innovation Way, Suite 400, San Francisco, CA',
            gstin: 'GSTIN94A827103',
            email: 'billing@tasknova.ai'
          },
          date: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          dueDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          items: [
            { description: 'TaskNova AI Starter Plan - Monthly Renewal', amount: 29.00 },
            { description: 'Extra Campaign Limits Pack', amount: 20.00 }
          ],
          subtotal: 49.00,
          tax: 8.82,
          gstAmount: 8.82,
          discount: 0,
          creditsApplied: 10.00,
          grandTotal: 47.82,
          status: InvoiceStatus.PENDING
        }
      ];
      localStorage.setItem(LocalBillingRepository.STORAGE_KEYS.INVOICES, JSON.stringify(defaultInvoices));
    }

    if (!localStorage.getItem(LocalBillingRepository.STORAGE_KEYS.CREDITS)) {
      const defaultCredits: CreditState = {
        balance: 140.00,
        ledger: [
          {
            id: 'cred_ld_01',
            amount: 100.00,
            type: 'credit',
            creditType: CreditType.PURCHASED,
            reason: 'Credit Bundle Purchase via Credit Card',
            timestamp: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
            expirationDate: null
          },
          {
            id: 'cred_ld_02',
            amount: 50.00,
            type: 'credit',
            creditType: CreditType.PROMOTIONAL,
            reason: 'Sign-up Promotional Credit',
            timestamp: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
            expirationDate: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000).toISOString()
          },
          {
            id: 'cred_ld_03',
            amount: 10.00,
            type: 'debit',
            creditType: CreditType.PLATFORM,
            reason: 'Invoice INV-2026-002 Payment Contribution',
            timestamp: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
            expirationDate: null
          }
        ]
      };
      localStorage.setItem(LocalBillingRepository.STORAGE_KEYS.CREDITS, JSON.stringify(defaultCredits));
    }

    if (!localStorage.getItem(LocalBillingRepository.STORAGE_KEYS.BUDGET)) {
      const defaultBudget: Budget = {
        id: 'bud_default',
        monthlyBudget: 250.00,
        campaignBudget: 150.00,
        departmentBudget: 500.00,
        alertsEnabled: true,
        thresholds: [50, 80, 90, 100],
        autoPause: true,
        forecastedSpend: 235.50
      };
      localStorage.setItem(LocalBillingRepository.STORAGE_KEYS.BUDGET, JSON.stringify(defaultBudget));
    }

    if (!localStorage.getItem(LocalBillingRepository.STORAGE_KEYS.PAYMENT_METHODS)) {
      const defaultPaymentMethods: PaymentMethod[] = [
        {
          id: 'pm_stripe_01',
          type: PaymentMethodType.STRIPE,
          isDefault: true,
          details: { last4: '4242', brand: 'Visa' },
          createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
          id: 'pm_upi_02',
          type: PaymentMethodType.UPI,
          isDefault: false,
          details: { upiId: 'tasknova@oksbi' },
          createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString()
        }
      ];
      localStorage.setItem(LocalBillingRepository.STORAGE_KEYS.PAYMENT_METHODS, JSON.stringify(defaultPaymentMethods));
    }

    if (!localStorage.getItem(LocalBillingRepository.STORAGE_KEYS.USAGE_METRICS)) {
      const defaultUsageMetrics: UsageMetric = {
        datasetsCount: 4,
        campaignsCount: 3,
        generatedTasksCount: 1250,
        publishedTasksCount: 1100,
        completedTasksCount: 980,
        storageUsedGb: 14.5,
        bandwidthGb: 48.2,
        apiCallsCount: 18450,
        aiValidationRunsCount: 840,
        rewardDistributedCoins: 14500,
        walletUsageCoins: 11200
      };
      localStorage.setItem(LocalBillingRepository.STORAGE_KEYS.USAGE_METRICS, JSON.stringify(defaultUsageMetrics));
    }
  }

  public getSubscription(): Subscription {
    return JSON.parse(localStorage.getItem(LocalBillingRepository.STORAGE_KEYS.SUBSCRIPTION)!);
  }

  public saveSubscription(subscription: Subscription): void {
    localStorage.setItem(LocalBillingRepository.STORAGE_KEYS.SUBSCRIPTION, JSON.stringify(subscription));
    // Mirror to Firebase simulated adapter
    globalGcpOperationsAdapter.saveSubscription(subscription);
  }

  public getInvoices(): Invoice[] {
    return JSON.parse(localStorage.getItem(LocalBillingRepository.STORAGE_KEYS.INVOICES)!);
  }

  public saveInvoice(invoice: Invoice): void {
    const invoices = this.getInvoices();
    const idx = invoices.findIndex(i => i.id === invoice.id);
    if (idx !== -1) {
      invoices[idx] = invoice;
    } else {
      invoices.push(invoice);
    }
    localStorage.setItem(LocalBillingRepository.STORAGE_KEYS.INVOICES, JSON.stringify(invoices));
    // Mirror to Firebase simulated adapter
    globalGcpOperationsAdapter.saveInvoice(invoice);
  }

  public getCreditState(): CreditState {
    return JSON.parse(localStorage.getItem(LocalBillingRepository.STORAGE_KEYS.CREDITS)!);
  }

  public saveCreditState(state: CreditState): void {
    localStorage.setItem(LocalBillingRepository.STORAGE_KEYS.CREDITS, JSON.stringify(state));
  }

  public getBudget(): Budget {
    return JSON.parse(localStorage.getItem(LocalBillingRepository.STORAGE_KEYS.BUDGET)!);
  }

  public saveBudget(budget: Budget): void {
    localStorage.setItem(LocalBillingRepository.STORAGE_KEYS.BUDGET, JSON.stringify(budget));
  }

  public getPaymentMethods(): PaymentMethod[] {
    return JSON.parse(localStorage.getItem(LocalBillingRepository.STORAGE_KEYS.PAYMENT_METHODS)!);
  }

  public savePaymentMethods(methods: PaymentMethod[]): void {
    localStorage.setItem(LocalBillingRepository.STORAGE_KEYS.PAYMENT_METHODS, JSON.stringify(methods));
  }

  public getUsageMetrics(): UsageMetric {
    return JSON.parse(localStorage.getItem(LocalBillingRepository.STORAGE_KEYS.USAGE_METRICS)!);
  }

  public saveUsageMetrics(metrics: UsageMetric): void {
    localStorage.setItem(LocalBillingRepository.STORAGE_KEYS.USAGE_METRICS, JSON.stringify(metrics));
  }

  public getFinancialAnalytics(): FinancialAnalytics {
    const invoices = this.getInvoices();
    const subscription = this.getSubscription();

    const mrr = subscription.price;
    const arr = mrr * 12;

    const paidInvoices = invoices.filter(i => i.status === InvoiceStatus.PAID);
    const pendingInvoices = invoices.filter(i => i.status === InvoiceStatus.PENDING || i.status === InvoiceStatus.OVERDUE);

    const monthlyRevenue = paidInvoices.reduce((acc, i) => acc + i.grandTotal, 0);
    const outstandingPayments = pendingInvoices.reduce((acc, i) => acc + i.grandTotal, 0);

    const planDistribution: Record<PlanTier, number> = {
      [PlanTier.FREE]: 154,
      [PlanTier.STARTER]: 84,
      [PlanTier.GROWTH]: 32,
      [PlanTier.BUSINESS]: 12,
      [PlanTier.ENTERPRISE]: 5,
      [PlanTier.CUSTOM]: 2
    };

    return {
      monthlyRevenue,
      mrr,
      arr,
      revenueGrowthPercentage: 14.8,
      avgCustomerValue: 85.50,
      topCustomers: [
        { name: 'Acme Robotics Corp', spend: 1450.00, plan: PlanTier.ENTERPRISE },
        { name: 'DataForge Innovations', spend: 850.00, plan: PlanTier.ENTERPRISE },
        { name: 'Global Language Lab', spend: 290.00, plan: PlanTier.BUSINESS },
        { name: 'Scribe AI Research', spend: 290.00, plan: PlanTier.BUSINESS },
        { name: 'Omni Retail Intelligence', spend: 99.00, plan: PlanTier.GROWTH }
      ],
      planDistribution,
      outstandingPayments,
      revenueForecastNextMonth: monthlyRevenue * 1.15
    };
  }
}

export const globalBillingRepository = new LocalBillingRepository();
