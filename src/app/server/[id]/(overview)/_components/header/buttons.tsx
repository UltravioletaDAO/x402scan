import { Bot, MessagesSquare } from 'lucide-react';

import Link from 'next/link';

import { Button } from '@/components/ui/button';

interface Props {
  originId: string;
}

export const HeaderButtons: React.FC<Props> = ({}) => {
  return (
    <ButtonsContainer>
      <Link href={`/composer/chat`} prefetch={false}>
        <Button variant="turbo">
          <MessagesSquare className="size-4" />
          Try in Chat
        </Button>
      </Link>
      <Link href={`/resources/register`} prefetch={false}>
        <Button variant="outline">
          <Bot className="size-4" />
          Create Agent
        </Button>
      </Link>
    </ButtonsContainer>
  );
};

export const LoadingHeaderButtons = () => {
  return (
    <ButtonsContainer>
      <Link href={`/composer/chat`} prefetch={false}>
        <Button variant="turbo">
          <MessagesSquare className="size-4" />
          Try in Chat
        </Button>
      </Link>
      <Link href={`/resources/register`} prefetch={false}>
        <Button variant="outline">
          <Bot className="size-4" />
          Create Agent
        </Button>
      </Link>
    </ButtonsContainer>
  );
};

const ButtonsContainer = ({ children }: { children: React.ReactNode }) => {
  return <div className="flex flex-row gap-2">{children}</div>;
};
