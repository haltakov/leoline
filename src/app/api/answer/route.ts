import { AnswerOptions } from "@/backend/answer/types";
import { convertStreamToWeb, getAnswerService } from "@/backend/answer/utils";
import { MessageWithRole } from "@/frontend/conversation/types";
import { NextResponse, NextRequest } from "next/server";

const answerService = getAnswerService();

export async function POST(request: NextRequest) {
  // Parse the request and get the messages
  const parsedRequest = await request.json();
  const messages: MessageWithRole[] = parsedRequest.messages;
  const options: AnswerOptions = parsedRequest.options;

  if (!messages) return new NextResponse("Messages not provided", { status: 400 });

  // Return the stream from the answer service
  const nodejsReadable = await answerService.answer(messages, options);
  const webReadableStream = convertStreamToWeb(nodejsReadable);
  return new Response(webReadableStream, {
    status: 200,
    statusText: "OK",
    headers: {
      "Transfer-Encoding": "chunked",
      Connection: "keep-alive",
    },
  });
}
