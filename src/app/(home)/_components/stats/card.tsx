import React from "react";

import { Card } from "@/components/ui/card";

import type { LucideIcon } from "lucide-react";

interface Props {
  title: string;
  Icon: LucideIcon;
  children: React.ReactNode;
}

export const CardContainer: React.FC<Props> = ({ children, title, Icon }) => {
  return (
    <Card className="">
      <div className="flex items-center gap-2 p-4 pb-0">
        <Icon className="size-3 text-muted-foreground" />
        <h2 className="text-muted-foreground text-xs">{title}</h2>
      </div>
      {children}
    </Card>
  );
};
