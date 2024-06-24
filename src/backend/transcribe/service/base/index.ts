export abstract class TranscribeService {
  protected readonly language: string;

  constructor(language: string) {
    this.language = language;
  }

  abstract transcribe(audio: Blob): Promise<string>;
}
