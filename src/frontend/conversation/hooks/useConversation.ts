import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import useVAD from "./useVAD";
import { ConversationState, MessageWithRole } from "../types";
import useBrowser from "@/frontend/browser/hooks/useBrowser";
import { BrowserType } from "@/frontend/browser/types";
import { utils } from "@ricky0123/vad-react";
import { transcribe } from "@/backend/transcribe/service";
import useAnswer from "@/frontend/answer/hooks/useAnswer";

export interface Props {
  language: string;
}

const useConversation = ({ language }: Props) => {
  // Conversation State
  const [state, setState] = useState<ConversationState>(ConversationState.INITIALIZE);

  // Browser Type
  const browserType = useBrowser();

  // Message History
  const [messages, setMessages] = useState<MessageWithRole[]>([]);

  // Answer abort controller
  const abortController = useRef<AbortController>(new AbortController());

  // Voice Activity Detection
  const { isVADLoading, isVADError, startListen, pauseListen } = useVAD({
    onSpeechStart: () => {
      if (state !== ConversationState.LISTEN) {
        abortController.current.abort();
      }

      console.log("DBG: onSpeechStart");
      setState(ConversationState.RECORD);
    },
    onSpeechEnd: (audio: Float32Array) => {
      // Reset the abort controller
      abortController.current = new AbortController();

      if (browserType === BrowserType.FIREFOX) {
        pauseListen();
      }

      const wav = utils.encodeWAV(audio);
      const blob = new Blob([wav], { type: "audio/wav" });
      transcribeAudio(blob);
    },
    onSpeechMisfire: () => {
      console.log("DBG: onSpeechMisfire");
      setState(ConversationState.LISTEN);
    },
  });

  // Answer
  const { answer } = useAnswer({
    onAnswerEnd: () => {
      setState(ConversationState.LISTEN);

      if (browserType === BrowserType.FIREFOX) {
        startListen();
      }
    },
  });

  // Add question text
  const submitQuestion = useCallback(
    (questionText: string) => {
      if (abortController.current.signal.aborted) return;

      setState(ConversationState.SPEAK);

      const updatedMessages = [...messages, { text: questionText, isUser: true }];
      setMessages(updatedMessages);

      answer(updatedMessages, abortController.current.signal);
    },
    [answer, messages, state]
  );

  // Transcription
  const transcribeAudio = useCallback(
    async (audio: Blob) => {
      if (abortController.current.signal.aborted) return;

      setState(ConversationState.TRANSCRIBE);

      const formData = new FormData();
      formData.append("audio", audio, "recording.webm");

      const questionText = await transcribe(formData, language);
      submitQuestion(questionText);
    },
    [language, submitQuestion]
  );

  // Initialize
  useEffect(() => {
    if (state === ConversationState.INITIALIZE && isVADError) setState(ConversationState.ERROR);
    if (state === ConversationState.INITIALIZE && !isVADLoading) setState(ConversationState.LISTEN);
  }, [isVADError, isVADLoading, state]);

  // Log State
  useEffect(() => {
    console.log("CONVERSATION STATE:", state);
  }, [state]);

  return { state };
};

export default useConversation;
