import { PassThrough, Stream } from "stream";

export class StreamCombiner {
  private streamQueue: Stream[];
  private combinedStream: PassThrough;
  private isPiping: boolean;
  private allStreamsAdded: boolean;

  constructor() {
    this.streamQueue = [];
    this.combinedStream = new PassThrough();
    this.isPiping = false;
    this.allStreamsAdded = false;
  }

  addStream(stream: Stream): void {
    this.streamQueue.push(stream);
    this.pipeNextStream();
  }

  private async pipeNextStream(): Promise<void> {
    if (this.isPiping) return;

    this.isPiping = true;
    const currentStream = this.streamQueue.shift();

    if (currentStream) {
      try {
        currentStream.pipe(this.combinedStream, { end: false });

        currentStream.on("end", () => {
          this.isPiping = false;
          this.pipeNextStream();
        });

        currentStream.on("error", (error) => {
          this.combinedStream.emit("error", error);
        });
      } catch (error) {
        this.combinedStream.emit("error", error);
        this.isPiping = false;
        this.pipeNextStream();
      }
    } else {
      this.isPiping = false;

      if (this.streamQueue.length === 0 && this.allStreamsAdded) {
        this.combinedStream.end();
      }
    }
  }

  end(): void {
    this.allStreamsAdded = true;

    if (!this.isPiping && this.streamQueue.length === 0) {
      this.pipeNextStream();
      this.combinedStream.end();
    }
  }

  getCombinedStream(): PassThrough {
    return this.combinedStream;
  }
}
