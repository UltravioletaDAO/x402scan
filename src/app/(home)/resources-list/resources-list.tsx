"use client";

import { useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Stepper } from "./stepper";

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
  // URLs to filter out for quick prototyping
  const failingUrls = [
    // 'https://aeon-qrpay-sbx.alchemytech.cc/open/ai/402/payment',
    // 'https://agentanalyst-production.up.railway.app/api/analyze',
    'https://api.prixe.io/x402/last_sold',
    // 'https://api.prixe.io/x402/search',
    // 'https://daa254c34060.ngrok-free.app/weather',
    // 'https://macrotrendsanalyst-production.up.railway.app/api/analyze',
    // 'https://priceagent-production.up.railway.app/api/prices',
    // 'https://scoutpay-production.up.railway.app/api/prices',
    // 'https://smartanalyst-production.up.railway.app/api/analyze',
    // 'https://x402-hello-agent-production.up.railway.app/api/hello',
    // 'https://x402-test.vercel.app/blog'
  ];

  const filteredAccepts = useMemo(() => {
    return accepts.filter(accept => !failingUrls.includes(accept.resource));
  }, [accepts]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Resources</h2>
        <span className="text-sm text-gray-500">
          {filteredAccepts.length} resources ({accepts.length - filteredAccepts.length} filtered out)
        </span>
      </div>

      {filteredAccepts.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          No resources available
        </div>
      ) : (
        <div className="space-y-3">
          {filteredAccepts.map((accept) => (
            <Card key={accept.id}>
              <CardContent className="p-4">
                <Stepper resource={accept.resource} bazaarMethod={accept.outputSchema?.input?.method} />
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}