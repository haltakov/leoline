"use client";

import useBrowser from "@/frontend/browser/hooks/useBrowser";
import { BrowserType } from "@/frontend/browser/types";
import { useMicVAD, utils } from "@ricky0123/vad-react";
import { useState } from "react";

const useListenVad = () => {
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);

  const browserType = useBrowser();

  const {
    userSpeaking: isRecording,
    pause: pauseListen,
    start: startListen,
    loading: isLoading,
    errored: isError,
  } = useMicVAD({
    startOnLoad: true,
    onSpeechEnd: (audio) => {
      if (browserType === BrowserType.FIREFOX) {
        pauseListen();
      }

      const wav = utils.encodeWAV(audio);

      const blob = new Blob([wav], { type: "audio/wav" });
      setAudioBlob(blob);
    },
    workletURL: "/_next/static/vad/vad.worklet.bundle.min.js",
    modelURL: "/_next/static/vad/silero_vad.onnx",
    positiveSpeechThreshold: 0.6,
    minSpeechFrames: 4,
    ortConfig(ort) {
      ort.env.wasm = {
        wasmPaths: {
          "ort-wasm-simd-threaded.wasm": "/_next/static/vad/ort-wasm-simd-threaded.wasm",
          "ort-wasm-simd.wasm": "/_next/static/vad/ort-wasm-simd.wasm",
          "ort-wasm.wasm": "/_next/static/vad/ort-wasm.wasm",
          "ort-wasm-threaded.wasm": "/_next/static/vad/ort-wasm-threaded.wasm",
        },
        numThreads: browserType === BrowserType.SAFARI ? 1 : 4,
      };
    },
  });

  return { audioBlob, isRecording, isLoading, isError, startListen };
};

export default useListenVad;
