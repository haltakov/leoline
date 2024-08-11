import { MessageWithRole } from "@/frontend/conversation/types";
import { Readable } from "stream";

export abstract class AnswerService {
  abstract answer(messages: MessageWithRole[]): Promise<Readable>;
}
