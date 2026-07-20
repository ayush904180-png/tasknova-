# Subscription Engine

The Subscription Engine regulates user tiers, quotas, support channels, and functional feature flags.

## Supported Plans

| Plan Tier | Price (Monthly) | Price (Yearly) | API Limits | Storage Limit | Support Level |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Free Plan** | $0 | $0 | 1,000 / mo | 1 GB | Basic Email |
| **Starter** | $29 | $290 | 10,000 / mo | 10 GB | Basic Email |
| **Growth** | $99 | $990 | 50,000 / mo | 50 GB | Standard 24/5 |
| **Business** | $299 | $2,990 | 250,000 / mo | 250 GB | Priority 24/7 |
| **Enterprise** | $999 | $9,990 | 1,000,000 / mo | 1,000 GB | Priority 24/7 |
| **Custom Ent.** | $2,500 | $25,000 | 10,000,000 / mo| 10,000 GB | Dedicated TAM |

## Pro-Rata and Upgrades
When a tenant updates their active plan, the platform calculates the appropriate cycle prices, publishes a `SubscriptionChanged` and `PlanUpgraded` / `PlanDowngraded` event, updates the Firestore records, and generates a corresponding pro-rata invoice ready for payment settlement.
