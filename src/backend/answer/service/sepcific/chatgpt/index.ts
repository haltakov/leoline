import { MessageWithRole } from "@/frontend/conversation/types";
import { AnswerService } from "../../base";

import OpenAI from "openai";
import pino from "pino";
import { StreamCombiner } from "@/backend/answer/utils/streamCombiner";
import { Readable } from "stream";
import { ChatCompletionMessageParam } from "openai/resources/index.mjs";

const logger = pino();

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

  private async processSentence(sentence: string, streamCombiner: StreamCombiner): Promise<void> {
    if (!sentence) return;

    const speechResponse = await this.openai.audio.speech.create({
      model: "tts-1",
      voice: "nova",
      input: sentence,
      response_format: "pcm",
    });

    if (speechResponse.body) {
      // Note: is seems the objec the OpenAI API returns is not a ReadableStream, but PassThrough instead, which is a node.js Readable
      streamCombiner.addStream(speechResponse.body as unknown as Readable);
    }
  }

  async answer(messages: MessageWithRole[]): Promise<Readable> {
    // Get the result stream
    const streamCombiner = new StreamCombiner();
    const resultStream = streamCombiner.getCombinedStream();

    // Prepare the messages for the OpenAI API
    const messagesOpenAIFormat = [
      {
        role: "system",
        content:
          "You are an asistant called Leoline. Your job is to tell stories to kids. If asked for a story topic, directly tell the story. If asked soemthing else you can give a short answer. Avoid complex words and phrases. Tell entertaining stories! Make sure that the content is suitable for little kids.",
      },
      ...messages.map(({ text, isUser }) => ({
        role: isUser ? "user" : "assistant",
        content: text,
      })),
    ] as Array<ChatCompletionMessageParam>;

    console.log("DBG:", { messagesOpenAIFormat });

    // Get the response from the OpenAI API LLM
    logger.info("Requesting OpenAI text response");
    const textResponseStream = await this.openai.chat.completions.create({
      model: "gpt-4o",
      messages: messagesOpenAIFormat,
      stream: true,
    });
    logger.info("Text response streaming started");

    // Process the response sentence by sentence
    (async () => {
      let currentSentence = "";
      for await (const chunk of textResponseStream) {
        const chunkContent = chunk.choices[0]?.delta?.content || "";
        currentSentence += chunkContent;

        if (
          currentSentence.length > 100 &&
          (chunkContent.includes(".") || chunkContent.includes("!") || chunkContent.includes("?"))
        ) {
          logger.info(`Processing sentence: ${currentSentence}`);
          await this.processSentence(currentSentence, streamCombiner);
          currentSentence = "";
        }
      }

      // Process the last sentence
      await this.processSentence(currentSentence, streamCombiner);

      // End the stream output
      streamCombiner.end();
    })();

    return resultStream;
  }
}
