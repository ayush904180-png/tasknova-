# Future Cloud Firestore Migration Plan

The TaskNova profile architecture is designed around a strict data abstraction pattern. Moving from local memory mocks to Google Cloud Firestore requires updating only the service and repository modules.

## Structural Comparison

| Local Path | Future Firestore Implementation |
|---|---|
| `mocks/index.ts` | Replaced by direct Firebase SDK `doc()` and `getDoc()` queries. |
| `repositories/index.ts` | Modified to fetch/store JSON documents inside the `profiles` collection. |
| `mappers/index.ts` | Maps flat Firestore objects into domain-ready models. |

## Proposed Firestore Schema (`/profiles/{uid}`)

```json
{
  "uid": "genesis_user_node_99",
  "display_name": "Captain Nova",
  "username": "captain_nova",
  "photo_url": "gradient:from-indigo-500 to-purple-500",
  "banner_url": "gradient:from-slate-900 via-indigo-950 to-slate-900",
  "bio": "veteran specialty node...",
  "country": "US",
  "language": "en",
  "timezone": "UTC",
  "member_since": "2026-01-15T00:00:00.000Z",
  "role": "contributor",
  "status": "active",
  "verification_status": "verified",
  "badges": ["badge_verified", "badge_early_member"],
  "is_public_profile_enabled": true
}
```

## Migration Code Snippet (`/src/profile/repositories/index.ts`)

To deploy Firebase, simply update the repository read operation:

```typescript
import { getFirestore, doc, getDoc, setDoc } from 'firebase/firestore';
import { ProfileMapper } from '../mappers';

export class ProfileRepository {
  static async getProfileFromCloud(uid: string): Promise<UserProfile> {
    const db = getFirestore();
    const docRef = doc(db, 'profiles', uid);
    const snap = await getDoc(docRef);
    
    if (snap.exists()) {
      return ProfileMapper.toDomain(snap.data());
    }
    throw new Error('Node profile not initialized.');
  }
}
```

Because UI components only access profile fields via the `useProfile` hook, **no frontend component files will require editing** when migrating to Cloud Firestore.
