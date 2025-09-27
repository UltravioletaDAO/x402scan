"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Play, Loader2 } from "lucide-react";
import { parseX402Response, type ParsedX402Response } from "@/lib/x402-schema";

type Step1Props = {
    resource: string;
    bazaarMethod?: string;
    onX402Response?: (response: ParsedX402Response | null) => void;
};

export function Step1({ resource, bazaarMethod: method, onX402Response }: Step1Props) {
    const [isLoading, setIsLoading] = useState(false);
    const [response, setResponse] = useState<unknown>(null);
    const [error, setError] = useState<string | null>(null);
    const [parseError, setParseError] = useState<string | null>(null);

    useEffect(() => {
        if (response && !error) {
            const parseResult = parseX402Response(response);
            if (parseResult.success) {
                onX402Response?.(parseResult.data);
                setParseError(parseResult.errors.length > 0 ? parseResult.errors.join("\n") : null);
            } else {
                onX402Response?.(null);
                setParseError(parseResult.errors.join("\n"));
            }
        } else {
            onX402Response?.(null);
        }
    }, [response, error, onX402Response]);

    const initialFetch = async () => {
        setIsLoading(true);
        setError(null);
        setResponse(null);
        try {
            const proxyResponse = await fetch("/api/test-402", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    url: resource,
                    method: method || "GET",
                    outputSchema: null,
                }),
            });

            if (!proxyResponse.ok) {
                const text = await proxyResponse.text();
                throw new Error(text || `Request failed with ${proxyResponse.status}`);
            }
            const data = await proxyResponse.json().catch(() => null);
            setResponse(data);

            // Parsing is now handled in the useEffect above
        } catch (err) {
            const message = err instanceof Error ? err.message : "Unknown error";
            setError(message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center">
                <h2 className="text-md font-medium tracking-tight">Initial Fetch</h2>
                <Button variant="ghost" size="sm" onClick={initialFetch} disabled={isLoading}>
                    {isLoading ? (
                        <>
                            <Loader2 className="size-4 animate-spin" />
                            Fetching
                        </>
                    ) : (
                        <>
                            <Play className="size-4" />
                            Play
                        </>
                    )}
                </Button>
            </div>

            {error && <p className="mt-2 text-sm text-red-600">{error}</p>}

            {response !== null && (
                <pre className="mt-3 max-h-60 overflow-auto rounded-md bg-muted p-3 text-xs">
                    {JSON.stringify(response, null, 2)}
                </pre>
            )}

            {parseError && <p className="mt-2 text-sm text-yellow-600">{parseError}</p>}
        </div>
    );
}

