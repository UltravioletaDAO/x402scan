'use client';

import { ConnectWalletForm } from '@/app/_components/wallet/connect/form';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useAccount } from 'wagmi';

export const UnauthedButton = () => {
  const { address } = useAccount();

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="turbo">Use Agent</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Sign In to Use Agent</DialogTitle>
          <DialogDescription>Sign in to use this agent.</DialogDescription>
        </DialogHeader>
        {address ? `Connected to ${address}` : <ConnectWalletForm />}
      </DialogContent>
    </Dialog>
  );
};
