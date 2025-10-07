'use client';

import { Wallet } from 'lucide-react';

import { Button } from '@/components/ui/button';

import { ConnectEmbeddedWalletDialog } from '@/app/_components/wallet/connect/dialog';

export const NavbarUnauthedButton = () => {
  return (
    <ConnectEmbeddedWalletDialog>
      <ConnectButton />
    </ConnectEmbeddedWalletDialog>
  );
};

const ConnectButton = ({
  disabled,
  onClick,
}: {
  disabled?: boolean;
  onClick?: () => void;
}) => {
  return (
    <Button
      size="navbar"
      variant="outline"
      disabled={disabled}
      onClick={onClick}
    >
      <Wallet className="size-4" />
      <span className="hidden md:block">Connect</span>
    </Button>
  );
};
