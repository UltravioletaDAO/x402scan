'use client';

import { Body, Heading } from '@/app/_components/layout/page-utils';

import { CreateAgentForm } from './_components/form';

export default function NewAgentPage() {
  return (
    <div className="flex w-full flex-1 h-0 flex-col pt-8 md:pt-12 overflow-y-auto relative">
      <Heading
        title="Create an Agent"
        description="Design an agent with x402 resources and custom behavior."
        className="md:max-w-2xl"
      />
      <Body className="max-w-2xl">
        <CreateAgentForm />
      </Body>
    </div>
  );
}
