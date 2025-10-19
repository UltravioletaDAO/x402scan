'use client';

import Image from 'next/image';

import { useRouter } from 'next/navigation';

import { toast } from 'sonner';

import { ConversationEmptyState } from '@/components/ai-elements/conversation';
import { api } from '@/trpc/client';

import type { RouterOutputs } from '@/trpc/client';

interface Props {
  agentConfiguration: NonNullable<
    RouterOutputs['public']['agentConfigurations']['get']
  >;
}
export const JoinAgent: React.FC<Props> = ({ agentConfiguration }) => {
  const router = useRouter();

  const { mutate: joinAgent, isPending } =
    api.user.agentConfigurations.join.useMutation({
      onSuccess: () => {
        toast.success('Agent configuration joined successfully');
        router.refresh();
      },
      onError: error => {
        toast.error(error.message);
      },
    });

  return (
    <div>
      <ConversationEmptyState
        title={agentConfiguration.name}
        description={agentConfiguration.description ?? 'No description'}
        icon={
          agentConfiguration.image ? (
            <Image
              src={agentConfiguration.image}
              alt={agentConfiguration.name}
              width={96}
              height={96}
              className="size-16 rounded-md overflow-hidden"
            />
          ) : undefined
        }
      />
    </div>
  );
};
