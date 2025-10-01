'use client';

import { Card, CardHeader } from '@/components/ui/card';

import { Header } from './header/header';
import { Form } from './form';

import { cn } from '@/lib/utils';
import type { Methods } from '@/types/x402';
import { ResourceExecutorProvider } from './contexts/resource-check/provider';
import { useResourceCheck } from './contexts/resource-check/hook';

import type { Resources } from '@prisma/client';
import { ResourceFetchProvider } from './contexts/fetch/provider';

interface Props {
  resource: Resources;
  bazaarMethod?: Methods;
  className?: string;
}

export const ResourceExecutor: React.FC<Props> = ({
  resource,
  bazaarMethod,
  className,
}) => {
  return (
    <ResourceExecutorProvider
      resource={resource.resource}
      method={bazaarMethod}
    >
      <ResourceFetchWrapper>
        <Card className={cn(className, 'overflow-hidden')}>
          <CardHeader className="bg-muted px-4 py-2">
            <Header resource={resource} />
          </CardHeader>
          <FormWrapper />
        </Card>
      </ResourceFetchWrapper>
    </ResourceExecutorProvider>
  );
};

function ResourceFetchWrapper({ children }: { children: React.ReactNode }) {
  const { response } = useResourceCheck();

  if (!response) return children;

  const accept = response?.accepts?.[0];

  if (!accept) return null;

  const inputSchema = accept.outputSchema?.input;

  if (!inputSchema) return null;

  const maxAmountRequired = BigInt(accept.maxAmountRequired);

  return (
    <ResourceFetchProvider
      inputSchema={inputSchema}
      maxAmountRequired={maxAmountRequired}
    >
      {children}
    </ResourceFetchProvider>
  );
}

function FormWrapper() {
  const { response } = useResourceCheck();

  if (!response) return null;

  return <Form />;
}
