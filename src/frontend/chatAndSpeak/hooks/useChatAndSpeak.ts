"use client";

import { useCallback, useRef } from "react";
import { sleep } from "@/utils";
import { AnswerParams, ChatAndSpeakEvents, SayParams } from "../types";

const useChatAndSpeak = () => {
  const audioContext = useRef<AudioContext | null>(null);
  const source = useRef<AudioBufferSourceNode | null>(null);

  const processSpeachStream = useCallback(
    async (stream: ReadableStreamDefaultReader<Uint8Array>, events?: ChatAndSpeakEvents) => {
      audioContext.current = new AudioContext({ sampleRate: 24000 });
      let nextStartTime = audioContext.current.currentTime;

      let leftover = new Uint8Array();
      let result = await stream.read();

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

        if (events?.onStartSpeaking) {
          events.onStartSpeaking();
        }

        nextStartTime += audioBuffer.duration;

        result = await stream.read();

        if (result.done) {
          source.current.onended = () => {
            if (events?.onEndSpeaking) {
              events.onEndSpeaking();
            }
          };
        }
      }
    },
    []
  );

  const answer = useCallback(
    async ({ messages, options, events }: AnswerParams) => {
      if (!messages.length || !messages[messages.length - 1].isUser) return;

      try {
        const response = await fetch("/api/answer", {
          method: "POST",
          body: JSON.stringify({ messages, options: { ...options, abort: undefined } }),
          signal: events?.abort,
        });

        if (!response.ok || !response.body) {
          console.error(response);
          console.error("Failed to get answer");
          return;
        }

        const reader = response.body.getReader();
        processSpeachStream(reader, events);
      } catch (error) {
        if (events?.abort?.aborted) {
          audioContext.current?.close();
        }
      }
    },
    [processSpeachStream]
  );

  const say = useCallback(
    async ({ phrase, language, events }: SayParams) => {
      try {
        const response = await fetch("/api/say", {
          method: "POST",
          body: JSON.stringify({ phrase, language }),
          signal: events?.abort,
        });

        if (!response.ok || !response.body) {
          console.error(response);
          console.error("Failed to get answer");
          return;
        }

        const reader = response.body.getReader();
        processSpeachStream(reader, events);
      } catch (error) {
        if (events?.abort?.aborted) {
          audioContext.current?.close();
        }
      }
    },
    [processSpeachStream]
  );

  const abortSpeach = useCallback(() => {
    audioContext.current?.close();
  }, []);

  const pauseSpeach = useCallback(() => {
    audioContext.current?.suspend();
  }, []);

  const resumeSpeach = useCallback(() => {
    audioContext.current?.resume();
  }, []);

  return { answer, say, abortSpeach, pauseSpeach, resumeSpeach };
};

export default useChatAndSpeak;