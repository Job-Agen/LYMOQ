import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { CardDto, FundingDto } from '@po/shared';
import { api, type TransactionFilter } from './endpoints';

export const keys = {
  me: ['me'] as const,
  kyc: ['kyc'] as const,
  merchants: ['merchants'] as const,
  cards: ['cards'] as const,
  card: (id: string) => ['cards', id] as const,
  funding: (id: string) => ['funding', id] as const,
  transactions: (filter: TransactionFilter, cardId?: string) => ['transactions', filter, cardId ?? 'all'] as const,
  transaction: (id: string) => ['transaction', id] as const,
};

export const useMe = (enabled = true) => useQuery({ queryKey: keys.me, queryFn: api.me, enabled });
export const useMerchants = () => useQuery({ queryKey: keys.merchants, queryFn: api.merchants, staleTime: 10 * 60_000 });
export const useCards = () => useQuery({ queryKey: keys.cards, queryFn: api.cards });
export const useCard = (id: string) => useQuery({ queryKey: keys.card(id), queryFn: () => api.card(id) });
export const useTransactions = (filter: TransactionFilter = 'ALL', cardId?: string) =>
  useQuery({ queryKey: keys.transactions(filter, cardId), queryFn: () => api.transactions(filter, cardId) });
export const useTransaction = (id: string) =>
  useQuery({ queryKey: keys.transaction(id), queryFn: () => api.transaction(id) });

/** Polls the Mobile Money request until it leaves PENDING. */
export const useFunding = (id: string) =>
  useQuery({
    queryKey: keys.funding(id),
    queryFn: () => api.funding(id),
    refetchInterval: (query) => ((query.state.data as FundingDto | undefined)?.status === 'PENDING' ? 2_000 : false),
  });

/** Card actions: update the cache with the returned card and refresh lists. */
export function useCardAction<TArgs>(action: (args: TArgs) => Promise<CardDto>) {
  const client = useQueryClient();
  return useMutation({
    mutationFn: action,
    onSuccess: (card) => {
      client.setQueryData(keys.card(card.id), card);
      void client.invalidateQueries({ queryKey: keys.cards });
    },
  });
}

export function useInvalidateActivity() {
  const client = useQueryClient();
  return () =>
    Promise.all([
      client.invalidateQueries({ queryKey: keys.cards }),
      client.invalidateQueries({ queryKey: ['transactions'] }),
    ]);
}
