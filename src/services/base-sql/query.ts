import { env } from "@/env";
import z from "zod";

const runBaseSqlQueryInternal = async <T>(
  sql: string,
  resultSchema: z.ZodSchema<T>
): Promise<T | null> => {
  const response = await fetch(
    "https://api.cdp.coinbase.com/platform/v2/data/query/run",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${env.CDP_CLIENT_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ sql }),
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `Failed to run SQL query: ${response.status} ${response.statusText} - ${errorText}`
    );
  }

  const data = await response.json();

  const schema = z.object({
    result: resultSchema.nullable(),
  });

  try {
    return schema.parse(data).result;
  } catch (error) {
    console.error("error parsing data", data);
    throw error;
  }
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
    } catch (error: any) {
      // Check for rate limit error (HTTP 429 or message includes "rate limit")
      const isRateLimit =
        (error?.message &&
          typeof error.message === "string" &&
          error.message.toLowerCase().includes("rate limit")) ||
        (error?.message &&
          typeof error.message === "string" &&
          error.message.includes("429")) ||
        (error?.response && error.response.status === 429);
      if (isRateLimit && attempt < maxRetries - 1) {
        const delay = Math.pow(2, attempt) * 500 + Math.random() * 200;
        console.warn(
          `Rate limited when running base SQL query (attempt ${
            attempt + 1
          }). Retrying in ${Math.round(delay)}ms...`
        );
        await new Promise((resolve) => setTimeout(resolve, delay));
        attempt++;
      } else {
        throw error;
      }
    }
  }
  return null;
}
