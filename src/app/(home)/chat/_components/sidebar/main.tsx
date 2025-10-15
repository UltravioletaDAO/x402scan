'use client';

import Link from 'next/link';

import { Edit } from 'lucide-react';

import { usePathname } from 'next/navigation';

import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';

import type { Route } from 'next';

export const NavMain = () => {
  const pathname = usePathname();

  const agentId =
    pathname.split('/')[2] === 'new' ? undefined : pathname.split('/')[2];

  const items = [
    {
      title: 'New Chat',
      url: (agentId ? `/chat/${agentId}` : '/chat') as Route,
      icon: Edit,
    },
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
