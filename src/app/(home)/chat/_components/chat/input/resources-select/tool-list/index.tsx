import React, { useState } from 'react';

import { Loader2, SearchX } from 'lucide-react';

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandList,
} from '@/components/ui/command';

import { ResourceItem } from './item';

import { api } from '@/trpc/client';

interface Props {
  selectedResourceIds: string[];
  onSelectResource: (resourceId: string) => void;
  gradientClassName?: string;
}

const toolItemHeight = 48;
const numToolsToShow = 5;

export const ToolList: React.FC<Props> = ({
  selectedResourceIds,
  onSelectResource,
  gradientClassName,
}) => {
  const { data: resourcesData, isLoading } = api.availableTools.list.useQuery();

  const [searchQuery, setSearchQuery] = useState('');

  const resources = resourcesData ?? [];

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
        {selectedResourceIds.length > 0 && (
          <CommandGroup className="p-0" heading="Enabled">
            {resources
              .filter(resource => selectedResourceIds.includes(resource.id))
              .map(resource => (
                <ResourceItem
                  key={resource.id}
                  resource={resource}
                  isSelected={selectedResourceIds.includes(resource.id)}
                  onSelectResource={onSelectResource}
                />
              ))}
          </CommandGroup>
        )}
        {resources.length > selectedResourceIds.length && (
          <CommandGroup className="p-0" heading="Available">
            {resources
              .filter(
                resource => !selectedResourceIds.some(t => t === resource.id)
              )
              .map(resource => {
                return (
                  <ResourceItem
                    key={resource.id}
                    resource={resource}
                    isSelected={selectedResourceIds.includes(resource.id)}
                    onSelectResource={onSelectResource}
                  />
                );
              })}
          </CommandGroup>
        )}
      </CommandList>
    </Command>
  );
};
