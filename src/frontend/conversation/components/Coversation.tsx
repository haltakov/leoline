"use client";

import { ConversationState } from "../types";
import clsx from "clsx";
import useConversation from "../hooks/useConversation";

export interface Props {
  language: string;
}

const Conversation = ({ language }: Props) => {
  const { state } = useConversation({ language });

  return (
    <div className="h-[100vh] flex flex-col justify-center p-8 overflow-hidden">
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
  );
};

export default Conversation;
