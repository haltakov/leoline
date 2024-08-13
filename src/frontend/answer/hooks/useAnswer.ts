"use client";

import { useCallback, useRef } from "react";
import { MessageWithRole } from "@/frontend/conversation/types";
import { sleep } from "@/utils";

export interface Props {
  onAnswerEnd: () => void;
}

const useAnswer = ({ onAnswerEnd }: Props) => {
  const audioContext = useRef<AudioContext | null>(null);
  const source = useRef<AudioBufferSourceNode | null>(null);

  const answer = useCallback(
    async (messages: MessageWithRole[], abort?: AbortSignal) => {
      if (!messages.length || !messages[messages.length - 1].isUser) return;

      try {
        const response = await fetch("/api/answer", {
          method: "POST",
          body: JSON.stringify({ messages }),
          signal: abort,
        });

        if (!response.ok || !response.body) {
          console.log(response);
          console.error("Failed to get answer");
          return;
        }

        audioContext.current = new AudioContext({ sampleRate: 24000 });

        let nextStartTime = audioContext.current.currentTime;
        const reader = response.body.getReader();
        let leftover = new Uint8Array();
        let result = await reader.read();

        while (audioContext.current) {
          if (!result.value) {
            await sleep(100);
            continue;
          }

          const data = new Uint8Array(leftover.length + result.value.length);
          data.set(leftover);
          data.set(result.value, leftover.length);

          const length = Math.floor(data.length / 2) * 2;
          const remainder = data.length % 2;
          const buffer = new Float32Array(length / 2);
          const view = new DataView(data.buffer);
          for (let i = 0; i < buffer.length; i++) {
            buffer[i] = view.getInt16(i * 2, true) / 0x8000; // Normalize PCM data
          }

          leftover = new Uint8Array(data.buffer, length, remainder);

          const audioBuffer = audioContext.current.createBuffer(1, buffer.length, audioContext.current.sampleRate);
          audioBuffer.copyToChannel(buffer, 0);

          source.current = audioContext.current.createBufferSource();
          source.current.buffer = audioBuffer;
          source.current.connect(audioContext.current.destination);
          source.current.start(nextStartTime);

          nextStartTime += audioBuffer.duration;

          result = await reader.read();

          if (result.done) {
            source.current.onended = () => {
              onAnswerEnd();
            };
          }
        }
      } catch (error) {
        if (abort?.aborted) {
          audioContext.current?.close();
        }
      }
    },
    [onAnswerEnd]
  );

  return { answer };
};

export default useAnswer;
