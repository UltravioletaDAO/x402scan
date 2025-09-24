import { formatCurrency } from "./utils";

export const formatTokenAmount = (amount: bigint) => {
  return formatCurrency(Number(amount / 10n ** 6n));
};
