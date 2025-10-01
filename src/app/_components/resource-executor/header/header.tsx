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
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 flex-1">
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
