import { MessageWithRole } from "@/frontend/conversation/types";
import { ChatAndSpeakService } from "../../base";

import OpenAI from "openai";
import pino from "pino";
import { StreamCombiner } from "@/backend/chatAndSpeak/utils/streamCombiner";
import { Readable } from "stream";
import { ChatCompletionMessageParam } from "openai/resources/index.mjs";
import { AnswerOptions, PhraseToSay } from "@/backend/chatAndSpeak/types";
import { PHRASES } from "@/backend/chatAndSpeak/utils/phrases";
import { Stream } from "openai/streaming.mjs";
import prisma from "@/backend/prisma";
import { AnswerWithStats } from "./types";
import { CompletionUsage } from "openai/src/resources/completions.js";

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

  private async speakOutSentence(sentence: string, streamCombiner: StreamCombiner): Promise<void> {
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

  private async speakOutTextStream(
    textStream: Stream<OpenAI.Chat.Completions.ChatCompletionChunk>,
    ausioStreamCombiner: StreamCombiner,
    shouldEndStream: boolean
  ): Promise<AnswerWithStats> {
    let responseText = "";
    let currentSentence = "";
    let usageStats: CompletionUsage | undefined = undefined;

    for await (const chunk of textStream) {
      const chunkContent = chunk.choices[0]?.delta?.content || "";
      currentSentence += chunkContent;

      if (chunk.usage) usageStats = chunk.usage;

      if (
        currentSentence.length > 100 &&
        (chunkContent.includes(".") || chunkContent.includes("!") || chunkContent.includes("?"))
      ) {
        logger.info(`Processing sentence: ${currentSentence}`);

        await this.speakOutSentence(currentSentence, ausioStreamCombiner);

        responseText += currentSentence;
        currentSentence = "";
      }
    }

    // Process the last sentence
    await this.speakOutSentence(currentSentence, ausioStreamCombiner);
    responseText += currentSentence;

    if (shouldEndStream) ausioStreamCombiner.end();

    return { text: responseText, tokensUsed: usageStats?.completion_tokens || 0 };
  }

  private getSystemMessage({ isScary, chaptersCount }: AnswerOptions): string {
    const defaultMessage =
      "You are an asistant called Leoline. Your job is to tell stories to kids. If asked for a story topic, directly tell the story. If asked soemthing else you can give a short answer. Avoid complex words and phrases.";

    const messages = [defaultMessage];

    // Scary mode
    messages.push(
      isScary
        ? "Tell scary stories if the user asks for it."
        : "Make sure stories are not scary and suitable for children."
    );

    // Chapters count
    if (chaptersCount > 1)
      messages.push(
        `Talk to the user until they provide a topic suitable for a story. Once you have a proper topic, reply first with the message "#CHAPTERS#" and then generate a short outline for a story with ${chaptersCount} chapters`
      );

    return messages.join(" ");
  }

  async answer(messages: MessageWithRole[], options: AnswerOptions, storyId: string): Promise<Readable> {
    // Log the request
    logger.info(`Answering the question: "${messages[messages.length - 1].text}" (${JSON.stringify(options)})`);

    // Get the result stream
    const streamCombiner = new StreamCombiner();

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
      stream_options: {
        include_usage: true,
      },
    });
    logger.info("Text response streaming started");

    // Check the response for Chapter Mode
    let initialText = "";
    let isChapterMode = false;

    const [checkContentTypeStream, contentStream] = textResponseStream.tee();

    let tempMessage = "";
    for await (const chunk of checkContentTypeStream) {
      const chunkContent = chunk.choices[0]?.delta?.content || "";
      tempMessage += chunkContent;

      if (tempMessage.length > 10) {
        if (tempMessage.includes("#CHAPTERS#")) {
          isChapterMode = true;
        }

        break;
      }
    }

    logger.info(`Chapter mode: ${isChapterMode ? "ACTIVE" : "INACTIVE"}`);

    if (!isChapterMode) {
      // Process the text stream to audio
      (async () => {
        const { text, tokensUsed } = await this.speakOutTextStream(contentStream, streamCombiner, true);

        // Update the story with the text in the DB
        await prisma.story.update({
          where: {
            id: storyId,
          },
          data: {
            text,
            tokensUsed,
          },
        });
      })();
    } else {
      let storyTokensUsed = 0;
      // Aggregate the chapter message
      logger.info(`Prepating the story outline`);
      let chapterMessage = initialText;
      for await (const chunk of contentStream) {
        const chunkContent = chunk.choices[0]?.delta?.content || "";
        chapterMessage += chunkContent;

        if (chunk.usage) storyTokensUsed = chunk.usage.completion_tokens || 0;
      }
      logger.info(`Story outline: ${chapterMessage}`);

      // Update the story with the outline in the DB
      await prisma.story.update({
        where: {
          id: storyId,
        },
        data: {
          outline: chapterMessage,
        },
      });

      // Generate each chapter and process each one to audio
      (async () => {
        let storyText = "";

        for (let i = 1; i <= options.chaptersCount; i++) {
          logger.info(`Requesting OpenAI text response for chapter ${i}`);
          const chapterTextResponseStream = await this.openai.chat.completions.create({
            model: "gpt-4o",
            messages: [
              ...messagesOpenAIFormat,
              { role: "assistant", content: chapterMessage },
              { role: "user", content: `Output the text for chapter ${i}` },
            ],
            stream: true,
            max_tokens: 4096,
            stream_options: {
              include_usage: true,
            },
          });
          logger.info("Text response streaming started");

          // Process the text stream to audio
          const { text, tokensUsed } = await this.speakOutTextStream(
            chapterTextResponseStream,
            streamCombiner,
            i === options.chaptersCount
          );
          storyText += text;
          storyTokensUsed += tokensUsed;
        }

        // Update the story with the text in the DB
        await prisma.story.update({
          where: {
            id: storyId,
          },
          data: {
            text: storyText,
            tokensUsed: storyTokensUsed,
          },
        });
      })();
    }

    return streamCombiner.getCombinedStream();
  }

  async say(phrase: PhraseToSay, language: string): Promise<Readable> {
    // Get the result stream
    const streamCombiner = new StreamCombiner();

    // Prepare the messages for the OpenAI API
    const messagesOpenAIFormat = [
      {
        role: "system",
        content: `Repeat the exact words from the user transalated in the language with code "${language}".`,
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

    (async () => {
      await this.speakOutSentence(textResponse.choices[0].message.content || "", streamCombiner);

      streamCombiner.end();
    })();

    return streamCombiner.getCombinedStream();
  }
}
