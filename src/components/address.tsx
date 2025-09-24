"use client";

import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";

interface Props {
  address: string;
  className?: string;
}

export const Address: React.FC<Props> = ({ address, className }) => {
  return (
    <Tooltip>
      <TooltipTrigger>
        <p
          className={cn("font-mono text-xs border rounded-md px-1", className)}
        >
          {address.slice(0, 6)}...{address.slice(-6)}
        </p>
      </TooltipTrigger>
      <TooltipContent>
        <p className="font-mono">{address}</p>
      </TooltipContent>
    </Tooltip>
  );
};
