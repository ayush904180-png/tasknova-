# Trust Engine Specification
Version 1.0.0 | High-Fidelity Verification Heuristics

The Trust Engine protects the integrity of the TaskNova AI database by automatically filtering out bot activity, scripted submissions, and careless "clicking-through".

## 1. Velocity Audit (Speed Traps)
Careless users often skip instructions and submit answers in a fraction of the time required to read them.
* **Heuristic**: If a task is completed in under **3 seconds** or in less than **15% of the estimated completion time**, the session is flagged as `isSpeeding`.
* **Action**: Trust score is penalized by **10 points** and accuracy rating is adjusted downward.

## 2. Repetitive Pattern Spam Detection
Scripted bots and spamming users often submit the same string over and over.
* **Heuristic**: Checks all answers for repetitive characters (e.g., mashing "aaaaa" or "asdfasdf").
* **Action**: Trust score is penalized by **25 points** and the submission is marked as invalid.

## 3. Score Adjustments
A contributor's trust score dynamically adjusts with each task:
* **Successful Consensus Alignment**: +1.5 points.
* **Speeding Flag**: -10 points.
* **Spamming Flag**: -25 points.

This ensures a highly calibrated, self-cleaning pool of reliable annotators.
