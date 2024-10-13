import { AnswerOptions, PhraseToSay } from "@/backend/chatAndSpeak/types";
import { MessageWithRole } from "@/frontend/conversation/types";

export interface ChatAndSpeakEvents {
  abort?: AbortSignal;
  onStartSpeaking?: () => void;
  onEndSpeaking?: () => void;
}

export interface AnswerParams {
  messages: MessageWithRole[];
  options?: AnswerOptions;
  events?: ChatAndSpeakEvents;
}

export enum AnswerResult {
  SUCCESS = "SUCCESS",
  ERROR = "ERROR",
  LIMIT_REACHED = "LIMIT_REACHED",
}

export interface SayParams {
  phrase: PhraseToSay;
  language: string;
  events?: ChatAndSpeakEvents;
}
