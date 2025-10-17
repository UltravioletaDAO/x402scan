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
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';

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
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const { data: resourcesData, isLoading } = api.availableTools.list.useQuery({
    searchQuery: searchQuery.trim().length > 0 ? searchQuery.trim() : undefined,
    tagIds: selectedTags.length > 0 ? selectedTags : undefined,
  });
  const { data: tagsData, isLoading: isLoadingTags } =
    api.resourceTags.list.useQuery();

  const resources = resourcesData ?? [];

  return (
    <Command className="bg-transparent" shouldFilter={false}>
      <CommandInput
        placeholder="Search tools..."
        value={searchQuery}
        onValueChange={setSearchQuery}
      />
      <div className="my-2">
        <div className="text-muted-foreground mb-1.5 px-2 text-xs font-medium">
          Categories
        </div>
        <div className="no-scrollbar flex gap-1 overflow-x-auto px-2">
          {isLoadingTags
            ? Array.from({ length: 3 }).map((_, index) => (
                <Skeleton key={index} className="w-12 h-[22px]" />
              ))
            : tagsData?.map(tag => (
                <Badge
                  key={tag.id}
                  variant={
                    selectedTags.includes(tag.id) ? 'default' : 'outline'
                  }
                  className="shrink-0 cursor-pointer gap-1 px-1.5 py-0.5"
                  onClick={() =>
                    setSelectedTags(prev =>
                      prev.includes(tag.id)
                        ? prev.filter(t => t !== tag.id)
                        : [...prev, tag.id]
                    )
                  }
                >
                  {tag.name}
                </Badge>
              ))}
        </div>
      </div>
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
          <CommandGroup className="p-0" heading="Selected">
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
          <CommandGroup className="p-0" heading="Tools">
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
