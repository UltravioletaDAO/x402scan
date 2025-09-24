import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  server: {
    DATABASE_URL: z.url(),
    CDP_CLIENT_API_KEY: z.string(),
  },
  client: {
    NEXT_PUBLIC_APP_URL: z.url().default("http://localhost:3000"),
    NEXT_PUBLIC_NODE_ENV: z
      .enum(["development", "production"])
      .default("development"),
  },
  experimental__runtimeEnv: {
    NEXT_PUBLIC_APP_URL:
      process.env.NEXT_PUBLIC_APP_URL ??
      process.env.VERCEL_PROJECT_PRODUCTION_URL
        ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
        : "http://localhost:3000",
    NEXT_PUBLIC_NODE_ENV: process.env.NODE_ENV ?? "development",
  },
  emptyStringAsUndefined: true,
});
