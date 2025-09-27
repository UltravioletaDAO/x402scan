"use client";

import { useState } from "react";
import { type ParsedX402Response } from "@/lib/x402-schema";
import { Step1 } from "./step1";
import { Step2 } from "./step2";


export function Stepper({ resource, bazaarMethod }: { resource: string; bazaarMethod?: string }) {
    const [x402Response, setX402Response] = useState<ParsedX402Response | null>(null);

    return (
        <div className="">
            <hr className="my-4" />
            <Step1 resource={resource} bazaarMethod={bazaarMethod} onX402Response={setX402Response} />
            {x402Response && <Step2 resource={resource} x402Response={x402Response} bazaarMethod={bazaarMethod} />}
        </div>
    );
}