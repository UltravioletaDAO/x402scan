import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import type { ReactNode } from 'react';
import { Sidebar } from './_components/sidebar';

export default function ChatLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex-1 overflow-hidden h-0 flex flex-col -my-6 md:-my-8">
      <SidebarProvider className="flex-1 h-0 min-h-0">
        <Sidebar />
        <SidebarInset>{children}</SidebarInset>
      </SidebarProvider>
    </div>
  );
}
