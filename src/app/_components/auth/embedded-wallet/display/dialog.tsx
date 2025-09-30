'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Logo } from '@/components/logo';

import { EmbeddedWalletContent } from './content';

import type { User } from '@coinbase/cdp-hooks';

interface Props {
  children: React.ReactNode;
  user: User;
}

export const DisplayEmbeddedWalletDialog: React.FC<Props> = ({
  children,
  user,
}) => {
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent showCloseButton={false} className="gap-6">
        <DialogHeader className="items-center gap-2">
          <Logo className="size-16" />
          <div className="flex flex-col gap-2">
            <DialogTitle className="text-primary text-xl">
              Your x402Scan Embedded Wallet
            </DialogTitle>
            <DialogDescription className="hidden">
              This is a Coinbase Developer Platform embedded wallet. We do not
              have access to your keys or the ability to make transactions on
              your behalf.
            </DialogDescription>
          </div>
        </DialogHeader>
        <EmbeddedWalletContent user={user} />
        <p className="text-xs text-muted-foreground text-center">
          We do not have access to your keys or the ability to make transactions
          on your behalf.
        </p>
      </DialogContent>
    </Dialog>
  );
};
