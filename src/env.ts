import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  server: {
    DATABASE_URL: z.url(),
    CDP_CLIENT_API_KEY: z.string(),
  },
  client: {},
  experimental__runtimeEnv: {},
});
