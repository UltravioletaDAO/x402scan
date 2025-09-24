import { Prisma, PrismaClient } from "@prisma/client";
import { FacilitatorTransaction } from "../cdp/sql/list-facilitator-transactions";
import { prisma } from "./client";

interface UpsertTransactionInput {
  resourceId: string;
  acceptsId: string;
  transaction: FacilitatorTransaction;
}

export const upsertTransaction = async (
  input: UpsertTransactionInput,
  tx: Prisma.TransactionClient
) => {
  const { resourceId, acceptsId, transaction } = input;

  try {
    const result = await tx.transactions.upsert({
      where: {
        transactionHash_logIndex: {
          transactionHash: transaction.transaction_hash,
          logIndex: transaction.log_index,
        },
      },
      create: {
        transactionHash: transaction.transaction_hash,
        logIndex: transaction.log_index,
        amount: transaction.amount,
        sender: transaction.sender,
        recipient: transaction.recipient,
        resourceId: resourceId,
        acceptsId: acceptsId,
        blockTimestamp: transaction.block_timestamp,
      },
      update: {
        amount: transaction.amount,
        sender: transaction.sender,
        recipient: transaction.recipient,
        blockTimestamp: transaction.block_timestamp,
      },
    });

    return result;
  } catch (error) {
    console.error("Upsert transaction failed:", {
      error: error,
      transaction: {
        hash: transaction.transaction_hash,
        logIndex: transaction.log_index,
        resourceId,
        acceptsId,
      },
    });
    throw error;
  }
};
