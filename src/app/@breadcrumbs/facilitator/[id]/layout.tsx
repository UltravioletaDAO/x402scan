import { Server, Wallet } from 'lucide-react';

import { Breadcrumb } from '../../_components/breadcrumb';

import { Separator } from '../../_components/separator';
import { facilitatorIdMap } from '@/lib/facilitators';
import { notFound } from 'next/navigation';

export default async function RecipientPage({
  params,
  children,
}: LayoutProps<'/facilitator/[id]'>) {
  const { id } = await params;
  const facilitator = facilitatorIdMap.get(id);
  if (!facilitator) {
    return notFound();
  }
  return (
    <>
      <Separator />
      <Breadcrumb
        href={`/facilitator/${id}`}
        image={null}
        name="Facilitator"
        Fallback={Server}
        mobileHideImage
        disabled
      />
      <Separator />
      <Breadcrumb
        href={`/facilitator/${id}`}
        image={facilitator.image}
        name={facilitator.name}
        Fallback={Wallet}
        mobileHideImage
      />
      {children}
    </>
  );
}
