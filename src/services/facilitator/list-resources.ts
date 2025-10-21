import 'server-only';

import type {
  FacilitatorConfig,
  ListDiscoveryResourcesRequest,
  ListDiscoveryResourcesResponse,
} from 'x402/types';
import { useFacilitator as facilitatorUtils } from 'x402/verify';
import type { ExtendedFacilitatorConfig } from './facilitators';

type FacilitatorResource = Awaited<
  ReturnType<typeof listFacilitatorResources>
>['items'][number];

const listFacilitatorResources = async (
  facilitator: ExtendedFacilitatorConfig,
  config?: ListDiscoveryResourcesRequest
) => {
  if (facilitator.useListEndpoint) {
    return await listResourcesFromListEndpoint(facilitator, config);
  }
  // NOTE(shafu): use the default discovery endpoint
  return await facilitatorUtils(facilitator).list(config);
};

// Custom function to fetch from /list endpoint
const listResourcesFromListEndpoint = async (
  facilitator: FacilitatorConfig,
  config?: ListDiscoveryResourcesRequest
): Promise<ListDiscoveryResourcesResponse> => {
  const params = new URLSearchParams(
    Object.fromEntries(
      Object.entries(config ?? {}).map(([key, value]) => [key, value?.toString() ?? ''])
    )
  ).toString();
  const url = `${facilitator.url}/list`;
  const res = await fetch(`${url}?${params}`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  });

  if (res.status !== 200) {
    throw new Error(`Failed to list resources: ${res.status} ${res.statusText}`);
  }

  const data = (await res.json()) as ListDiscoveryResourcesResponse;
  return data;
};

export const listAllFacilitatorResources = async (
  facilitator: FacilitatorConfig
) => {
  let hasMore = true;
  let offset = 0;
  const allItems: FacilitatorResource[] = [];
  while (hasMore) {
    const { pagination, items } = await listFacilitatorResources(facilitator, {
      offset,
      limit: 100,
    });
    allItems.push(...items);
    if (pagination.total > pagination.offset + pagination.limit) {
      hasMore = true;
      offset += pagination.limit;
    } else {
      hasMore = false;
    }
  }
  return allItems;
};
