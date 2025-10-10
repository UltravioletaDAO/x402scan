'use client';

import { Wallet } from 'lucide-react';

import { useCurrentUser, useIsInitialized } from '@coinbase/cdp-hooks';

import { useAccount } from 'wagmi';

import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

import { DisplayEmbeddedWalletDialog } from '@/app/_components/wallet/display/dialog';
import { OnrampSessionDialog } from '@/app/_components/wallet/embedded-wallet/onramp-session-dialog';

import { useBalance } from '@/app/_hooks/use-balance';

import { NavbarUnauthedButton } from './unauthed';

export const NavbarAuthedButton = () => {
  return <NavbarAuthedButtonInternal />;
};

const NavbarAuthedButtonInternal = () => {
  const { address } = useAccount();
  const { currentUser } = useCurrentUser();
  const { isInitialized } = useIsInitialized();

  if (!isInitialized) {
    return <NavbarAuthedButtonLoading />;
  }

  if (!address) {
    return <NavbarUnauthedButton />;
  }

  return (
    <>
      <OnrampSessionDialog />
      <DisplayEmbeddedWalletDialog
        address={address}
        user={currentUser ?? undefined}
      >
        <NavbarAuthedButtonContent />
      </DisplayEmbeddedWalletDialog>
    </>
  );
};

const NavbarAuthedButtonLoading = () => {
  return (
    <Button size="navbar" variant="outline" disabled>
      <Wallet className="size-4" />
      <NavbarAuthedButtonSkeleton />
    </Button>
  );
};

const NavbarAuthedButtonContent = ({ onClick }: { onClick?: () => void }) => {
  const { data: balance, isLoading } = useBalance();

  return (
    <Button size="navbar" variant="outline" onClick={onClick}>
      <Wallet className="size-4" />
      {isLoading ? (
        <NavbarAuthedButtonSkeleton />
      ) : (
        <span className="hidden md:block">{`${balance} USDC`}</span>
      )}
    </Button>
  );
};

const NavbarAuthedButtonSkeleton = () => {
  return <Skeleton className="h-4 w-20 hidden md:block" />;
};
