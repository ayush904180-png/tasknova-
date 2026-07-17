/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Clean Class Merger Utility (Tailwind CSS helper).
 * Conditionally joins CSS class names without importing external massive libraries,
 * optimizing compilation performance.
 */
export function cn(...inputs: any[]): string {
  const classes: string[] = [];

  for (const input of inputs) {
    if (!input) continue;

    if (typeof input === 'string') {
      classes.push(input);
    } else if (Array.isArray(input)) {
      classes.push(cn(...input));
    } else if (typeof input === 'object') {
      for (const [key, value] of Object.entries(input)) {
        if (value) {
          classes.push(key);
        }
      }
    }
  }

  // Deduplicate and join classes cleanly
  return Array.from(new Set(classes.join(' ').split(/\s+/))).join(' ');
}

/**
 * Formats coin balances with appropriate commas or short forms (e.g. 1,200 or 12.5k).
 */
export function formatCoins(amount: number): string {
  if (amount >= 100000) {
    return `${(amount / 1000).toFixed(1)}k`;
  }
  return new Intl.NumberFormat('en-IN').format(amount);
}

/**
 * Converts reward coins into India Rupee (INR) and other international currencies.
 * Value multiplier: 1 Coin = ₹0.10 (INR)
 * For USA: 1 Coin = $0.0012 (USD)
 */
export function formatCurrencyValue(coins: number, countryCode: 'IN' | 'US' | 'GB' | 'CA' = 'IN'): string {
  const multipliers = {
    IN: { rate: 0.10, symbol: '₹', locale: 'en-IN', code: 'INR' },
    US: { rate: 0.0012, symbol: '$', locale: 'en-US', code: 'USD' },
    GB: { rate: 0.00095, symbol: '£', locale: 'en-GB', code: 'GBP' },
    CA: { rate: 0.0016, symbol: 'CA$', locale: 'en-CA', code: 'CAD' }
  };

  const config = multipliers[countryCode] || multipliers.IN;
  const value = coins * config.rate;

  return new Intl.NumberFormat(config.locale, {
    style: 'currency',
    currency: config.code,
    minimumFractionDigits: countryCode === 'IN' ? 2 : 4,
  }).format(value);
}

/**
 * Formats elapsed seconds into a standard digital clock stopwatch text "mm:ss".
 */
export function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

/**
 * Safely generates a unique alphanumeric micro-task ID.
 */
export function generateTaskId(prefix = 'TASK'): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let rand = '';
  for (let i = 0; i < 6; i++) {
    rand += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `${prefix}-${rand}`;
}
