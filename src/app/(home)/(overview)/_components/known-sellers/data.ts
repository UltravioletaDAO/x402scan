import { DollarSign, Hash, Users } from "lucide-react";

import { convertTokenAmount } from "@/lib/token";

export const knownSellerMetrics = [
  {
    value: "tx_count",
    label: "Total Transactions",
    Icon: Hash,
    format: (value: bigint) =>
      value.toLocaleString(undefined, {
        notation: "compact",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }),
  },
  {
    value: "total_amount",
    label: "Total Amount",
    Icon: DollarSign,
    format: (value: bigint) =>
      convertTokenAmount(value).toLocaleString(undefined, {
        notation: "compact",
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }),
  },
  {
    value: "unique_buyers",
    label: "Unique Buyers",
    Icon: Users,
    format: (value: bigint) =>
      value.toLocaleString(undefined, {
        notation: "compact",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }),
  },
] as const;
