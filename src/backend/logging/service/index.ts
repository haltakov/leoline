import { auth } from "@/auth";
import { CreateLogParams } from "../types";
import { headers } from "next/headers";
import prisma from "@/backend/prisma";
import pino from "pino";

const logger = pino();

export const createLog = async ({ level, message, notify }: CreateLogParams) => {
  // Log the message
  switch (level) {
    case "info":
      logger.info(message);
      break;
    case "warn":
      logger.warn(message);
      break;
    case "error":
      logger.error(message);
      break;
  }

  // Get the user
  const session = await auth();
  const email = session?.user?.email;

  // Get the information from the headers
  const requestHeaders = headers();
  const xuid = requestHeaders.get("xuid") || undefined;
  const country = requestHeaders.get("cf-ipcountry") || undefined;

  // Log the message
  await prisma.log.create({
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
