import { OriginResources as OriginResourcesComponent } from '@/app/_components/resources/origin-resources';

import { api } from '@/trpc/server';

interface Props {
  originId: string;
}

export const OriginResources: React.FC<Props> = async ({ originId }) => {
  const [{ resources }] = await api.public.origins.list.withResources({
    originIds: [originId],
  });

  return <OriginResourcesComponent resources={resources} defaultOpen={true} />;
};
