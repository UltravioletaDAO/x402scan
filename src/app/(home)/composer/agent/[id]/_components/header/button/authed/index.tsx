import Link from 'next/link';

import { Button } from '@/components/ui/button';

import { JoinButton } from './join';

import { api } from '@/trpc/server';

interface Props {
  agentConfigurationId: string;
}

export const AuthedButton: React.FC<Props> = async ({
  agentConfigurationId,
}) => {
  const isMember =
    await api.user.agentConfigurations.isMember(agentConfigurationId);

  if (isMember) {
    return (
      <Link href={`/composer/agent/${agentConfigurationId}/chat`}>
        <Button variant="turbo">Use Agent</Button>
      </Link>
    );
  }

  return <JoinButton agentConfigurationId={agentConfigurationId} />;
};
