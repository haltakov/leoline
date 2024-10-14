export interface CreateLogParams {
  level: "info" | "warn" | "error";
  message: string;
  notify?: boolean;
}

export interface SendTelegramMessageParams {
  level: "info" | "warn" | "error";
  message: string;
  email?: string;
  country?: string;
}
