import { useCallback, useEffect, useRef, useState } from "react";
import useVAD from "./useVAD";
import { ConversationState, MessageWithRole } from "../types";
import { utils } from "@ricky0123/vad-react";
import { transcribe } from "@/backend/transcribe/service";
import useChatAndSpeak from "@/frontend/chatAndSpeak/hooks/useChatAndSpeak";
import { PhraseToSay } from "@/backend/chatAndSpeak/types";
import { AnswerResult } from "@/frontend/chatAndSpeak/types";
import { useConversationContext } from "../context/ConversationStateContext";
import { usePlausible } from "next-plausible";

export interface Props {
  language: string;
  isScaryActive: boolean;
  chaptersCount: number;
}

const useConversation = ({ language, isScaryActive, chaptersCount }: Props) => {
  // Plausible analytics
  const plausible = usePlausible();

  // Conversation State
  const { state, setState } = useConversationContext();

  // Message History
  const [messages, setMessages] = useState<MessageWithRole[]>([]);

  // Answer abort controller
  const abortController = useRef<AbortController>(new AbortController());

  // Answer
  const { answer, say, abortSpeach, pauseSpeach, resumeSpeach } = useChatAndSpeak();

  // Voice Activity Detection
  const { isVADLoading, isVADError, startListen, pauseListen } = useVAD({
    onSpeechStart: () => {
      console.debug("VAD: Speech Start");
      pauseSpeach();
    },
    onSpeechEnd: (audio: Float32Array) => {
      console.debug("VAD: Speech End");

      pauseListen();

      const wav = utils.encodeWAV(audio);
      const blob = new Blob([wav], { type: "audio/wav" });
      transcribeAudio(blob);
    },
    onSpeechMisfire: () => {
      console.debug("VAD: Speech Misfire");
      resumeSpeach();
    },
  });

  // Add question text
  const submitQuestion = useCallback(
    async (questionText: string) => {
      console.debug("ANSWER: Answer start");

      const updatedMessages = [...messages, { text: questionText, isUser: true }];
      setMessages(updatedMessages);

      plausible("create-story");

      const answerResult = await answer({
        messages: updatedMessages,
        options: {
          chaptersCount,
          isScary: isScaryActive,
          language,
        },
        events: {
          abort: abortController.current.signal,
          onStartSpeaking: () => setState(ConversationState.SPEAK),
          onEndSpeaking: () => {
            console.debug("ANSWER: Answer ended");
            setState(ConversationState.WAIT);
          },
        },
      });

      if (answerResult === AnswerResult.LIMIT_REACHED) {
        setState(ConversationState.LIMIT_REACHED);
      }
    },
    [answer, chaptersCount, isScaryActive, language, messages, setState]
  );

  // Transcription
  const transcribeAudio = useCallback(
    async (audio: Blob) => {
      console.debug("TRANSCRIBE: Transcribing audio");
      setState(ConversationState.TRANSCRIBE);

      const formData = new FormData();
      formData.append("audio", audio, "recording.webm");

      const questionText = await transcribe(formData, language);

      console.debug("TRANSCRIBE: Transcribing finished");
      await submitQuestion(questionText);
    },
    [language, setState, submitQuestion]
  );

  // Activate action
  const activate = useCallback(() => {
    setState(ConversationState.LISTEN);
    startListen();
  }, [setState, startListen]);

  // Deactivate action
  const deactivate = useCallback(() => {
    setState(ConversationState.WAIT);
    pauseListen();
    abortController.current.abort();
    abortSpeach();

    // Reset the abort controller
    abortController.current = new AbortController();
  }, [abortSpeach, pauseListen, setState]);

  // Initialize
  useEffect(() => {
    if (state === ConversationState.INITIALIZE && isVADError) setState(ConversationState.ERROR);
    if (state === ConversationState.INITIALIZE && !isVADLoading) {
      setState(ConversationState.WAIT);

      say({
        phrase: PhraseToSay.WELCOME_MESSAGE,
        language,
        events: {
          onStartSpeaking: () => setState(ConversationState.SPEAK),
          onEndSpeaking: () => setState(ConversationState.WAIT),
        },
      });
    }
    if (state === ConversationState.LIMIT_REACHED) {
      say({
        phrase: PhraseToSay.LIMIT_REACHED,
        language,
        events: {
          onStartSpeaking: () => setState(ConversationState.SPEAK),
          onEndSpeaking: () => setState(ConversationState.WAIT),
        },
      });
    }
  }, [isVADError, isVADLoading, language, say, setState, state]);

  // Log State
  useEffect(() => {
    console.debug("CONVERSATION STATE:", state);
  }, [state]);

  return { state, activate, deactivate };
};

export default useConversation;
