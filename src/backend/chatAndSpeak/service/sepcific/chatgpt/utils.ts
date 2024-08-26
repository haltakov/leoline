import { ChatCompletionChunk } from "openai/resources/index.mjs";

export async function* parseOpenAIStream(stream: AsyncIterable<ChatCompletionChunk>) {
  for await (const chunk of stream) {
    yield chunk.choices[0].delta.content || "";
  }
}
