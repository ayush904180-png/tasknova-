# Security Audit Center Architecture

This document describes the security scoring algorithms and verification components designed to safeguard developer assets.

## Security Health Scoring

A user's security score (from 0 to 100) is evaluated inside `ProfileAdapter.ts` to reward preventative lock configurations:

- **Base Score**: 50 points.
- **Two-Factor Auth Enabled**: +25 points.
- **Display Name Configured**: +15 points.
- **Bio Configured**: +10 points.

## Multi-Factor & Authentication Modes

- **Two-Factor Authentication**: Active switch toggles state. Updates dynamic score metrics instantly.
- **FIDO2 Passkeys**: Planned biometric hardware authentication. Placeholder controls are declared for easy implementation.
- **Magic Links**: Sandbox magic link email overrides for passwordless onboarding.

## Active Sessions and Trusted Hardware

We track structured `SessionAudit` arrays to identify unusual activity:
- `device`: User agent analysis.
- `ip`: Request socket IP address.
- `location`: GeoIP lookup location.
- `timestamp`: Creation date.
