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
  isMicActive: boolean;
  isLongActive: boolean;
  isScaryActive: boolean;
}

const useConversation = ({ language, isMicActive, isLongActive, isScaryActive }: Props) => {
  // Conversation State
  const [state, setState] = useState<ConversationState>(ConversationState.INITIALIZE);
  const [isAnswering, setIsAnswering] = useState(false);

  // Browser Type
  const browserType = useBrowser();

  // Message History
  const [messages, setMessages] = useState<MessageWithRole[]>([]);

  // Answer abort controller
  const abortController = useRef<AbortController>(new AbortController());

  // Answer
  const {
    answer,
    abort: answerAbort,
    pause: answerPause,
    resume: answerResume,
  } = useAnswer({
    onAnswerEnd: () => {
      console.debug("ANSWER: Answer ended");

      setIsAnswering(false);
      setState(ConversationState.LISTEN);

      if (browserType === BrowserType.FIREFOX && isMicActive) {
        startListen();
      }
    },
  });

  // Voice Activity Detection
  const { isVADLoading, isVADError, startListen, pauseListen } = useVAD({
    onSpeechStart: () => {
      console.debug("VAD: Speech Start");

      answerPause();

      setState(ConversationState.RECORD);
    },
    onSpeechEnd: (audio: Float32Array) => {
      console.debug("VAD: Speech End");

      if (state !== ConversationState.LISTEN) {
        abortController.current.abort();
        answerAbort();
      }

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
      console.debug("VAD: Speech Misfire");

      setState(isAnswering ? ConversationState.SPEAK : ConversationState.LISTEN);

      answerResume();
    },
  });

  // Mic active toggle
  useEffect(() => {
    if (isMicActive) {
      startListen();
    } else {
      pauseListen();
    }
  }, [isMicActive, pauseListen, startListen]);

  // Add question text
  const submitQuestion = useCallback(
    (questionText: string) => {
      if (abortController.current.signal.aborted) return;

      console.debug("ANSWER: Answer start");
      setIsAnswering(true);

      const updatedMessages = [...messages, { text: questionText, isUser: true }];
      setMessages(updatedMessages);

      answer(updatedMessages, {
        abort: abortController.current.signal,
        onStartSpeaking: () => setState(ConversationState.SPEAK),
        isLong: isLongActive,
        isScary: isScaryActive,
      });
    },
    [answer, isLongActive, isScaryActive, messages]
  );

  // Transcription
  const transcribeAudio = useCallback(
    async (audio: Blob) => {
      if (abortController.current.signal.aborted) return;

      console.debug("TRANSCRIBE: Transcribing audio");
      setState(ConversationState.TRANSCRIBE);

      const formData = new FormData();
      formData.append("audio", audio, "recording.webm");

      const questionText = await transcribe(formData, language);

      console.debug("TRANSCRIBE: Transcribing finished");
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
    console.debug("CONVERSATION STATE:", state);
  }, [state]);

  return { state };
};

export default useConversation;
