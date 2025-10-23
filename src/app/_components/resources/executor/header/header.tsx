'use client';

import { Method } from './method';
import { FetchButton } from './fetch-button';

import type { Resources } from '@prisma/client';
import type { Methods } from '@/types/x402';
import type { ParsedX402Response } from '@/lib/x402/schema';
import { Chains } from '@/app/_components/chains';
import { Chain } from '@/types/chain';

interface Props {
  resource: Resources;
  method: Methods;
  response: ParsedX402Response;
}

export const Header: React.FC<Props> = ({ resource, method, response }) => {
  return (
    <>
      <div className="flex md:items-center justify-between flex-col md:flex-row gap-4 md:gap-0 flex-1 px-4 py-2">
        <div className="flex items-center gap-2 flex-1 w-full md:w-auto">
          <Method method={method} />
          <span className="font-mono text-sm truncate">
            {resource.resource}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Chains
            chains={
              (response.accepts
                ?.map(accept => accept.network)
                .filter(network =>
                  Object.values(Chain).includes(network as Chain)
                ) ?? []) as Chain[]
            }
          />
          <FetchButton />
        </div>
      </div>
    </>
  );
};
