import prisma from "@/backend/prisma";
import { getCurrentUser } from "@/backend/user/service";
import { NextAuthRequest } from "@/backend/user/types";
import { NextResponse } from "next/server";

export async function POST(request: NextAuthRequest) {
  // Parse the request and get the messages
  const parsedRequest = await request.json();
  const storyId = parsedRequest.storyId;

  if (!storyId) return new NextResponse("Story ID not provided", { status: 400 });

  const { chatUser } = await getCurrentUser(request, request.auth);

  try {
    // Create the story in the DB
    await prisma.story.update({
      where: {
        id: storyId,
        chatUserId: chatUser.id,
        abortedAt: null,
      },
      data: {
        abortedAt: new Date(),
      },
    });
  } catch (error) {
    console.error("Error aborting story:", error);
    return new NextResponse("Error aborting story", { status: 400 });
  }

  return new NextResponse("", { status: 200 });
}
