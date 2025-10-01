'use client';

import { Card, CardHeader } from '@/components/ui/card';

import { Header } from './header/header';
import { Form } from './form';

import { cn } from '@/lib/utils';
import type { Methods } from '@/types/methods';
import { ResourceExecutorProvider } from './context/provider';
import { useResourceExecutor } from './context/hook';

import type { Resources } from '@prisma/client';

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
      <Card className={cn(className, 'overflow-hidden')}>
        <CardHeader className="bg-muted px-4 py-2">
          <Header resource={resource} />
        </CardHeader>
        <FormWrapper />
      </Card>
    </ResourceExecutorProvider>
  );
};

function FormWrapper() {
  const { response } = useResourceExecutor();

  if (!response) return null;
  return <Form x402Response={response} />;
}
