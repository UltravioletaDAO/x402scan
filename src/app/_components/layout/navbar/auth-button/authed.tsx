'use client';

import { Loader2, Wallet } from 'lucide-react';

import { useCurrentUser, useIsInitialized } from '@coinbase/cdp-hooks';

import { Button } from '@/components/ui/button';

import { DisplayEmbeddedWalletDialog } from '@/app/_components/auth/embedded-wallet/display/dialog';

import { NavbarUnauthedButton } from './unauthed';

export const NavbarAuthedButton = () => {
  if (typeof window === 'undefined') {
    return <NavbarAuthedButtonLoading />;
  }

  return <NavbarAuthedButtonContent />;
};

const NavbarAuthedButtonContent = () => {
  const { isInitialized } = useIsInitialized();
  const { currentUser } = useCurrentUser();

  if (!isInitialized) {
    return <NavbarAuthedButtonLoading />;
  }

  if (!currentUser) {
    return <NavbarUnauthedButton />;
  }

  return (
    <DisplayEmbeddedWalletDialog user={currentUser}>
      <Button size="navbar" variant="outline">
        <span className="hidden md:block">
          {currentUser.authenticationMethods.email?.email}
        </span>
        <Wallet className="size-4 md:hidden" />
      </Button>
    </DisplayEmbeddedWalletDialog>
  );
};

const NavbarAuthedButtonLoading = () => {
  return (
    <Button size="navbar" variant="outline" disabled>
      <Loader2 className="size-4 animate-spin" />
    </Button>
  );
};
