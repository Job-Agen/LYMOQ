# Mesura sandbox — architecture

## 1. Starting point

The repository contained a single-file Flutter UI mock (`LYMOQ` branding, hardcoded data, no
backend) and a GitHub Action building a debug APK. It was moved to `legacy/flutter-prototype/`
(the workflow now builds from there) and the product was rebuilt on the requested stack.

## 2. Folder architecture

```
apps/api/                      NestJS modular monolith
  prisma/schema.prisma         Data model (+ CHECK constraints in the migration)
  prisma/migrations/           SQL migrations
  prisma/seed.ts               Merchants, demo user, demo cards & activity
  scripts/smoke-test.sh        End-to-end API scenario
  src/
    main.ts, app.module.ts
    config/                    Zod-validated environment (fails fast at boot)
    prisma/                    PrismaService (global)
    common/                    ZodValidationPipe, @Public, @CurrentUserId
    auth/                      register/login, scrypt hashing, JWT, global AuthGuard
    users/                     GET /me
    kyc/                       start + complete (via KycProvider)
    card-policies/             CardPolicyEngine (pure domain logic) + unit tests
    cards/                     drafts, activation, freeze/unfreeze/terminate, rules, pricing
    funding/                   Mobile Money funding lifecycle (via PaymentProvider)
    transactions/              activity + authorization (row-locked, uses the engine)
    merchants/                 merchant catalogue
    sandbox/                   /sandbox/* developer tools (guarded by SANDBOX_MODE)
    providers/                 PaymentProvider, CardIssuerProvider, KycProvider interfaces
      sandbox/                 SandboxMobileMoneyProvider, SandboxCardIssuerProvider, SandboxKycProvider
apps/mobile/                   Expo SDK 57, Expo Router (src/app), TanStack Query
  src/app/                     Routes only (see §7)
  src/api/                     fetch client, typed endpoints, query hooks
  src/auth/                    token in SecureStore, AuthProvider
  src/components/              Screen, Button, VirtualCard, RuleRow, OptionRow, States, …
  src/features/create-card/    UI state of the 4-step creation flow
  src/theme/                   design tokens (forest green / warm off-white)
packages/shared/               Enums, money helpers, Zod request schemas, response DTO types, copy
packages/config/               tsconfig.base.json (strict)
```

Business rules live only in the API. The app reuses the *request schemas* from `@mesura/shared`
for instant form feedback; the API validates every request again with the same schemas.

## 3. Dependencies

| Area | Packages |
| --- | --- |
| API | `@nestjs/{core,common,platform-express}` 11, `@nestjs/jwt`, `@nestjs/throttler`, `@prisma/client` 6, `zod` 3, `rxjs`, `reflect-metadata` |
| API dev | `prisma` 6, `@nestjs/cli`, `jest` + `ts-jest`, `tsx` (seed), `typescript` 5.9 |
| Mobile | `expo` 57, `expo-router`, `react-native-safe-area-context`, `react-native-screens`, `expo-secure-store`, `@tanstack/react-query` 5, `@expo/vector-icons`, `react-native-web` + `react-dom` (web dev) |
| Shared | `zod` |

Password hashing uses Node's built-in `scrypt` (no native module). No UI kit, no state library.

## 4. Money strategy

- Every amount is an **integer in minor units** of its currency. XOF (FCFA) has no minor unit,
  so `15000` = 15,000 FCFA. Columns are `Int`, never `Float`/`Decimal`.
- Fees use integer basis-point math, rounded half-up (`floor((a × bps + 5000) / 10000)`).
- The USD estimate (`≈ $26.55`, 1 USD ≈ 565 FCFA) is display-only and never persisted.
- The database enforces `maxAmount > 0`, `0 ≤ spentAmount ≤ maxAmount`, `amount > 0`,
  `total = amount + fee` with CHECK constraints.

## 5. Data model (Prisma)

| Model | Key fields |
| --- | --- |
| `User` | id, email (unique), name, phone, passwordHash, createdAt |
| `KycProfile` | userId (unique), status `NOT_STARTED/PENDING/VERIFIED/REJECTED`, firstName, lastName, dateOfBirth, country, providerReference, verifiedAt |
| `Merchant` | name, slug (unique), iconUrl |
| `Card` | userId, label, providerCardId, **last4 only**, status `PENDING_FUNDING/ACTIVE/FROZEN/EXPIRED/TERMINATED`, terminationReason `USER_REQUESTED/USAGE_LIMIT_REACHED`, activatedAt, expiresAt |
| `CardPolicy` | cardId (unique), maxAmount, spentAmount, currency, maxTransactionCount (null = until expiration), currentTransactionCount, merchantRestriction (→ Merchant.slug, null = anywhere), durationMinutes, expiresAt |
| `Funding` | userId, cardId, provider `TMONEY/FLOOZ/MOOV_MONEY`, providerReference, phone, amount, fee, total, currency, status `PENDING/CONFIRMED/FAILED/EXPIRED`, confirmedAt |
| `Transaction` | cardId, merchant (normalised), merchantName, amount, currency, status `PENDING/APPROVED/BLOCKED/FAILED`, declineReason |

Never stored: PAN, CVV, Mobile Money PIN, identity documents.

**Usage-rule model.** When the transaction count reaches `maxTransactionCount`, the card becomes
`TERMINATED` with `terminationReason = USAGE_LIMIT_REACHED` (there is no separate "completed"
status). A one-payment card is therefore terminated right after its first approved payment.
Expiry is applied lazily: cards past `expiresAt` are moved to `EXPIRED` when read or charged.

## 6. API endpoints

All routes require `Authorization: Bearer <jwt>` except `/auth/*`. Every resource query is scoped
to the caller (`where: { id, userId }`); another user's card or transaction returns **404**.

| Method & path | Purpose |
| --- | --- |
| `POST /auth/register` · `POST /auth/login` | Email/password → `{ accessToken, user }` (10 req/min) |
| `GET /me` | Current user + KYC status |
| `GET /kyc` · `POST /kyc/start` · `POST /kyc/complete` | Submit identity details → sandbox verification |
| `GET /merchants` | Merchant catalogue |
| `GET /cards` | Funded cards (drafts excluded) |
| `POST /cards/draft` | Create a `PENDING_FUNDING` card + policy; returns illustrative pricing |
| `GET /cards/:id` | Card, policy usage, pricing |
| `POST /cards/:id/fund` | Start Mobile Money funding (KYC must be VERIFIED) |
| `GET /funding/:id` | Funding status (syncs with the provider; activates the card on CONFIRMED) |
| `POST /cards/:id/freeze` · `POST /cards/:id/unfreeze` | Freeze / unfreeze |
| `PATCH /cards/:id/rules` | Tighten rules only (lower limit ≥ spent, fewer payments) |
| `DELETE /cards/:id` | Terminate (record kept for history) |
| `GET /transactions?status=&cardId=` · `GET /transactions/:id` | Activity |
| `POST /sandbox/funding/:id/confirm` | Simulate the user approving the Mobile Money request |
| `POST /sandbox/transactions` | Simulate a merchant charging a card → `APPROVED` / `BLOCKED` + reason |

Errors: `{ statusCode, message, issues? }` with plain-language messages. Rate limiting:
120 req/min globally, stricter on auth, KYC, funding and sandbox payments.

## 7. Core flows

**Card lifecycle**

```
POST /cards/draft ─► PENDING_FUNDING ─(funding CONFIRMED + KYC VERIFIED)─► ACTIVE ◄─► FROZEN
                                                                            │
                          usage limit reached / user terminates ─► TERMINATED
                          expiresAt passed ─────────────────────► EXPIRED
```

Activation is triggered only by a confirmed funding: `FundingService.sync` claims the funding
(`PENDING → CONFIRMED` compare-and-set), then `CardsService.activateAfterFunding` issues the card
through `CardIssuerProvider` and restarts the clock (`expiresAt = now + durationMinutes`).

**Authorization** (`TransactionsService.authorize`) runs in one DB transaction: it locks the card
row (`SELECT … FOR UPDATE`), runs `CardPolicyEngine.evaluate`, updates counters on approval,
terminates exhausted cards, and records the transaction (approved or blocked).

**CardPolicyEngine** — pure, clock injected, first failing rule wins:

1. card ACTIVE? → `CARD_NOT_ACTIVE` (`CARD_EXPIRED` if status is EXPIRED)
2. not expired? → `CARD_EXPIRED`
3. transaction count left? → `TRANSACTION_LIMIT_REACHED`
4. amount ≤ remaining limit? → `AMOUNT_LIMIT_EXCEEDED`
5. merchant allowed? → `MERCHANT_NOT_ALLOWED`
6. → `APPROVED`

Decline codes are translated to plain language (`declineReasonMessage` in `@mesura/shared`),
e.g. "This card can only be used with Canva."

## 8. Provider abstractions

| Interface (injection token) | Methods | Sandbox implementation |
| --- | --- | --- |
| `PaymentProvider` (`PAYMENT_PROVIDER`) | `initiateFunding`, `getFundingStatus` | `SandboxMobileMoneyProvider` — in-memory, auto-confirms after N s, manual confirm hook |
| `CardIssuerProvider` (`CARD_ISSUER_PROVIDER`) | `createCard`, `freezeCard`, `unfreezeCard`, `terminateCard`, `getCard` | `SandboxCardIssuerProvider` — random provider id + last4, never a PAN/CVV |
| `KycProvider` (`KYC_PROVIDER`) | `verify` | `SandboxKycProvider` — approves adults, no documents |

Services depend on the tokens only. Replacing a partner (e.g. an issuer/processor or a Mobile
Money aggregator) means adding an implementation and changing the binding in
`providers/providers.module.ts`. The sandbox controller is the only code that knows the sandbox
Mobile Money class, and it is disabled when `SANDBOX_MODE=false`.

## 9. Mobile routes

```
src/app/
  _layout.tsx               providers + guarded root stack (signed out / KYC / app)
  onboarding.tsx            01 Onboarding
  auth.tsx                  02 Login / Sign up
  kyc.tsx                   03 KYC
  (app)/(tabs)/index.tsx    04 Home      cards.tsx 14 Cards   activity.tsx 15 Activity   profile.tsx 17 Profile
  (app)/create/where.tsx    05 Where     amount.tsx 06   usage.tsx 07   duration.tsx 08
  (app)/cards/[id]/review.tsx   09 Review      fund.tsx 10 Fund         created.tsx 12 Card created
  (app)/cards/[id]/index.tsx    13 Card details   rules.tsx Manage rules   simulate.tsx Simulate payment
  (app)/funding/[id].tsx        11 Mobile Money confirmation
  (app)/transactions/[id].tsx   16 Transaction details
  (app)/payment-result/[id].tsx 18 Payment blocked / approved
```

Navigation is guarded with `Stack.Protected`: signed-out users only reach onboarding/auth,
signed-in users without verified KYC only reach KYC.

## 10. Implementation phases (as built)

1. Monorepo, shared package, Prisma schema + migration, NestJS and Expo skeletons
2. Auth (register/login/JWT guard), `/me`, KYC start/complete
3. `CardPolicyEngine` + unit tests (8 required cases + evaluation order + input validation)
4. Card drafts, sandbox card issuer, activation
5. Funding + sandbox Mobile Money (auto/manual confirmation, expiry)
6. Transaction simulator with row locking and auto-termination
7. Home, Cards, Activity, Profile screens
8. Loading skeletons, empty/error states, seed data, smoke test

## 11. Known sandbox limitations

- Sandbox provider state is in memory; after an API restart, pending fundings can still be
  confirmed manually and the database remains the source of truth for cards.
- Unspent funds on terminated/expired cards are not refunded — a real issuer integration
  would define that settlement flow.
- On web (development only) the session token is kept in memory, so a page reload signs out.
