"use client";

import useListen from "@/frontend/listen/hooks/useListen";
import { useEffect, useState } from "react";
import Message from "./Message";
import useTranscribe from "@/frontend/transcribe/hooks/useTranscribe";

const Conversation = () => {
  // Messages
  const [messages, setMessages] = useState<string[]>(["Hey, I'm Leoline. What is your name?"]);
  const [currentMessage, setCurrentMessage] = useState<string>("");

  // Listen
  const { audioBlob, isRecording, toggleRecording } = useListen();

  // Transcribe
  const { transcribedText } = useTranscribe({ audio: audioBlob });

  useEffect(() => {
    if (!transcribedText) return;

    setMessages((messages) => [...messages, transcribedText]);
  }, [transcribedText]);

  return (
    <div className="min-h-screen flex flex-col justify-between p-8 ">
      <div className="max-w-[1000px] space-y-4">
        {messages.map((message, index) => (
          <Message key={index} text={message} />
        ))}

        {currentMessage && <Message text={currentMessage} />}
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
