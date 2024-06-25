"use client";

import useListen from "@/frontend/listen/hooks/useListen";
import { useEffect, useState } from "react";
import Message from "./Message";
import useTranscribe from "@/frontend/transcribe/hooks/useTranscribe";
import { MessageWithRole } from "../types";
import useAnswer from "@/frontend/answer/hooks/useAnswer";

const Conversation = () => {
  // Messages
  const [messages, setMessages] = useState<MessageWithRole[]>([
    { text: "What is the capital of Germany?", isUser: true },
  ]);

  // Listen
  const { audioBlob, isRecording, toggleRecording } = useListen();

  // Transcribe
  const { transcribedText } = useTranscribe({ audio: audioBlob });

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
    <div className="min-h-screen flex flex-col justify-between p-8 ">
      <div className="max-w-[1000px] space-y-4">
        {messages.map((message, index) => (
          <Message key={index} message={message} />
        ))}

        {isAnswering && answer && <Message message={{ text: answer, isUser: false }} />}
      </div>

      <div className="flex justify-center bg-slate-00 w-full">
        <button className="bg-blue-700 text-white font-bold text-xl px-16 py-4" onClick={toggleRecording}>
          {isRecording ? "Stop" : "Talk"}
        </button>
      </div>
    </div>
  );
};

export default Conversation;
