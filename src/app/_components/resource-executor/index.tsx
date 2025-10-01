'use client';

import { Card, CardHeader } from '@/components/ui/card';

import { Header } from './header';
import { Form } from './form';

import { cn } from '@/lib/utils';
import type { Methods } from '@/types/methods';
import { ResourceExecutorProvider } from './context/provider';
import { useResourceExecutor } from './context/hook';

interface Props {
  resource: string;
  bazaarMethod?: Methods;
  className?: string;
}

export const ResourceExecutor: React.FC<Props> = ({
  resource,
  bazaarMethod,
  className,
}) => {
  return (
    <ResourceExecutorProvider resource={resource} method={bazaarMethod}>
      <Card className={cn(className, 'overflow-hidden')}>
        <CardHeader>
          <Header />
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
