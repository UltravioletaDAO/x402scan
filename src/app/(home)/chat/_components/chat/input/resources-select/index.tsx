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

import { ToolList } from './tool-list';

import { useIsMobile } from '@/hooks/use-mobile';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface Props {
  resourceIds: string[];
  onSelectResource: (resourceId: string) => void;
}

export const ToolSelect: React.FC<Props> = ({
  resourceIds,
  onSelectResource,
}) => {
  const isMobile = useIsMobile();

  const content = (
    <div className={cn('w-full max-w-full')}>
      <ToolList
        selectedResourceIds={resourceIds}
        onSelectResource={onSelectResource}
        gradientClassName="md:from-popover"
      />
    </div>
  );

  const trigger = (
    <Button variant="outline" size="sm">
      <span className="text-xs">
        {resourceIds.length > 0
          ? `${resourceIds.length} Tool${resourceIds.length > 1 ? 's' : ''}`
          : 'Select Tools'}
      </span>
    </Button>
  );

  if (isMobile) {
    return (
      <Drawer>
        <DrawerTrigger asChild>{trigger}</DrawerTrigger>
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
      <PopoverTrigger asChild>{trigger}</PopoverTrigger>
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
