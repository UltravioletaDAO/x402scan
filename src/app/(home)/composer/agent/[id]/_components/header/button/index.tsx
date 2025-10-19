import { Skeleton } from '@/components/ui/skeleton';

import { UnauthedButton } from './unauthed';
import { AuthedButton } from './authed';

import { auth } from '@/auth';

interface Props {
  agentConfigurationId: string;
}

export const HeaderButtons: React.FC<Props> = async ({
  agentConfigurationId,
}) => {
  const session = await auth();

  return (
    <ButtonsContainer>
      {session ? (
        <AuthedButton agentConfigurationId={agentConfigurationId} />
      ) : (
        <UnauthedButton />
      )}
    </ButtonsContainer>
  );
};

export const LoadingHeaderButtons = () => {
  return (
    <ButtonsContainer>
      <Skeleton className="h-8 md:h-9 w-24" />
    </ButtonsContainer>
  );
};

const ButtonsContainer = ({ children }: { children: React.ReactNode }) => {
  return <div className="flex flex-row gap-2">{children}</div>;
};
