# Profile Calibration Completeness Engine

This documentation explains how the completeness calculations are computed on the client on each change cycle.

## Overview

The Completeness Engine dynamically scores a user's configuration parameters out of 100, providing responsive checklist recommendations for missing parameters.

## Formula & Evaluated Fields

Calculations are evaluated in `/src/profile/utils/index.ts`. Every field listed below corresponds to a boolean calibration trigger:

| Field Checked | Target Section | Score Weight |
|---|---|---|
| Display Name | Identity | 11.1% |
| Username | Identity | 11.1% |
| Avatar Gradient | Identity | 11.1% |
| Bio description | Identity | 11.1% |
| Country location | Preferences | 11.1% |
| Preferred Language | Preferences | 11.1% |
| Timezone | Preferences | 11.1% |
| Two-Factor Enabled | Security | 11.1% |
| Public Profile Toggle | Privacy | 11.1% |

## Recommendation Rules

- **Low Security**: If Two-Factor Authentication is disabled, propose: *"Enable 2FA to secure your earned TaskNova coins."*
- **Short Bio**: If Bio is empty or fewer than 15 characters, propose: *"Write an informative bio to build reputation inside Creator networks."*
- **Low Badge Stack**: If user has fewer than 3 active credentials, propose: *"Complete tasks with >95% accuracy to earn high-tier alignment badges."*
