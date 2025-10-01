import { createEnv } from '@t3-oss/env-nextjs';
import { z } from 'zod';

export const env = createEnv({
  server: {
    POSTGRES_PRISMA_URL: z.url(),
    POSTGRES_URL_NON_POOLING: z.url(),
    CDP_API_KEY_NAME: z.string(),
    CDP_API_KEY_ID: z.string(),
    CDP_API_KEY_SECRET: z.string(),
    ECHO_APP_ID: z.string().optional(),
  },
  client: {
    NEXT_PUBLIC_APP_URL: z.url().default('http://localhost:3000'),
    NEXT_PUBLIC_NODE_ENV: z
      .enum(['development', 'production'])
      .default('development'),
    NEXT_PUBLIC_CDP_PROJECT_ID: z.string().optional(),
  },
  experimental__runtimeEnv: {
    NEXT_PUBLIC_APP_URL:
      (process.env.NEXT_PUBLIC_APP_URL ??
      process.env.VERCEL_PROJECT_PRODUCTION_URL)
        ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
        : 'http://localhost:3000',
    NEXT_PUBLIC_NODE_ENV: process.env.NODE_ENV ?? 'development',
    NEXT_PUBLIC_CDP_PROJECT_ID: process.env.NEXT_PUBLIC_CDP_PROJECT_ID,
  },
  emptyStringAsUndefined: true,
});
