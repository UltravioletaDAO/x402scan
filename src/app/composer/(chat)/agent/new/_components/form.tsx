'use client';

import { useRouter } from 'next/navigation';

import { toast } from 'sonner';

import { api } from '@/trpc/client';

import { AgentForm } from '../../_components/form';

export const CreateAgentForm: React.FC = () => {
  const router = useRouter();

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

  return (
    <AgentForm
      onSubmit={data => {
        createAgent(data);
      }}
      isSubmitting={isPending}
      submitText={{
        default: 'Create Agent',
        submitting: 'Creating...',
      }}
    />
  );
};
