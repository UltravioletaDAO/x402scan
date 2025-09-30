'use client';

import { createContext, useContext, useEffect, useState } from 'react';

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { ethereumAddressSchema } from '@/lib/schemas';
import Link from 'next/link';
import { api } from '@/trpc/client';
import { useRouter } from 'next/navigation';
import type { Route } from 'next';
import { Globe, Loader2, Search, SearchX } from 'lucide-react';
import { Origins } from '../_components/origins';

interface SearchContext {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  search: string;
  setSearch: (search: string) => void;
}

const SearchContext = createContext<SearchContext>({
  isOpen: false,
  setIsOpen: () => {
    // do nothing
  },
  search: '',
  setSearch: () => {
    // do nothing
  },
});

export const SearchProvider = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();

  const [search, setSearch] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setIsOpen(isOpen => !isOpen);
      }
    };
    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  const { data: origins, isLoading: isLoadingOrigins } =
    api.origins.search.useQuery(
      {
        search,
        limit: 4,
      },
      {
        enabled: isOpen && search.length > 0,
      }
    );
  const { data: resources, isLoading: isLoadingResources } =
    api.resources.search.useQuery(
      {
        search,
        limit: 4,
      },
      {
        enabled: isOpen && search.length > 0,
      }
    );

  console.log(origins, resources);

  const handleSelect = <T extends string>(route: Route<T>) => {
    router.push(route);
    setIsOpen(false);
    setSearch('');
  };

  return (
    <SearchContext.Provider value={{ search, setSearch, isOpen, setIsOpen }}>
      <CommandDialog
        open={isOpen}
        onOpenChange={setIsOpen}
        shouldFilter={false}
      >
        <CommandInput
          placeholder="Type a command or search..."
          value={search}
          onValueChange={setSearch}
        />
        <CommandList>
          <CommandEmpty className="flex flex-col items-center justify-center gap-4 p-8 text-center text-muted-foreground text-sm">
            {isLoadingOrigins || isLoadingResources ? (
              <>
                <Loader2 className="size-8 animate-spin" />
                <p>Loading...</p>
              </>
            ) : search.length > 0 ? (
              <>
                <SearchX className="size-8" />
                <p>No results found.</p>
              </>
            ) : (
              <>
                <Search className="size-8" />
                <p>Search by address, origin, or resource.</p>
              </>
            )}
          </CommandEmpty>
          {ethereumAddressSchema.safeParse(search).success && (
            <>
              <CommandGroup heading="Server Addresses">
                <CommandItem
                  value={`${search}-server`}
                  onSelect={() => handleSelect(`/recipient/${search}`)}
                >
                  {search}
                </CommandItem>
              </CommandGroup>
              <CommandGroup heading="Buyer Addresses">
                <CommandItem
                  value={`${search}-buyer`}
                  onSelect={() => handleSelect(`/recipient/${search}`)}
                >
                  {search}
                </CommandItem>
              </CommandGroup>
            </>
          )}
          {origins && origins.length > 0 && (
            <CommandGroup heading="Origins">
              {origins.map(origin => (
                <CommandItem key={origin.resources[0].id}>
                  <Origins
                    origins={[origin]}
                    address={origin.resources[0].accepts[0].payTo}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          )}
          {resources && resources.length > 0 && (
            <CommandGroup heading="Resources">
              {resources.map(resource => (
                <CommandItem key={resource.id}>{resource.resource}</CommandItem>
              ))}
            </CommandGroup>
          )}
        </CommandList>
      </CommandDialog>
      {children}
    </SearchContext.Provider>
  );
};

export const useSearch = () => {
  return useContext(SearchContext);
};
