import { auth } from "@/auth";
import { CreateLogParams, SendTelegramMessageParams } from "../types";
import { headers } from "next/headers";
import prisma from "@/backend/prisma";
import pino from "pino";
import axios from "axios";

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
  const email = session?.user?.email || undefined;

  // Get the information from the headers
  const requestHeaders = headers();
  const xuid = requestHeaders.get("xuid") || undefined;
  const country = requestHeaders.get("cf-ipcountry") || undefined;

  // if notify is true, send a telegram message
  if (notify) {
    await sendTelegramMessage({ level, message, email, country });
  }

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

const sendTelegramMessage = async ({ level, message, email, country }: SendTelegramMessageParams) => {
  const telegramApiUrl = `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_API_TOKEN}/sendMessage`;

  await axios.post(telegramApiUrl, {
    chat_id: process.env.TELEGRAM_BOT_CHAT_ID,
    text: `${level.toLocaleUpperCase()}, ${email || ""}, ${country || ""}\n${message}`,
  });
};
