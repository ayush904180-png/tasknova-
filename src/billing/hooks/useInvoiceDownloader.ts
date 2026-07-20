/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Invoice } from '../types';

/**
 * Custom hook to manage formatted client-side invoice downloads.
 */
export function useInvoiceDownloader() {
  const downloadInvoice = (invoice: Invoice) => {
    try {
      const gstinLine = invoice.businessDetails.gstin ? `GSTIN: ${invoice.businessDetails.gstin}` : '';
      const content = `
=========================================
      TASKNOVA AI ENTERPRISE INVOICE
=========================================
Invoice Number : ${invoice.invoiceNumber}
Date           : ${invoice.date}
Due Date       : ${invoice.dueDate}
Status         : ${invoice.status.toUpperCase()}
Reference      : ${invoice.transactionReference || 'N/A'}
Payment Method : ${invoice.paymentMethodType || 'N/A'}

BUSINESS DETAILS:
Name           : ${invoice.businessDetails.name}
Address        : ${invoice.businessDetails.address}
Email          : ${invoice.businessDetails.email}
${gstinLine}

-----------------------------------------
LINE ITEMS:
${invoice.items.map(item => `${item.description.padEnd(35)} $${item.amount.toFixed(2)}`).join('\n')}
-----------------------------------------

FINANCIAL SUMMARY:
Subtotal       : $${invoice.subtotal.toFixed(2)}
GST / Tax (18%): $${invoice.tax.toFixed(2)}
Discount       : -$${invoice.discount.toFixed(2)}
Credits Applied: -$${invoice.creditsApplied.toFixed(2)}
-----------------------------------------
GRAND TOTAL    : $${invoice.grandTotal.toFixed(2)}

=========================================
Thank you for powering TaskNova AI!
For billing support: support@tasknova.ai
=========================================
`;

      const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `TaskNova_Invoice_${invoice.invoiceNumber}.txt`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (e) {
      console.error('[useInvoiceDownloader] Download execution failed:', e);
    }
  };

  return { downloadInvoice };
}
export default useInvoiceDownloader;
