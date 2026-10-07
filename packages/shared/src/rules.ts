/** Selectable presets for the card creation flow (input options, not business logic). */

export const MIN_CARD_AMOUNT = 500;
export const MAX_CARD_AMOUNT = 1_000_000;

export const MIN_DURATION_MINUTES = 5;
export const MAX_DURATION_MINUTES = 30 * 24 * 60;

export const MAX_TRANSACTION_COUNT = 100;

export const AMOUNT_PRESETS = [5_000, 10_000, 15_000, 25_000, 50_000, 100_000] as const;

export interface UsagePreset {
  label: string;
  description: string;
  /** null = unlimited payments until the card expires */
  maxTransactionCount: number | null;
}

export const USAGE_PRESETS: readonly UsagePreset[] = [
  { label: '1 payment', description: 'The card closes after 1 payment.', maxTransactionCount: 1 },
  { label: '5 payments', description: 'The card can be used up to 5 times.', maxTransactionCount: 5 },
  {
    label: 'Until expiration',
    description: 'Use it multiple times until the card expires.',
    maxTransactionCount: null,
  },
];

export interface DurationPreset {
  label: string;
  minutes: number;
}

export const DURATION_PRESETS: readonly DurationPreset[] = [
  { label: '30 minutes', minutes: 30 },
  { label: '1 hour', minutes: 60 },
  { label: '24 hours', minutes: 24 * 60 },
  { label: '7 days', minutes: 7 * 24 * 60 },
  { label: '30 days', minutes: 30 * 24 * 60 },
];

export const DEFAULT_DURATION_MINUTES = 24 * 60;

export function formatDuration(minutes: number): string {
  const preset = DURATION_PRESETS.find((p) => p.minutes === minutes);
  if (preset) return preset.label;
  if (minutes % (24 * 60) === 0) {
    const days = minutes / (24 * 60);
    return `${days} day${days > 1 ? 's' : ''}`;
  }
  if (minutes % 60 === 0) {
    const hours = minutes / 60;
    return `${hours} hour${hours > 1 ? 's' : ''}`;
  }
  return `${minutes} minutes`;
}
