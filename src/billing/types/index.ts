/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export enum PlanTier {
  FREE = 'Free Plan',
  STARTER = 'Starter',
  GROWTH = 'Growth',
  BUSINESS = 'Business',
  ENTERPRISE = 'Enterprise',
  CUSTOM = 'Custom Enterprise'
}

export enum BillingCycle {
  MONTHLY = 'Monthly',
  YEARLY = 'Yearly'
}

export interface UsageLimits {
  apiLimits: number;          // API calls per month
  storageGb: number;         // Storage limits in GB
  campaignLimits: number;    // Maximum campaigns
  datasetLimits: number;     // Maximum datasets
  taskLimits: number;        // Maximum active tasks
}

export enum SupportLevel {
  BASIC = 'Basic Email Support',
  STANDARD = 'Standard 24/5 Support',
  PRIORITY = 'Priority 24/7 Support',
  DEDICATED = 'Dedicated TAM Support'
}

export interface FeatureFlags {
  hasAdvancedAnalytics: boolean;
  hasBulkTaskUpload: boolean;
  hasCustomValidators: boolean;
  hasTeamCollaboration: boolean;
  hasSsoSaml: boolean;
  hasAuditLogs: boolean;
}

export interface SubscriptionPlan {
  tier: PlanTier;
  priceMonthly: number;
  priceYearly: number;
  trialDays: number;
  limits: UsageLimits;
  supportLevel: SupportLevel;
  features: FeatureFlags;
}

export interface Subscription {
  id: string;
  tier: PlanTier;
  cycle: BillingCycle;
  price: number;
  startDate: string;
  endDate: string;
  trialEndDate: string | null;
  status: 'Active' | 'Past Due' | 'Canceled' | 'Trialing';
  autoRenew: boolean;
}

export enum PaymentMethodType {
  STRIPE = 'Stripe',
  RAZORPAY = 'Razorpay',
  UPI = 'UPI',
  GPAY = 'Google Pay',
  PHONEPE = 'PhonePe',
  PAYTM = 'Paytm',
  BANK_TRANSFER = 'Bank Transfer',
  CREDIT_CARD = 'Credit Card',
  DEBIT_CARD = 'Debit Card'
}

export interface PaymentMethod {
  id: string;
  type: PaymentMethodType;
  isDefault: boolean;
  details: {
    last4?: string;
    brand?: string;
    upiId?: string;
    bankName?: string;
    accountHolder?: string;
  };
  createdAt: string;
}

export enum InvoiceStatus {
  PAID = 'Paid',
  PENDING = 'Pending',
  OVERDUE = 'Overdue',
  VOID = 'Void'
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  businessDetails: {
    name: string;
    address: string;
    gstin?: string;
    email: string;
  };
  date: string;
  dueDate: string;
  items: Array<{
    description: string;
    amount: number;
  }>;
  subtotal: number;
  tax: number; // GST, sales tax
  gstAmount: number;
  discount: number;
  creditsApplied: number;
  grandTotal: number;
  status: InvoiceStatus;
  transactionReference?: string;
  paymentMethodType?: PaymentMethodType;
}

export interface UsageMetric {
  datasetsCount: number;
  campaignsCount: number;
  generatedTasksCount: number;
  publishedTasksCount: number;
  completedTasksCount: number;
  storageUsedGb: number;
  bandwidthGb: number;
  apiCallsCount: number;
  aiValidationRunsCount: number;
  rewardDistributedCoins: number;
  walletUsageCoins: number;
}

export enum CreditType {
  PLATFORM = 'Platform Credits',
  PROMOTIONAL = 'Promotional Credits',
  BONUS = 'Bonus Credits',
  PURCHASED = 'Purchased Credits',
  REFUND = 'Refund Credits'
}

export interface CreditLedgerEntry {
  id: string;
  amount: number;
  type: 'credit' | 'debit';
  creditType: CreditType;
  reason: string;
  timestamp: string;
  expirationDate: string | null;
}

export interface CreditState {
  balance: number;
  ledger: CreditLedgerEntry[];
}

export interface Budget {
  id: string;
  monthlyBudget: number;
  campaignBudget: number;
  departmentBudget: number;
  alertsEnabled: boolean;
  thresholds: number[]; // e.g., [50, 80, 90, 100] representing % of budget
  autoPause: boolean;
  forecastedSpend: number;
}

export interface FinancialAnalytics {
  monthlyRevenue: number;
  mrr: number;
  arr: number;
  revenueGrowthPercentage: number;
  avgCustomerValue: number;
  topCustomers: Array<{ name: string; spend: number; plan: PlanTier }>;
  planDistribution: Record<PlanTier, number>;
  outstandingPayments: number;
  revenueForecastNextMonth: number;
}

export enum BillingRole {
  OWNER = 'Owner',
  FINANCE = 'Finance',
  BILLING_MANAGER = 'Billing Manager',
  ADMIN = 'Admin',
  AUDITOR = 'Auditor',
  DEVELOPER = 'Developer',
  VIEWER = 'Viewer'
}

export interface RbacContext {
  role: BillingRole;
  permissions: string[];
}

export enum BillingEventType {
  SUBSCRIPTION_CREATED = 'SubscriptionCreated',
  SUBSCRIPTION_CHANGED = 'SubscriptionChanged',
  INVOICE_GENERATED = 'InvoiceGenerated',
  INVOICE_PAID = 'InvoicePaid',
  PAYMENT_FAILED = 'PaymentFailed',
  CREDITS_ADDED = 'CreditsAdded',
  CREDITS_USED = 'CreditsUsed',
  BUDGET_EXCEEDED = 'BudgetExceeded',
  BUDGET_PAUSED = 'BudgetPaused',
  PLAN_UPGRADED = 'PlanUpgraded',
  PLAN_DOWNGRADED = 'PlanDowngraded'
}

export interface BillingEvent {
  id: string;
  type: BillingEventType;
  timestamp: string;
  payload: Record<string, any>;
}
