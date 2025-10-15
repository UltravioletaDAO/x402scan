'use client';

import type { HTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { Code } from '@/components/ui/code';
import type { BundledLanguage } from '@/components/ui/code/shiki.bundle';

const CodeBlock = ({
  code,
  language,
  className,
  children,
  ...props
}: HTMLAttributes<HTMLDivElement> & {
  code: string;
  language: BundledLanguage;
  showLineNumbers?: boolean;
  children?: ReactNode;
}) => (
  <div
    className={cn(
      'relative w-full overflow-hidden rounded-md border bg-background text-foreground',
      className
    )}
    {...props}
  >
    <div className="relative">
      <Code value={code} lang={language} />
      {children && (
        <div className="absolute top-2 right-2 flex items-center gap-2">
          {children}
        </div>
      )}
    </div>
  </div>
);

export { CodeBlock };
