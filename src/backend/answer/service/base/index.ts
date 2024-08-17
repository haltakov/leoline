import { MessageWithRole } from "@/frontend/conversation/types";
import { Readable } from "stream";
import { AnswerOptions } from "../../types";

export abstract class AnswerService {
  abstract answer(messages: MessageWithRole[], options?: AnswerOptions): Promise<Readable>;
}
