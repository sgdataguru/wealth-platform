/**
 * @file lib/utils/currency.ts
 * @description Helpers to format USD values into display strings (Million / Billion)
 */

/**
 * Convert millions to billions where appropriate
 */
export function millionsToBillions(millions: number): number {
  return millions / 1000;
}

/**
 * Convert absolute USD amount to millions
 */
export function usdToMillions(usd: number): number {
  return usd / 1_000_000;
}

/**
 * Format a value expressed in millions into a human-friendly USD string.
 * - <1000 -> "$X Million"
 * - >=1000 -> "$Y.Billion"
 */
export function formatMillionsAsUSD(millions: number): string {
  if (millions >= 1000) {
    const billions = (millions / 1000);
    // show one decimal for readability
    return `$${billions % 1 === 0 ? billions.toFixed(0) : billions.toFixed(1)} Billion`;
  }
  return `$${millions % 1 === 0 ? millions.toFixed(0) : millions.toFixed(1)} Million`;
}

/**
 * Convenience: format an absolute USD amount directly to USD display.
 * @param usd - Amount in USD
 */
export function formatUSDFromAbsolute(usd: number): string {
  return formatMillionsAsUSD(usdToMillions(usd));
}

/**
 * Legacy function for backward compatibility
 * @deprecated Use formatUSDFromAbsolute or formatMillionsAsUSD instead
 */
export function formatCroreToUSD(crore: number): string {
  // Convert legacy unit to millions for display (10 million)
  return formatMillionsAsUSD(crore * 10);
}
