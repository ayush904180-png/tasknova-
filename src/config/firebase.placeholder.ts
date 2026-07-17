/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * TaskNova AI Firebase Core Configuration Placeholder.
 * 
 * DESIGN PRINCIPLE:
 * Adheres strictly to lazy-initialization safety rules to ensure that if the API keys
 * are not yet provisioned, the application does not crash on startup. Instead, it fallback
 * gracefully and logs helpful setup instructions.
 */

export interface FirebaseConfigSchema {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
}

// Read from system variables (typically injected server-side or via build environment)
const firebaseConfig: Partial<FirebaseConfigSchema> = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

let firebaseAppInstance: any = null;
let firestoreDbInstance: any = null;
let firebaseAuthInstance: any = null;

/**
 * Verifies if all necessary Firebase credentials exist in the environment.
 */
export function hasFirebaseCredentials(): boolean {
  return !!(
    firebaseConfig.apiKey &&
    firebaseConfig.projectId &&
    firebaseConfig.appId
  );
}

/**
 * Lazy-initializer for the Firebase Application instance.
 * Ensures the app does not freeze on client-side loading.
 */
export function getFirebaseApp() {
  if (!hasFirebaseCredentials()) {
    console.warn(
      'TaskNova AI: Firebase environment variables are missing in .env. Let-us run mock local services for preview.'
    );
    return null;
  }

  if (!firebaseAppInstance) {
    try {
      // In production, you would do:
      // import { initializeApp } from 'firebase/app';
      // firebaseAppInstance = initializeApp(firebaseConfig);
      firebaseAppInstance = { name: '[TaskNova Firebase Placeholder]', config: firebaseConfig };
    } catch (error) {
      console.error('Failed to initialize Firebase SDK:', error);
    }
  }
  return firebaseAppInstance;
}

/**
 * Lazy-initializer for Cloud Firestore Database.
 */
export function getFirestore() {
  const app = getFirebaseApp();
  if (!app) return null;

  if (!firestoreDbInstance) {
    // In production:
    // import { getFirestore } from 'firebase/firestore';
    // firestoreDbInstance = getFirestore(app);
    firestoreDbInstance = { type: 'FirestorePlaceholder' };
  }
  return firestoreDbInstance;
}

/**
 * Lazy-initializer for Firebase Authentication.
 */
export function getFirebaseAuth() {
  const app = getFirebaseApp();
  if (!app) return null;

  if (!firebaseAuthInstance) {
    // In production:
    // import { getAuth } from 'firebase/auth';
    // firebaseAuthInstance = getAuth(app);
    firebaseAuthInstance = { type: 'AuthPlaceholder' };
  }
  return firebaseAuthInstance;
}

/**
 * Document Schemas reference map for future Firestore structures.
 * Keeping our collection structures SOLID and well-documented.
 */
export const FIRESTORE_COLLECTIONS = {
  USERS: 'users',             // User profile info, total reward coin states
  TASKS: 'tasks',             // Global available AI tasks (RLHF prompts, image rating)
  SUBMISSIONS: 'submissions', // Worker submissions, response payloads, duration logs
  TRANSACTIONS: 'transactions' // Coin audit logs (credits/debits)
} as const;
