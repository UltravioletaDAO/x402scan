'use client';

import { createContext, useContext, useEffect, useState } from 'react';

import { Loader2, Search, SearchX } from 'lucide-react';

import { useRouter } from 'next/navigation';

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';

import { Origin } from '../_components/origins';

import { api } from '@/trpc/client';

import { ethereumAddressSchema } from '@/lib/schemas';

import type { Route } from 'next';
import { Resource } from '../_components/resource';

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
          <CommandEmpty className="flex flex-col items-center justify-center gap-2 p-8 text-center text-muted-foreground text-sm">
            {isLoadingOrigins || isLoadingResources ? (
              <>
                <Loader2 className="size-10 animate-spin" />
                <p>Loading...</p>
              </>
            ) : search.length > 0 ? (
              <>
                <SearchX className="size-10" />
                <p>No results found.</p>
              </>
            ) : (
              <>
                <Search className="size-10" />
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
                <CommandItem key={origin.id}>
                  <Origin
                    origin={origin}
                    addresses={Array.from(
                      new Set(
                        origin.resources.flatMap(resource =>
                          resource.accepts.map(accept => accept.payTo)
                        )
                      )
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          )}
          {resources && resources.length > 0 && (
            <CommandGroup heading="Resources">
              {resources.map(resource => (
                <CommandItem key={resource.id}>
                  <Resource resource={resource} />
                </CommandItem>
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
