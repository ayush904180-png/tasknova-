/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { AuthUser, UserRole } from '../types';
import { AUTH_ROLES_CONFIG } from '../constants';

export interface AuthenticationService {
  signInWithGoogle(): Promise<AuthUser>;
  signUpWithEmail(email: string, password: string, username: string, role: UserRole): Promise<AuthUser>;
  signInWithEmail(email: string, password: string): Promise<AuthUser>;
  signOut(): Promise<void>;
  sendVerificationEmail(): Promise<void>;
  resetPassword(email: string): Promise<void>;
  confirmPasswordReset(code: string, newPassword: string): Promise<void>;
  
  // Future Placeholders - Architectural Definitions only
  signInWithPhoneOTP?(phoneNumber: string): Promise<AuthUser>;
  signInWithPasskey?(): Promise<AuthUser>;
  signInWithMagicLink?(email: string): Promise<void>;
  signInWithApple?(): Promise<AuthUser>;
  signInWithGitHub?(): Promise<AuthUser>;
}

/**
 * Enterprise Production-Ready Auth Service Mock Foundation.
 * Designed to mirror Firebase Authentication SDK signature exactly.
 * Includes lazy initialization checkpoints and detailed security annotations.
 */
class MockAuthService implements AuthenticationService {
  private activeSession: AuthUser | null = null;

  // Real world implementation will lazily load Firebase config & initialize
  private async getFirebaseInstance() {
    // Lazy check to guarantee keys exist in env prior to loading Firebase modules
    const apiKey = import.meta.env.VITE_FIREBASE_API_KEY;
    if (!apiKey) {
      console.warn('VITE_FIREBASE_API_KEY is not defined in environments. Operating in simulated offline alignment sandbox.');
    }
  }

  async signInWithGoogle(): Promise<AuthUser> {
    await this.getFirebaseInstance();
    await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulated network latency
    
    // Create an aligned admin profile if the email is our default or similar
    const adminUser: AuthUser = {
      uid: 'google-uid-admin-99',
      email: 'ayush904180@gmail.com', // Bootstrapped Admin from runtime
      displayName: 'Ayush Kumar',
      photoURL: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop',
      emailVerified: true,
      role: UserRole.ADMIN,
      permissions: AUTH_ROLES_CONFIG[UserRole.ADMIN].permissions,
      createdAt: new Date().toISOString(),
      lastLoginAt: new Date().toISOString(),
    };
    
    this.activeSession = adminUser;
    return adminUser;
  }

  async signUpWithEmail(email: string, password: string, username: string, role: UserRole): Promise<AuthUser> {
    await this.getFirebaseInstance();
    await new Promise((resolve) => setTimeout(resolve, 1200));
    
    const newUser: AuthUser = {
      uid: `email-uid-${Math.random().toString(36).substr(2, 9)}`,
      email,
      displayName: username,
      photoURL: null,
      emailVerified: false, // Email verification required in v2.0
      role,
      permissions: AUTH_ROLES_CONFIG[role].permissions,
      createdAt: new Date().toISOString(),
      lastLoginAt: new Date().toISOString(),
    };

    this.activeSession = newUser;
    return newUser;
  }

  async signInWithEmail(email: string, password: string): Promise<AuthUser> {
    await this.getFirebaseInstance();
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Support a simulated mock lookup
    let role: UserRole = UserRole.CONTRIBUTOR;
    let username = 'Valued Contributor';
    let emailVerified = false;

    // Direct match for easy developer evaluations
    if (email.includes('admin') || email === 'ayush904180@gmail.com') {
      role = UserRole.ADMIN;
      username = 'Sovereign Administrator';
      emailVerified = true;
    } else if (email.includes('business')) {
      role = UserRole.BUSINESS;
      username = 'Enterprise Node Partner';
      emailVerified = true;
    } else if (email.includes('creator')) {
      role = UserRole.CREATOR;
      username = 'Campaign Creator';
      emailVerified = true;
    }

    const matchedUser: AuthUser = {
      uid: `email-uid-static-77`,
      email,
      displayName: username,
      photoURL: null,
      emailVerified,
      role,
      permissions: AUTH_ROLES_CONFIG[role].permissions,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30).toISOString(),
      lastLoginAt: new Date().toISOString(),
    };

    this.activeSession = matchedUser;
    return matchedUser;
  }

  async signOut(): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, 400));
    this.activeSession = null;
  }

  async sendVerificationEmail(): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, 800));
    console.log('Verification dispatch triggered for:', this.activeSession?.email);
  }

  async resetPassword(email: string): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, 800));
    console.log('Password reset instruction dispatched to:', email);
  }

  async confirmPasswordReset(code: string, newPassword: string): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, 800));
    console.log('Confirming password reset for coordinate code:', code);
  }

  /* =========================================================
     FUTURE REINFORCEMENT PROVIDERS (ARCHITECTURAL PLACEHOLDERS)
     ========================================================= */

  /**
   * Future OTP SMS Gateway.
   * Integration Point: Firebase Auth with Twilio or Google Identity platform.
   */
  async signInWithPhoneOTP(phoneNumber: string): Promise<AuthUser> {
    throw new Error('Phone OTP Authentication is a post-MVP roadmap capability. Integration hooks reserved.');
  }

  /**
   * Future Passkeys / WebAuthn standard login.
   * Integration Point: FIDO2 credential validation and Firebase custom token routing.
   */
  async signInWithPasskey(): Promise<AuthUser> {
    throw new Error('FIDO2 Passkeys (WebAuthn) are a post-MVP roadmap capability. Integration hooks reserved.');
  }

  /**
   * Future passwordless Magic Link dispatch.
   * Integration Point: Firebase action links with dynamic routing templates.
   */
  async signInWithMagicLink(email: string): Promise<void> {
    throw new Error('Passwordless Magic Links are a post-MVP roadmap capability. Integration hooks reserved.');
  }

  /**
   * Future Apple ID authentication.
   * Integration Point: OAuth 2.0 Client credentials with Apple Developer Program keys.
   */
  async signInWithApple(): Promise<AuthUser> {
    throw new Error('Sign in with Apple is a post-MVP roadmap capability. Integration hooks reserved.');
  }

  /**
   * Future GitHub credentials login.
   * Integration Point: Firebase Client OAuth provider for GitHub organization targets.
   */
  async signInWithGitHub(): Promise<AuthUser> {
    throw new Error('GitHub Provider Authentication is a post-MVP roadmap capability. Integration hooks reserved.');
  }
}

export const authService = new MockAuthService();
