import type { OgObject } from 'open-graph-scraper/types';
import { scrapeMetadata } from './metadata';
import { scrapeOg } from './og';

export const scrapeOriginData = async (inputOrigin: string) => {
  let origin = inputOrigin;

  let [og, metadata] = await Promise.all([
    scrapeOg(origin).catch(() => {
      return null;
    }),
    scrapeMetadata(origin).catch(() => {
      return null;
    }),
  ]);

  if (origin.startsWith('https://api.')) {
    origin = `https://${origin.slice(12)}`;

    if (
      !['ogTitle', 'ogDescription', 'ogImage'].some(
        key => og?.[key as keyof OgObject]
      )
    ) {
      og = await scrapeOg(origin);
    }

    if (
      !metadata ||
      !(['title', 'description'] as const).some(key => key in (metadata ?? {}))
    ) {
      metadata = await scrapeMetadata(origin);
    }
  }

  return {
    og,
    metadata,
    origin,
  };
};
