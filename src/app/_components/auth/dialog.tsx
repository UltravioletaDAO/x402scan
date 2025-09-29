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
import { EmbeddedWallet } from './embedded-wallet';

interface AuthModalProps {
  children: React.ReactNode;
}

export const AuthModal = ({ children }: AuthModalProps) => {
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent showCloseButton={false} className="gap-6 sm:max-w-sm">
        <DialogHeader className="items-center gap-2">
          <Logo className="size-16" />
          <div className="flex flex-col gap-2">
            <DialogTitle className="text-primary text-xl">
              Sign in to x402Scan
            </DialogTitle>
            <DialogDescription className="hidden">
              Sign in to your account to get started with x402Scan.
            </DialogDescription>
          </div>
        </DialogHeader>
        <EmbeddedWallet />
      </DialogContent>
    </Dialog>
  );
};
