"use client";

import * as React from "react";
import {
  closestCenter,
  DndContext,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type UniqueIdentifier,
} from "@dnd-kit/core";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { ArrowDown, ArrowUp, ArrowUpDown, GripVertical } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

const sortingOptions = [
  { id: "tx_count", label: "Tx Count" },
  { id: "total_amount", label: "Total Amount" },
  { id: "latest_block_timestamp", label: "Latest Transaction" },
];

interface SortType {
  id: "tx_count" | "total_amount" | "latest_block_timestamp";
  desc: boolean;
}

interface Props {
  sorting: SortType[];
  setSorting: (sorting: SortType[]) => void;
}

function DragHandle({ id }: { id: string }) {
  const { attributes, listeners, setNodeRef, isDragging } = useSortable({
    id,
  });

  return (
    <Button
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      variant="ghost"
      size="icon"
      className="text-muted-foreground size-fit md:size-fit p-2 hover:bg-transparent cursor-grab active:cursor-grabbing"
      style={{
        opacity: isDragging ? 0.5 : 1,
      }}
    >
      <GripVertical className="text-muted-foreground size-3" />
      <span className="sr-only">Drag to reorder</span>
    </Button>
  );
}

interface SortableItemProps {
  sort: SortType;
  onToggle: () => void;
}

const SortableItem: React.FC<SortableItemProps> = ({ sort, onToggle }) => {
  const { setNodeRef, transform, transition, isDragging } = useSortable({
    id: sort.id,
  });

  return (
    <div
      ref={setNodeRef}
      className="flex items-center gap-2 border-b p-2"
      style={{
        transform: CSS.Transform.toString(transform),
        transition: transition,
        opacity: isDragging ? 0.5 : 1,
      }}
    >
      <DragHandle id={sort.id} />
      <p className="flex-1 text-sm font-medium">
        {sortingOptions.find((option) => option.id === sort.id)?.label ||
          sort.id}
      </p>
      <Button
        variant="outline"
        onClick={onToggle}
        size="icon"
        className="size-fit md:size-fit p-2"
      >
        <ArrowDown
          className={cn(
            "size-3 transition-transform duration-200",
            sort.desc ? "rotate-0" : "rotate-180"
          )}
        />
      </Button>
    </div>
  );
};

export const Sorting = ({ sorting, setSorting }: Props) => {
  const sensors = useSensors(
    useSensor(MouseSensor, {}),
    useSensor(TouchSensor, {}),
    useSensor(KeyboardSensor, {})
  );

  const sortingIds = React.useMemo<UniqueIdentifier[]>(
    () => sorting.map(({ id }) => id),
    [sorting]
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (active && over && active.id !== over.id) {
      const oldIndex = sorting.findIndex(
        (item: SortType) => item.id === active.id
      );
      const newIndex = sorting.findIndex(
        (item: SortType) => item.id === over.id
      );
      setSorting(arrayMove(sorting, oldIndex, newIndex));
    }
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="icon">
          <ArrowUpDown className="size-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0 overflow-hidden">
        <div className="flex flex-col relative overflow-hidden">
          <div className="p-2 border-b bg-muted">
            <h4 className="font-bold text-sm">Sort Order</h4>
            <p className="text-xs text-muted-foreground">
              The order in which the items are sorted.
            </p>
          </div>
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
            modifiers={[restrictToVerticalAxis]}
          >
            <SortableContext
              items={sortingIds}
              strategy={verticalListSortingStrategy}
            >
              {sorting.map((sort) => (
                <SortableItem
                  key={sort.id}
                  sort={sort}
                  onToggle={() =>
                    setSorting(
                      sorting.map((s) =>
                        s.id === sort.id ? { ...s, desc: !s.desc } : s
                      )
                    )
                  }
                />
              ))}
            </SortableContext>
          </DndContext>
        </div>
      </PopoverContent>
    </Popover>
  );
};
