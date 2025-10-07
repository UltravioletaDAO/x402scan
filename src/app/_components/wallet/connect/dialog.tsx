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
import { ConnectEmbeddedWalletForm } from './embedded';
import { Separator } from '@/components/ui/separator';
import { useEffect } from 'react';
import { signInWithEthereum } from '@/auth/providers/siwe/sign-in';
import { useAccount, useSignMessage } from 'wagmi';
import { useCurrentUser } from '@coinbase/cdp-hooks';
import { ConnectEOAForm } from './eoa';

interface AuthModalProps {
  children: React.ReactNode;
}

export const ConnectEmbeddedWalletDialog = ({ children }: AuthModalProps) => {
  const account = useAccount();

  console.log('account', account);

  const { currentUser } = useCurrentUser();

  const { signMessageAsync } = useSignMessage();

  useEffect(() => {
    if (account.address) {
      void signInWithEthereum({
        address: account.address,
        chainId: 8453,
        signMessage: async message => {
          return await signMessageAsync({ message });
        },
        email: currentUser?.authenticationMethods.email?.email ?? '',
      });
    }
  }, [account.address, currentUser, signMessageAsync]);

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent showCloseButton={false} className="gap-6 sm:max-w-sm">
        <DialogHeader className="items-center gap-2">
          <Logo className="size-16" />
          <div className="flex flex-col gap-2">
            <DialogTitle className="text-primary text-xl">
              Connect Wallet
            </DialogTitle>
            <DialogDescription className="hidden">
              Connect your wallet to use on-chain functionality.
            </DialogDescription>
          </div>
        </DialogHeader>
        <ConnectEOAForm />
        <div className="flex items-center gap-2">
          <Separator className="flex-1" />
          <p className="text-muted-foreground text-xs">or</p>
          <Separator className="flex-1" />
        </div>
        <ConnectEmbeddedWalletForm />
      </DialogContent>
    </Dialog>
  );
};
