"use client";

import { useState } from "react";
import { type ParsedX402Response } from "@/lib/x402-schema";
import { Card, CardContent } from "@/components/ui/card";
import { Header } from "./header";
import { Form } from "./form";


export function GenericResourceCaller({ resource, bazaarMethod }: { resource: string; bazaarMethod?: string }) {
    const [init402Response, setInit402Response] = useState<ParsedX402Response | null>(null);

    return (
        <Card>
            <CardContent className="p-4">
                <Header
                    resource={resource}
                    bazaarMethod={bazaarMethod}
                    onX402Response={setInit402Response} />

                {init402Response &&
                    <Form resource={resource}
                        x402Response={init402Response}
                        bazaarMethod={bazaarMethod} />
                }
            </CardContent>
        </Card>
    );
}