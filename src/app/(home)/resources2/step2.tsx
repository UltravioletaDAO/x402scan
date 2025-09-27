"use client";

import { useEffect, useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Loader2, Play } from "lucide-react";
import { type ParsedX402Response, type NormalizedInputSchema } from "@/lib/x402-schema";

type FieldDefinition = {
    name: string;
    type?: string;
    description?: string;
    required?: boolean;
};

type Step2Props = {
    resource: string;
    x402Response: ParsedX402Response;
    bazaarMethod?: string;
};

function getFields(record: Record<string, unknown> | null | undefined): FieldDefinition[] {
    if (!record) {
        return [];
    }

    return Object.entries(record).map(([name, raw]) => {
        if (typeof raw === "string") {
            return { name, type: raw } satisfies FieldDefinition;
        }

        return {
            name,
            type: typeof raw === "object" && raw && "type" in raw && typeof (raw as Record<string, unknown>).type === "string"
                ? ((raw as Record<string, unknown>).type as string)
                : undefined,
            description:
                typeof raw === "object" && raw && "description" in raw && typeof (raw as Record<string, unknown>).description === "string"
                    ? ((raw as Record<string, unknown>).description as string)
                    : undefined,
            required:
                typeof raw === "object" && raw && "required" in raw && typeof (raw as Record<string, unknown>).required === "boolean"
                    ? ((raw as Record<string, unknown>).required as boolean)
                    : undefined,
        } satisfies FieldDefinition;
    });
}

export function Step2({ resource, x402Response, bazaarMethod: method }: Step2Props) {
    const inputSchema = useMemo(() => {
        return x402Response.accepts?.[0]?.outputSchema?.input ?? null;
    }, [x402Response]);

    const queryFields = useMemo(() => getFields(inputSchema?.queryParams ?? null), [inputSchema]);
    const bodyFields = useMemo(() => getFields(inputSchema?.bodyFields ?? null), [inputSchema]);
    const [queryValues, setQueryValues] = useState<Record<string, string>>({});
    const [bodyValues, setBodyValues] = useState<Record<string, string>>({});
    const [isLoading, setIsLoading] = useState(false);
    const [response, setResponse] = useState<unknown>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        setQueryValues({});
        setBodyValues({});
        setResponse(null);
        setError(null);
    }, [inputSchema, resource]);

    const handleQueryChange = (name: string, value: string) => {
        setQueryValues((prev) => ({ ...prev, [name]: value }));
    };

    const handleBodyChange = (name: string, value: string) => {
        setBodyValues((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async () => {
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
                    queryParams: Object.fromEntries(
                        Object.entries(queryValues)
                            .map(([key, value]) => [key, value.trim()])
                            .filter(([, value]) => value.length > 0)
                    ),
                    bodyParams: Object.fromEntries(
                        Object.entries(bodyValues)
                            .map(([key, value]) => [key, value.trim()])
                            .filter(([, value]) => value.length > 0)
                    ),
                    outputSchema: null,
                }),
            });

            if (!proxyResponse.ok) {
                const text = await proxyResponse.text();
                throw new Error(text || `Request failed with ${proxyResponse.status}`);
            }

            const data = await proxyResponse.json().catch(() => null);
            setResponse(data);
        } catch (err) {
            const message = err instanceof Error ? err.message : "Unknown error";
            setError(message);
        } finally {
            setIsLoading(false);
        }
    };

    const hasSchema = inputSchema !== null;
    const showQuery = queryFields.length > 0;
    const showBody = bodyFields.length > 0;

    return (
        <div className="mt-6 space-y-4">
            <div>
                <h2 className="text-md font-medium tracking-tight">Query</h2>
            </div>

            {!hasSchema ? null : !showQuery && !showBody ? (
                <p className="text-sm text-muted-foreground">No input parameters required.</p>
            ) : (
                <div className="space-y-4">
                    <form
                        className="space-y-4"
                        onSubmit={(event) => {
                            event.preventDefault();
                            handleSubmit();
                        }}
                    >
                        {showQuery && (
                            <div className="space-y-3">
                                <h3 className="text-sm font-medium text-muted-foreground">Query Parameters</h3>
                                {queryFields.map((field) => (
                                    <div key={`query-${field.name}`} className="space-y-1">
                                        <Label htmlFor={`query-${field.name}`}>
                                            {field.name}
                                            {field.required ? <span className="text-destructive">*</span> : null}
                                        </Label>
                                        <Input
                                            id={`query-${field.name}`}
                                            placeholder={field.description || field.type || "Value"}
                                            value={queryValues[field.name] ?? ""}
                                            onChange={(event) => handleQueryChange(field.name, event.target.value)}
                                            aria-required={field.required}
                                        />
                                        {field.description && (
                                            <p className="text-xs text-muted-foreground">{field.description}</p>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}

                        {showBody && (
                            <div className="space-y-3">
                                <h3 className="text-sm font-medium text-muted-foreground">Body Parameters</h3>
                                {bodyFields.map((field) => (
                                    <div key={`body-${field.name}`} className="space-y-1">
                                        <Label htmlFor={`body-${field.name}`}>
                                            {field.name}
                                            {field.required ? <span className="text-destructive">*</span> : null}
                                        </Label>
                                        <Input
                                            id={`body-${field.name}`}
                                            placeholder={field.description || field.type || "Value"}
                                            value={bodyValues[field.name] ?? ""}
                                            onChange={(event) => handleBodyChange(field.name, event.target.value)}
                                            aria-required={field.required}
                                        />
                                        {field.description && (
                                            <p className="text-xs text-muted-foreground">{field.description}</p>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}

                        <Button type="submit" size="sm" variant="ghost" className="inline-flex items-center gap-2" disabled={isLoading}>
                            {isLoading ? (
                                <>
                                    <Loader2 className="size-4 animate-spin" />
                                    Fetching
                                </>
                            ) : (
                                <>
                                    <Play className="size-4" />
                                    Fetch
                                </>
                            )}
                        </Button>
                    </form>

                    {error && <p className="text-sm text-red-600">{error}</p>}

                    {response !== null && (
                        <pre className="max-h-60 overflow-auto rounded-md bg-muted p-3 text-xs">
                            {JSON.stringify(response, null, 2)}
                        </pre>
                    )}
                </div>
            )}
        </div>
    );
}

