# PÔ — "Your money. Your rules."

Sandbox prototype of **PÔ**, a controlled virtual card for online payments (initial market: Togo).
The user decides **HOW MUCH** a card can spend, **WHERE** it can be used, **HOW MANY** times, and **HOW LONG** it stays active.

> **Sandbox only.** No real money moves, no real Visa/Mastercard is issued, no Mobile Money
> request is sent and no KYC provider is called. All external partners are fake providers
> behind interfaces, so they can later be replaced by regulated partners.

```
apps/
  api/        NestJS + Prisma + PostgreSQL (modular monolith)
  mobile/     Expo (React Native) + Expo Router + TanStack Query
packages/
  shared/     Enums, money helpers, Zod request schemas, API response types
  config/     Shared strict tsconfig
legacy/
  flutter-prototype/   Earlier UI-only Flutter mock (kept for reference)
```

Architecture, data model, endpoint list and build phases: [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md).

## Requirements

- Node.js ≥ 20 and pnpm 10 (`corepack enable`)
- PostgreSQL 14+ locally, in Docker, or on [Neon](https://neon.tech)
- For the phone: the Expo Go app (SDK 57) or an Android emulator / iOS simulator

## 1. Install

```bash
pnpm install          # also generates the Prisma client
pnpm build:shared     # compiles packages/shared (API and app import it)
```

## 2. Database

Start Postgres (skip if you already have one):

```bash
docker run -d --name po-db -p 5432:5432 -e POSTGRES_USER=po -e POSTGRES_PASSWORD=po -e POSTGRES_DB=po postgres:16
```

Configure and migrate:

```bash
cp apps/api/.env.example apps/api/.env
# set JWT_SECRET (≥ 32 chars):
node -e "console.log(require('crypto').randomBytes(48).toString('base64url'))"

pnpm db:migrate       # applies prisma/migrations
pnpm db:seed          # merchants, demo user, demo cards and activity
```

**Neon:** put the *pooled* connection string in `DATABASE_URL` and the *direct* one in `DIRECT_URL`
(both with `?sslmode=require`), then run `pnpm --filter @po/api prisma:deploy` and `pnpm db:seed`.

Demo account created by the seed: **`demo@po.test` / `demo1234`** (KYC verified, 4 cards, mixed activity).

## 3. Run the API

```bash
pnpm api:dev          # http://localhost:3000
```

## 4. Run the mobile app

```bash
cp apps/mobile/.env.example apps/mobile/.env
# EXPO_PUBLIC_API_URL must be reachable from the device:
#   iOS simulator / web: http://localhost:3000
#   Android emulator:    http://10.0.2.2:3000
#   Phone with Expo Go:  http://<your computer's LAN IP>:3000
pnpm mobile:dev       # then press a (Android), i (iOS), w (web) or scan the QR code
```

## 5. Try the full flow

1. **Onboarding → Sign up** (any email, 8+ char password)
2. **KYC** — name, date of birth (18+), Togo number → verified instantly (sandbox)
3. **Home → Create a card** → Where (Anywhere / merchant) → How much → How many → How long
4. **Review** — maximum, merchant, payments, duration, illustrative fees (5 %)
5. **Fund** — pick TMoney / Flooz / Moov Money → *Pay 15,750 FCFA*
6. **Confirm the payment** — auto-confirms after ~10 s, or tap *Simulate confirmation*
7. **Card created** → **Card details** — masked card, rules, *Freeze*, *Manage rules*, *Terminate*
8. **Simulate an online payment** — choose a merchant and amount → **Approved** or **Payment blocked**
9. **Activity** — All / Approved / Blocked → transaction details with the plain-language reason

Or drive it from the command line (merchant charging a card):

```bash
curl -X POST localhost:3000/sandbox/transactions \
  -H "Authorization: Bearer $TOKEN" -H 'content-type: application/json' \
  -d '{"cardId":"<id>","merchant":"CANVA","amount":5650,"currency":"XOF"}'
# → {"status":"APPROVED", ...}  or  {"status":"BLOCKED","reason":"MERCHANT_NOT_ALLOWED", ...}
```

## Tests and checks

```bash
pnpm test                          # CardPolicyEngine unit tests (Jest)
pnpm typecheck                     # shared + api + mobile, strict TypeScript
pnpm --filter @po/api smoke        # end-to-end API scenario against a running API + seeded DB
```

## Sandbox configuration (`apps/api/.env`)

| Variable | Default | Meaning |
| --- | --- | --- |
| `SANDBOX_MODE` | `true` in `.env.example` | Enables `/sandbox/*`. When `false` those routes return 404. |
| `SANDBOX_FUNDING_AUTO_CONFIRM_SECONDS` | `10` | Fake Mobile Money auto-approval delay (`0` = manual only). |
| `SERVICE_FEE_BPS` | `500` | Illustrative fee, in basis points (5 %). |
| `FUNDING_EXPIRY_MINUTES` | `15` | A pending Mobile Money request expires after this. |
