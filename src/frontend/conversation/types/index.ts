export interface MessageWithRole {
  text: string;
  isUser: boolean;
}

export enum ConversationState {
  INITIALIZE = "INITIALIZE",
  WAIT = "WAIT",
  LISTEN = "LISTEN",
  RECORD = "RECORD",
  THINK = "THINK",
  SPEAK = "SPEAK",
  ERROR = "ERROR",
  LIMIT_REACHED = "LIMIT_REACHED",
}
