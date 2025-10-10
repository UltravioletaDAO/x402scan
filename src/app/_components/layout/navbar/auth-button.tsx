'use client';

import { Wallet } from 'lucide-react';

import { useAccount } from 'wagmi';

import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

import { OnrampSessionDialog } from '@/app/_components/wallet/onramp-session-dialog';

import { useBalance } from '@/app/_hooks/use-balance';

import { WalletDialog } from '../../wallet/dialog';
import { formatTokenAmount } from '@/lib/token';

export const NavbarAuthButton = () => {
  const { address } = useAccount();

  return (
    <>
      <OnrampSessionDialog />
      <WalletDialog>
        {address ? (
          <ConnectedButton />
        ) : (
          <Button size="navbar" variant="outline">
            <Wallet className="size-4" />
            <span className="hidden md:block">Connect</span>
          </Button>
        )}
      </WalletDialog>
    </>
  );
};

const ConnectedButton = ({ onClick }: { onClick?: () => void }) => {
  const { data: balance, isLoading } = useBalance();

  return (
    <Button size="navbar" variant="outline" onClick={onClick}>
      <Wallet className="size-4" />
      {isLoading ? (
        <Skeleton className="h-4 w-20 hidden md:block" />
      ) : (
        <span className="hidden md:block">{`${(balance ?? 0).toLocaleString(
          undefined,
          {
            minimumFractionDigits: 0,
            maximumFractionDigits: 2,
            notation: 'compact',
          }
        )} USDC`}</span>
      )}
    </Button>
  );
};
