import {
  OriginResources as OriginResourcesComponent,
  LoadingOriginResources as LoadingOriginResourcesComponent,
} from '@/app/_components/resources/origin-resources';

import { api } from '@/trpc/server';

interface Props {
  originId: string;
}

export const OriginResources: React.FC<Props> = async ({ originId }) => {
  const [{ resources }] = await api.public.origins.list.withResources({
    originIds: [originId],
  });

  return (
    <div>
      <OriginResourcesComponent
        resources={resources}
        defaultOpen={true}
        hideOrigin={true}
      />
      <div className="h-4 w-[1px] bg-border" />
      <div className="size-3 bg-border rounded-full -ml-[5px]" />
    </div>
  );
};

export const LoadingOriginResources = () => {
  return (
    <div>
      <LoadingOriginResourcesComponent />
      <div className="h-4 w-[1px] bg-border" />
      <div className="size-3 bg-border rounded-full -ml-[5px]" />
    </div>
  );
};
