'use client';

import { Button } from '@/components/ui/button';
import { api } from '@/trpc/client';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

interface Props {
  agentConfigurationId: string;
}

export const JoinButton: React.FC<Props> = ({ agentConfigurationId }) => {
  const router = useRouter();

  const { mutate: joinAgent, isPending } =
    api.user.agentConfigurations.join.useMutation({
      onSuccess: () => {
        router.push(`/composer/agent/${agentConfigurationId}/chat`);
      },
      onError: error => {
        toast.error(error.message);
      },
    });

  return (
    <Button
      variant="turbo"
      onClick={() => joinAgent(agentConfigurationId)}
      disabled={isPending}
    >
      Use Agent
    </Button>
  );
};
