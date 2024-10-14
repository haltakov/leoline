import { auth } from "@/auth";
import { CreateLogParams } from "../types";
import { headers } from "next/headers";
import prisma from "@/backend/prisma";

export const createLog = async ({ level, message, notify }: CreateLogParams) => {
  // Get the user
  const session = await auth();
  const email = session?.user?.email;

  // Get the information from the headers
  const requestHeaders = headers();
  const xuid = requestHeaders.get("xuid") || undefined;
  const country = requestHeaders.get("cf-ipcountry") || undefined;

  // Log the message
  prisma.log.create({
    data: {
      level,
      message,
      notify,
      email,
      xuid,
      country,
    },
  });
};
