'use client';

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useChain } from "./hook"
import type { Chain} from "@/types/chain";
import { CHAIN_LABELS } from "@/types/chain";

export const ChainSelector = () => {
    const { chain, setChain } = useChain();

    return (
        <Select value={chain} onValueChange={(value) => setChain(value as Chain)}>
            <SelectTrigger className="w-[120px]">
                <SelectValue />
            </SelectTrigger>
            <SelectContent>
                {Object.entries(CHAIN_LABELS).map(([chain, label]) => (
                    <SelectItem key={chain} value={chain}>
                        {label}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    )
}