import { ChatGPTAnswerService } from "../service/sepcific/chatgpt";
import { Readable } from "stream";

export const getAnswerService = () => {
  return new ChatGPTAnswerService();
};

export const asyncIterableToReadableStream = <T>(asyncIterable: AsyncIterable<T>): ReadableStream<T> => {
  return new ReadableStream<T>({
    async start(controller) {
      try {
        for await (const item of asyncIterable) {
          controller.enqueue(item);
        }
        controller.close();
      } catch (error) {
        controller.error(error);
      }
    },
  });
};

export const convertStreamToWeb = (nodeStream: Readable): ReadableStream => {
  return new ReadableStream({
    start(controller) {
      nodeStream.on("data", (chunk) => {
        controller.enqueue(chunk);
      });
      nodeStream.on("end", () => {
        controller.close();
      });
      nodeStream.on("error", (err) => {
        controller.error(err);
      });
    },
    cancel() {
      nodeStream.destroy();
    },
  });
};
