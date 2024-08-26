import { PhraseToSay } from "@/backend/chatAndSpeak/types";
import { convertStreamToWeb, getChatAndSpeakService } from "@/backend/chatAndSpeak/utils";
import { NextResponse, NextRequest } from "next/server";

const chatAndSpeakService = getChatAndSpeakService();

export async function POST(request: NextRequest) {
  // Parse the request and get the messages
  const { phrase: phraseString, language } = await request.json();

  // Check the phrase parameter
  if (!phraseString || !Object.values(PhraseToSay).includes(phraseString)) {
    return new NextResponse("Invalid phrase", { status: 400 });
  }

  // Check the language parameter
  if (!language || typeof language !== "string" || language.length !== 2) {
    return new NextResponse("Invalid language", { status: 400 });
  }

  // Return the stream from the answer service
  const nodejsReadable = await chatAndSpeakService.say(phraseString, language);
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
