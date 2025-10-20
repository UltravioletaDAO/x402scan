import Link from 'next/link';

import { Bot, Edit } from 'lucide-react';

import { Heading } from '@/app/_components/layout/page-utils';
import { Button } from '@/components/ui/button';

export const ComposerHomeHeading = () => {
  return (
    <Heading
      title="Composer"
      description="A playground for building agents that pay for inference and resources with x402"
      actions={
        <div className="flex items-center gap-2">
          <Link href="/composer/chat">
            <Button variant="outline">
              <Edit className="size-4" />
              New Chat
            </Button>
          </Link>
          <Link href="/composer/agent/new">
            <Button variant="turbo">
              <Bot className="size-4" />
              New Agent
            </Button>
          </Link>
        </div>
      }
    />
  );
};
