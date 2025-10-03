import { unstable_cache } from 'next/cache';

/**
 * Round a date to the nearest minute for stable cache keys
 */
export const roundDateToMinute = (date?: Date): string | undefined => {
  if (!date) return undefined;
  const rounded = new Date(date);
  rounded.setSeconds(0, 0);
  return rounded.toISOString();
};

/**
 * Serialize dates in an object to ISO strings for JSON serialization
 */
export const serializeDates = <T extends Record<string, any>>(
  obj: T,
  dateKeys: (keyof T)[]
): T => {
  const result = { ...obj };
  for (const key of dateKeys) {
    if (result[key] instanceof Date) {
      result[key] = result[key].toISOString() as any;
    }
  }
  return result;
};

/**
 * Deserialize ISO strings back to Date objects
 */
export const deserializeDates = <T extends Record<string, any>>(
  obj: T,
  dateKeys: (keyof T)[]
): T => {
  const result = { ...obj };
  for (const key of dateKeys) {
    if (typeof result[key] === 'string') {
      result[key] = new Date(result[key]) as any;
    }
  }
  return result;
};

/**
 * Generic cached query wrapper for arrays of items with dates
 */
export const createCachedArrayQuery = <TInput, TItem extends Record<string, any>>(
  config: {
    queryFn: (input: TInput) => Promise<TItem[]>;
    cacheKeyPrefix: string;
    createCacheKey: (input: TInput) => string;
    dateFields: (keyof TItem)[];
    revalidate?: number;
    tags?: string[];
  }
) => {
  return async (input: TInput): Promise<TItem[]> => {
    const cacheKey = config.createCacheKey(input);

    const result = await unstable_cache(
      async () => {
        const data = await config.queryFn(input);
        // Serialize dates to ISO strings
        return data.map(item => serializeDates(item, config.dateFields));
      },
      [config.cacheKeyPrefix, cacheKey],
      {
        revalidate: config.revalidate ?? 60,
        tags: config.tags,
      }
    )();

    // Deserialize ISO strings back to Date objects
    return result.map(item => deserializeDates(item, config.dateFields));
  };
};

/**
 * Generic cached query wrapper for single items with dates
 */
export const createCachedQuery = <TInput, TOutput extends Record<string, any>>(
  config: {
    queryFn: (input: TInput) => Promise<TOutput>;
    cacheKeyPrefix: string;
    createCacheKey: (input: TInput) => string;
    dateFields: (keyof TOutput)[];
    revalidate?: number;
    tags?: string[];
  }
) => {
  return async (input: TInput): Promise<TOutput> => {
    const cacheKey = config.createCacheKey(input);

    const result = await unstable_cache(
      async () => {
        const data = await config.queryFn(input);
        // Serialize dates to ISO strings
        return serializeDates(data, config.dateFields);
      },
      [config.cacheKeyPrefix, cacheKey],
      {
        revalidate: config.revalidate ?? 60,
        tags: config.tags,
      }
    )();

    // Deserialize ISO strings back to Date objects
    return deserializeDates(result, config.dateFields);
  };
};

/**
 * Generic cached query wrapper for paginated responses with dates
 */
export const createCachedPaginatedQuery = <
  TInput,
  TItem extends Record<string, any>,
  TPaginated extends { items: TItem[]; [key: string]: any }
>(
  config: {
    queryFn: (input: TInput) => Promise<TPaginated>;
    cacheKeyPrefix: string;
    createCacheKey: (input: TInput) => string;
    dateFields: (keyof TItem)[];
    revalidate?: number;
    tags?: string[];
  }
) => {
  return async (input: TInput): Promise<TPaginated> => {
    const cacheKey = config.createCacheKey(input);

    const result = await unstable_cache(
      async () => {
        const data = await config.queryFn(input);
        // Serialize dates in items
        return {
          ...data,
          items: data.items.map(item => serializeDates(item, config.dateFields)),
        };
      },
      [config.cacheKeyPrefix, cacheKey],
      {
        revalidate: config.revalidate ?? 60,
        tags: config.tags,
      }
    )();

    // Deserialize ISO strings back to Date objects
    return {
      ...result,
      items: result.items.map(item => deserializeDates(item, config.dateFields)),
    };
  };
};

/**
 * Create a standardized cache key from input parameters
 * Handles date rounding and array sorting automatically
 */
export const createStandardCacheKey = (params: Record<string, any>): string => {
  const normalized: Record<string, any> = {};

  for (const [key, value] of Object.entries(params)) {
    if (value === undefined) {
      // Skip undefined values
      continue;
    } else if (value instanceof Date) {
      // Round dates to nearest minute
      normalized[key] = roundDateToMinute(value);
    } else if (Array.isArray(value)) {
      // Sort arrays for consistent keys
      normalized[key] = [...value].sort();
    } else {
      normalized[key] = value;
    }
  }

  return JSON.stringify(normalized);
};
