export interface AnswerOptions {
  isScary: boolean;
  chaptersCount: number;
  language: string;
}

export enum PhraseToSay {
  WELCOME_MESSAGE = "WELCOME_MESSAGE",
  LIMIT_REACHED = "LIMIT_REACHED",
}
