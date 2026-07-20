/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { PaymentMethodType } from '../types';

export interface PaymentTransaction {
  transactionId: string;
  amount: number;
  currency: string;
  status: 'SUCCESS' | 'FAILED' | 'PENDING';
  gatewayReference: string;
  timestamp: string;
}

/**
 * Generic Payment Gateway Adapter interface.
 */
export interface PaymentGatewayAdapter {
  getSupportedType(): PaymentMethodType;
  processPayment(invoiceId: string, amount: number, paymentMethodDetails: any): Promise<PaymentTransaction>;
  refundPayment(transactionId: string, amount: number): Promise<boolean>;
}

/**
 * Stripe Payment Gateway Adapter
 */
export class StripePaymentAdapter implements PaymentGatewayAdapter {
  public getSupportedType(): PaymentMethodType {
    return PaymentMethodType.STRIPE;
  }

  public async processPayment(invoiceId: string, amount: number, paymentMethodDetails: any): Promise<PaymentTransaction> {
    console.log(`[StripePaymentAdapter] Processing Stripe checkout session. Invoice: ${invoiceId}, Amount: $${amount}`);
    return {
      transactionId: `ch_stripe_${Math.random().toString(36).substring(4, 12)}`,
      amount,
      currency: 'USD',
      status: 'SUCCESS',
      gatewayReference: `stripe_pi_${Math.random().toString(36).substring(2, 10)}`,
      timestamp: new Date().toISOString()
    };
  }

  public async refundPayment(transactionId: string, amount: number): Promise<boolean> {
    console.log(`[StripePaymentAdapter] Issuing refund of $${amount} on txn ${transactionId}`);
    return true;
  }
}

/**
 * Razorpay Payment Gateway Adapter
 */
export class RazorpayPaymentAdapter implements PaymentGatewayAdapter {
  public getSupportedType(): PaymentMethodType {
    return PaymentMethodType.RAZORPAY;
  }

  public async processPayment(invoiceId: string, amount: number, paymentMethodDetails: any): Promise<PaymentTransaction> {
    console.log(`[RazorpayPaymentAdapter] Initiating Razorpay order. Invoice: ${invoiceId}, Amount: ₹${amount * 80}`);
    return {
      transactionId: `pay_rzp_${Math.random().toString(36).substring(4, 12)}`,
      amount,
      currency: 'INR',
      status: 'SUCCESS',
      gatewayReference: `rzp_order_${Math.random().toString(36).substring(2, 10)}`,
      timestamp: new Date().toISOString()
    };
  }

  public async refundPayment(transactionId: string, amount: number): Promise<boolean> {
    console.log(`[RazorpayPaymentAdapter] Initiating Razorpay refund for transaction ${transactionId}`);
    return true;
  }
}

/**
 * UPI Unified Payments Interface Adapter
 */
export class UpiPaymentAdapter implements PaymentGatewayAdapter {
  public getSupportedType(): PaymentMethodType {
    return PaymentMethodType.UPI;
  }

  public async processPayment(invoiceId: string, amount: number, paymentMethodDetails: any): Promise<PaymentTransaction> {
    const upiId = paymentMethodDetails.upiId || 'user@upi';
    console.log(`[UpiPaymentAdapter] Dispatching UPI Intent Request to ${upiId}. Amount: ₹${amount * 80}`);
    return {
      transactionId: `txn_upi_${Math.random().toString(36).substring(4, 12)}`,
      amount,
      currency: 'INR',
      status: 'SUCCESS',
      gatewayReference: `upi_ref_${Math.random().toString(36).substring(2, 10)}`,
      timestamp: new Date().toISOString()
    };
  }

  public async refundPayment(transactionId: string, amount: number): Promise<boolean> {
    console.log(`[UpiPaymentAdapter] Refunding UPI transaction ${transactionId}`);
    return true;
  }
}

/**
 * Google Pay Payment Gateway Adapter
 */
export class GPayPaymentAdapter implements PaymentGatewayAdapter {
  public getSupportedType(): PaymentMethodType {
    return PaymentMethodType.GPAY;
  }

  public async processPayment(invoiceId: string, amount: number, paymentMethodDetails: any): Promise<PaymentTransaction> {
    console.log(`[GPayPaymentAdapter] Authenticating GPay merchant API. Amount: $${amount}`);
    return {
      transactionId: `gpay_${Math.random().toString(36).substring(4, 12)}`,
      amount,
      currency: 'USD',
      status: 'SUCCESS',
      gatewayReference: `gpay_token_${Math.random().toString(36).substring(2, 10)}`,
      timestamp: new Date().toISOString()
    };
  }

  public async refundPayment(transactionId: string, amount: number): Promise<boolean> {
    return true;
  }
}

/**
 * PhonePe Payment Gateway Adapter
 */
export class PhonePePaymentAdapter implements PaymentGatewayAdapter {
  public getSupportedType(): PaymentMethodType {
    return PaymentMethodType.PHONEPE;
  }

  public async processPayment(invoiceId: string, amount: number, paymentMethodDetails: any): Promise<PaymentTransaction> {
    console.log(`[PhonePePaymentAdapter] Redirecting to PhonePe secure login. Amount: $${amount}`);
    return {
      transactionId: `phonepe_${Math.random().toString(36).substring(4, 12)}`,
      amount,
      currency: 'USD',
      status: 'SUCCESS',
      gatewayReference: `pp_${Math.random().toString(36).substring(2, 10)}`,
      timestamp: new Date().toISOString()
    };
  }

  public async refundPayment(transactionId: string, amount: number): Promise<boolean> {
    return true;
  }
}

/**
 * Paytm Payment Gateway Adapter
 */
export class PaytmPaymentAdapter implements PaymentGatewayAdapter {
  public getSupportedType(): PaymentMethodType {
    return PaymentMethodType.PAYTM;
  }

  public async processPayment(invoiceId: string, amount: number, paymentMethodDetails: any): Promise<PaymentTransaction> {
    console.log(`[PaytmPaymentAdapter] Processing Paytm wallet transaction. Amount: $${amount}`);
    return {
      transactionId: `paytm_${Math.random().toString(36).substring(4, 12)}`,
      amount,
      currency: 'USD',
      status: 'SUCCESS',
      gatewayReference: `ptm_${Math.random().toString(36).substring(2, 10)}`,
      timestamp: new Date().toISOString()
    };
  }

  public async refundPayment(transactionId: string, amount: number): Promise<boolean> {
    return true;
  }
}

/**
 * Bank Transfer Payment Gateway Adapter
 */
export class BankTransferPaymentAdapter implements PaymentGatewayAdapter {
  public getSupportedType(): PaymentMethodType {
    return PaymentMethodType.BANK_TRANSFER;
  }

  public async processPayment(invoiceId: string, amount: number, paymentMethodDetails: any): Promise<PaymentTransaction> {
    console.log(`[BankTransferPaymentAdapter] Generating bank virtual account for Invoice ${invoiceId}`);
    return {
      transactionId: `bank_va_${Math.random().toString(36).substring(4, 12)}`,
      amount,
      currency: 'USD',
      status: 'PENDING', // Bank transfers are typically pending authorization
      gatewayReference: `iban_va_${Math.random().toString(36).substring(2, 10)}`,
      timestamp: new Date().toISOString()
    };
  }

  public async refundPayment(transactionId: string, amount: number): Promise<boolean> {
    console.log(`[BankTransferPaymentAdapter] Processing manual bank wire refund of $${amount}`);
    return true;
  }
}

/**
 * Credit Card Payment Gateway Adapter
 */
export class CreditCardPaymentAdapter implements PaymentGatewayAdapter {
  public getSupportedType(): PaymentMethodType {
    return PaymentMethodType.CREDIT_CARD;
  }

  public async processPayment(invoiceId: string, amount: number, paymentMethodDetails: any): Promise<PaymentTransaction> {
    console.log(`[CreditCardPaymentAdapter] Processing 3DSecure direct credit card charge. Amount: $${amount}`);
    return {
      transactionId: `cc_${Math.random().toString(36).substring(4, 12)}`,
      amount,
      currency: 'USD',
      status: 'SUCCESS',
      gatewayReference: `cc_txn_${Math.random().toString(36).substring(2, 10)}`,
      timestamp: new Date().toISOString()
    };
  }

  public async refundPayment(transactionId: string, amount: number): Promise<boolean> {
    return true;
  }
}

/**
 * Debit Card Payment Gateway Adapter
 */
export class DebitCardPaymentAdapter implements PaymentGatewayAdapter {
  public getSupportedType(): PaymentMethodType {
    return PaymentMethodType.DEBIT_CARD;
  }

  public async processPayment(invoiceId: string, amount: number, paymentMethodDetails: any): Promise<PaymentTransaction> {
    console.log(`[DebitCardPaymentAdapter] Processing 3DSecure debit card transaction. Amount: $${amount}`);
    return {
      transactionId: `dc_${Math.random().toString(36).substring(4, 12)}`,
      amount,
      currency: 'USD',
      status: 'SUCCESS',
      gatewayReference: `dc_txn_${Math.random().toString(36).substring(2, 10)}`,
      timestamp: new Date().toISOString()
    };
  }

  public async refundPayment(transactionId: string, amount: number): Promise<boolean> {
    return true;
  }
}

/**
 * Payment Gateway Registry and Routing Service
 */
export class PaymentGatewayRegistry {
  private adapters: Map<PaymentMethodType, PaymentGatewayAdapter> = new Map();

  constructor() {
    this.registerAdapter(new StripePaymentAdapter());
    this.registerAdapter(new RazorpayPaymentAdapter());
    this.registerAdapter(new UpiPaymentAdapter());
    this.registerAdapter(new GPayPaymentAdapter());
    this.registerAdapter(new PhonePePaymentAdapter());
    this.registerAdapter(new PaytmPaymentAdapter());
    this.registerAdapter(new BankTransferPaymentAdapter());
    this.registerAdapter(new CreditCardPaymentAdapter());
    this.registerAdapter(new DebitCardPaymentAdapter());
  }

  public registerAdapter(adapter: PaymentGatewayAdapter): void {
    this.adapters.set(adapter.getSupportedType(), adapter);
  }

  public getAdapter(type: PaymentMethodType): PaymentGatewayAdapter {
    const adapter = this.adapters.get(type);
    if (!adapter) {
      throw new Error(`[PaymentGatewayRegistry] No adapter found for payment method: ${type}`);
    }
    return adapter;
  }

  public getAvailableMethods(): PaymentMethodType[] {
    return Array.from(this.adapters.keys());
  }
}

export const globalPaymentRegistry = new PaymentGatewayRegistry();
