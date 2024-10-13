export interface MessageWithRole {
  text: string;
  isUser: boolean;
}

export enum ConversationState {
  INITIALIZE = "INITIALIZE",
  WAIT = "WAIT",
  LISTEN = "LISTEN",
  RECORD = "RECORD",
  TRANSCRIBE = "TRANSCRIBE",
  SPEAK = "SPEAK",
  ERROR = "ERROR",
  LIMIT_REACHED = "LIMIT_REACHED",
}
