import { Button } from '@/components/ui/button';

import { ResourcesSelect as BaseResourcesSelect } from '@/app/(home)/composer/_components/resources-select';

import type { SelectedResource } from '@/app/(home)/composer/chat/_lib/types';
import { Favicons } from '@/app/_components/favicon';

interface Props {
  resources: SelectedResource[];
  onSelectResource: (resource: SelectedResource) => void;
}

export const ResourcesSelect: React.FC<Props> = ({
  resources,
  onSelectResource,
}) => {
  return (
    <BaseResourcesSelect
      selectedResourceIds={resources.map(resource => resource.id)}
      onSelectResource={onSelectResource}
    >
      <Button variant="outline" size="sm">
        <Favicons
          favicons={resources.map(resource => resource.favicon)}
          iconContainerClassName="size-5"
        />
        <span className="text-xs">
          {resources.length > 0
            ? `${resources.length} Tool${resources.length > 1 ? 's' : ''}`
            : 'Select Tools'}
        </span>
      </Button>
    </BaseResourcesSelect>
  );
};
