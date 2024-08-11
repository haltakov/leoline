import { convertStreamToWeb, getAnswerService } from "@/backend/answer/utils";
import { MessageWithRole } from "@/frontend/conversation/types";
import { NextResponse, NextRequest } from "next/server";

const answerService = getAnswerService();

export async function POST(request: NextRequest) {
  // Parse the request and get the messages
  const parsedRequest = await request.json();
  const messages: MessageWithRole[] = parsedRequest.messages;

  if (!messages) return new NextResponse("Messages not provided", { status: 400 });

  // Return the stream from the answer service
  const nodejsReadable = await answerService.answer(messages);
  const webReadableStream = convertStreamToWeb(nodejsReadable);
  return new Response(webReadableStream);
}
