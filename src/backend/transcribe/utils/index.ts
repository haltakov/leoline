import { TranscribeService } from "../service/base";
import { WhisperTranscribeService } from "../service/specific/whisper";

export const getTranscribeService = (language: string): TranscribeService => {
  return new WhisperTranscribeService(language);
};
