import { Wallet } from 'lucide-react';

import { Button } from '@/components/ui/button';

import { ConnectEmbeddedWalletDialog } from '@/app/_components/auth/embedded-wallet/connect/dialog';

export const NavbarUnauthedButton = () => {
  return (
    <ConnectEmbeddedWalletDialog>
      <Button size="navbar" variant="outline">
        <Wallet className="size-4" />
        <span className="hidden md:block">Sign In</span>
      </Button>
    </ConnectEmbeddedWalletDialog>
  );
};
