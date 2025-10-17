'use client';

import { toast } from 'sonner';

import { Loader2 } from 'lucide-react';

import { Button } from '@/components/ui/button';

import { api } from '@/trpc/client';

export const CreateWallet = () => {
  const { mutate: createWallet, isPending: isCreatingWallet } =
    api.serverWallet.create.useMutation({
      onSuccess: () => {
        toast.success('Wallet created successfully');
      },
      onError: () => {
        toast.error('Failed to create wallet');
      },
    });

  return (
    <div className="flex flex-col gap-4">
      <Button
        onClick={() => createWallet()}
        disabled={isCreatingWallet}
        className="w-full h-12 md:h-12"
        variant="turbo"
      >
        {isCreatingWallet ? (
          <Loader2 className="size-4 animate-spin" />
        ) : (
          'Initialize Agent Wallet'
        )}
      </Button>
      <p className="text-muted-foreground text-xs text-center font-mono">
        Your agent wallet is only accessible to you.
      </p>
    </div>
  );
};
