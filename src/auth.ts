import { cache } from "react";

import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";

import { prisma } from "./services/db/client";

const {
  handlers,
  signIn,
  signOut,
  auth: uncachedAuth,
} = NextAuth({
  providers: [],
  adapter: PrismaAdapter(prisma),
});

const auth = cache(uncachedAuth);

export { handlers, signIn, signOut, auth };
