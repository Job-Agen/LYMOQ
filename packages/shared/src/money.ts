/**
 * Money strategy
 * --------------
 * Every amount is an integer expressed in the currency's MINOR units.
 * XOF (FCFA) has no minor unit (ISO 4217 exponent 0), so 15000 means
 * 15,000 FCFA. Floating point is never used to store or compute money.
 * The only non-integer value is the illustrative FX estimate, which is
 * display-only and never persisted.
 */

export const SUPPORTED_CURRENCIES = ['XOF'] as const;
export type Currency = (typeof SUPPORTED_CURRENCIES)[number];
export const DEFAULT_CURRENCY: Currency = 'XOF';

const CURRENCY_LABEL: Record<Currency, string> = { XOF: 'FCFA' };

/** Groups thousands the French way, with non-breaking spaces: 15000 → "15 000". */
export function formatNumber(value: number): string {
  return Math.trunc(value)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, '\u00A0');
}

/** Formats an integer amount: 15000 → "15 000 FCFA". */
export function formatMoney(amount: number, currency: Currency = DEFAULT_CURRENCY): string {
  return `${formatNumber(amount)}\u00A0${CURRENCY_LABEL[currency]}`;
}

/**
 * Illustrative only: 1 USD ≈ 565 FCFA. Used to show "≈ 26,55 $" hints in the UI.
 * It is not a quote and is never used for any settlement or limit logic.
 */
export const ILLUSTRATIVE_XOF_PER_USD = 565;

export function formatIllustrativeUsd(amountXof: number): string {
  const cents = Math.round((amountXof * 100) / ILLUSTRATIVE_XOF_PER_USD);
  return `≈ ${(cents / 100).toFixed(2).replace('.', ',')}\u00A0$`;
}
