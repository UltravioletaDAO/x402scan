import { clsx, type ClassValue } from 'clsx';
import { formatDistanceToNow } from 'date-fns';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatCurrency = (
  value: number,
  options?: Intl.NumberFormatOptions
): string => {
  if (value < 0.01 && value > 0) {
    return '< $0.01';
  }

  return value.toLocaleString(undefined, {
    style: 'currency',
    currency: 'USD',
    notation: 'compact',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
    ...options,
  });
};

export const formatCompactAgo = (date: Date) => {
  const str = formatDistanceToNow(date, {
    addSuffix: true,
  });
  return str
    .replace('about ', '~')
    .replace(' hours', 'h')
    .replace(' hour', 'h')
    .replace(' minutes', 'm')
    .replace(' minute', 'm')
    .replace(' seconds', 's')
    .replace(' second', 's')
    .replace(' days', 'd')
    .replace(' day', 'd')
    .replace(' weeks', 'w')
    .replace(' week', 'w')
    .replace(' months', 'M')
    .replace(' month', 'M')
    .replace(' years', 'y')
    .replace(' year', 'y');
};

export const formatAddress = (address: string) => {
  return address.slice(0, 6) + '...' + address.slice(-6);
};

export const getPercentageFromBigInt = (previous: bigint, current: bigint) => {
  return ((Number(current) - Number(previous)) / Number(previous)) * 100;
};

export const USDC_ADDRESS = '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913';
