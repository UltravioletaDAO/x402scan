'use client';

import { ConnectEmbeddedWalletForm } from '@/app/_components/wallet/connect/embedded';
import { ConnectEOAForm } from '@/app/_components/wallet/connect/eoa';
import { Separator } from '@/components/ui/separator';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useAccount, useConnect } from 'wagmi';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Logo } from '@/components/logo';

export const ConnectDialog = () => {
  const { address } = useAccount();

  const { connectors } = useConnect();

  const filteredConnectors = connectors.filter(
    connector =>
      connector.type === 'injected' &&
      !['injected', 'cdp-embedded-wallet'].includes(connector.id)
  );

  const router = useRouter();

  useEffect(() => {
    if (address) {
      router.refresh();
    }
  }, [address, router]);

  return (
    <AlertDialog open={true}>
      <AlertDialogContent className="p-0 overflow-hidden gap-0">
        <AlertDialogHeader className="flex flex-row items-center gap-4 space-y-0 bg-muted border-b p-4">
          <Logo className="size-12" />
          <div>
            <AlertDialogTitle>Welcome to x402scan Composer</AlertDialogTitle>
            <AlertDialogDescription className="text-xs font-mono">
              Build agents that pay for their inference and invoke resources and
              pay for them with x402.
            </AlertDialogDescription>
          </div>
        </AlertDialogHeader>
        <div className="p-4 flex flex-col gap-4">
          {filteredConnectors.length > 0 && (
            <>
              <ConnectEOAForm
                connectors={filteredConnectors}
                className="w-full"
                buttonClassName="w-full h-12 md:h-12"
              />
              <div className="flex items-center gap-2 w-full">
                <Separator className="flex-1" />
                <p className="text-muted-foreground text-xs">or</p>
                <Separator className="flex-1" />
              </div>
            </>
          )}
          <ConnectEmbeddedWalletForm />
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
};
