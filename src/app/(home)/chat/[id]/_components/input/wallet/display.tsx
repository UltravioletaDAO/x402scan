'use client';

import { CopyCode } from '@/components/ui/copy-code';

import type { Address } from 'viem';

interface Props {
  address: Address;
  balance: number;
}

export const WalletDisplay: React.FC<Props> = ({ address, balance }) => {
  return (
    <div className="space-y-4 w-full overflow-hidden">
      <ItemContainer
        label="Balance"
        value={<p className="bg-muted rounded-md border p-2">{balance} USDC</p>}
      />
      <ItemContainer
        label="Address"
        value={
          <CopyCode code={address} toastMessage="Address copied to clipboard" />
        }
      />
    </div>
  );
};

const ItemContainer = ({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) => {
  return (
    <div className="flex flex-col gap-1">
      <p className="text-sm font-medium font-mono">{label}</p>
      {value}
    </div>
  );
};
