# Future Firestore Integration Path

When transitioning from the onboarding sandbox to a live Google Cloud Firestore deployment, this document governs the synchronization handshake.

## Storage Strategy

Upon Onboarding Completion, state is stored under the `users` collection:

```typescript
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../config/firebase';

export async function finalizeUserOnboarding(userId: string, state: OnboardingState) {
  const userRef = doc(db, 'users', userId);
  
  await setDoc(userRef, {
    role: state.role,
    hasCompletedOnboarding: true,
    onboardingStep: state.currentStep,
    profile: {
      displayName: state.profile.displayName,
      username: state.profile.username,
      country: state.profile.country,
      language: state.profile.language,
      timezone: state.profile.timezone,
      photoURL: state.profile.photoURL,
      updatedAt: new Date().toISOString(),
    },
    interests: state.selectedInterests,
    notificationPreferences: state.notifications,
  }, { merge: true });
}
```

## Security Rules

Ensure your `firestore.rules` protect these fields from unauthorized alterations:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read: if request.auth != null && request.auth.uid == userId;
      allow write: if request.auth != null && request.auth.uid == userId 
                    && !request.resource.data.diff(resource.data).affectedKeys().hasAny(['role']) 
                    || (resource == null); // Restrict role modifications once set
    }
  }
}
```

## Multi-Device Sessions

For multi-device synchronization:
- On load, query `/users/{userId}` to verify if `hasCompletedOnboarding == true`.
- If true, bypass onboarding shell entirely.
- If incomplete, restore `onboardingStep` to allow users to resume where they left off.
