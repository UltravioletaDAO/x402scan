'use client';

import { Bot } from 'lucide-react';

import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { useRouter } from 'next/navigation';

import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field';

import { api } from '@/trpc/client';

import { createAgentConfigurationSchema } from '@/services/db/agent-config/schema';

import { ResourceList } from '../../_components/resource-list';
import { Card } from '@/components/ui/card';

import type z from 'zod';

export default function NewAgentPage() {
  const router = useRouter();

  const form = useForm({
    resolver: zodResolver(createAgentConfigurationSchema),
    defaultValues: {
      name: '',
      systemPrompt: '',
      resourceIds: [],
    },
    mode: 'onChange',
  });

  const { mutate: createAgent, isPending } =
    api.user.agentConfigurations.create.useMutation({
      onSuccess: agentConfiguration => {
        toast.success('Agent configuration created successfully');
        router.push(`/composer/agent/${agentConfiguration.id}`);
      },
      onError: error => {
        toast.error(error.message);
      },
    });

  const onSubmit = (data: z.infer<typeof createAgentConfigurationSchema>) => {
    createAgent(data);
  };

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col px-2 py-8 md:py-12">
      <div className="flex flex-col w-full items-start gap-8">
        <div className="flex items-center gap-2 md:gap-4">
          <Bot className="text-primary size-16" />
          <div className="gap-2">
            <div>
              <h1 className="text-2xl font-bold md:text-3xl">
                Create an Agent
              </h1>
              <p className="text-muted-foreground text-sm md:text-base">
                Design an agent with x402 resources and custom behavior.
              </p>
            </div>
          </div>
        </div>

        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full space-y-8"
        >
          <FieldGroup className="w-full items-start gap-6 flex flex-col">
            {/* Name Field */}
            <Controller
              control={form.control}
              name="name"
              render={({ field }) => (
                <Field>
                  <FieldLabel htmlFor="name">Name</FieldLabel>
                  <Input
                    id="name"
                    value={field.value}
                    onChange={field.onChange}
                    placeholder="Enter workbench name..."
                  />
                  <FieldError errors={[form.formState.errors.name]} />
                </Field>
              )}
            />
            <Controller
              control={form.control}
              name="systemPrompt"
              render={({ field }) => (
                <Field>
                  <FieldLabel htmlFor="systemPrompt">System Prompt</FieldLabel>
                  <Textarea
                    id="systemPrompt"
                    value={field.value}
                    onChange={field.onChange}
                    placeholder="Ex. You are a deep research agent that will email me a report on the latest x402 news each day."
                    rows={8}
                    className="resize-none"
                  />
                  <FieldDescription>
                    Define how your agent should behave. It is often helpful to
                    articulate how your tools should be used.
                  </FieldDescription>
                </Field>
              )}
            />

            <Controller
              control={form.control}
              name="resourceIds"
              render={({ field }) => (
                <Field>
                  <FieldContent>
                    <FieldLabel htmlFor="resourceIds">Tools</FieldLabel>
                  </FieldContent>
                  <Card>
                    <ResourceList
                      selectedResourceIds={field.value}
                      onSelectResource={resource => {
                        field.onChange(
                          field.value.includes(resource.id)
                            ? field.value.filter(id => id !== resource.id)
                            : [...field.value, resource.id]
                        );
                      }}
                    />
                  </Card>
                </Field>
              )}
            />
            <Button
              type="submit"
              variant="turbo"
              disabled={isPending || !form.formState.isValid}
              className="w-full h-12 md:h-12"
            >
              {isPending ? 'Creating...' : 'Create Agent'}
            </Button>
          </FieldGroup>
        </form>
      </div>
    </div>
  );
}
