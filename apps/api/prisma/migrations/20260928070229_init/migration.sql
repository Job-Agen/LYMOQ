-- CreateEnum
CREATE TYPE "KycStatus" AS ENUM ('NOT_STARTED', 'PENDING', 'VERIFIED', 'REJECTED');

-- CreateEnum
CREATE TYPE "CardStatus" AS ENUM ('PENDING_FUNDING', 'ACTIVE', 'FROZEN', 'EXPIRED', 'TERMINATED');

-- CreateEnum
CREATE TYPE "TerminationReason" AS ENUM ('USER_REQUESTED', 'USAGE_LIMIT_REACHED');

-- CreateEnum
CREATE TYPE "FundingStatus" AS ENUM ('PENDING', 'CONFIRMED', 'FAILED', 'EXPIRED');

-- CreateEnum
CREATE TYPE "TransactionStatus" AS ENUM ('PENDING', 'APPROVED', 'BLOCKED', 'FAILED');

-- CreateEnum
CREATE TYPE "DeclineReason" AS ENUM ('CARD_NOT_ACTIVE', 'CARD_EXPIRED', 'AMOUNT_LIMIT_EXCEEDED', 'TRANSACTION_LIMIT_REACHED', 'MERCHANT_NOT_ALLOWED');

-- CreateEnum
CREATE TYPE "MobileMoneyProvider" AS ENUM ('TMONEY', 'FLOOZ', 'MOOV_MONEY');

-- CreateEnum
CREATE TYPE "Currency" AS ENUM ('XOF');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "phone" TEXT,
    "passwordHash" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "KycProfile" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "status" "KycStatus" NOT NULL DEFAULT 'NOT_STARTED',
    "firstName" TEXT,
    "lastName" TEXT,
    "dateOfBirth" DATE,
    "country" TEXT,
    "providerReference" TEXT,
    "verifiedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "KycProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Merchant" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "iconUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Merchant_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Card" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "providerCardId" TEXT,
    "last4" TEXT,
    "status" "CardStatus" NOT NULL DEFAULT 'PENDING_FUNDING',
    "terminationReason" "TerminationReason",
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "activatedAt" TIMESTAMP(3),
    "expiresAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Card_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CardPolicy" (
    "id" TEXT NOT NULL,
    "cardId" TEXT NOT NULL,
    "maxAmount" INTEGER NOT NULL,
    "spentAmount" INTEGER NOT NULL DEFAULT 0,
    "currency" "Currency" NOT NULL DEFAULT 'XOF',
    "maxTransactionCount" INTEGER,
    "currentTransactionCount" INTEGER NOT NULL DEFAULT 0,
    "merchantRestriction" TEXT,
    "durationMinutes" INTEGER NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CardPolicy_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Funding" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "cardId" TEXT NOT NULL,
    "provider" "MobileMoneyProvider" NOT NULL,
    "providerReference" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    "fee" INTEGER NOT NULL,
    "total" INTEGER NOT NULL,
    "currency" "Currency" NOT NULL DEFAULT 'XOF',
    "status" "FundingStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "confirmedAt" TIMESTAMP(3),

    CONSTRAINT "Funding_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Transaction" (
    "id" TEXT NOT NULL,
    "cardId" TEXT NOT NULL,
    "merchant" TEXT NOT NULL,
    "merchantName" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    "currency" "Currency" NOT NULL DEFAULT 'XOF',
    "status" "TransactionStatus" NOT NULL,
    "declineReason" "DeclineReason",
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Transaction_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "KycProfile_userId_key" ON "KycProfile"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Merchant_slug_key" ON "Merchant"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Card_providerCardId_key" ON "Card"("providerCardId");

-- CreateIndex
CREATE INDEX "Card_userId_createdAt_idx" ON "Card"("userId", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "CardPolicy_cardId_key" ON "CardPolicy"("cardId");

-- CreateIndex
CREATE UNIQUE INDEX "Funding_providerReference_key" ON "Funding"("providerReference");

-- CreateIndex
CREATE INDEX "Funding_cardId_idx" ON "Funding"("cardId");

-- CreateIndex
CREATE INDEX "Funding_userId_createdAt_idx" ON "Funding"("userId", "createdAt");

-- CreateIndex
CREATE INDEX "Transaction_cardId_createdAt_idx" ON "Transaction"("cardId", "createdAt");

-- AddForeignKey
ALTER TABLE "KycProfile" ADD CONSTRAINT "KycProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Card" ADD CONSTRAINT "Card_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CardPolicy" ADD CONSTRAINT "CardPolicy_cardId_fkey" FOREIGN KEY ("cardId") REFERENCES "Card"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CardPolicy" ADD CONSTRAINT "CardPolicy_merchantRestriction_fkey" FOREIGN KEY ("merchantRestriction") REFERENCES "Merchant"("slug") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Funding" ADD CONSTRAINT "Funding_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Funding" ADD CONSTRAINT "Funding_cardId_fkey" FOREIGN KEY ("cardId") REFERENCES "Card"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_cardId_fkey" FOREIGN KEY ("cardId") REFERENCES "Card"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Money invariants enforced by the database as a last line of defence.
-- All amounts are integer minor units (XOF: 1 = 1 FCFA).
ALTER TABLE "CardPolicy" ADD CONSTRAINT "CardPolicy_maxAmount_positive" CHECK ("maxAmount" > 0);
ALTER TABLE "CardPolicy" ADD CONSTRAINT "CardPolicy_spent_within_limit" CHECK ("spentAmount" >= 0 AND "spentAmount" <= "maxAmount");
ALTER TABLE "CardPolicy" ADD CONSTRAINT "CardPolicy_counts_valid" CHECK ("currentTransactionCount" >= 0 AND ("maxTransactionCount" IS NULL OR "maxTransactionCount" > 0));
ALTER TABLE "CardPolicy" ADD CONSTRAINT "CardPolicy_duration_positive" CHECK ("durationMinutes" > 0);
ALTER TABLE "Funding" ADD CONSTRAINT "Funding_amounts_valid" CHECK ("amount" > 0 AND "fee" >= 0 AND "total" = "amount" + "fee");
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_amount_positive" CHECK ("amount" > 0);
