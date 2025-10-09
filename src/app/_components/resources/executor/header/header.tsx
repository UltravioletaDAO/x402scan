'use client';

import { Method } from './method';
import { FetchButton } from './fetch-button';

import { useResourceCheck } from '../contexts/resource-check/hook';

import type { Resources } from '@prisma/client';
import { Status } from './status';

interface Props {
  resource: Resources;
}

export const Header: React.FC<Props> = ({ resource }) => {
  const { rawResponse, method, error, parseErrors } = useResourceCheck();

  const hasError = Boolean(error) || parseErrors.length > 0;

  return (
    <>
      <div className="flex md:items-center justify-between flex-col md:flex-row gap-4 md:gap-0">
        <div className="flex items-center gap-2 flex-1 w-full md:w-auto">
          <Method method={method} />
          <span className="font-mono text-sm truncate">
            {resource.resource}
          </span>
          <Status />
        </div>
        {Boolean(rawResponse) && !hasError && <FetchButton />}
      </div>
    </>
  );
};
