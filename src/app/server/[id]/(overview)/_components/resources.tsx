import {
  OriginResources as OriginResourcesComponent,
  LoadingOriginResources as LoadingOriginResourcesComponent,
} from '@/app/_components/resources/origin-resources';

import { api } from '@/trpc/server';
import { OriginOverviewSection } from './section';

interface Props {
  originId: string;
}

export const OriginResources: React.FC<Props> = async ({ originId }) => {
  const [{ resources }] = await api.public.origins.list.withResources({
    originIds: [originId],
  });

  return (
    <OriginOverviewSection title="Resources" className="gap-0">
      <OriginResourcesComponent
        resources={resources}
        defaultOpen
        hideOrigin
        isFlat
      />
    </OriginOverviewSection>
  );
};

export const LoadingOriginResources = () => {
  return (
    <OriginOverviewSection title="Resources">
      <LoadingOriginResourcesComponent />
    </OriginOverviewSection>
  );
};
