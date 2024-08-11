"use client";

import { useEffect, useRef, useState } from "react";
import Message from "./Message";
import useTranscribe from "@/frontend/transcribe/hooks/useTranscribe";
import { MessageWithRole } from "../types";
import useAnswer from "@/frontend/answer/hooks/useAnswer";
import useListenVad from "@/frontend/listen/hooks/useListenVad";

export interface Props {
  language: string;
}

const Conversation = ({ language }: Props) => {
  // Audio ref
  const audioRef = useRef<HTMLAudioElement>(null);

  // Messages
  const [messages, setMessages] = useState<MessageWithRole[]>([
    // { text: "Tell me a very short story about Mickey Mouse", isUser: true },
    // { text: "What is the capital of Germany?", isUser: true },
  ]);

  // Listen
  // const { audioBlob, isRecording, toggleRecording } = useListen();
  const { audioBlob, isRecording, startListen } = useListenVad();

  // Transcribe
  const { transcribedText } = useTranscribe({ audio: audioBlob, language });

  // Answer
  const { answer, isAnswering } = useAnswer({ messages, audioRef });

  useEffect(() => {
    if (!isAnswering && answer) {
      setMessages((messages) => [...messages, { text: answer, isUser: false }]);
    }
  }, [answer, isAnswering]);

  useEffect(() => {
    if (!transcribedText) return;

    setMessages((messages) => [...messages, { text: transcribedText, isUser: true }]);
  }, [transcribedText]);

  // useEffect(() => {
  //   if (!isAnswering) {
  //     startListen();
  //   }
  // }, [isAnswering, startListen]);

  return (
    <div className="min-h-screen flex flex-col justify-between p-8 ">
      <div className="max-w-[1000px] space-y-4">
        {messages.map((message, index) => (
          <Message key={index} message={message} />
        ))}

        {isAnswering && answer && <Message message={{ text: answer, isUser: false }} />}
      </div>

      <div className="flex justify-center bg-slate-00 w-full">
        <button className="bg-blue-700 text-white font-bold text-xl px-16 py-4">{isRecording ? "Stop" : "Talk"}</button>
      </div>

      <audio controls ref={audioRef}></audio>
    </div>
  );
};

export default Conversation;
