"use server";

import { LANGUAGE } from "@/const";
import { getTranscribeService } from "../utils";

const transcribeService = getTranscribeService(LANGUAGE);

export const transcribe = async (data: FormData): Promise<string> => {
  return transcribeService.transcribe(data.get("audio") as Blob);
};
