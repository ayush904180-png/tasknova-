# AI Campaign Recommendation Engine

The AI Campaign Recommendation Engine analyses existing human intelligence benchmarks to propose optimized configuration rules for newly initiated campaigns.

## Parameter Projections & Confidence Bounds

- **Consensus Count**: Proposes optimal annotator redundancies (e.g., 3x, 5x) based on task complexity.
- **Difficulty Tagging**: Machine-learned task difficulty class (Easy, Medium, Hard).
- **Expected Accuracy**: Proposes expected alignment quality based on target experience levels.
- **Expected Fraud Probability**: Evaluates structural cheating/spam risk (e.g., < 1.4%).
- **Country & Language Proposals**: Matches task objectives to regional cognitive pools.
- **Validation Rules**: Proposes auto-rejection rules (e.g., "minimum time per task: 25 seconds").

## Risk & Confidence Scores

- **Risk Score (0–100%)**: Evaluates standard adversarial vulnerabilities (jailbreak attempts, prompt injection checks).
- **Confidence Score (0–100%)**: Based on historic compliance patterns and validation datasets.
- **Explanations**: Natural language explanations for why each setting is recommended (e.g., "High-consensus count of 5 requested due to medical domain terminology").
