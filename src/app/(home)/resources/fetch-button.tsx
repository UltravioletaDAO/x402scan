"use client";

import { useState } from "react";
import { type OutputSchema, parseX402Response, type ParsedX402Response } from '@/lib/x402-schema';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

interface FetchResponse {
  status: number;
  statusText: string;
  headers: Record<string, string>;
  body: string;
}

interface FetchButtonProps {
  url: string;
  outputSchema?: OutputSchema;
  optimisticSchema?: any;
}

export function FetchButton({ url, outputSchema, optimisticSchema }: FetchButtonProps) {
  const [response, setResponse] = useState<FetchResponse | null>(null);
  const [parsed402, setParsed402] = useState<ParsedX402Response | null>(null);
  const [parseError, setParseError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [schemaMatch, setSchemaMatch] = useState<boolean | null>(null);
  const [schemaDifferences, setSchemaDifferences] = useState<SchemaDifference[]>([]);

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch (err) {
      console.error('Failed to copy to clipboard:', err);
    }
  };

  interface SchemaDifference {
    path: string;
    type: 'missing' | 'added' | 'changed';
    expected?: any;
    actual?: any;
  }

  const findSchemaDifferences = (optimistic: any, actual: any, path: string = ''): SchemaDifference[] => {
    const differences: SchemaDifference[] = [];

    // Handle null/undefined cases
    if (optimistic === null && actual === null) return differences;
    if (optimistic === undefined && actual === undefined) return differences;

    if (optimistic === null || optimistic === undefined) {
      if (actual !== null && actual !== undefined) {
        differences.push({ path, type: 'added', actual });
      }
      return differences;
    }

    if (actual === null || actual === undefined) {
      differences.push({ path, type: 'missing', expected: optimistic });
      return differences;
    }

    // Different types
    if (typeof optimistic !== typeof actual) {
      differences.push({ path, type: 'changed', expected: optimistic, actual });
      return differences;
    }

    // Primitive values
    if (typeof optimistic !== 'object') {
      if (optimistic !== actual) {
        differences.push({ path, type: 'changed', expected: optimistic, actual });
      }
      return differences;
    }

    // Arrays
    if (Array.isArray(optimistic) && Array.isArray(actual)) {
      const maxLength = Math.max(optimistic.length, actual.length);
      for (let i = 0; i < maxLength; i++) {
        const currentPath = path ? `${path}[${i}]` : `[${i}]`;
        if (i >= optimistic.length) {
          differences.push({ path: currentPath, type: 'added', actual: actual[i] });
        } else if (i >= actual.length) {
          differences.push({ path: currentPath, type: 'missing', expected: optimistic[i] });
        } else {
          differences.push(...findSchemaDifferences(optimistic[i], actual[i], currentPath));
        }
      }
      return differences;
    }

    // Objects
    const optimisticKeys = Object.keys(optimistic || {});
    const actualKeys = Object.keys(actual || {});
    const allKeys = new Set([...optimisticKeys, ...actualKeys]);

    for (const key of allKeys) {
      const currentPath = path ? `${path}.${key}` : key;
      if (!(key in optimistic)) {
        differences.push({ path: currentPath, type: 'added', actual: actual[key] });
      } else if (!(key in actual)) {
        differences.push({ path: currentPath, type: 'missing', expected: optimistic[key] });
      } else {
        differences.push(...findSchemaDifferences(optimistic[key], actual[key], currentPath));
      }
    }

    return differences;
  };

  const compareSchemas = (optimistic: any, actual: any): boolean => {
    if (!optimistic && !actual) return true;
    if (!optimistic || !actual) return false;
    return JSON.stringify(optimistic) === JSON.stringify(actual);
  };

  const fetchRoute = async () => {
    setLoading(true);
    setParsed402(null);
    setParseError(null);
    setSchemaMatch(null);
    setSchemaDifferences([]);
    
    try {
      // Use our proxy API route to avoid CORS issues
      const method = outputSchema?.input?.method?.toUpperCase() || 'GET';
      
      const proxyResponse = await fetch('/api/test-402', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          url,
          method,
          outputSchema
        })
      });

      const result = await proxyResponse.json();
      
      const fetchResponse = {
        status: result.status,
        statusText: result.statusText,
        headers: result.headers,
        body: result.body
      };
      
      setResponse(fetchResponse);

      // If it's a 402 response, try to parse as X402, but show raw response if parsing fails
      if (result.status === 402 && result.body) {
        try {
          const jsonData = JSON.parse(result.body);
          const parseResult = parseX402Response(jsonData);

          if (parseResult.success) {
            setParsed402(parseResult.data);

            // Compare optimistic schema with actual response outputSchema
            const actualOutputSchema = parseResult.data.accepts?.[0]?.outputSchema;
            const match = compareSchemas(optimisticSchema, actualOutputSchema);
            setSchemaMatch(match);

            // Calculate differences if schemas don't match
            if (!match) {
              const differences = findSchemaDifferences(optimisticSchema, actualOutputSchema);
              setSchemaDifferences(differences);
            } else {
              setSchemaDifferences([]);
            }
          } else {
            // If parsing fails, still show the raw 402 response for debugging
            console.warn('X402 parsing failed:', parseResult.errors);
            setParseError(`Response does not match X402 schema: ${parseResult.errors.join(', ')}`);
          }
        } catch (error) {
          setParseError(`Failed to parse 402 response JSON: ${error instanceof Error ? error.message : 'Unknown parsing error'}`);
        }
      }
    } catch (error) {
      setResponse({
        status: 0,
        statusText: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`,
        headers: {},
        body: ''
      });
    }
    
    setLoading(false);
  };

  const formatValue = (value: any): string => {
    if (value === null) return 'null';
    if (value === undefined) return 'undefined';
    if (typeof value === 'string') return `"${value}"`;
    if (typeof value === 'object') return JSON.stringify(value, null, 2);
    return String(value);
  };

  const renderDifferences = () => {
    if (schemaDifferences.length === 0) return null;

    return (
      <div className="max-w-md max-h-60 overflow-y-auto space-y-2 text-xs">
        <div className="font-semibold text-red-700">Schema Differences:</div>
        {schemaDifferences.slice(0, 10).map((diff, index) => (
          <div key={index} className="border-l-2 border-red-300 pl-2 py-1">
            <div className="font-mono text-red-600 text-xs">{diff.path || '(root)'}</div>
            {diff.type === 'missing' && (
              <div className="text-red-700">
                <span className="text-red-500">Missing:</span> {formatValue(diff.expected)}
              </div>
            )}
            {diff.type === 'added' && (
              <div className="text-blue-700">
                <span className="text-blue-500">Added:</span> {formatValue(diff.actual)}
              </div>
            )}
            {diff.type === 'changed' && (
              <div className="space-y-1">
                <div className="text-red-700">
                  <span className="text-red-500">Expected:</span> {formatValue(diff.expected)}
                </div>
                <div className="text-blue-700">
                  <span className="text-blue-500">Actual:</span> {formatValue(diff.actual)}
                </div>
              </div>
            )}
          </div>
        ))}
        {schemaDifferences.length > 10 && (
          <div className="text-gray-500 text-xs">... and {schemaDifferences.length - 10} more differences</div>
        )}
      </div>
    );
  };

  const getSchemaIcon = () => {
    if (schemaMatch === null) return null;

    if (schemaMatch) {
      return (
        <Tooltip>
          <TooltipTrigger>
            <span className="text-green-600">✓</span>
          </TooltipTrigger>
          <TooltipContent>
            <p>Schemas match perfectly</p>
          </TooltipContent>
        </Tooltip>
      );
    }

    return (
      <Tooltip>
        <TooltipTrigger>
          <span className="text-red-600 cursor-help">⚠</span>
        </TooltipTrigger>
        <TooltipContent>
          {renderDifferences()}
        </TooltipContent>
      </Tooltip>
    );
  };

  return (
    <div>
      <div className="flex items-center gap-2">
        <button
          onClick={fetchRoute}
          disabled={loading}
          className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50 flex items-center gap-1"
        >
          {loading ? (
            <>Loading...</>
          ) : (
            <>▶ Play</>
          )}
        </button>
        {getSchemaIcon()}
      </div>

      {response && (
        <div className="mt-4 p-3 bg-gray-50 border rounded">
          <div className="flex justify-between items-start mb-2">
            <h4 className="font-semibold">Response:</h4>
            <button
              onClick={() => copyToClipboard(JSON.stringify(response, null, 2))}
              className="px-2 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Copy Full Response
            </button>
          </div>
          
          {response.status === 402 ? (
            <div>
              <div className="mb-3 p-2 bg-yellow-100 border border-yellow-300 rounded">
                <strong className="text-yellow-800">402 Payment Required</strong>
              </div>
              
              {parsed402 ? (
                <div className="space-y-3">
                  <div className="bg-white p-3 border rounded">
                    <h5 className="font-semibold text-green-700 mb-2">✓ Valid 402 Response</h5>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                      <div>
                        <strong>x402 Version:</strong> {parsed402.x402Version}
                      </div>
                      {parsed402.payer && (
                        <div>
                          <strong>Payer:</strong> <span className="font-mono text-xs">{parsed402.payer}</span>
                        </div>
                      )}
                      {parsed402.error && (
                        <div className="md:col-span-2">
                          <strong className="text-red-600">Error:</strong> {parsed402.error}
                        </div>
                      )}
                      {parsed402.accepts && parsed402.accepts.length > 0 && (
                        <div className="md:col-span-2">
                          <strong>Payment Options:</strong>
                          <div className="mt-1 space-y-2">
                            {parsed402.accepts.map((accept, idx) => (
                              <div key={idx} className="bg-gray-50 p-2 rounded border text-xs">
                                <div><strong>Network:</strong> {accept.network}</div>
                                <div><strong>Asset:</strong> {accept.asset}</div>
                                <div><strong>Max Amount:</strong> {accept.maxAmountRequired}</div>
                                <div><strong>Pay To:</strong> <span className="font-mono">{accept.payTo}</span></div>
                                <div><strong>Scheme:</strong> {accept.scheme}</div>
                                {accept.maxTimeoutSeconds && (
                                  <div><strong>Timeout:</strong> {accept.maxTimeoutSeconds}s</div>
                                )}
                                {accept.description && (
                                  <div><strong>Description:</strong> {accept.description}</div>
                                )}
                                {accept.resource && (
                                  <div><strong>Resource:</strong> {accept.resource}</div>
                                )}
                                {accept.mimeType && (
                                  <div><strong>MIME Type:</strong> {accept.mimeType}</div>
                                )}
                                {accept.outputSchema && (
                                  <div>
                                    <strong>Output Schema:</strong>
                                    <pre className="mt-1 bg-gray-100 p-1 rounded text-xs overflow-auto border max-h-24">
                                      {JSON.stringify(accept.outputSchema, null, 2)}
                                    </pre>
                                  </div>
                                )}
                                {accept.extra && (
                                  <div>
                                    <strong>Extra:</strong>
                                    <pre className="mt-1 bg-gray-100 p-1 rounded text-xs overflow-auto border max-h-24">
                                      {JSON.stringify(accept.extra, null, 2)}
                                    </pre>
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ) : parseError ? (
                <div className="bg-red-100 border border-red-300 p-3 rounded">
                  <strong className="text-red-800">✗ Parse Error:</strong>
                  <div className="text-red-700 text-sm mt-1">{parseError}</div>
                  <details className="mt-2">
                    <summary className="text-red-600 cursor-pointer text-sm">Show raw response</summary>
                    <pre className="mt-2 bg-white p-2 rounded text-xs overflow-auto border max-h-32">
                      {response.body}
                    </pre>
                  </details>
                </div>
              ) : response.body ? (
                <div className="bg-blue-100 border border-blue-300 p-3 rounded">
                  <strong className="text-blue-800">Raw 402 Response:</strong>
                  <pre className="mt-2 bg-white p-2 rounded text-xs overflow-auto border max-h-32">
                    {response.body}
                  </pre>
                </div>
              ) : null}
            </div>
          ) : (
            <div>
              <div className="mb-2 p-2 bg-red-100 border border-red-300 rounded">
                <strong className="text-red-800">Error {response.status}:</strong> {response.statusText}
              </div>
              {response.body && (
                <details>
                  <summary className="cursor-pointer text-sm text-gray-600">Show response body</summary>
                  <pre className="mt-2 bg-white p-2 rounded text-xs overflow-auto border max-h-32">
                    {response.body}
                  </pre>
                </details>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}