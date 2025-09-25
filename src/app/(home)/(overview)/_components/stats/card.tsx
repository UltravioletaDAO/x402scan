import React from "react";

import { Card, CardHeader } from "@/components/ui/card";

import type { LucideIcon } from "lucide-react";

interface Props {
  label: string;
  value: React.ReactNode;
  Icon: LucideIcon;
  children: React.ReactNode;
}

export const StatCard: React.FC<Props> = ({ children, label, Icon, value }) => {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="space-y-0 bg-muted border-b">
        <div className="flex items-center gap-2 pb-0">
          <Icon className="size-3 text-muted-foreground" />
          <h2 className="text-muted-foreground text-xs">{label}</h2>
        </div>
        <div className="text-2xl font-bold">{value}</div>
      </CardHeader>
      <div className="h-36 pt-2">{children}</div>
    </Card>
  );
};
