import z from 'zod';

import { cdpFetch } from '../lib/fetch';
import { CdpError } from '../lib/error';

const runBaseSqlQueryInternal = async <T>(
  sql: string,
  outputSchema: z.ZodSchema<T>
): Promise<T | null> => {
  const data = await cdpFetch(
    {
      requestMethod: 'POST',
      requestPath: '/platform/v2/data/query/run',
    },
    z.object({
      result: outputSchema.nullable(),
    }),
    {
      body: JSON.stringify({ sql }),
    }
  );

  return data.result;
};

export async function runBaseSqlQuery<T>(
  sql: string,
  resultSchema: z.ZodSchema<T>
): Promise<T | null> {
  // Add exponential backoff for rate limiting
  const maxRetries = 2;
  let attempt = 0;
  while (attempt < maxRetries) {
    try {
      return await runBaseSqlQueryInternal(sql, resultSchema);
    } catch (error) {
      if (error instanceof CdpError) {
        if (error.status === 429) {
          console.warn(
            `Rate limited when running base SQL query (attempt ${attempt + 1}). Retrying in 1000ms...`
          );
          await new Promise(resolve => setTimeout(resolve, 1000));
          attempt++;
        } else {
          throw error;
        }
      } else {
        throw error;
      }
    }
  }
  return null;
}
