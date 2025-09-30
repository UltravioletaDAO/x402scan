import { Body, Heading } from "../../_components/layout/page-utils";
import { api } from "@/trpc/server";
import { ResourceExecutor } from "../../_components/resource-executor/resource-executor";

export default async function ResourcesPage() {
  const accepts = await api.accepts.list();

  return (
    <div>
      <Heading title="All Resources" />
      <Body>
        <div className="space-y-4">
          <div className="space-y-3">
            {accepts.map((accept) => (
              <GenericResourceCaller key={accept.id} resource={accept.resource} bazaarMethod={accept.outputSchema?.input?.method} />
            ))}
          </div>
        </div>
      </Body>
    </div>
  );
}