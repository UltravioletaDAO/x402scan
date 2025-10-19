'use client';

import Link from 'next/link';

import { Bot, Edit } from 'lucide-react';

import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';

export const NavMain = () => {
  const items = [
    {
      title: 'New Chat',
      url: '/chat' as const,
      icon: Edit,
    },
    {
      title: 'New Agent',
      url: '/agent/new' as const,
      icon: Bot,
    },
  ];

  return (
    <SidebarGroup>
      <SidebarMenu>
        {items.map(item => (
          <SidebarMenuItem key={item.title}>
            <SidebarMenuButton key={item.title} tooltip={item.title} asChild>
              <Link href={`/composer${item.url}`}>
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
