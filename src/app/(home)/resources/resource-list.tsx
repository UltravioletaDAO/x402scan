"use client";

import { useMemo } from "react";
import { Resource } from "./resource";

interface ResourceListProps {
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

export function ResourceList({ accepts }: ResourceListProps) {
  // URLs to filter out for quick prototyping
  const excludedUrls = [
    'https://aeon-qrpay-sbx.alchemytech.cc/open/ai/402/payment',
    'https://agentanalyst-production.up.railway.app/api/analyze',
    'https://api.prixe.io/x402/last_sold',
    'https://api.prixe.io/x402/search',
    'https://daa254c34060.ngrok-free.app/weather',
    'https://macrotrendsanalyst-production.up.railway.app/api/analyze',
    'https://priceagent-production.up.railway.app/api/prices',
    'https://scoutpay-production.up.railway.app/api/prices',
    'https://smartanalyst-production.up.railway.app/api/analyze',
    'https://x402-hello-agent-production.up.railway.app/api/hello',
    'https://x402-test.vercel.app/blog'
  ];

  const filteredAccepts = useMemo(() => {
    return accepts.filter(accept => !excludedUrls.includes(accept.resource));
  }, [accepts]);

  const generateSchemaDebugView = () => {
    const schemasText = filteredAccepts
      .map(accept => {
        const schemaJson = accept.outputSchema
          ? JSON.stringify(accept.outputSchema, null, 2)
          : 'null';
        return `${accept.resource}\n${schemaJson}`;
      })
      .join('\n\n---\n\n');

    return schemasText;
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Accepts</h2>
          <span className="text-sm text-gray-500">
            {filteredAccepts.length} resources ({accepts.length - filteredAccepts.length} filtered out)
          </span>
        </div>

        {filteredAccepts.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No resources available
          </div>
        ) : (
          filteredAccepts.map((accept) => (
            <Resource key={accept.id} accept={accept} />
          ))
        )}
      </div>

      {/* Output Schema Debug View */}
      <div className="border-t pt-6">
        <h3 className="text-lg font-semibold mb-3">Output Schemas Debug View</h3>
        <textarea
          value={generateSchemaDebugView()}
          readOnly
          className="w-full h-96 p-3 text-xs font-mono bg-gray-50 border border-gray-300 rounded-md resize-none"
          placeholder="No schemas to display"
        />
      </div>
    </div>
  );
}