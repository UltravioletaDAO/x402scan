import type z from 'zod';

import { Prisma } from '@prisma/client';

import type { baseQuerySchema } from './schemas';
import type { paginatedQuerySchema } from '@/lib/pagination';

export const transfersWhereClause = (
  input: z.infer<typeof baseQuerySchema>
) => {
  const { chain, startDate, endDate, senders, recipients, facilitatorIds } =
    input;
  return Prisma.sql`WHERE 1=1
    ${chain ? Prisma.sql`AND t.chain = ${chain}` : Prisma.empty}
    ${startDate ? Prisma.sql`AND t.block_timestamp >= ${startDate}` : Prisma.empty}
    ${endDate ? Prisma.sql`AND t.block_timestamp <= ${endDate}` : Prisma.empty}
    ${senders ? Prisma.sql`AND t.sender = ANY(${senders})` : Prisma.empty}
    ${
      recipients?.include !== undefined && recipients.include.length > 0
        ? Prisma.sql`AND t.recipient = ANY(${recipients.include})`
        : Prisma.empty
    }
    ${
      recipients?.exclude !== undefined && recipients.exclude.length > 0
        ? Prisma.sql`AND t.recipient NOT IN (${recipients.exclude})`
        : Prisma.empty
    }
    ${
      senders?.include !== undefined && senders.include.length > 0
        ? Prisma.sql`AND t.sender = ANY(${senders.include})`
        : Prisma.empty
    }
    ${
      senders?.exclude !== undefined && senders.exclude.length > 0
        ? Prisma.sql`AND t.sender NOT IN (${senders.exclude})`
        : Prisma.empty
    }
    ${facilitatorIds ? Prisma.sql`AND t.facilitator_id = ANY(${facilitatorIds})` : Prisma.empty}
`;
};

export const paginationClause = (
  pagination: z.infer<typeof paginatedQuerySchema>
) => {
  return Prisma.sql`
    LIMIT ${pagination.page_size} 
    OFFSET ${pagination.page * pagination.page_size}`;
};
