import { Button } from '@/components/ui/button';
import { AuthModal } from './dialog';
import { auth } from '@/auth';
import { Wallet } from 'lucide-react';

export const AuthButton = async () => {
  const session = await auth();

  if (session) {
    return <Button>{session.user.email}</Button>;
  }

  return (
    <AuthModal>
      <Button size="navbar">
        <span className="hidden md:block">Sign in</span>
        <Wallet className="size-4 md:hidden" />
      </Button>
    </AuthModal>
  );
};
