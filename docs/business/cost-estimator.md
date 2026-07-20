# Campaign Cost Estimator & Platform Ledger

The Cost Estimator calculates real-time campaign budgets and platform fees based on volume, complexity, and target audience restrictions.

## Budget Components Matrix

- **Reward Budget**: Total coin rewards directly allocated to validators and annotators ($R_b$).
- **Platform Fee**: TaskNova service fee, calculated as 8.5% of the reward budget ($P_f$).
- **Buffer Budget**: Emergency buffer allocation (5% of reward budget) for high-consensus tasks where multi-user overlap is required ($B_b$).
- **Refund Reserve**: Dedicated treasury pool (10% of reward budget) for automated reimbursement on invalidated or low-quality tasks ($R_r$).
- **Taxes**: 18% standard professional service GST, applied on the platform fee and buffer allocations ($T_x$).
- **Business Discount**: Dynamic discount (up to 12.5%) applied to high-volume campaigns ($D_b$).

## Cost Optimization Formula

The final corporate invoice total $C_{total}$ is calculated dynamically using the following formula:

$$C_{total} = R_b + P_f + B_b + R_r + T_x - D_b$$

Where:
- $P_f = R_b \times 0.085$
- $B_b = R_b \times 0.05$
- $R_r = R_b \times 0.10$
- $T_x = (P_f + B_b) \times 0.18$
- $D_b = R_b \times \text{VolumeDiscountRate}$
