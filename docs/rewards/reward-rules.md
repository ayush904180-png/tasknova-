# Configurable Reward Rules Engine

The Rules Engine enables dynamic evaluation of business-centric constraints. Rules are defined in JSON configurations and evaluated in sequence according to their prioritized weights.

## Rule Data Layout
```json
{
  "id": "RULE-003",
  "name": "Quality Excellence Incentive",
  "version": "1.1.0",
  "priority": 30,
  "status": "Active",
  "effectiveDate": "2026-02-15",
  "conditionFormula": "qualityScore >= 90",
  "actionFormula": "finalCoins + 10"
}
```

## Evaluator Conditions
- **IF**: Evaluates contextual variables (`submission.validationStatus`, `trustScore`, etc.).
- **THEN**: Executes the reward modification action if the condition evaluates to true.
- **ELSE**: Optional fallback instruction when conditions are not satisfied.
