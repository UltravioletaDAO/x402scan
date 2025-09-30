"use client";

import { useEffect, useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Loader2, Play } from "lucide-react";
import { type ParsedX402Response } from "@/lib/x402-schema";
import { useX402Fetch } from "@/lib/use-x402-fetch";

const MICRO_FACTOR = 1_000_000n;
const VALUE_PATTERN = /^\d*(\.\d{0,6})?$/;

function formatMicrosToValue(value: string | undefined): string {
    if (!value) return "0";

    try {
        const micros = BigInt(value);
        const whole = micros / MICRO_FACTOR;
        const fractional = (micros % MICRO_FACTOR).toString().padStart(6, "0").replace(/0+$/, "");
        return fractional ? `${whole}.${fractional}` : whole.toString();
    } catch {
        return "0";
    }
}

function parseValueToMicros(value: string): bigint {
    if (!value) return 0n;

    const [rawWhole, rawFraction = ""] = value.split(".");
    const whole = rawWhole === "" ? "0" : rawWhole;
    const fraction = (rawFraction + "000000").slice(0, 6);

    return BigInt(whole) * MICRO_FACTOR + BigInt(fraction || "0");
}

type FieldDefinition = {
    name: string;
    type?: string;
    description?: string;
    required?: boolean;
};

type FormProps = {
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

export function Form({ resource, x402Response }: FormProps) {
    const inputSchema = useMemo(() => {
        return x402Response.accepts?.[0]?.outputSchema?.input ?? null;
    }, [x402Response]);

    const queryFields = useMemo(() => getFields(inputSchema?.queryParams ?? null), [inputSchema]);
    const bodyFields = useMemo(() => getFields(inputSchema?.bodyFields ?? null), [inputSchema]);
    const [queryValues, setQueryValues] = useState<Record<string, string>>({});
    const [bodyValues, setBodyValues] = useState<Record<string, string>>({});
    const maxAmountRequired = x402Response.accepts?.[0]?.maxAmountRequired;
    const defaultValue = useMemo(() => formatMicrosToValue(maxAmountRequired), [maxAmountRequired]);
    const [valueInput, setValueInput] = useState<string>(defaultValue);

    useEffect(() => {
        setQueryValues({});
        setBodyValues({});
        setValueInput(defaultValue);
    }, [inputSchema, resource, defaultValue]);

    const handleQueryChange = (name: string, value: string) => {
        setQueryValues((prev) => ({ ...prev, [name]: value }));
    };

    const handleBodyChange = (name: string, value: string) => {
        setBodyValues((prev) => ({ ...prev, [name]: value }));
    };

    const handleValueChange = (next: string) => {
        if (next === "" || VALUE_PATTERN.test(next)) {
            setValueInput(next);
        }
    };

    const paymentValue = useMemo(() => parseValueToMicros(valueInput), [valueInput]);
    const method = x402Response.accepts?.[0]?.outputSchema?.input?.method?.toUpperCase() ?? "GET";

    const queryEntries = Object.entries(queryValues).reduce<Array<[string, string]>>((acc, [key, value]) => {
        const trimmed = value.trim();
        if (trimmed.length > 0) {
            acc.push([key, trimmed]);
        }
        return acc;
    }, []);

    // Build URL with query parameters
    const targetUrl = useMemo(() => {
        if (queryEntries.length === 0) return resource;
        const searchParams = new URLSearchParams(queryEntries);
        const separator = resource.includes("?") ? "&" : "?";
        return `${resource}${separator}${searchParams.toString()}`;
    }, [resource, queryEntries]);

    const bodyEntries = Object.entries(bodyValues).reduce<Array<[string, string]>>((acc, [key, value]) => {
        const trimmed = value.trim();
        if (trimmed.length > 0) {
            acc.push([key, trimmed]);
        }
        return acc;
    }, []);

    const init = {
        method,
        body: bodyEntries.length > 0
            ? JSON.stringify(Object.fromEntries(bodyEntries))
            : undefined,
    } satisfies RequestInit;

    const {
        data: response,
        mutate: execute,
        isPending,
        error,
    } = useX402Fetch(targetUrl, paymentValue, init);

    const hasSchema = inputSchema !== null;
    const showQuery = queryFields.length > 0;
    const showBody = bodyFields.length > 0;

    // Check if all required fields are filled
    const allRequiredFieldsFilled = useMemo(() => {
        const requiredQuery = queryFields.filter(field => field.required);
        const requiredBody = bodyFields.filter(field => field.required);

        const queryFilled = requiredQuery.every(field =>
            queryValues[field.name] && queryValues[field.name].trim().length > 0
        );
        const bodyFilled = requiredBody.every(field =>
            bodyValues[field.name] && bodyValues[field.name].trim().length > 0
        );

        return queryFilled && bodyFilled;
    }, [queryFields, bodyFields, queryValues, bodyValues]);

    return (
        <div className="mt-6 space-y-4">
            <div className="flex justify-between items-center">
                <h2 className="text-md font-medium tracking-tight">Execute</h2>
                <Button size="sm" variant="ghost" className="inline-flex items-center gap-2" disabled={isPending || !allRequiredFieldsFilled} onClick={() => execute()}>
                    {isPending ? (
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
            </div>

            {!hasSchema ? null : !showQuery && !showBody ? (
                <div className="space-y-4">
                    <p className="text-sm text-muted-foreground">No input parameters required.</p>
                    <div className="space-y-1">
                        <Label htmlFor="value">Value</Label>
                        <Input
                            id="value"
                            inputMode="decimal"
                            placeholder="0"
                            value={valueInput}
                            onChange={(event) => handleValueChange(event.target.value)}
                        />
                        <p className="text-xs text-muted-foreground">Default: ${defaultValue}</p>
                    </div>
                </div>
            ) : (
                <div className="space-y-4">
                    <div className="space-y-1">
                        <Label htmlFor="value">Value</Label>
                        <Input
                            id="value"
                            inputMode="decimal"
                            placeholder="0"
                            value={valueInput}
                            onChange={(event) => handleValueChange(event.target.value)}
                        />
                        <p className="text-xs text-muted-foreground">Default: ${defaultValue}</p>
                    </div>

                    {showQuery && (
                        <div className="space-y-3">
                            {queryFields.map((field) => (
                                <div key={`query-${field.name}`} className="space-y-1">
                                    <Label htmlFor={`query-${field.name}`}>
                                        {field.name}
                                        {field.required ? <span className="text-destructive">*</span> : null}
                                    </Label>
                                    <Input
                                        id={`query-${field.name}`}
                                        placeholder={field.description ?? field.type ?? "Value"}
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
                                        placeholder={field.description ?? field.type ?? "Value"}
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
                </div>
            )}

            {/* Error and response display - always visible */}
            {error && <p className="text-xs text-red-600 bg-red-50 p-3 rounded-md">{error.message}</p>}

            {response !== undefined && (
                <pre className="max-h-60 overflow-auto rounded-md bg-muted p-3 text-xs">
                    {JSON.stringify(response, null, 2)}
                </pre>
            )}
        </div>
    );
}