import { formatCurrency } from './utils';

export const convertTokenAmount = (amount: bigint) => {
  // Convert to string, then use string manipulation to preserve precision
  const amountStr = amount.toString();
  const decimals = 6;

  if (amountStr.length <= decimals) {
    // Amount is less than 1 token (e.g., 500000 -> 0.5)
    return parseFloat(`0.${amountStr.padStart(decimals, '0')}`);
  } else {
    // Amount is 1+ tokens (e.g., 1500000 -> 1.5)
    const integerPart = amountStr.slice(0, -decimals);
    const decimalPart = amountStr.slice(-decimals);
    return parseFloat(`${integerPart}.${decimalPart}`);
  }
};

export const formatTokenAmount = (amount: bigint) => {
  return formatCurrency(Number(convertTokenAmount(amount)));
};
