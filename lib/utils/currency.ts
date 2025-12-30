/**
 * @file lib/utils/currency.ts
 * @description Helpers to convert INR / Crore values to USD display strings (Million / Billion)
 */

/**
 * Convert Crores (1 Cr = 10 million) to millions (number)
 */
export function croreToMillions(crore: number): number {
  return crore * 10; // 1 Cr = 10 million
}

/**
 * Convert absolute INR amount (rupees) to millions
 */
export function inrToMillions(inr: number): number {
  return inr / 1_000_000;
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
 * Convenience: format a Crore number directly to USD display.
 */
export function formatCroreToUSD(crore: number): string {
  return formatMillionsAsUSD(croreToMillions(crore));
}

/**
 * Convenience: format an INR amount directly to USD display.
 */
export function formatINRToUSD(inr: number): string {
  return formatMillionsAsUSD(inrToMillions(inr));
}
