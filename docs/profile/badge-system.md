# Cryptographic Badge Matrix

TaskNova uses a priority-sorted badge stacking system to showcase verified credentials, community standing, and contribution accuracy thresholds.

## Badge Fields

Every badge is strongly typed:
- `id`: Unique key.
- `label`: UI title.
- `description`: Detailed explanation.
- `icon`: Lucide icon name.
- `priority`: Priority stacking rank (higher stacks first).
- `color`: CSS color values.
- `category`: Category groupings (`system`, `contribution`, `community`, `event`).

## Predefined System Badges

| ID | Label | Priority | Purpose |
|---|---|---|---|
| `badge_verified` | Verified Node | 10 | Identity checked and audited. |
| `badge_top_contributor` | Top Contributor | 9 | Sustained accuracy rate above 98%. |
| `badge_early_member` | Early Member | 8 | Joined during the initial genesis phase. |
| `badge_beta_tester` | Beta Tester | 7 | Validated sandbox builds. |
| `badge_trusted` | Trusted Validator | 6 | High peer-review alignment standing. |
| `badge_community_helper` | Community Guide | 5 | Guided onboarding steps. |

## Priority Stacking Rules

Badges are sorted dynamically using the helper function `getSortedBadgesForProfile`:
```typescript
export function getSortedBadgesForProfile(badgeIds: string[]): Badge[] {
  return SYSTEM_BADGES.filter((b) => badgeIds.includes(b.id)).sort((a, b) => b.priority - a.priority);
}
```
This guarantees that critical, high-reputation credentials (such as verification checks) are displayed in visual priority, even when space is constrained.
