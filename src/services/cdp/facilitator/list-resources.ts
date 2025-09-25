import { facilitator as baseFacilitator } from "@coinbase/x402";
import type { FacilitatorConfig } from "x402/types";
import { useFacilitator as facilitatorUtils } from "x402/verify";

export const listFacilitatorResources = async (
  facilitator: FacilitatorConfig = baseFacilitator
) => {
  return await facilitatorUtils(facilitator).list();
};

export type FacilitatorResource = Awaited<
  ReturnType<typeof listFacilitatorResources>
>["items"][number];
