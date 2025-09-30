import { NavbarAuthedButton } from './authed';
import { NavbarUnauthedButton } from './unauthed';

import { auth } from '@/auth';

export const NavbarAuthButton = async () => {
  const session = await auth();

  if (session) {
    return <NavbarAuthedButton />;
  }

  return <NavbarUnauthedButton />;
};
