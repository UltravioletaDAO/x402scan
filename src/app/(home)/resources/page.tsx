import { Body, Heading } from '../../_components/layout/page-utils';
import { api } from '@/trpc/server';
import { ResourceExecutor } from '../../_components/resource-executor';

function getBazaarMethod(outputSchema: unknown): string | undefined {
  if (
    typeof outputSchema === 'object' &&
    outputSchema &&
    'input' in outputSchema
  ) {
    const input = (outputSchema as { input: unknown }).input;
    if (typeof input === 'object' && input && 'method' in input) {
      return (input as { method: unknown }).method as string;
    }
  }
  return undefined;
}

export default async function ResourcesPage() {
  const accepts = await api.accepts.list();

  return (
    <div>
      <Heading title="All Resources" />
      <Body>
        <div className="space-y-4">
          <div className="space-y-3">
            {accepts.map(accept => (
              <ResourceExecutor
                key={accept.id}
                resource={accept.resource}
                bazaarMethod={getBazaarMethod(accept.outputSchema)}
              />
            ))}
          </div>
        </div>
      </Body>
    </div>
  );
}
