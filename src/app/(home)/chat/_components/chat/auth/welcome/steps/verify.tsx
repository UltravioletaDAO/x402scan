'use client';

import { useSignIn } from '@/app/_hooks/use-sign-in';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

export const Verify = () => {
  const { signIn, isPending } = useSignIn();

  return (
    <div className="flex flex-col gap-4">
      <Button
        onClick={() => signIn()}
        disabled={isPending}
        className="w-full h-12 md:h-12"
        variant="turbo"
      >
        {isPending ? (
          <Loader2 className="size-4 animate-spin" />
        ) : (
          'Sign Message'
        )}
      </Button>
      <p className="text-muted-foreground text-xs text-center font-mono">
        Sign a message to confirm you own this wallet.
      </p>
    </div>
  );
};
