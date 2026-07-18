/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type ProfileAnalyticsEvent =
  | { type: 'PROFILE_VIEWED'; payload: { uid: string; source: string } }
  | { type: 'PROFILE_UPDATED'; payload: { uid: string; fieldsChanged: string[] } }
  | { type: 'AVATAR_CHANGED'; payload: { uid: string; style: string } }
  | { type: 'BADGE_EARNED'; payload: { uid: string; badgeId: string; label: string } }
  | { type: 'LANGUAGE_CHANGED'; payload: { uid: string; previous: string; next: string } }
  | { type: 'SECURITY_SETTINGS_OPENED'; payload: { uid: string; screen: string } };

class ProfileAnalyticsTracker {
  /**
   * Tracks an event to a console telemetry logger or external listener.
   * Isolates production analytic hooks.
   */
  track(event: ProfileAnalyticsEvent): void {
    console.log(`[Telemetry Event] ${event.type}`, event.payload);
    
    // Future expansion point:
    // if (window.gtag) { window.gtag('event', event.type, event.payload); }
  }
}

export const profileAnalytics = new ProfileAnalyticsTracker();
