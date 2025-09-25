import { facilitator as baseFacilitator } from "@coinbase/x402";
import type { FacilitatorConfig } from "x402/types";
import { useFacilitator } from "x402/verify";

export const listFacilitatorResources = async (
  facilitator: FacilitatorConfig = baseFacilitator
) => {
  const { list } = useFacilitator(facilitator);
  return await list();
};

export type FacilitatorResource = Awaited<
  ReturnType<typeof listFacilitatorResources>
>["items"][number];
