import z from 'zod';

import { cdpFetch } from '../lib/fetch';

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
  const maxRetries = 5;
  let attempt = 0;
  while (attempt < maxRetries) {
    try {
      return await runBaseSqlQueryInternal(sql, resultSchema);
    } catch (error) {
      console.error('error', error);
      // Check for rate limit error (HTTP 429 or message includes "rate limit")
      const isRateLimit =
        (error instanceof Error &&
          typeof error.message === 'string' &&
          (error.message.toLowerCase().includes('rate limit') ||
            error.message.includes('429'))) ||
        (typeof error === 'object' &&
          error !== null &&
          'response' in error &&
          typeof (error as { response: { status: number } }).response ===
            'object' &&
          (error as { response: { status: number } }).response !== null &&
          (error as { response: { status: number } }).response.status === 429);
      if (isRateLimit && attempt < maxRetries - 1) {
        const delay = Math.pow(2, attempt) * 500 + Math.random() * 200;
        console.warn(
          `Rate limited when running base SQL query (attempt ${
            attempt + 1
          }). Retrying in ${Math.round(delay)}ms...`
        );
        await new Promise(resolve => setTimeout(resolve, delay));
        attempt++;
      } else {
        throw error;
      }
    }
  }
  return null;
}
