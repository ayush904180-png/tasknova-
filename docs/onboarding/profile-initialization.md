# Profile Initialization Schemas

Profiles are structured as clean, self-contained data objects to ease transitions to dynamic servers.

## Profile Type Definition

```typescript
export interface OnboardingProfile {
  displayName: string;
  username: string;
  country: string;
  language: string;
  timezone: string;
  photoURL: string | null;
}
```

## Form Fields & Valids

1. **Display Name**: Required string, minimum length of 3 characters.
2. **Username**: Lowercase, spaces stripped, alphanumeric and underscores only. Must be unique upon dynamic validation.
3. **Country**: Standard country code selection mapping.
4. **Language**: Locale ISO specification.
5. **Timezone**: Geographical timezone coordinate.

## Avatar Gradient Synthesis

Instead of heavy file uploads during onboarding, users can cycle through elegant gradient codes:
- `gradient:from-indigo-500 to-purple-500`
- `gradient:from-pink-500 to-rose-500`
- `gradient:from-emerald-400 to-teal-600`
- `gradient:from-blue-500 to-indigo-600`
- `gradient:from-amber-400 to-orange-500`

These are saved as string references to be rendered dynamically in any downstream client widget.
