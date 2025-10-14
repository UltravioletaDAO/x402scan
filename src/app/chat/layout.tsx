import type { ReactNode } from 'react';

export default function ChatLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-col overflow-hidden h-full">
      {children}
    </div>
  );
}

