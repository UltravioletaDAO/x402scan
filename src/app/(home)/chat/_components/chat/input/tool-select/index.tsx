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
  tools: string[];
  addTool: (tool: string) => void;
  removeTool: (id: string) => void;
}

export const ToolSelect: React.FC<Props> = ({ tools, addTool, removeTool }) => {
  const isMobile = useIsMobile();

  const content = (
    <div className={cn('w-full max-w-full')}>
      <ToolList
        selectedTools={tools}
        onAddTool={addTool}
        onRemoveTool={removeTool}
        gradientClassName="md:from-popover"
      />
    </div>
  );

  const trigger = (
    <Button variant="outline" size="sm">
      <span className="text-xs">
        {tools.length > 0
          ? `${tools.length} tool${tools.length > 1 ? 's' : ''}`
          : 'Select tools'}
      </span>
    </Button>
  );

  if (isMobile) {
    return (
      <Drawer>
        <DrawerTrigger asChild>{trigger}</DrawerTrigger>
        <DrawerContent className="p-0">
          <DrawerHeader className="items-start px-3 pb-3">
            <DrawerTitle className="text-lg">Toolkit Selector</DrawerTitle>
            <DrawerDescription>
              Add tools to give the model more capabilities
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
