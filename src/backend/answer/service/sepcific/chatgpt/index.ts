import { MessageWithRole } from "@/frontend/conversation/types";
import { AnswerService } from "../../base";

import OpenAI from "openai";
import { parseOpenAIStream } from "./utils";
import { asyncIterableToReadableStream } from "@/backend/answer/utils";

export class ChatGPTAnswerService extends AnswerService {
  private readonly openai: OpenAI;

  constructor() {
    super();

    this.openai = new OpenAI({
      organization: process.env.OPENAI_ORG_ID,
      project: process.env.OPENAI_PROJECT_ID,
      apiKey: process.env.OPENAI_API_KEY,
    });
  }

  async answer(messages: MessageWithRole[]): Promise<ReadableStream> {
    // Get the OpenAI response
    const textResponse = await this.openai.chat.completions.create({
      model: "gpt-4o",
      messages: messages.map(({ text, isUser }) => ({
        role: isUser ? "user" : "assistant",
        content: text,
      })),
      stream: false,
    });

    console.log("DBG:", textResponse.choices[0].message.content);

    const speechResponse = await this.openai.audio.speech.create({
      model: "tts-1",
      voice: "nova",
      input: textResponse.choices[0].message.content,
      response_format: "pcm",
    });

    if (!speechResponse.body) throw new Error("Failed to get answer");

    // Extract the tokens from the chunks
    // const transformedIterator = parseOpenAIStream(response);

    // Convert to a stream
    // return asyncIterableToReadableStream(transformedIterator);

    return speechResponse.body;
  }
}
