/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { UserProfile } from '../types';
import { profileStorageMock } from '../mocks';
import { ProfileMapper } from '../mappers';

/**
 * ProfileRepository encapsulates the data access layer.
 * Any UI component or service requesting user profile data queries this repository,
 * ensuring complete separation of concerns.
 */
export class ProfileRepository {
  /**
   * Retrieves the current user profile.
   * Isolates the database loader so that replacing this with real Firestore queries
   * will immediately propagate to the entire application.
   */
  static getProfile(uid: string): UserProfile {
    console.log(`[ProfileRepository] Loading profile data for UID: ${uid}`);
    const raw = profileStorageMock.loadProfile();
    return ProfileMapper.toDomain(raw);
  }

  /**
   * Saves the user profile.
   * Serializes the domain object back to raw persistent format.
   */
  static saveProfile(profile: UserProfile): void {
    console.log(`[ProfileRepository] Persisting updated profile for UID: ${profile.uid}`);
    const persistedFormat = ProfileMapper.toPersistence(profile);
    profileStorageMock.saveProfile(persistedFormat);
  }

  /**
   * Resets profile back to factory default snapshot.
   */
  static resetToDefault(): UserProfile {
    profileStorageMock.resetProfile();
    return ProfileMapper.toDomain(profileStorageMock.loadProfile());
  }
}
