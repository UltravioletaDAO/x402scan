import { Body, Heading } from "../../_components/layout/page-utils";
import { api } from "@/trpc/server";
import { ResourceList } from "./resource-list";

export default async function ResourcesPage() {
  const accepts = await api.accepts.list();

  return (
    <div>
      <Heading title="Resources" />
      <Body>
        <ResourceList accepts={accepts} />
      </Body>
    </div>
  );
}
