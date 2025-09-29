import { Button } from '@/components/ui/button';
import { AuthModal } from './dialog';
import { auth } from '@/auth';

export const AuthButton = async () => {
  const session = await auth();

  if (session) {
    return <Button>{session.user.email}</Button>;
  }

  return (
    <AuthModal>
      <Button>Sign in</Button>
    </AuthModal>
  );
};
