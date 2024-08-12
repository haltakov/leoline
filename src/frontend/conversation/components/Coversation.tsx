"use client";

import { useEffect, useRef, useState } from "react";
import Message from "./Message";
import useTranscribe from "@/frontend/transcribe/hooks/useTranscribe";
import { MessageWithRole } from "../types";
import useAnswer from "@/frontend/answer/hooks/useAnswer";
import useListenVad from "@/frontend/listen/hooks/useListenVad";
import clsx from "clsx";

export interface Props {
  language: string;
}

const Conversation = ({ language }: Props) => {
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
  const { answer, isAnswering } = useAnswer({ messages });

  useEffect(() => {
    if (!isAnswering && answer) {
      setMessages((messages) => [...messages, { text: answer, isUser: false }]);
    }
  }, [answer, isAnswering]);

  useEffect(() => {
    if (!transcribedText) return;

    setMessages((messages) => [...messages, { text: transcribedText, isUser: true }]);
  }, [transcribedText]);

  return (
    <div className="min-h-screen flex flex-col justify-center p-8 ">
      {/* <div className="max-w-[1000px] space-y-4">
        {messages.map((message, index) => (
          <Message key={index} message={message} />
        ))}

        {isAnswering && answer && <Message message={{ text: answer, isUser: false }} />}
      </div> */}

      {/* <div className="flex justify-center bg-slate-00 w-full">
        <button className="bg-blue-700 text-white font-bold text-xl px-16 py-4">{isRecording ? "Stop" : "Talk"}</button>
      </div> */}

      <div
        className={clsx(
          "bg-gradient-to-b from-gray-400 to-gray-500 rounded-full size-24 shadow-2xl blur-sm transition-all ease-in-out",
          isRecording ? "from-red-400 to-red-500 scale-125" : "",
          isAnswering ? "from-blue-400 to-blue-600 scale-150 animate-pulse" : ""
        )}
      ></div>
    </div>
  );
};

export default Conversation;
