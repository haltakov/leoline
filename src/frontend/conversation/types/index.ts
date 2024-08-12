export interface MessageWithRole {
  text: string;
  isUser: boolean;
}

export enum ConversationState {
  INITIALIZE = "INITIALIZE",
  LISTEN = "LISTEN",
  RECORD = "RECORD",
  TRANSCRIBE = "TRANSCRIBE",
  SPEAK = "SPEAK",
  ERROR = "ERROR",
}
