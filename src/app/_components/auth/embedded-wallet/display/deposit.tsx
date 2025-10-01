import { useState } from 'react';

import Image from 'next/image';

import { CopyCode } from '@/components/ui/copy-code';
import { Separator } from '@/components/ui/separator';
import { MoneyInput } from '@/components/ui/money-input';
import { Button } from '@/components/ui/button';

import type { User } from '@coinbase/cdp-hooks';

interface Props {
  user: User;
}

export const Deposit: React.FC<Props> = ({ user }) => {
  const address = user?.evmAccounts?.[0];

  if (!address) {
    return <p>There was a problem getting your wallet address</p>;
  }

  return (
    <div className="flex flex-col gap-4">
      <Onramp address={address} />
      <div className="flex items-center gap-2">
        <Separator className="flex-1" />
        <p className="text-muted-foreground text-xs">or</p>
        <Separator className="flex-1" />
      </div>
      <Send address={address} />
    </div>
  );
};

interface OnrampProps {
  address: string;
}

const Onramp: React.FC<OnrampProps> = ({}) => {
  const [amount, setAmount] = useState(0);

  return (
    <div className="flex flex-col gap-2">
      <div className="gap-1 flex items-center">
        <Image
          src="/coinbase.png"
          alt="Base"
          height={16}
          width={16}
          className="size-4 inline-block mr-1 rounded-full"
        />
        <span className="font-bold text-sm">Onramp</span>
      </div>
      <MoneyInput
        setAmount={setAmount}
        placeholder="0.00"
        inputClassName="placeholder:text-muted-foreground/60"
      />
      <Button variant="turbo" disabled={amount === 0}>
        Checkout on Coinbase
      </Button>
    </div>
  );
};

interface SendProps {
  address: string;
}

const Send: React.FC<SendProps> = ({ address }) => {
  return (
    <div className="flex flex-col gap-2">
      <div className="gap-1 flex items-center">
        <Image
          src="/base.png"
          alt="Base"
          height={16}
          width={16}
          className="size-4 inline-block mr-1"
        />
        <span className="font-bold text-sm">Send USDC on Base</span>
      </div>
      <CopyCode code={address} toastMessage="Address copied to clipboard" />
    </div>
  );
};
