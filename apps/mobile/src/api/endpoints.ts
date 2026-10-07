import type {
  AuthResponseDto,
  CardDto,
  CreateCardDraftInput,
  FundCardInput,
  FundingDto,
  KycProfileDto,
  KycStartInput,
  LoginInput,
  MerchantDto,
  RegisterInput,
  SimulateTransactionInput,
  SimulateTransactionResponseDto,
  TransactionDto,
  UpdateCardRulesInput,
  UserDto,
} from '@mesura/shared';
import { request } from './client';

export type TransactionFilter = 'ALL' | 'APPROVED' | 'BLOCKED';

export const api = {
  register: (input: RegisterInput) => request<AuthResponseDto>('POST', '/auth/register', input),
  login: (input: LoginInput) => request<AuthResponseDto>('POST', '/auth/login', input),
  me: () => request<UserDto>('GET', '/me'),

  kyc: () => request<KycProfileDto>('GET', '/kyc'),
  startKyc: (input: KycStartInput) => request<KycProfileDto>('POST', '/kyc/start', input),
  completeKyc: () => request<KycProfileDto>('POST', '/kyc/complete'),

  merchants: () => request<MerchantDto[]>('GET', '/merchants'),

  cards: () => request<CardDto[]>('GET', '/cards'),
  card: (id: string) => request<CardDto>('GET', `/cards/${id}`),
  createDraft: (input: CreateCardDraftInput) => request<CardDto>('POST', '/cards/draft', input),
  fundCard: (id: string, input: FundCardInput) => request<FundingDto>('POST', `/cards/${id}/fund`, input),
  freezeCard: (id: string) => request<CardDto>('POST', `/cards/${id}/freeze`),
  unfreezeCard: (id: string) => request<CardDto>('POST', `/cards/${id}/unfreeze`),
  terminateCard: (id: string) => request<CardDto>('DELETE', `/cards/${id}`),
  updateRules: (id: string, input: UpdateCardRulesInput) => request<CardDto>('PATCH', `/cards/${id}/rules`, input),

  funding: (id: string) => request<FundingDto>('GET', `/funding/${id}`),

  transactions: (filter: TransactionFilter = 'ALL', cardId?: string) => {
    const params = new URLSearchParams();
    if (filter !== 'ALL') params.set('status', filter);
    if (cardId) params.set('cardId', cardId);
    const qs = params.toString();
    return request<TransactionDto[]>('GET', `/transactions${qs ? `?${qs}` : ''}`);
  },
  transaction: (id: string) => request<TransactionDto>('GET', `/transactions/${id}`),

  sandbox: {
    confirmFunding: (id: string) => request<FundingDto>('POST', `/sandbox/funding/${id}/confirm`),
    simulateTransaction: (input: SimulateTransactionInput) =>
      request<SimulateTransactionResponseDto>('POST', '/sandbox/transactions', input),
  },
};
