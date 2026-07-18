# Anti-Fraud Reward Verification

Securing micro-payment pipelines is critical. The `AntiFraudGuard` evaluates multiple risk vectors prior to releasing ledger transactions.

## Fraud Blockers
Rewards are **strictly blocked** when:
1. **Validation Rejected**: Submission fails QA checks.
2. **Spam Detected**: Core linguistic and structural filters mark the submission as spam.
3. **High Security Risk**: Suspicious device signatures, emulator flags, or proxy nodes detected (Risk > 75%).
4. **Duplicate Node**: Identical payload hashes detected elsewhere in the consensus cycle.
5. **Human Review Pending**: Submissions held for secondary inspection are deferred and do not receive rewards.
6. **Checksum Mismatch**: Tampering detected on the original client transmission payload.
7. **Velocity Attack**: Contributor exceeds maximum submission rate thresholds.
8. **Bot Pattern**: Device fingerprint associated with automated click farms.
9. **Security Hold**: Administrative fraud hold flagged on user account.
