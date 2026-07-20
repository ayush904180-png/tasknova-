/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Formats duration seconds into readable visual spans (e.g. 90s -> 1m 30s or 1.5 min).
 */
export function formatDuration(seconds: number): string {
  if (seconds < 60) return `${seconds}s`;
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return secs > 0 ? `${mins}m ${secs}s` : `${mins}m`;
}

/**
 * Formats countdown seconds (e.g. 1799 -> 29:59).
 */
export function formatCountdown(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

/**
 * Formats trust scores with high-precision suffixes.
 */
export function formatTrustScore(score: number): string {
  return `${score}% Score`;
}

/**
 * Map country codes to visual country emoji or text.
 */
export function getCountryFlagAndName(countryCode: string): { flag: string; name: string } {
  const code = countryCode.toUpperCase();
  const countries: Record<string, { flag: string; name: string }> = {
    US: { flag: '🇺🇸', name: 'United States' },
    ES: { flag: '🇪🇸', name: 'Spain' },
    IN: { flag: '🇮🇳', name: 'India' },
    GB: { flag: '🇬🇧', name: 'United Kingdom' },
    ALL: { flag: '🌐', name: 'Global Access' }
  };
  return countries[code] || { flag: '🌐', name: countryCode };
}

/**
 * Map language ISO codes to human-readable names.
 */
export function getLanguageName(isoCode: string): string {
  const code = isoCode.split('-')[0].toLowerCase();
  const languages: Record<string, string> = {
    en: 'English',
    es: 'Spanish',
    hi: 'Hindi',
    all: 'Global Language'
  };
  return languages[code] || isoCode;
}
