import { useMemo, useState } from 'react';

import { ResourceFetchContext } from './context';

import { useX402Fetch } from '@/app/_hooks/x402/use-fetch';

import { useResourceCheck } from '../resource-check/hook';

import type { ParsedX402Response } from '@/lib/x402/schema';
import type { FieldDefinition } from '@/types/x402';

type Accept = NonNullable<ParsedX402Response['accepts']>[number];

interface Props {
  children: React.ReactNode;
  inputSchema: NonNullable<Accept['outputSchema']>['input'];
  maxAmountRequired: bigint;
}

export const ResourceFetchProvider: React.FC<Props> = ({
  children,
  inputSchema,
  maxAmountRequired,
}) => {
  const { resource, method } = useResourceCheck();

  const queryFields = useMemo(
    () => getFields(inputSchema.queryParams),
    [inputSchema]
  );
  const bodyFields = useMemo(
    () => getFields(inputSchema.bodyFields),
    [inputSchema]
  );

  const [queryValues, setQueryValues] = useState<Record<string, string>>({});
  const [bodyValues, setBodyValues] = useState<Record<string, string>>({});

  const handleQueryChange = (name: string, value: string) => {
    setQueryValues(prev => ({ ...prev, [name]: value }));
  };

  const handleBodyChange = (name: string, value: string) => {
    setBodyValues(prev => ({ ...prev, [name]: value }));
  };

  const allRequiredFieldsFilled = useMemo(() => {
    const requiredQuery = queryFields.filter(field => field.required);
    const requiredBody = bodyFields.filter(field => field.required);

    const queryFilled = requiredQuery.every(
      field =>
        queryValues[field.name] && queryValues[field.name].trim().length > 0
    );
    const bodyFilled = requiredBody.every(
      field =>
        bodyValues[field.name] && bodyValues[field.name].trim().length > 0
    );

    return queryFilled && bodyFilled;
  }, [queryFields, bodyFields, queryValues, bodyValues]);

  const queryEntries = Object.entries(queryValues).reduce<
    Array<[string, string]>
  >((acc, [key, value]) => {
    const trimmed = value.trim();
    if (trimmed.length > 0) {
      acc.push([key, trimmed]);
    }
    return acc;
  }, []);

  // Build URL with query parameters
  const targetUrl = useMemo(() => {
    if (queryEntries.length === 0) return resource;
    const searchParams = new URLSearchParams(queryEntries);
    const separator = resource.includes('?') ? '&' : '?';
    return `${resource}${separator}${searchParams.toString()}`;
  }, [resource, queryEntries]);

  const bodyEntries = Object.entries(bodyValues).reduce<
    Array<[string, string]>
  >((acc, [key, value]) => {
    const trimmed = value.trim();
    if (trimmed.length > 0) {
      acc.push([key, trimmed]);
    }
    return acc;
  }, []);

  console.log(maxAmountRequired);

  const {
    data: response,
    mutate: execute,
    isPending,
    error,
  } = useX402Fetch(targetUrl, maxAmountRequired, {
    method,
    body:
      bodyEntries.length > 0
        ? JSON.stringify(Object.fromEntries(bodyEntries))
        : undefined,
  });

  return (
    <ResourceFetchContext.Provider
      value={{
        queryValues,
        bodyValues,
        queryFields,
        bodyFields,
        handleQueryChange,
        handleBodyChange,
        allRequiredFieldsFilled,
        execute,
        isPending,
        error: error?.message ?? null,
        response,
        maxAmountRequired,
      }}
    >
      {children}
    </ResourceFetchContext.Provider>
  );
};

function getFields(
  record: Record<string, unknown> | null | undefined
): FieldDefinition[] {
  if (!record) {
    return [];
  }

  return Object.entries(record).map(([name, raw]) => {
    if (typeof raw === 'string') {
      return { name, type: raw } satisfies FieldDefinition;
    }

    return {
      name,
      type:
        typeof raw === 'object' &&
        raw &&
        'type' in raw &&
        typeof (raw as Record<string, unknown>).type === 'string'
          ? ((raw as Record<string, unknown>).type as string)
          : undefined,
      description:
        typeof raw === 'object' &&
        raw &&
        'description' in raw &&
        typeof (raw as Record<string, unknown>).description === 'string'
          ? ((raw as Record<string, unknown>).description as string)
          : undefined,
      required:
        typeof raw === 'object' &&
        raw &&
        'required' in raw &&
        typeof (raw as Record<string, unknown>).required === 'boolean'
          ? ((raw as Record<string, unknown>).required as boolean)
          : undefined,
    } satisfies FieldDefinition;
  });
}
