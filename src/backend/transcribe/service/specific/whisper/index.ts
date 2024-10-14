import { Readable } from "stream";
import { TranscribeService } from "../../base";

import OpenAI from "openai";
import { createLog } from "@/backend/logging/service";

export class WhisperTranscribeService extends TranscribeService {
  private readonly openai: OpenAI;

  constructor(language: string) {
    super(language);

    this.openai = new OpenAI({
      organization: process.env.OPENAI_ORG_ID,
      project: process.env.OPENAI_PROJECT_ID,
      apiKey: process.env.OPENAI_API_KEY,
    });
  }

  async transcribe(audio: Blob): Promise<string> {
    try {
      // Transcribe with Whisper
      const { text } = await this.openai.audio.transcriptions.create({
        model: "whisper-1",
        file: audio as any,
        language: this.language,
      });

      return text;
    } catch (error) {
      await createLog({ level: "error", message: `Cannot transcribe audio: ${error}`, notify: true });
      throw error;
    }
  }
}
