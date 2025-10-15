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
  const { data: tools, isLoading } = api.availableTools.list.useQuery();

  const [searchQuery, setSearchQuery] = useState('');

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!tools) {
    return <div>No tools found</div>;
  }

  return (
    <Command className="bg-transparent">
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
        <CommandEmpty>No tools match your search</CommandEmpty>
        {selectedTools.length > 0 && (
          <CommandGroup className="p-0" heading="Enabled">
            {tools
              .filter(tool => selectedTools.includes(tool.name))
              .map(tool => (
                <ToolItem
                  key={tool.id}
                  tool={tool.name}
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
              .filter(tool => !selectedTools.some(t => t === tool.name))
              .map(tool => {
                return (
                  <ToolItem
                    key={tool.id}
                    tool={tool.name}
                    favicon={tool.origin.favicon}
                    resource={tool.resource}
                    price={BigInt(tool.maxAmountRequired)}
                    description={tool.description}
                    isSelected={selectedTools.some(t => t === tool.name)}
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
