import { MessageWithRole } from "@/frontend/conversation/types";
import { Readable } from "stream";
import { AnswerOptions, PhraseToSay } from "../../types";

export abstract class ChatAndSpeakService {
  abstract answer(messages: MessageWithRole[], options?: AnswerOptions): Promise<Readable>;

  abstract say(phrase: PhraseToSay, language: string): Promise<Readable>;
}
