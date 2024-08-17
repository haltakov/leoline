"use client";

import { ConversationState } from "../types";
import clsx from "clsx";
import useConversation from "../hooks/useConversation";
import Toggle from "./Toggle";
import { useState } from "react";

export interface Props {
  language: string;
}

const Conversation = ({ language }: Props) => {
  const [isMicActive, setIsMicActive] = useState(true);
  const [isLongActive, setIsLongActive] = useState(false);
  const [isScaryActive, setIsScaryActive] = useState(false);

  const { state } = useConversation({ language, isMicActive, isLongActive, isScaryActive });

  return (
    <>
      <div className="h-[100vh] flex flex-col justify-center p-8">
        <div
          className={clsx(
            "bg-gradient-to-b rounded-full size-24 shadow-2xl blur-sm transition-all ease-in-out",
            state === ConversationState.LISTEN ? "from-gray-400 to-gray-500" : "",
            state === ConversationState.RECORD ? "from-red-400 to-red-500 scale-125" : "",
            state === ConversationState.TRANSCRIBE || state === ConversationState.SPEAK
              ? "from-blue-400 to-blue-600 scale-150 animate-pulse"
              : ""
          )}
        ></div>
      </div>

      <div className="absolute bottom-10 flex flex-row w-full justify-around px-8">
        <Toggle active={isMicActive} onClick={() => setIsMicActive(!isMicActive)}>
          👂
        </Toggle>
        <Toggle active={isLongActive} onClick={() => setIsLongActive(!isLongActive)}>
          📚
        </Toggle>
        <Toggle active={isScaryActive} onClick={() => setIsScaryActive(!isScaryActive)}>
          😈
        </Toggle>
      </div>
    </>
  );
};

export default Conversation;
