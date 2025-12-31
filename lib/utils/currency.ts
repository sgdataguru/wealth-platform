/**
 * @file lib/utils/currency.ts
 * @description Helpers to convert AED / Middle East currency values to USD display strings (Million / Billion)
 */

/**
 * Convert millions to billions where appropriate
 */
export function millionsToBillions(millions: number): number {
  return millions / 1000;
}

/**
 * Convert absolute AED amount (dirhams) to millions
 * Using approximate exchange rate: 1 USD = 3.67 AED
 */
export function aedToMillions(aed: number): number {
  const usd = aed / 3.67;
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
 * Convenience: format an AED amount directly to USD display.
 * @param aed - Amount in AED (dirhams)
 */
export function formatAEDToUSD(aed: number): string {
  return formatMillionsAsUSD(aedToMillions(aed));
}

/**
 * Legacy function for backward compatibility
 * @deprecated Use formatAEDToUSD or formatMillionsAsUSD instead
 */
export function formatCroreToUSD(crore: number): string {
  // Convert crore to millions for display (1 Cr = 10 million)
  return formatMillionsAsUSD(crore * 10);
}

/**
 * Legacy function for backward compatibility
 * @deprecated Use formatAEDToUSD instead
 */
export function formatINRToUSD(inr: number): string {
  // Assume INR input, convert to millions
  return formatMillionsAsUSD(inr / 1_000_000);
}
