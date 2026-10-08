/** Selectable presets for the card creation flow (input options, not business logic). */

export const MIN_CARD_AMOUNT = 500;
export const MAX_CARD_AMOUNT = 1_000_000;

export const MIN_DURATION_MINUTES = 5;
export const MAX_DURATION_MINUTES = 30 * 24 * 60;

export const MAX_TRANSACTION_COUNT = 100;

export const AMOUNT_PRESETS = [5_000, 10_000, 25_000, 50_000, 100_000] as const;

export interface UsagePreset {
  label: string;
  description: string;
  /** null = unlimited payments until the card expires */
  maxTransactionCount: number | null;
}

export const USAGE_PRESETS: readonly UsagePreset[] = [
  { label: '1 paiement', description: 'La carte se clôture après 1 paiement.', maxTransactionCount: 1 },
  { label: '5 paiements', description: "La carte peut être utilisée jusqu'à 5 fois.", maxTransactionCount: 5 },
  {
    label: "Jusqu'à expiration",
    description: "Utilisez-la plusieurs fois jusqu'à ce qu'elle expire.",
    maxTransactionCount: null,
  },
];

export interface DurationPreset {
  label: string;
  minutes: number;
}

export const DURATION_PRESETS: readonly DurationPreset[] = [
  { label: '30 minutes', minutes: 30 },
  { label: '1 heure', minutes: 60 },
  { label: '24 heures', minutes: 24 * 60 },
  { label: '7 jours', minutes: 7 * 24 * 60 },
  { label: '30 jours', minutes: 30 * 24 * 60 },
];

export const DEFAULT_DURATION_MINUTES = 24 * 60;

export function formatDuration(minutes: number): string {
  const preset = DURATION_PRESETS.find((p) => p.minutes === minutes);
  if (preset) return preset.label;
  if (minutes % (24 * 60) === 0) {
    const days = minutes / (24 * 60);
    return `${days} jour${days > 1 ? 's' : ''}`;
  }
  if (minutes % 60 === 0) {
    const hours = minutes / 60;
    return `${hours} heure${hours > 1 ? 's' : ''}`;
  }
  return `${minutes} minutes`;
}
