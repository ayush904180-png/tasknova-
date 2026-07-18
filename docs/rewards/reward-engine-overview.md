# Reward Intelligence Engine Overview

The Reward Intelligence Engine is the core system responsible for determining, scaling, and dispersing reward coins and experience points (XP) to TaskNova platform contributors after a micro-task submission undergoes validation by the AI Quality Engine.

## System Goals
1. **Decoupled Coin & XP Accounting**: Maintain distinct paths for reward coins (financial simulation value) and XP (career advancement progression).
2. **Dynamic Rule Customization**: Empower business users to deploy updated reward criteria models without changing codebase.
3. **Multi-Vector Scaling**: Support layered multipliers spanning task difficulty, user reputation, current campaigns, time periods, and streak vectors.
4. **Active Anti-Fraud Isolation**: Disallow reward distribution on any submission flagged with suspicious anomalies.

## Modular Components
- **RewardRulesEngine**: Interprets business compliance conditions.
- **MultiplierEngine**: Evaluates cumulative scaling factors.
- **CoinLedger**: Generates transaction ledger events with digital signature seals.
- **XpAchievementEngine**: Measures leveling curves and issues achievements.
- **AntiFraudGuard**: Validates integrity bounds on device and payload structures.
