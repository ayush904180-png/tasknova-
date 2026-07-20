/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Invoice, BillingRole, Budget, CreditLedgerEntry } from '../types';

/**
 * Validator utility to prevent subscription abuse, invoice tampering,
 * duplicate payments, replay attacks, budget bypass, and unauthorized refunds.
 */
export class BillingValidator {
  /**
   * Validates that an invoice's totals sum up correctly to prevent tempering.
   */
  public static validateInvoiceTotals(invoice: Invoice): boolean {
    const subtotal = invoice.subtotal;
    const computedTotal = subtotal - invoice.discount - invoice.creditsApplied + invoice.tax;
    const difference = Math.abs(invoice.grandTotal - computedTotal);
    // Allowing minor floating point differences
    return difference < 0.01 && invoice.grandTotal >= 0;
  }

  /**
   * Prevents credit manipulation by checking that addition/debit values are secure.
   */
  public static validateCreditOperation(amount: number, operationType: 'credit' | 'debit'): boolean {
    if (amount <= 0 || isNaN(amount) || !isFinite(amount)) {
      return false;
    }
    return true;
  }

  /**
   * Prevents unauthorized operations based on RBAC permissions.
   */
  public static validateRbacPermission(role: BillingRole, requiredRoles: BillingRole[]): boolean {
    return requiredRoles.includes(role);
  }

  /**
   * Validates budget update constraints to prevent bypass or negative limits.
   */
  public static validateBudget(budget: Budget): boolean {
    if (budget.monthlyBudget < 0 || budget.campaignBudget < 0 || budget.departmentBudget < 0) {
      return false;
    }
    if (budget.thresholds.some(t => t < 0 || t > 200)) {
      return false;
    }
    return true;
  }

  /**
   * Checks for duplicate transaction references to prevent replay attacks.
   */
  public static isDuplicatePayment(txRef: string, existingTxRefs: Set<string>): boolean {
    return existingTxRefs.has(txRef);
  }

  /**
   * Validates discount values.
   */
  public static validateDiscount(discountAmount: number, subtotal: number): boolean {
    if (discountAmount < 0 || discountAmount > subtotal) {
      return false;
    }
    return true;
  }
}
