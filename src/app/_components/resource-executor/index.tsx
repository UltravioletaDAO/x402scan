'use client';

import { useState } from 'react';

import { Card, CardHeader } from '@/components/ui/card';

import { Header } from './header';
import { Form } from './form';

import type { ParsedX402Response } from '@/lib/x402/schema';
import { cn } from '@/lib/utils';

interface Props {
  resource: string;
  bazaarMethod?: string;
  className?: string;
}

export const ResourceExecutor: React.FC<Props> = ({
  resource,
  bazaarMethod,
  className,
}) => {
  const [init402Response, setInit402Response] =
    useState<ParsedX402Response | null>(null);

  return (
    <Card className={cn(className, 'overflow-hidden')}>
      <CardHeader className={cn('p-4 bg-muted', init402Response && 'border-b')}>
        <Header
          resource={resource}
          bazaarMethod={bazaarMethod}
          onX402Response={setInit402Response}
        />
      </CardHeader>
      {init402Response && (
        <Form
          resource={resource}
          x402Response={init402Response}
          bazaarMethod={bazaarMethod}
        />
      )}
    </Card>
  );
};
