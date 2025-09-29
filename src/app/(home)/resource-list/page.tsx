import { Body, Heading } from "../../_components/layout/page-utils";
import { api } from "@/trpc/server";
import { ResourcesList } from "./resources-list";

export default async function Resources2Page() {
  const accepts = await api.accepts.list();

  return (
    <div>
      <Heading title="All Resources" />
      <Body>
        <ResourcesList accepts={accepts} />
      </Body>
    </div>
  );
}