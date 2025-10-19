import { Favicon } from '@/app/_components/favicon';
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Loading } from '@/components/ui/loading';
import { Skeleton } from '@/components/ui/skeleton';
import { api } from '@/trpc/client';

interface Props {
  resourceId: string;
  onRemoveResource: (resourceId: string) => void;
}

export const SelectedResource: React.FC<Props> = ({
  resourceId,
  onRemoveResource,
}) => {
  const { data: resource, isLoading: isResourceLoading } =
    api.resources.get.useQuery(resourceId);

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-row items-center gap-2">
          <Loading
            value={resource}
            isLoading={isResourceLoading}
            component={resource => (
              <Favicon url={resource.origin.favicon} className="size-6" />
            )}
            loadingComponent={<Skeleton className="size-6" />}
          />
          <Loading
            value={resource}
            isLoading={isResourceLoading}
            component={resource => (
              <CardTitle className="flex-1 truncate">
                {resource.resource}
              </CardTitle>
            )}
            loadingComponent={<Skeleton className="w-full" />}
          />
        </div>
        <Loading
          value={resource}
          isLoading={isResourceLoading}
          component={resource => (
            <CardDescription>{resource.accepts[0].description}</CardDescription>
          )}
          loadingComponent={<Skeleton className="size-6" />}
        />
      </CardHeader>
    </Card>
  );
};
