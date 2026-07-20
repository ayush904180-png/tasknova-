# Invoice Generation and Tax Engine

TaskNova AI provides a compliant billing invoice generator.

## Statutory Calculations
Every generated invoice includes:
- **Subtotal**: Sum of plan costs or supplementary packs.
- **GST / Sales Tax**: Evaluated dynamically at 18% as required for global corporate compliance.
- **Discounts**: Applied coupon deductions.
- **Credits Applied**: Automated deduction of credit balances before charging.
- **Grand Total**: Formulated strictly as `Subtotal - Discount - Credits + Tax`.

## Security Protection
Before saving or submitting to payment gateways:
1. **Invoice Tampering Checks**: `BillingValidator` verifies that `Grand Total` equals `Subtotal - Discount - Credits + Tax`. If any parameters have been altered on the client side, the settlement throws an error.
2. **Replay Protection**: The payment gateway checks invoice transaction hashes to prevent duplicate payment submittals.
3. **Downloader**: A formatting utility outputs structured TXT documents representation of PDF invoice formats.
