'use client';

import { Wallet } from 'lucide-react';

import { useCurrentUser, useIsInitialized } from '@coinbase/cdp-hooks';

import { Button } from '@/components/ui/button';

import { DisplayEmbeddedWalletDialog } from '@/app/_components/wallet/display/dialog';

import { NavbarUnauthedButton } from './unauthed';
import { useBalance } from '@/app/_hooks/use-balance';
import { Skeleton } from '@/components/ui/skeleton';
import { OnrampSessionDialog } from '@/app/_components/wallet/embedded-wallet/onramp-session-dialog';

import type { Address } from 'viem';
import { useSession } from 'next-auth/react';

export const NavbarAuthedButton = () => {
  return <NavbarAuthedButtonInternal />;
};

const NavbarAuthedButtonInternal = () => {
  const { isInitialized } = useIsInitialized();
  const { currentUser } = useCurrentUser();
  const { data: session, status } = useSession();

  if (status === 'loading' || !isInitialized) {
    return <NavbarAuthedButtonLoading />;
  }

  if (!session) {
    return <NavbarUnauthedButton />;
  }

  return (
    <>
      <OnrampSessionDialog />
      <DisplayEmbeddedWalletDialog
        user={currentUser ?? undefined}
        address={session.user.id as Address}
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
