"use client";

import { useEffect, useMemo, useState } from "react";
import { type ParsedX402Response } from "@/lib/x402-schema";
import { useX402Test } from "@/lib/use-x402-fetch";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

type Step1Props = {
    resource: string;
    bazaarMethod?: string;
    onX402Response?: (response: ParsedX402Response | null) => void;
};

export function Step1({ resource, bazaarMethod: method, onX402Response }: Step1Props) {
    const { isLoading, response, rawResponse, error, x402Response, parseErrors } = useX402Test(
        resource,
        { method: method || "GET" },
        { enabled: true }
    );

    const [showDialog, setShowDialog] = useState(false);

    useEffect(() => {
        onX402Response?.(x402Response);
    }, [x402Response, onX402Response]);

    const price = useMemo(() => {
        const maxAmount = x402Response?.accepts?.[0]?.maxAmountRequired;
        if (!maxAmount) return "0.00";
        const value = Number(maxAmount) / 1_000_000;
        return value.toFixed(2);
    }, [x402Response]);

    const statusColor = useMemo(() => {
        if (isLoading) return "bg-gray-500";
        if (error || !response) return "bg-red-500";
        if (response && x402Response && parseErrors.length === 0) return "bg-green-500";
        if (response && (!x402Response || parseErrors.length > 0)) return "bg-red-500";
        return "bg-gray-500";
    }, [isLoading, error, response, x402Response, parseErrors]);

    const hasError = error || parseErrors.length > 0;
    const errorContent = error || parseErrors.join('\n');
    const hasResponse = !isLoading && (rawResponse || hasError);

    return (
        <>
            <div className="flex items-center justify-between py-2">
                <span className="font-mono text-sm truncate flex-1 mr-4">{resource}</span>
                {!hasError && <span className="font-bold font-mono text-sm mr-4">${price}</span>}
                <div
                    className={`w-3 h-3 rounded-full ${statusColor} ${hasResponse ? 'cursor-pointer' : ''}`}
                    onClick={hasResponse ? () => setShowDialog(true) : undefined}
                />
            </div>

            <Dialog open={showDialog} onOpenChange={setShowDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{hasError ? "Error Details" : "Response Details"}</DialogTitle>
                    </DialogHeader>
                    <div className="max-h-60 overflow-auto space-y-4">
                        {hasError && (
                            <div>
                                <h4 className="text-sm font-medium mb-2">Error</h4>
                                <pre className="text-xs font-mono whitespace-pre-wrap">
                                    {errorContent}
                                </pre>
                            </div>
                        )}
                        {rawResponse && (
                            <div>
                                <h4 className="text-sm font-medium mb-2">Raw Response</h4>
                                <pre className="text-xs font-mono whitespace-pre-wrap">
                                    {JSON.stringify(rawResponse, null, 2)}
                                </pre>
                            </div>
                        )}
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
}

