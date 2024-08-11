"use server";

import { getTranscribeService } from "../utils";

export const transcribe = async (data: FormData, language: string): Promise<string> => {
  const transcribeService = getTranscribeService(language);
  return transcribeService.transcribe(data.get("audio") as Blob);
};
