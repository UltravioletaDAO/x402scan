import { Accordion, AccordionItem } from '@/components/ui/accordion';

import { ResourceExecutor } from './executor';

import { getBazaarMethod } from './executor/utils';

import type { RouterOutputs } from '@/trpc/client';

interface Props {
  resources: RouterOutputs['public']['origins']['list']['withResources'][number]['resources'];
  defaultOpen?: boolean;
}

export const OriginResources: React.FC<Props> = ({
  resources,
  defaultOpen = false,
}) => {
  return (
    <Accordion
      type="multiple"
      className="border-b-0"
      defaultValue={
        defaultOpen ? resources.map(resource => resource.id) : undefined
      }
    >
      {resources.map(resource => (
        <AccordionItem
          value={resource.id}
          key={resource.id}
          className="border-b-0 pl-4 border-l pt-4 relative"
        >
          <div className="absolute left-0 top-[calc(2rem+5px)] w-4 h-[1px] bg-border" />
          <ResourceExecutor
            resource={resource}
            bazaarMethod={getBazaarMethod(resource.accepts[0].outputSchema)}
            className="bg-transparent"
            response={resource.data}
          />
        </AccordionItem>
      ))}
    </Accordion>
  );
};
