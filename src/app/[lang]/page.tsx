"use client";

import LeolineVideo from "@/frontend/conversation/components/LeolineVideo";
import Loading from "@/frontend/conversation/components/Loading";
import useConversation from "@/frontend/conversation/hooks/useConversation";
import { ConversationState } from "@/frontend/conversation/types";
import { useState } from "react";

interface Props {
  params: {
    lang: string;
  };
}

const Home = ({ params: { lang } }: Props) => {
  const [isMicActive, setIsMicActive] = useState(true);
  const [isLongActive, setIsLongActive] = useState(false);
  const [isScaryActive, setIsScaryActive] = useState(false);

  const { state, activate, deactivate } = useConversation({ language: lang, isLongActive, isScaryActive });

  if (state === ConversationState.INITIALIZE) {
    return <Loading />;
  }

  if (state === ConversationState.ERROR) {
    return <div>ERROR</div>;
  }

  return (
    <div className="min-h-screen overflow-hidden">
      <LeolineVideo active={state === ConversationState.WAIT} src="/video/leoline_waiting_1.mp4" onClick={activate} />
      <LeolineVideo active={state === ConversationState.LISTEN} src="/img/leoline_listening.jpg" onClick={deactivate} />
      <LeolineVideo
        active={state === ConversationState.TRANSCRIBE}
        src="/video/leoline_thinking_1.mp4"
        onClick={deactivate}
      />
      <LeolineVideo active={state === ConversationState.SPEAK} src="/video/leoline_story_2.mp4" onClick={deactivate} />

      <div className="z-10 bg-[url('/img/leoline_background.jpg')] bg-cover top-[-103px] md:top-[-156px] xl:top-[-208px] w-[1000px] h-[1000px] md:w-[1500px] md:h-[1500px] xl:w-[2000px] xl:h-[2000px] absolute left-1/2 transform -translate-x-1/2 overflow-hidden"></div>
    </div>
  );
};

export default Home;
