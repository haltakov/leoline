import { NextRequest } from "next/server";
import { AnonymousUserWithChatUser, UserPublic } from "../types";
import prisma from "@/backend/prisma";
import { ChatUser } from "@prisma/client";
import { sha256 } from "@/backend/user/utils";
import { MAX_ANONYMOUS_STORIES } from "@/backend/user/const";
import { Session } from "next-auth";
import pino from "pino";

const logger = pino();

export const getCurrentUser = async (request: NextRequest, auth: Session | null): Promise<UserPublic> => {
  let chatUser: ChatUser | undefined | null;
  let isAnonymous = true;

  // If the user is authenticated, get the chat user from it
  if (auth?.user?.email) {
    const user = await prisma.user.findUnique({
      where: {
        email: auth.user.email,
      },
      include: {
        chatUser: true,
      },
    });

    chatUser = user?.chatUser;
    isAnonymous = false;

    logger.info("User: Found authenticated user");
  }

  // If the user is not authenticated, get the annonymous user and the corresponding chat user
  if (!chatUser) {
    const annonymousUser = await getAnnonymousUser(request);
    chatUser = annonymousUser.chatUser;

    logger.info("User: Found anonymous user");
  }

  // Raise an error if the chat user is not found (should never happen)
  if (!chatUser) {
    throw new Error("Chat user not found");
  }

  const isActive = await checkUserIsActive(isAnonymous, chatUser);

  return {
    email: auth?.user?.email || undefined,
    isActive,
  } as UserPublic;
};

export const getAnnonymousUser = async (request: NextRequest): Promise<AnonymousUserWithChatUser> => {
  const localIdentifier = request.headers.get("xuid");
  const ipAddress = request.headers.get("x-forwarded-for") || request.ip;

  const ipAddressLocation = request.headers.get("cf-ipcountry") || "";

  if (!localIdentifier || !ipAddress) {
    throw new Error("Missing anonymoius user identification");
  }

  const ipAddressHash = sha256(ipAddress);

  logger.info("User: Getting anonymous user by:", { localIdentifier, ipAddressHash });

  // Try to fint the user by local identifier or ip address
  let annonymousUser: AnonymousUserWithChatUser | null = await prisma.anonymousUser.findFirst({
    where: {
      OR: [
        {
          localIdentifier,
        },
        {
          ipAddressHash,
        },
      ],
    },
    include: {
      chatUser: true,
    },
  });

  if (!annonymousUser) {
    // Create a new user if not found
    logger.info("User: Creating new anonymous user");

    // Create the chat user first
    const chatUser = await prisma.chatUser.create({
      data: {},
    });

    // Create the anonymous user
    annonymousUser = await prisma.anonymousUser.create({
      data: {
        localIdentifier,
        ipAddressHash,
        ipAddressLocation,
        chatUserId: chatUser.id,
      },
      include: {
        chatUser: true,
      },
    });
  } else {
    // Update the anonymous user
    if (
      annonymousUser.localIdentifier !== localIdentifier ||
      annonymousUser.ipAddressHash !== ipAddressHash ||
      annonymousUser.ipAddressLocation !== ipAddressLocation
    ) {
      logger.info("User: Updating anonymous user");

      annonymousUser = await prisma.anonymousUser.update({
        where: {
          id: annonymousUser.id,
        },
        data: {
          localIdentifier,
          ipAddressHash,
          ipAddressLocation,
        },
        include: {
          chatUser: true,
        },
      });
    }
  }

  return annonymousUser;
};

export const checkUserIsActive = async (isAnonymous: boolean, chatUser: ChatUser): Promise<boolean> => {
  if (isAnonymous) {
    // Find the number of stories the chat user has used
    const storiesCount = await prisma.story.count({
      where: {
        chatUserId: chatUser.id,
      },
    });

    return storiesCount <= MAX_ANONYMOUS_STORIES;
  } else {
    // TODO: check user payment status
    return true;
  }
};
