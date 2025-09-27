import { Card, CardContent } from "@/components/ui/card";
import { FetchButton } from "./fetch-button";
import { outputSchema, type OutputSchema } from "@/lib/x402-schema";

interface ResourceProps {
  accept: {
    id: string;
    resource: string;
    description: string;
    network: string;
    payTo: string;
    asset: string;
    outputSchema?: any;
    scheme: string;
  };
}

export function Resource({ accept }: ResourceProps) {
  return (
    <Card className="m-8">
      <CardContent className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Left side - Resource Information */}
          <div className="space-y-3">
            <div>
              <strong>Resource:</strong>
              <div className="text-sm text-gray-600 font-mono break-all mt-1">
                {accept.resource}
              </div>
            </div>
            
            <div>
              <strong>Description:</strong>
              <div className="text-sm text-gray-700 mt-1">
                {accept.description}
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <strong>Network:</strong>
                <div className="text-gray-700">{accept.network}</div>
              </div>
              <div>
                <strong>Scheme:</strong>
                <div className="text-gray-700">{accept.scheme}</div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <strong>Asset:</strong>
                <div className="text-gray-700">{accept.asset}</div>
              </div>
              <div>
                <strong>Pay To:</strong>
                <div className="font-mono text-xs text-gray-600 break-all">
                  {accept.payTo}
                </div>
              </div>
            </div>
            
            {accept.outputSchema && (
              <div>
                <strong>Output Schema:</strong>
                <pre className="mt-1 bg-gray-100 p-2 rounded text-xs overflow-auto border max-h-32">
                  {JSON.stringify(accept.outputSchema, null, 2)}
                </pre>
              </div>
            )}
          </div>
          
          {/* Right side - Fetch Button */}
          <div className="flex flex-col justify-start">
            <FetchButton
              url={accept.resource}
              outputSchema={accept.outputSchema ? outputSchema.safeParse(accept.outputSchema).data : undefined}
              optimisticSchema={accept.outputSchema}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}