/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { UserProfile } from '../types';
import { DEFAULT_MOCK_PROFILE } from '../constants';

class ProfileStorageMock {
  private STORAGE_KEY = 'tasknova_profile_snapshot';

  /**
   * Loads profile state from localized mock memory.
   */
  loadProfile(): UserProfile {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored) as UserProfile;
      }
    } catch (e) {
      console.error('[ProfileMock] Failed to load local profile session:', e);
    }
    return { ...DEFAULT_MOCK_PROFILE };
  }

  /**
   * Syncs active profile configurations.
   */
  saveProfile(profile: UserProfile): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(profile));
      console.log('[ProfileMock] Local snapshot updated:', profile);
    } catch (e) {
      console.error('[ProfileMock] Failed to write local profile snapshot:', e);
    }
  }

  /**
   * Resets active profile state.
   */
  resetProfile(): void {
    try {
      localStorage.removeItem(this.STORAGE_KEY);
    } catch (e) {
      console.error('[ProfileMock] Failed to purge storage session:', e);
    }
  }
}

export const profileStorageMock = new ProfileStorageMock();
