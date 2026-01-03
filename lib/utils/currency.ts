/**
 * @file lib/utils/currency.ts
 * @description Centralized currency formatting helpers for USD, AED, and INR.
 */

export type SupportedCurrency = 'USD' | 'AED' | 'INR';

const CURRENCY_LOCALES: Record<SupportedCurrency, string> = {
  USD: 'en-US',
  AED: 'en-AE',
  INR: 'en-IN',
};

const FORMATTER_CACHE = new Map<string, Intl.NumberFormat>();

const CRORE_VALUE = 10_000_000;
const LAKH_VALUE = 100_000;
const MILLION_VALUE = 1_000_000;

interface FormatCurrencyOptions {
  currency?: SupportedCurrency;
  notation?: Intl.NumberFormatOptions['notation'];
  maximumFractionDigits?: number;
  minimumFractionDigits?: number;
}

function getFormatter({
  currency,
  notation,
  maximumFractionDigits,
  minimumFractionDigits,
}: Required<FormatCurrencyOptions>) {
  const locale = CURRENCY_LOCALES[currency];
  const cacheKey = `${locale}-${currency}-${notation}-${maximumFractionDigits}-${minimumFractionDigits}`;
  const cached = FORMATTER_CACHE.get(cacheKey);
  if (cached) return cached;

  const formatter = new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    notation,
    compactDisplay: notation === 'compact' ? 'short' : undefined,
    maximumFractionDigits,
    minimumFractionDigits,
  });
  FORMATTER_CACHE.set(cacheKey, formatter);
  return formatter;
}

export function formatCurrencyAmount(
  amount: number,
  {
    currency = 'USD',
    notation = 'compact',
    maximumFractionDigits = 1,
    minimumFractionDigits = 0,
  }: FormatCurrencyOptions = {}
): string {
  const formatter = getFormatter({
    currency,
    notation,
    maximumFractionDigits,
    minimumFractionDigits,
  });
  return formatter.format(amount);
}

export function formatMillionsAsUSD(millions: number): string {
  return formatCurrencyAmount(millions * MILLION_VALUE, { currency: 'USD' });
}

export function formatAEDAmount(aed: number): string {
  return formatCurrencyAmount(aed, { currency: 'AED' });
}

export function formatINRAmount(inr: number): string {
  return formatCurrencyAmount(inr, { currency: 'INR' });
}

export function formatCroreAmount(
  crore: number,
  currency: SupportedCurrency = 'USD'
): string {
  return formatCurrencyAmount(crore * CRORE_VALUE, { currency });
}

export function formatLakhAmount(
  lakh: number,
  currency: SupportedCurrency = 'USD'
): string {
  return formatCurrencyAmount(lakh * LAKH_VALUE, { currency });
}

export function formatLakhCroreAmount(
  lakhCrore: number,
  currency: SupportedCurrency = 'USD'
): string {
  return formatCroreAmount(lakhCrore * 100_000, currency);
}

/**
 * Legacy wrappers for backward compatibility.
 * @deprecated Prefer formatCroreAmount or formatCurrencyAmount.
 */
export function formatCroreToUSD(crore: number): string {
  return formatCroreAmount(crore, 'USD');
}

/**
 * Legacy wrapper for INR.
 * @deprecated Prefer formatINRAmount.
 */
export function formatINRToUSD(inr: number): string {
  return formatINRAmount(inr);
}

/**
 * Legacy wrapper for AED.
 * @deprecated Prefer formatAEDAmount.
 */
export function formatAEDToUSD(aed: number): string {
  return formatAEDAmount(aed);
}

export interface DisplayAmount {
  currencySymbol: string;
  value: number;
  unit: string;
}

function getUnitPrecision(unit: string): number {
  if (!unit) return 2;
  if (unit.includes('Million') || unit.includes('Billion')) return 1;
  if (unit.includes('Cr')) return 2;
  return 2;
}

export function parseDisplayAmount(display: string): DisplayAmount | null {
  const trimmed = display.trim();
  const currencySymbol = trimmed.startsWith('₹') || trimmed.startsWith('$') ? trimmed[0] : '';
  const withoutSymbol = currencySymbol ? trimmed.slice(1).trim() : trimmed;
  const match = withoutSymbol.match(/([\d,.]+)\s*([A-Za-z\s]+)?/);

  if (!match) return null;

  const value = Number(match[1].replace(/,/g, ''));
  if (Number.isNaN(value)) return null;

  return {
    currencySymbol,
    value,
    unit: (match[2] || '').trim(),
  };
}

export function formatDisplayAmount(
  value: number,
  currencySymbol: string,
  unit: string,
  precision?: number,
): string {
  const decimals = precision ?? getUnitPrecision(unit);
  const formatted = value
    .toFixed(decimals)
    .replace(/\.0+$/, '')
    .replace(/(\.\d*[1-9])0+$/, '$1');

  return `${currencySymbol}${formatted}${unit ? ` ${unit}` : ''}`;
}

export function buildDisplayChange(display: string, percentChange: number) {
  const parsed = parseDisplayAmount(display);
  const direction = percentChange >= 0 ? 'up' : 'down';
  const percentAbs = Math.abs(percentChange);

  if (!parsed) {
    return {
      direction,
      percentAbs,
      formattedChange: `${percentAbs.toFixed(1)}%`,
    };
  }

  const changeValue = Math.abs((parsed.value * percentChange) / 100);
  const formattedChange = formatDisplayAmount(
    changeValue,
    parsed.currencySymbol,
    parsed.unit,
  );

  return {
    direction,
    percentAbs,
    formattedChange,
  };
}
