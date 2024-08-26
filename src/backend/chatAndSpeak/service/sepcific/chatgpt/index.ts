import { MessageWithRole } from "@/frontend/conversation/types";
import { ChatAndSpeakService } from "../../base";

import OpenAI from "openai";
import pino from "pino";
import { StreamCombiner } from "@/backend/chatAndSpeak/utils/streamCombiner";
import { Readable } from "stream";
import { ChatCompletionMessageParam } from "openai/resources/index.mjs";
import { AnswerOptions, PhraseToSay } from "@/backend/chatAndSpeak/types";
import { PHRASES } from "@/backend/chatAndSpeak/utils/phrases";

const logger = pino();

export class ChatGPTChatAndSpeakService extends ChatAndSpeakService {
  private readonly openai: OpenAI;
  private readonly voice: "alloy" | "echo" | "fable" | "onyx" | "nova" | "shimmer" = "echo";

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
      voice: this.voice,
      input: sentence,
      response_format: "pcm",
    });

    if (speechResponse.body) {
      // Note: is seems the objec the OpenAI API returns is not a ReadableStream, but PassThrough instead, which is a node.js Readable
      streamCombiner.addStream(speechResponse.body as unknown as Readable);
    }
  }

  private getSystemMessage(options?: AnswerOptions): string {
    const defaultMessage =
      "You are an asistant called Leoline. Your job is to tell stories to kids. If asked for a story topic, directly tell the story. If asked soemthing else you can give a short answer. Avoid complex words and phrases.";

    const messages = [defaultMessage];

    // Scary mode
    messages.push(
      options?.isScary
        ? "Tell scary stories if the user asks for it."
        : "Make sure stories are not scary and suitable for children."
    );

    // Long mode
    if (options?.isLong) {
      messages.push("Make the story longer by creating 3 dedicated chapters.");
    }

    return messages.join(" ");
  }

  async answer(messages: MessageWithRole[], options?: AnswerOptions): Promise<Readable> {
    // Get the result stream
    const streamCombiner = new StreamCombiner();
    const resultStream = streamCombiner.getCombinedStream();

    // Prepare the messages for the OpenAI API
    const messagesOpenAIFormat = [
      {
        role: "system",
        content: this.getSystemMessage(options),
      },
      ...messages.map(({ text, isUser }) => ({
        role: isUser ? "user" : "assistant",
        content: text,
      })),
    ] as Array<ChatCompletionMessageParam>;

    // Get the response from the OpenAI API LLM
    logger.info("Requesting OpenAI text response");
    const textResponseStream = await this.openai.chat.completions.create({
      model: "gpt-4o",
      messages: messagesOpenAIFormat,
      stream: true,
      max_tokens: 4096,
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

  async say(phrase: PhraseToSay, language: string): Promise<Readable> {
    // Prepare the messages for the OpenAI API
    const messagesOpenAIFormat = [
      {
        role: "system",
        content: `Repeat the exact words from the user transalated in the language with code "${language}"`,
      },
      { role: "user", content: PHRASES.get(phrase) },
    ] as Array<ChatCompletionMessageParam>;

    // Get the response from the OpenAI API LLM
    logger.info("Requesting OpenAI text response");
    const textResponse = await this.openai.chat.completions.create({
      model: "gpt-4o",
      messages: messagesOpenAIFormat,
      stream: false,
      max_tokens: 4096,
    });
    logger.info("Text response streaming started");

    // Stream the response from the Speech API
    const speechResponse = await this.openai.audio.speech.create({
      model: "tts-1",
      voice: this.voice,
      input: textResponse.choices[0]?.message?.content || "",
      response_format: "pcm",
    });

    return speechResponse.body as unknown as Readable;
  }
}
