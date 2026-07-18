# Profile Feature Flag Subsystem

This document outlines the feature flags used to configure profile sections on staging and production environments.

## Available Profile Flags

The feature flag states are managed in `/src/profile/featureFlags/index.ts`:

- `enablePublicProfile`: Toggles the entire Public Portal tab.
- `enableBadges`: Controls badge accumulation and verification stacking.
- `enableStatistics`: Activates metric tracking cards.
- `enableSecurityCenter`: Deploys active session audits and 2FA toggles.
- `enablePortfolio`: Mounts portfolio showcases.
- `enableReputation`: Tracks reputation progression ranks.

## Staging Usage Pattern

Inside UI code, features are guarded using `featureFlagManager`:

```typescript
import { featureFlagManager } from '../featureFlags';

if (featureFlagManager.isFeatureEnabled('enableBadges')) {
  // Render badge system
}
```

This ensures modules can be safely turned off dynamically without code changes, preventing exposure of unvetted features in public branches.
