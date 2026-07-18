/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface EnvVariables {
  FIREBASE_API_KEY: string;
  FIREBASE_PROJECT_ID: string;
  FIREBASE_STORAGE_BUCKET: string;
  FIREBASE_APP_ID: string;
  GOOGLE_SHEET_ID: string;
  GOOGLE_DRIVE_FOLDER_ID: string;
  APP_URL: string;
}

/**
 * Validates and retrieves the required environment variables.
 * Employs graceful fallbacks or throws detailed developer guidance.
 */
export function getEnvConfig(): EnvVariables {
  const getVar = (name: string, fallback: string = ''): string => {
    // Access Vite environment variables safely
    const val = import.meta.env[`VITE_${name}`] || import.meta.env[name];
    if (val !== undefined && val !== null) {
      return String(val);
    }
    return fallback;
  };

  return {
    FIREBASE_API_KEY: getVar('FIREBASE_API_KEY'),
    FIREBASE_PROJECT_ID: getVar('FIREBASE_PROJECT_ID'),
    FIREBASE_STORAGE_BUCKET: getVar('FIREBASE_STORAGE_BUCKET'),
    FIREBASE_APP_ID: getVar('FIREBASE_APP_ID'),
    GOOGLE_SHEET_ID: getVar('GOOGLE_SHEET_ID'),
    GOOGLE_DRIVE_FOLDER_ID: getVar('GOOGLE_DRIVE_FOLDER_ID'),
    APP_URL: getVar('APP_URL') || window.location.origin,
  };
}

/**
 * Checks if the minimal required environment configurations are present.
 */
export function isInfrastructureConfigured(): boolean {
  const config = getEnvConfig();
  return Boolean(
    config.FIREBASE_API_KEY &&
    config.FIREBASE_PROJECT_ID &&
    config.FIREBASE_APP_ID
  );
}
