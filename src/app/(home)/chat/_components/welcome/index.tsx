'use client';

import { WalletDialog } from '@/app/_components/wallet/dialog';
import { useSignIn } from '@/app/_hooks/use-sign-in';
import { Logo } from '@/components/logo';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Loader2, Wallet } from 'lucide-react';
import { useAccount } from 'wagmi';

export const Welcome = () => {
  const { address } = useAccount();

  return (
    <div className="flex-1 flex flex-col items-center justify-center w-full h-full">
      <Card className="p-8 max-w-md flex flex-col gap-4 items-center">
        <Logo className="size-16" />
        <div className="flex flex-col gap-2 items-center">
          <h1 className="text-2xl md:text-2xl font-bold">
            Welcome to x402scan Chat
          </h1>
          <p className="text-muted-foreground text-sm font-mono text-center">
            An agent that pays for inference with x402 and can invoke all x402
            resources.
          </p>
        </div>
        {address ? (
          <SignInButton />
        ) : (
          <WalletDialog>
            <Button variant="turbo" className="h-10 md:h-10">
              <Wallet className="size-4" />
              Connect Wallet
            </Button>
          </WalletDialog>
        )}
        <p className="text-muted-foreground/80 text-xs text-center max-w-xs mt-2">
          {address
            ? 'Sign in to confirm you own this wallet. This will also create a server wallet for you.'
            : 'We will create a server wallet for you after you connect and sign in.'}
        </p>
      </Card>
    </div>
  );
};

export const SignInButton = () => {
  const { signIn, isPending } = useSignIn();

  return (
    <Button onClick={() => signIn()} disabled={isPending}>
      {isPending ? (
        <Loader2 className="size-4 animate-spin" />
      ) : (
        'Verify Wallet'
      )}
    </Button>
  );
};
