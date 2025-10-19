'use client';

import Link from 'next/link';

import { Edit, Settings } from 'lucide-react';

import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import { usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { api } from '@/trpc/client';

export const NavMain = () => {
  const pathname = usePathname();
  const { data: session } = useSession();

  const isAgent = pathname.includes('/composer/agent/');
  const agentId = pathname.split('/')[3];

  const { data: agentConfiguration } =
    api.public.agentConfigurations.get.useQuery(agentId, {
      enabled: isAgent && !!session?.user.id,
    });

  const items = [
    {
      title: 'New Chat',
      url: isAgent
        ? (`/composer/agent/${agentId}` as const)
        : ('/composer/chat' as const),
      icon: Edit,
    },
    ...(isAgent && session?.user.id === agentConfiguration?.ownerId
      ? [
          {
            title: 'Edit Agent',
            url: `/composer/agent/${agentId}/edit` as const,
            icon: Settings,
          },
        ]
      : []),
  ];

  return (
    <SidebarGroup>
      <SidebarMenu>
        {items.map(item => (
          <SidebarMenuItem key={item.title}>
            <SidebarMenuButton key={item.title} tooltip={item.title} asChild>
              <Link href={item.url}>
                {item.icon && <item.icon />}
                <span>{item.title}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
};
