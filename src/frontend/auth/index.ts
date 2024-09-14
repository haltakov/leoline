import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import prisma from "@/backend/prisma";
import { PrismaAdapter } from "@auth/prisma-adapter";
import Resend from "next-auth/providers/resend";

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [Google, Resend],
});
