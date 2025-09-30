"use client";

import { useMemo } from "react";
import { GenericResourceCaller } from "./generic-resource-caller";

// TODO: Fix this type to use Prisma.
interface ResourcesListProps {
  accepts: Array<{
    id: string;
    resource: string;
    description: string;
    network: string;
    payTo: string;
    asset: string;
    outputSchema?: any;
    scheme: string;
  }>;
}

export function ResourcesList({ accepts }: ResourcesListProps) {
  return (
    <div className="space-y-4">

        <div className="space-y-3">
          {accepts.map((accept) => (
            <GenericResourceCaller key={accept.id} resource={accept.resource} bazaarMethod={accept.outputSchema?.input?.method} />
          ))}
        </div>
    </div>
  );
}