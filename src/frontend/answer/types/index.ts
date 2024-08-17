import { AnswerOptions } from "@/backend/answer/types";

export interface AnswerOptionsWithAbort extends AnswerOptions {
  abort?: AbortSignal;
}
