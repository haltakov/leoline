export interface CreateLogParams {
  level: "info" | "warn" | "error";
  message: string;
  notify?: boolean;
}
