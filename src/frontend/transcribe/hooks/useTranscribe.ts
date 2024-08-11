"use client";

import { transcribe } from "@/backend/transcribe/service";
import { useEffect, useState } from "react";

export interface Props {
  audio: Blob | null;
  language: string;
}

const useTranscribe = ({ audio, language }: Props) => {
  const [transcribedText, setTranscribedText] = useState("");

  useEffect(() => {
    if (!audio) return;

    const formData = new FormData();
    formData.append("audio", audio, "recording.webm");

    transcribe(formData, language).then((text) => {
      setTranscribedText(text);
    });
  }, [audio]);

  return { transcribedText };
};

export default useTranscribe;
