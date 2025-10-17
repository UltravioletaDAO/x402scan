import { auth } from '@/auth';
import { Nav } from '../_components/layout/nav';
import { forbidden, unauthorized } from 'next/navigation';

export default async function AdminLayout({ children }: LayoutProps<'/admin'>) {
  const session = await auth();

  if (!session) {
    return unauthorized();
  }

  if (session?.user?.role !== 'admin') {
    return forbidden();
  }

  return (
    <div className="flex flex-col flex-1">
      <Nav
        tabs={[
          {
            label: 'Overview',
            href: '/',
          },
          {
            label: 'Chat',
            href: '/chat',
            subRoutes: ['/chat/'],
            isNew: true,
          },
          {
            label: 'Resources',
            href: '/resources',
            subRoutes: ['/resources/register'],
          },
          {
            label: 'Transactions',
            href: '/transactions',
          },
          {
            label: 'Facilitators',
            href: '/facilitators',
          },
          {
            label: 'Ecosystem',
            href: '/ecosystem',
          },
        ]}
      />
      <div className="flex flex-col py-6 md:py-8 flex-1">{children}</div>
    </div>
  );
}
