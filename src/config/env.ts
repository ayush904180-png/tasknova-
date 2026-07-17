/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Validated client-side environment configurations for TaskNova AI.
 * Handles graceful fallbacks when environment variables are not yet populated.
 */
export const ENV = {
  /**
   * The core hosted application URL, injected by AI Studio.
   */
  APP_URL: import.meta.env.VITE_APP_URL || 'https://tasknova.ai',

  /**
   * Node execution mode flag.
   */
  MODE: import.meta.env.MODE || 'development',

  /**
   * Verification flag indicating if the environment is active development.
   */
  IS_DEV: import.meta.env.DEV || true,

  /**
   * Currency representation.
   */
  COIN_VALUE_INR: 0.1, // 1 TaskNova Coin = ₹0.10 (Standard reward model)
};
