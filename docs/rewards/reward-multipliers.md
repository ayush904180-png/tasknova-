# Reward Multiplier Engine

The Multiplier Engine calculates overlapping scaling variables to adjust the Base Reward before finalizing coin transactions.

## Implemented Multipliers

1. **Difficulty Multiplier**
   - Easy: 1.0x
   - Medium: 1.5x
   - Hard: 2.2x

2. **Reputation Trust Multiplier**
   - High Trust (Score >= 85): 1.25x
   - Medium Trust (Score 40-84): 1.0x
   - Low Trust (Score < 40): 0.8x

3. **Quality Score Modifier**
   - Perfect Accuracy (Score >= 98): 1.3x
   - Outstanding Quality (Score 90-97): 1.15x
   - Standard Quality: 1.0x

4. **Context & Campaign Modifiers**
   - Weekend Rate: 1.1x
   - Festival Bonus: 1.25x
   - Peak Hour Bonus: 1.15x
   - First Task Bonus: 2.0x
   - Streak Bonus (Daily: 1.05x | Weekly: 1.15x | Monthly: 1.30x)
   - AI Quality Performance Bonus: 1.05x
