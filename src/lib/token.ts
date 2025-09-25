import { formatCurrency } from "./utils";

export const convertTokenAmount = (amount: bigint) => {
  return amount / 10n ** 6n;
};

export const formatTokenAmount = (amount: bigint) => {
  return formatCurrency(Number(convertTokenAmount(amount)));
};
