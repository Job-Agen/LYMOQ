import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';
import { DEFAULT_DURATION_MINUTES, type CreateCardDraftInput, type MerchantDto } from '@mesura/shared';

/** UI state for the 4-step flow. Nothing is persisted until "Review card". */
export interface CardRulesDraft {
  merchant: MerchantDto | null;
  restrictToMerchant: boolean;
  maxAmount: number;
  maxTransactionCount: number | null;
  durationMinutes: number;
}

interface CreateCardState {
  draft: CardRulesDraft;
  update: (patch: Partial<CardRulesDraft>) => void;
  toInput: () => CreateCardDraftInput;
}

const INITIAL: CardRulesDraft = {
  merchant: null,
  restrictToMerchant: true,
  maxAmount: 15_000,
  maxTransactionCount: 1,
  durationMinutes: DEFAULT_DURATION_MINUTES,
};

const Ctx = createContext<CreateCardState | null>(null);

export function CreateCardProvider({ children }: { children: ReactNode }) {
  const [draft, setDraft] = useState<CardRulesDraft>(INITIAL);
  const value = useMemo<CreateCardState>(
    () => ({
      draft,
      update: (patch) => setDraft((d) => ({ ...d, ...patch })),
      toInput: () => ({
        maxAmount: draft.maxAmount,
        currency: 'XOF',
        maxTransactionCount: draft.maxTransactionCount,
        durationMinutes: draft.durationMinutes,
        merchantRestriction: draft.restrictToMerchant && draft.merchant ? draft.merchant.slug : null,
      }),
    }),
    [draft],
  );
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useCreateCard(): CreateCardState {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useCreateCard must be used inside CreateCardProvider');
  return ctx;
}
