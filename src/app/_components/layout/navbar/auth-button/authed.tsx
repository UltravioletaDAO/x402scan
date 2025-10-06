'use client';

import { Wallet } from 'lucide-react';

import { useCurrentUser, useIsInitialized } from '@coinbase/cdp-hooks';

import { Button } from '@/components/ui/button';

import { DisplayEmbeddedWalletDialog } from '@/app/_components/auth/embedded-wallet/display/dialog';

import { NavbarUnauthedButton } from './unauthed';
import { useBalance } from '@/app/_hooks/use-balance';
import { Skeleton } from '@/components/ui/skeleton';
import { OnrampSessionDialog } from '@/app/_components/auth/embedded-wallet/onramp-session-dialog';

export const NavbarAuthedButton = () => {
  if (typeof window === 'undefined') {
    return <NavbarAuthedButtonLoading />;
  }

  return <NavbarAuthedButtonInternal />;
};

const NavbarAuthedButtonInternal = () => {
  const { isInitialized } = useIsInitialized();
  const { currentUser } = useCurrentUser();

  if (!isInitialized) {
    return <NavbarAuthedButtonLoading />;
  }

  if (!currentUser) {
    return <NavbarUnauthedButton />;
  }

  return (
    <>
      <OnrampSessionDialog />
      <DisplayEmbeddedWalletDialog user={currentUser}>
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
