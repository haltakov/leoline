"use client";

import useBrowser from "@/frontend/browser/hooks/useBrowser";
import { BrowserType } from "@/frontend/browser/types";
import { useMicVAD, utils } from "@ricky0123/vad-react";
import { useState } from "react";
import { getVADConfig } from "../config";

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
    positiveSpeechThreshold: 0.6,
    minSpeechFrames: 4,
    onSpeechEnd: (audio) => {
      if (browserType === BrowserType.FIREFOX) pauseListen();

      const wav = utils.encodeWAV(audio);
      const blob = new Blob([wav], { type: "audio/wav" });

      setAudioBlob(blob);
    },
    ...getVADConfig(browserType),
  });

  return { audioBlob, isRecording, isLoading, isError, startListen };
};

export default useListenVad;
