import { AnswerOptions } from "@/backend/chatAndSpeak/types";
import { convertStreamToWeb, getChatAndSpeakService } from "@/backend/chatAndSpeak/utils";
import prisma from "@/backend/prisma";
import { getCurrentUser } from "@/backend/user/service";
import { NextAuthRequest } from "@/backend/user/types";
import { MessageWithRole } from "@/frontend/conversation/types";
import { NextResponse } from "next/server";

const chatAndSpeakServiceService = getChatAndSpeakService();

export async function POST(request: NextAuthRequest) {
  // Parse the request and get the messages
  const parsedRequest = await request.json();
  const messages: MessageWithRole[] = parsedRequest.messages;
  const options: AnswerOptions = parsedRequest.options;

  if (!messages) return new NextResponse("Messages not provided", { status: 400 });
  if (!options || !options.chaptersCount) return new NextResponse("Options not provided", { status: 400 });

  // Get the current user
  const { chatUser } = await getCurrentUser(request, request.auth);

  // Create the story in the DB
  const story = await prisma.story.create({
    data: {
      prompt: messages[messages.length - 1].text,
      chapters: options.chaptersCount,
      isScary: options.isScary,
      language: options.language,
      chatUserId: chatUser.id,
    },
  });

  // Return the stream from the answer service
  const nodejsReadable = await chatAndSpeakServiceService.answer(messages, options, story.id);
  const webReadableStream = convertStreamToWeb(nodejsReadable);
  return new Response(webReadableStream, {
    status: 200,
    statusText: "OK",
    headers: {
      "Transfer-Encoding": "chunked",
      Connection: "keep-alive",
      "Story-Id": story.id,
    },
  });
}
