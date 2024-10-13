import prisma from "@/backend/prisma";
import crypto from "crypto";

export const sha256 = (data: string): string => {
  return crypto.createHash("sha256").update(data).digest("hex");
};

export const getStoriesCountForCurrentMonth = async (chatUserId: string) => {
  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);

  return await prisma.story.count({
    where: {
      chatUserId,
      createdAt: {
        gte: startOfMonth,
      },
    },
  });
};
