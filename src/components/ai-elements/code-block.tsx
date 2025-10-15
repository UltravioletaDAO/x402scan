'use client';

import type { HTMLAttributes, ReactNode } from 'react';
import { createContext } from 'react';
import { cn } from '@/lib/utils';
import { Code } from '@/components/ui/code';
import type { BundledLanguage } from '@/components/ui/code/shiki.bundle';

type CodeBlockContextType = {
  code: string;
};

const CodeBlockContext = createContext<CodeBlockContextType>({
  code: '',
});

const CodeBlock = ({
  code,
  language,
  className,
  children,
  ...props
}: HTMLAttributes<HTMLDivElement> & {
  code: string;
  language: string;
  showLineNumbers?: boolean;
  children?: ReactNode;
}) => (
  <CodeBlockContext.Provider value={{ code }}>
    <div
      className={cn(
        'relative w-full overflow-hidden rounded-md border bg-background text-foreground',
        className
      )}
      {...props}
    >
      <div className="relative">
        <Code value={code} lang={language as BundledLanguage} />
        <Code value={code} lang={language as BundledLanguage} />
        {children && (
          <div className="absolute top-2 right-2 flex items-center gap-2">
            {children}
          </div>
        )}
      </div>
    </div>
  </CodeBlockContext.Provider>
);

export { CodeBlock };
