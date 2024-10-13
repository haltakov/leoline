import { PhraseToSay } from "../types";

export const PHRASES: Map<PhraseToSay, string> = new Map([
  [
    PhraseToSay.WELCOME_MESSAGE,
    "Hey, my name is Leoline. I am here to tell you a story. Tap me and tell me what story you want to hear.",
  ],
  [
    PhraseToSay.LIMIT_REACHED,
    "Sorry, but you have reached the limit of stories for this month. Please ask an adult to help you subscribe for more stories.",
  ],
]);
