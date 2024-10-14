"use server";

import { NextRequest } from "next/server";
import { AnonymousUserWithChatUser, GetCurrentUserResponse, UserPublic, UserStats, UserWithChatUser } from "../types";
import prisma from "@/backend/prisma";
import { ChatUser } from "@prisma/client";
import { getStoriesCountForCurrentMonth, sha256 } from "@/backend/user/utils";
import { MAX_ANONYMOUS_STORIES_PER_MONTH, MAX_SUBSCRIBED_STORIES_PER_MONTH } from "@/backend/user/const";
import pino from "pino";
import { uniqueNamesGenerator, adjectives, colors, animals } from "unique-names-generator";
import { convertStripeSubscriptionStatus } from "@/frontend/account/utils";
import { SubscriptionStatus } from "@/frontend/account/types";
import { auth } from "@/auth";
import { headers } from "next/headers";
import { createLog } from "@/backend/logging/service";

const logger = pino();

export const getCurrentUser = async (request: NextRequest): Promise<GetCurrentUserResponse> => {
  try {
    let chatUser: ChatUser | undefined | null;

    const session = await auth();
    const email = session?.user?.email;

    // If the user is authenticated, get the chat user from it
    let user: UserWithChatUser | null = null;
    if (email) {
      user = await prisma.user.findUnique({
        where: {
          email,
        },
        include: {
          chatUser: true,
        },
      });

      chatUser = user?.chatUser;

      logger.info("User: Found authenticated user");
    }

    // Get the ananonymous user
    const annonymousUser = await getAnnonymousUser();

    // If the user is not authenticated, get the annonymous user and the corresponding chat user
    if (!chatUser) {
      chatUser = annonymousUser.chatUser;

      logger.info("User: Found anonymous user");

      // If the user is logged in, but oesn't have a char user, asign the one from the anonymous user
      if (email) {
        logger.info("User: Updating user chat user for the authenticated user");

        await prisma.user.update({
          where: {
            email,
          },
          data: {
            chatUserId: chatUser.id,
          },
        });
      }
    }

    // Raise an error if the chat user is not found (should never happen)
    if (!chatUser) {
      throw new Error("Chat user not found");
    }

    const isActive = await checkUserIsActive(chatUser, user?.stripeSubscriptionStatus || undefined);

    return {
      user: {
        email: email || undefined,
        name: annonymousUser?.name || undefined,
        subscriptionStatus: user?.stripeSubscriptionStatus || undefined,
        subscriptionPriceId: user?.stripeSubscriptionPriceId || undefined,
        isActive,
      },
      chatUser,
    };
  } catch (error) {
    await createLog({ level: "error", message: `Cannot get current user: ${error}`, notify: true });
    throw error;
  }
};

export const getAnnonymousUser = async (): Promise<AnonymousUserWithChatUser> => {
  const requestHeaders = headers();

  const localIdentifier = requestHeaders.get("xuid");
  const ipAddress = requestHeaders.get("x-forwarded-for") || requestHeaders.get("cf-connecting-ip") || "";

  const ipAddressLocation = requestHeaders.get("cf-ipcountry") || "";

  if (!localIdentifier || !ipAddress) {
    throw new Error("Missing anonymoius user identification");
  }

  const ipAddressHash = sha256(ipAddress);

  logger.info(`User: Getting anonymous user by: ${JSON.stringify({ localIdentifier, ipAddressHash })}`);

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
        name: uniqueNamesGenerator({
          dictionaries: [adjectives, colors, animals],
        }),
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

export const checkUserIsActive = async (chatUser: ChatUser, stripeSubscriptionStatus?: string): Promise<boolean> => {
  const subscriptionStatus = convertStripeSubscriptionStatus(stripeSubscriptionStatus);

  const storiesCount = await getStoriesCountForCurrentMonth(chatUser.id);

  if (subscriptionStatus === SubscriptionStatus.ACTIVE) {
    if (storiesCount > MAX_SUBSCRIBED_STORIES_PER_MONTH) {
      return !chatUser.isUserLimited;
    } else {
      return true;
    }
  } else {
    return storiesCount <= MAX_ANONYMOUS_STORIES_PER_MONTH;
  }
};

export const getUserStats = async (): Promise<UserStats> => {
  try {
    const session = await auth();
    const email = session?.user?.email;

    if (!email) {
      return { storiesCountCurrentMonth: 0, storiesCountTotal: 0 };
    }

    // Get the user with chatUser from the DB
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!user || !user.chatUserId) {
      return { storiesCountCurrentMonth: 0, storiesCountTotal: 0 };
    }

    const storiesCountTotal = await prisma.story.count({
      where: {
        chatUser: {
          id: user.chatUserId,
        },
      },
    });

    const storiesCountCurrentMonth = await getStoriesCountForCurrentMonth(user.chatUserId);

    return { storiesCountCurrentMonth, storiesCountTotal };
  } catch (error) {
    await createLog({ level: "error", message: `Cannot get user stats: ${error}`, notify: true });
    throw error;
  }
};
