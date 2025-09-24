import { generateJwt } from "@coinbase/cdp-sdk/auth";

import { env } from "@/env";

interface GenerateCdpJwtInput {
  requestMethod: "POST" | "GET" | "PUT" | "DELETE";
  requestHost?: string;
  requestPath: string;
  expiresIn?: number;
}

export const generateCdpJwt = async ({
  requestMethod,
  requestPath,
  requestHost = "api.cdp.coinbase.com",
  expiresIn = 120,
}: GenerateCdpJwtInput) => {
  return await generateJwt({
    apiKeyId: env.CDP_API_KEY_ID,
    apiKeySecret: env.CDP_API_KEY_SECRET,
    requestMethod,
    requestHost,
    requestPath,
    expiresIn,
  });
};
