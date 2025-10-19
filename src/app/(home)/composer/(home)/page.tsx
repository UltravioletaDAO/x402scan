import { Body, Heading } from '@/app/_components/layout/page-utils';
import { Agents } from './_components/agents';
import { Bot, Edit, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function ComposerPage() {
  return (
    <div className="py-6 md:py-8">
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
      <Body>
        <Agents />
      </Body>
    </div>
  );
}
