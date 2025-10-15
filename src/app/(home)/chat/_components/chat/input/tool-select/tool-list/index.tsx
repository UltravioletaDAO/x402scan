import React, { useState } from 'react';

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandList,
} from '@/components/ui/command';

import { ToolItem } from './item';
import { api } from '@/trpc/client';
import { Loader2, SearchX } from 'lucide-react';

interface Props {
  selectedTools: string[];
  onAddTool: (tool: string) => void;
  onRemoveTool: (id: string) => void;
  gradientClassName?: string;
}

const toolItemHeight = 48;
const numToolsToShow = 5;

export const ToolList: React.FC<Props> = ({
  selectedTools,
  onAddTool,
  onRemoveTool,
  gradientClassName,
}) => {
  const { data: toolsData, isLoading } = api.availableTools.list.useQuery();

  const [searchQuery, setSearchQuery] = useState('');

  const tools = toolsData ?? [];

  return (
    <Command
      className="bg-transparent"
      filter={(val, search) => {
        return val.toLowerCase().includes(search.toLowerCase()) ? 1 : 0;
      }}
    >
      <CommandInput
        placeholder="Search tools..."
        value={searchQuery}
        onValueChange={setSearchQuery}
      />
      <CommandList
        style={{
          height: `${toolItemHeight * (numToolsToShow + 0.5)}px`,
        }}
        gradientClassName={gradientClassName}
      >
        <CommandEmpty
          className="flex flex-col items-center justify-center gap-4 p-8 text-center text-sm text-muted-foreground"
          style={{
            height: `${toolItemHeight * numToolsToShow}px`,
          }}
        >
          {isLoading ? (
            <Loader2 className="size-10 animate-spin" />
          ) : (
            <SearchX className="size-10" />
          )}
          <h2>{isLoading ? 'Loading...' : 'No tools match your search'}</h2>
        </CommandEmpty>
        {selectedTools.length > 0 && (
          <CommandGroup className="p-0" heading="Enabled">
            {tools
              .filter(tool => selectedTools.includes(tool.resource))
              .map(tool => (
                <ToolItem
                  key={tool.id}
                  favicon={tool.origin.favicon}
                  resource={tool.resource}
                  price={BigInt(tool.maxAmountRequired)}
                  description={tool.description}
                  isSelected={true}
                  addTool={onAddTool}
                  removeTool={onRemoveTool}
                />
              ))}
          </CommandGroup>
        )}
        {tools.length > selectedTools.length && (
          <CommandGroup className="p-0" heading="Available">
            {tools
              .filter(tool => !selectedTools.some(t => t === tool.resource))
              .map(tool => {
                return (
                  <ToolItem
                    key={tool.id}
                    favicon={tool.origin.favicon}
                    resource={tool.resource}
                    price={BigInt(tool.maxAmountRequired)}
                    description={tool.description}
                    isSelected={selectedTools.some(t => t === tool.resource)}
                    addTool={onAddTool}
                    removeTool={onRemoveTool}
                  />
                );
              })}
          </CommandGroup>
        )}
      </CommandList>
    </Command>
  );
};
