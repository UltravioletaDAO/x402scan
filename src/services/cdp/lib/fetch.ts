import { generateCdpJwt } from './generate-jwt';
import { cdpFetchSchema } from './schema';

import type z from 'zod';

export const cdpFetch = async <T>(
  request: z.input<typeof cdpFetchSchema>,
  outputSchema: z.ZodSchema<T>,
  init?: RequestInit
): Promise<T> => {
  const { requestMethod, requestPath, requestHost } =
    cdpFetchSchema.parse(request);

  const jwt = await generateCdpJwt({
    requestMethod: request.requestMethod,
    requestPath: request.requestPath,
    requestHost: request.requestHost,
  });

  const url = `https://${requestHost}${requestPath}`;

  const response = await fetch(url, {
    ...init,
    method: request.requestMethod,
    headers: {
      ...init?.headers,
      'Content-Type': 'application/json',
      Authorization: `Bearer ${jwt}`,
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `Failed to ${requestMethod} ${requestPath} from ${requestHost}: ${errorText}`
    );
  }
  return outputSchema.parse(await response.json());
};
