'use client';

import { Bot } from 'lucide-react';

import Image from 'next/image';

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
  FieldLegend,
  FieldSet,
} from '@/components/ui/field';

import { api } from '@/trpc/client';

import { createAgentConfigurationSchema } from '@/services/db/agent-config/schema';

import { ResourceList } from '../../_components/resource-list';
import { Card } from '@/components/ui/card';

import { Body, Heading } from '@/app/_components/layout/page-utils';
import { Dropzone } from '@/components/ui/dropzone';
import { cn } from '@/lib/utils';

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

  const { mutate: uploadImage, isPending: isUploading } =
    api.user.upload.image.useMutation({
      onSuccess: ({ url }) => {
        form.setValue('image', url, {
          shouldValidate: true,
          shouldDirty: true,
          shouldTouch: true,
        });
      },
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
    <div className="flex w-full flex-1 h-0 flex-col pt-8 md:pt-12 overflow-y-auto relative">
      <Heading
        title="Create an Agent"
        description="Design an agent with x402 resources and custom behavior."
        className="md:max-w-2xl"
      />
      <Body className="max-w-2xl">
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full space-y-8"
        >
          <FieldSet>
            <FieldLegend>Display Information</FieldLegend>
            <FieldGroup className="flex flex-col md:flex-row bg-card border border-border rounded-md p-4 gap-4">
              <Controller
                control={form.control}
                name="image"
                render={({ field }) => (
                  <Field className="shrink-0 h-[156px] w-[136px]">
                    <FieldLabel htmlFor="image">Image</FieldLabel>
                    <Dropzone
                      accept={{
                        'image/*': ['.jpg', '.jpeg', '.png', '.webp'],
                      }}
                      maxFiles={1}
                      maxSize={5 * 1024 * 1024}
                      onDrop={async files => {
                        if (files.length === 0) {
                          toast.error('No file selected');
                          return;
                        }
                        uploadImage(files[0]);
                      }}
                      disabled={isUploading}
                      className={cn(
                        'flex-1 p-0 flex flex-col items-center justify-center gap-1 overflow-hidden bg-transparent',
                        field.value && 'border-none shadow-none'
                      )}
                    >
                      {field.value ? (
                        <Image
                          src={field.value}
                          alt="Profile Picture"
                          width={96}
                          height={96}
                          className="size-full hover:opacity-80 transition-opacity"
                          unoptimized
                        />
                      ) : (
                        <Bot className="size-16" />
                      )}
                    </Dropzone>
                  </Field>
                )}
              />
              <FieldGroup className="flex-1">
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
                        placeholder="Ex. Deep Research Agent"
                      />
                      <FieldError errors={[form.formState.errors.name]} />
                    </Field>
                  )}
                />
                <Controller
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <Field>
                      <FieldLabel htmlFor="description">Description</FieldLabel>
                      <Textarea
                        id="systemPrompt"
                        value={field.value}
                        onChange={field.onChange}
                        placeholder="Ex. A deep research agent with emailing capabilities"
                        rows={8}
                        className="resize-none"
                      />
                    </Field>
                  )}
                />
              </FieldGroup>
            </FieldGroup>
          </FieldSet>
          <FieldSet>
            <FieldLegend>Behavior</FieldLegend>
            <FieldGroup className="w-full items-start gap-6 flex flex-col">
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
              <Controller
                control={form.control}
                name="systemPrompt"
                render={({ field }) => (
                  <Field>
                    <FieldLabel htmlFor="systemPrompt">
                      System Prompt
                    </FieldLabel>
                    <Textarea
                      id="systemPrompt"
                      value={field.value}
                      onChange={field.onChange}
                      placeholder="Ex. You are a deep research agent that will email me a report on the latest x402 news each day."
                      rows={8}
                      className="resize-none"
                    />
                    <FieldDescription>
                      Define how your agent should behave. It is often helpful
                      to articulate how your tools should be used.
                    </FieldDescription>
                  </Field>
                )}
              />
            </FieldGroup>
          </FieldSet>
          <div className="sticky bottom-0 pb-2 bg-background">
            <Button
              type="submit"
              variant="turbo"
              disabled={isPending || !form.formState.isValid}
              className="w-full h-12 md:h-12 sticky bottom-0"
            >
              {isPending ? 'Creating...' : 'Create Agent'}
            </Button>
          </div>
        </form>
      </Body>
    </div>
  );
}
