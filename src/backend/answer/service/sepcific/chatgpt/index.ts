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
    const response = await this.openai.chat.completions.create({
      model: "gpt-4o",
      messages: messages.map(({ text, isUser }) => ({
        role: isUser ? "user" : "assistant",
        content: text,
      })),
      stream: true,
    });

    // Extract the tokens from the chunks
    const transformedIterator = parseOpenAIStream(response);

    // Convert to a stream
    return asyncIterableToReadableStream(transformedIterator);
  }
}
