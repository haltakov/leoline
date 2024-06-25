import { MessageWithRole } from "@/frontend/conversation/types";

export abstract class AnswerService {
  abstract answer(messages: MessageWithRole[]): void;
}
