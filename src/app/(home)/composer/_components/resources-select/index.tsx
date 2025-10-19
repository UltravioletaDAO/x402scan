import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

import { ResourceList } from './resource-list';

import { useIsMobile } from '@/hooks/use-mobile';

import { cn } from '@/lib/utils';

import type { SelectedResource } from '@/app/(home)/composer/chat/_lib/types';

interface Props {
  selectedResourceIds: string[];
  onSelectResource: (resource: SelectedResource) => void;
  children: React.ReactNode;
}

export const ResourcesSelect: React.FC<Props> = ({
  selectedResourceIds,
  onSelectResource,
  children,
}) => {
  const isMobile = useIsMobile();

  const content = (
    <div className={cn('w-full max-w-full')}>
      <ResourceList
        selectedResourceIds={selectedResourceIds}
        onSelectResource={onSelectResource}
        gradientClassName="md:from-popover"
      />
    </div>
  );

  if (isMobile) {
    return (
      <Drawer>
        <DrawerTrigger asChild>{children}</DrawerTrigger>
        <DrawerContent className="p-0">
          <DrawerHeader className="items-start px-3 pb-3">
            <DrawerTitle className="text-lg">Tools Selector</DrawerTitle>
            <DrawerDescription>
              Add x402 tools to give your agent more capabilities
            </DrawerDescription>
          </DrawerHeader>
          {content}
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Popover>
      <PopoverTrigger asChild>{children}</PopoverTrigger>
      <PopoverContent
        className="w-xs overflow-hidden p-0 md:w-lg"
        align="start"
        sideOffset={8}
      >
        {content}
      </PopoverContent>
    </Popover>
  );
};
