import { Skeleton } from '@/components/ui/skeleton';

import Link from 'next/link';
import { Button } from '@/components/ui/button';

interface Props {
  agentConfigurationId: string;
}

export const HeaderButtons: React.FC<Props> = async ({
  agentConfigurationId,
}) => {
  return (
    <ButtonsContainer>
      <Link href={`/composer/agent/${agentConfigurationId}/chat`}>
        <Button variant="turbo">Use Agent</Button>
      </Link>
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
