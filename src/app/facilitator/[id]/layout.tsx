import { facilitatorIdMap } from '@/lib/facilitators';
import { Nav } from '../../_components/layout/nav';
import { notFound } from 'next/navigation';

export default async function RecipientLayout({
  params,
  children,
}: LayoutProps<'/facilitator/[id]'>) {
  const { id } = await params;

  const facilitator = facilitatorIdMap.get(id);
  if (!facilitator) {
    return notFound();
  }

  return (
    <div className="flex flex-col flex-1">
      <Nav
        tabs={[
          {
            label: 'Overview',
            href: `/facilitator/${id}`,
          },
          {
            label: 'Transactions',
            href: `/facilitator/${id}/transactions`,
          },
        ]}
      />
      <div className="flex flex-col py-6 md:py-8 flex-1">{children}</div>
    </div>
  );
}
