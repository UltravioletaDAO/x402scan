import { Wallet } from 'lucide-react';

import { Button } from '@/components/ui/button';

import { ConnectEmbeddedWalletDialog } from '@/app/_components/auth/embedded-wallet/connect/dialog';

export const NavbarUnauthedButton = () => {
  return (
    <ConnectEmbeddedWalletDialog>
      <Button size="navbar" variant="outline">
        <span className="hidden md:block">Sign In</span>
        <Wallet className="size-4 md:hidden" />
      </Button>
    </ConnectEmbeddedWalletDialog>
  );
};
