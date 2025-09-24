-- CreateEnum
CREATE TYPE "public"."ResourceType" AS ENUM ('http');

-- CreateEnum
CREATE TYPE "public"."AcceptsScheme" AS ENUM ('exact');

-- CreateEnum
CREATE TYPE "public"."AcceptsNetwork" AS ENUM ('base_sepolia', 'avalanche_fuji', 'base', 'sei', 'sei_testnet', 'avalanche', 'iotex', 'solana_devnet', 'solana');

-- CreateTable
CREATE TABLE "public"."Resources" (
    "id" TEXT NOT NULL,
    "resource" TEXT NOT NULL,
    "type" "public"."ResourceType" NOT NULL,
    "x402Version" INTEGER NOT NULL,
    "lastUpdated" TIMESTAMP(3) NOT NULL,
    "metadata" JSONB,

    CONSTRAINT "Resources_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Accepts" (
    "id" TEXT NOT NULL,
    "resourceId" TEXT NOT NULL,
    "scheme" "public"."AcceptsScheme" NOT NULL,
    "description" TEXT NOT NULL,
    "network" "public"."AcceptsNetwork" NOT NULL,
    "maxAmountRequired" BIGINT NOT NULL,
    "resource" TEXT NOT NULL,
    "mimeType" TEXT NOT NULL,
    "payTo" TEXT NOT NULL,
    "maxTimeoutSeconds" INTEGER NOT NULL,
    "asset" TEXT NOT NULL,
    "outputSchema" JSONB,
    "extra" JSONB,

    CONSTRAINT "Accepts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Transactions" (
    "id" TEXT NOT NULL,
    "transactionHash" TEXT NOT NULL,
    "logIndex" INTEGER NOT NULL,
    "amount" BIGINT NOT NULL,
    "sender" TEXT NOT NULL,
    "recipient" TEXT NOT NULL,
    "blockTimestamp" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Transactions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Resources_resource_key" ON "public"."Resources"("resource");

-- CreateIndex
CREATE UNIQUE INDEX "Accepts_resourceId_scheme_network_key" ON "public"."Accepts"("resourceId", "scheme", "network");

-- CreateIndex
CREATE UNIQUE INDEX "Transactions_transactionHash_logIndex_key" ON "public"."Transactions"("transactionHash", "logIndex");

-- AddForeignKey
ALTER TABLE "public"."Accepts" ADD CONSTRAINT "Accepts_resourceId_fkey" FOREIGN KEY ("resourceId") REFERENCES "public"."Resources"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
