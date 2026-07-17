# Firebase Authentication Configuration Guide

This blueprint details the steps to transition the **TaskNova AI Authentication Architecture Foundation** to a live, production-grade Firebase Authentication backend.

## 1. Environment Variable Registrations

To initialize the Firebase Authentication SDK, ensure the following keys are populated inside your active environment file (`.env`):

```env
# .env.example
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
```

---

## 2. Firebase Client SDK Integration

Inside `/src/auth/services/authService.ts`, you can transition the mock getters to the standard Google Firebase SDK hooks:

```typescript
import { initializeApp } from "firebase/app";
import { 
  getAuth, 
  signInWithPopup, 
  GoogleAuthProvider, 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut
} from "firebase/auth";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

// Lazy initialization pattern to prevent crashes during initialization phases
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
```

---

## 3. Custom Claims Role Provisioning

By default, Firebase Auth does not include a role field. To implement custom claims, use a Cloud Function triggered upon user creation or manage it through Firestore document observers:

```typescript
// Cloud Function for Custom Claims
exports.onUserCreated = functions.auth.user().onCreate(async (user) => {
  const customClaims = {
    role: "contributor" // Default role assignment
  };
  
  await admin.auth().setCustomUserClaims(user.uid, customClaims);
});
```
