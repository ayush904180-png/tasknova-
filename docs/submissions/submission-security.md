# Submission Security

The Submission Engine implements multi-layered client-side validation, anti-spam heuristics, tamper prevention, and replay-attack defenses.

## 1. Cryptographic Signatures

To ensure that answer payloads are not intercepted or edited in-transit (such as users artificially augmenting their reward balances), a unique, lightweight **integrity signature** is computed on the client.

```typescript
// Computes a fast, durable polynomial hash of answers to detect tampering
const hash = SubmissionValidator.computeChecksum(submission);
```

If any portion of the JSON payload changes without regenerating the signature, the `SubmissionValidator` flags the anomaly, halts database commits, and triggers alerts.

## 2. Speed Traps & Velocity Metrics

To discourage "spam clickers" or low-quality automated scripts, the engine tracks focused completion duration:

- **Velocity Thresholds**: If actual elapsed duration is less than **3 seconds** or less than **15%** of the task's design estimate, the submission is automatically flagged as spam.
- **Speed Index**: Computed as a ratio of focused seconds vs. expected SLA targets.

## 3. Repetitive Input Pattern Mashing

The validator incorporates advanced heuristic analyses to check text answers for pattern mashing:

- **Key-Mashing (Direct Repetition)**: Detects runs of the same character (e.g. `aaaaa`).
- **Sequenced Swipes**: Identifies standard keyboard progressions (e.g. `asdfasdf`, `qwerqwer`, `12341234`).
- **Entropy Scopes**: Flags repetitive phrases and low-vocabulary answers.
