import { z } from 'zod';
import { MobileMoneyProvider } from './enums';
import {
  MAX_CARD_AMOUNT,
  MAX_DURATION_MINUTES,
  MAX_TRANSACTION_COUNT,
  MIN_CARD_AMOUNT,
  MIN_DURATION_MINUTES,
} from './rules';
import { SUPPORTED_CURRENCIES } from './money';

/**
 * Request schemas. The API validates every request body with these schemas
 * (see ZodValidationPipe); the mobile app reuses them for instant form feedback.
 * Frontend validation is a convenience only — the backend is authoritative.
 */

const amountSchema = z
  .number({ invalid_type_error: 'Amount must be a number' })
  .int('Amount must be a whole number')
  .positive('Amount must be greater than zero');

export const registerSchema = z.object({
  name: z.string().trim().min(2, 'Enter your name').max(80),
  email: z.string().trim().toLowerCase().email('Enter a valid email'),
  password: z.string().min(8, 'Use at least 8 characters').max(128),
});
export type RegisterInput = z.infer<typeof registerSchema>;

export const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email('Enter a valid email'),
  password: z.string().min(1, 'Enter your password').max(128),
});
export type LoginInput = z.infer<typeof loginSchema>;

/** Togo mobile numbers: +228 followed by 8 digits. Spaces are ignored. */
export const togoPhoneSchema = z
  .string()
  .transform((v) => v.replace(/[\s-]/g, ''))
  .pipe(z.string().regex(/^\+228\d{8}$/, 'Enter a Togo number like +228 90 12 34 56'));

export const kycStartSchema = z.object({
  firstName: z.string().trim().min(1, 'Enter your first name').max(60),
  lastName: z.string().trim().min(1, 'Enter your last name').max(60),
  dateOfBirth: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Use the format YYYY-MM-DD')
    .refine((v) => !Number.isNaN(Date.parse(v)), 'Enter a valid date'),
  country: z.string().length(2).toUpperCase().default('TG'),
  phone: togoPhoneSchema,
});
export type KycStartInput = z.infer<typeof kycStartSchema>;

export const createCardDraftSchema = z.object({
  label: z.string().trim().min(1).max(40).optional(),
  maxAmount: amountSchema
    .min(MIN_CARD_AMOUNT, `Minimum is ${MIN_CARD_AMOUNT} FCFA`)
    .max(MAX_CARD_AMOUNT, `Maximum is ${MAX_CARD_AMOUNT} FCFA`),
  currency: z.enum(SUPPORTED_CURRENCIES).default('XOF'),
  /** null = unlimited payments until expiration */
  maxTransactionCount: z.number().int().min(1).max(MAX_TRANSACTION_COUNT).nullable(),
  durationMinutes: z.number().int().min(MIN_DURATION_MINUTES).max(MAX_DURATION_MINUTES),
  /** Merchant slug, or null for "Anywhere" */
  merchantRestriction: z.string().trim().toLowerCase().min(1).max(40).nullable(),
});
export type CreateCardDraftInput = z.infer<typeof createCardDraftSchema>;

export const fundCardSchema = z.object({
  provider: z.nativeEnum(MobileMoneyProvider),
  phone: togoPhoneSchema,
});
export type FundCardInput = z.infer<typeof fundCardSchema>;

/** Rules can only be tightened after funding — never loosened. */
export const updateCardRulesSchema = z
  .object({
    maxAmount: amountSchema.optional(),
    maxTransactionCount: z.number().int().min(1).max(MAX_TRANSACTION_COUNT).optional(),
  })
  .refine((v) => v.maxAmount !== undefined || v.maxTransactionCount !== undefined, {
    message: 'Change at least one rule',
  });
export type UpdateCardRulesInput = z.infer<typeof updateCardRulesSchema>;

export const simulateTransactionSchema = z.object({
  cardId: z.string().min(1),
  merchant: z.string().trim().min(1).max(40),
  amount: amountSchema.max(MAX_CARD_AMOUNT * 10),
  currency: z.enum(SUPPORTED_CURRENCIES),
});
export type SimulateTransactionInput = z.infer<typeof simulateTransactionSchema>;

export const transactionFilterSchema = z.object({
  status: z.enum(['APPROVED', 'BLOCKED']).optional(),
  cardId: z.string().optional(),
  limit: z.coerce.number().int().min(1).max(100).default(50),
});
export type TransactionFilterInput = z.infer<typeof transactionFilterSchema>;
