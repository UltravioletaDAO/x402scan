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
import { useAccount, useConnect, useSignMessage } from 'wagmi';
import { useCurrentUser } from '@coinbase/cdp-hooks';
import { ConnectEOAForm } from './eoa';

interface AuthModalProps {
  children: React.ReactNode;
}

export const ConnectEmbeddedWalletDialog = ({ children }: AuthModalProps) => {
  const account = useAccount();

  const { currentUser } = useCurrentUser();

  const { signMessageAsync } = useSignMessage();

  const { connectors } = useConnect();

  const filteredConnectors = connectors.filter(
    connector =>
      connector.type === 'injected' &&
      !['injected', 'cdp-embedded-wallet'].includes(connector.id)
  );

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
              {filteredConnectors.length > 0
                ? 'Connect Wallet'
                : 'Create Wallet'}
            </DialogTitle>
            <DialogDescription className="hidden">
              Connect your wallet to use on-chain functionality.
            </DialogDescription>
          </div>
        </DialogHeader>
        {filteredConnectors.length > 0 && (
          <>
            <ConnectEOAForm connectors={filteredConnectors} />
            <div className="flex items-center gap-2">
              <Separator className="flex-1" />
              <p className="text-muted-foreground text-xs">or</p>
              <Separator className="flex-1" />
            </div>
          </>
        )}

        <ConnectEmbeddedWalletForm />
      </DialogContent>
    </Dialog>
  );
};
