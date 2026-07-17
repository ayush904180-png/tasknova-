/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { OnboardingState } from '../types';
import { INITIAL_ONBOARDING_STATE } from '../constants';

/**
 * Onboarding Storage Mock Engine.
 * Implements a clean abstract repository pattern for persisting and restoring
 * user onboarding progress. This acts as the pre-integration layer for Firestore.
 */
class OnboardingStorageMock {
  private STORAGE_KEY = 'tasknova_onboarding_session';

  /**
   * Loads onboarding state from localized persistent memory.
   */
  loadOnboardingState(): OnboardingState {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored) as OnboardingState;
      }
    } catch (e) {
      console.error('[OnboardingMock] Failed to restore progress session:', e);
    }
    return { ...INITIAL_ONBOARDING_STATE };
  }

  /**
   * Persists onboarding progress to localized memory.
   * Demonstrates the exact payload structure designed for a future Firestore update.
   */
  saveOnboardingState(state: OnboardingState): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(state));
      console.log('[OnboardingMock] Auto-save synchronized:', state);
    } catch (e) {
      console.error('[OnboardingMock] Failed to synchronize auto-save:', e);
    }
  }

  /**
   * Purges localized onboarding records.
   */
  clearOnboardingState(): void {
    try {
      localStorage.removeItem(this.STORAGE_KEY);
    } catch (e) {
      console.error('[OnboardingMock] Failed to purge session:', e);
    }
  }

  /**
   * Blueprint detailing the future production Firestore implementation.
   */
  getFirestoreBlueprint(userId: string, state: OnboardingState) {
    return {
      collection: 'users',
      documentId: userId,
      payload: {
        role: state.role,
        hasCompletedOnboarding: state.isCompleted,
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
        terms: {
          acceptedAt: new Date().toISOString(),
          tos: state.termsAccepted.tos,
          privacy: state.termsAccepted.privacy,
          community: state.termsAccepted.community,
          dataUsage: state.termsAccepted.dataUsage,
        },
        interests: state.selectedInterests,
        notificationPreferences: {
          email: state.notifications.email,
          taskAlerts: state.notifications.taskAlerts,
          rewardUpdates: state.notifications.rewardUpdates,
          productNews: state.notifications.productNews,
          securityAlerts: state.notifications.securityAlerts,
          updatedAt: new Date().toISOString(),
        }
      }
    };
  }
}

export const onboardingStorageMock = new OnboardingStorageMock();
