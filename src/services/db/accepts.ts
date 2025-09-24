import { prisma } from "./client";

export const getAcceptsAddresses = async () => {
  const accepts = await prisma.accepts.findMany({
    select: {
      payTo: true,
    },
  });
  return Array.from(new Set(accepts.map((accept) => accept.payTo))).filter(
    (address) => address !== ""
  );
};
