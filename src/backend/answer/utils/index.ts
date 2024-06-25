import { ChatGPTAnswerService } from "../service/sepcific/chatgpt";

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
