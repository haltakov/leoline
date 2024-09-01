"use client";

import LeolineVideo from "@/frontend/conversation/components/LeolineVideo";
import Loading from "@/frontend/conversation/components/Loading";
import useConversation from "@/frontend/conversation/hooks/useConversation";
import { ConversationState } from "@/frontend/conversation/types";
import { useEffect, useState } from "react";
import Toggle from "@/frontend/conversation/components/Toggle";
import NoSleep from "nosleep.js";

interface Props {
  params: {
    lang: string;
  };
}

const Home = ({ params: { lang } }: Props) => {
  const noSleep = new NoSleep();

  const [chaptersCount, setChaptersCount] = useState(1);
  const [isScaryActive, setIsScaryActive] = useState(false);

  const { state, activate, deactivate } = useConversation({ language: lang, isScaryActive, chaptersCount });

  useEffect(() => {
    const options = JSON.parse(localStorage.getItem("options") || "{}");

    setIsScaryActive(options.isScaryActive || false);
    setChaptersCount(options.chaptersCount || 1);
  }, []);

  const handleActivate = () => {
    if (!noSleep.isEnabled) noSleep.enable();
    activate();
  };

  const handleDeactivate = () => {
    if (!noSleep.isEnabled) noSleep.enable();
    deactivate();
  };

  if (state === ConversationState.INITIALIZE) {
    return <Loading />;
  }

  if (state === ConversationState.ERROR) {
    return <div>ERROR</div>;
  }

  return (
    <div className="min-h-screen overflow-hidden">
      <div className="z-10 bg-[url('/img/leoline_background.jpg')] bg-cover top-[-103px] md:top-[-156px] xl:top-[-208px] w-[1000px] h-[1000px] md:w-[1500px] md:h-[1500px] xl:w-[2000px] xl:h-[2000px] absolute left-1/2 transform -translate-x-1/2 overflow-hidden"></div>

      <LeolineVideo
        active={state === ConversationState.WAIT}
        src="/video/leoline_waiting_1.mp4"
        onClick={handleActivate}
      />
      <LeolineVideo
        active={state === ConversationState.LISTEN}
        src="/img/leoline_listening.jpg"
        onClick={handleDeactivate}
      />
      <LeolineVideo
        active={state === ConversationState.TRANSCRIBE}
        src="/video/leoline_thinking_1.mp4"
        onClick={handleDeactivate}
      />
      <LeolineVideo
        active={state === ConversationState.SPEAK}
        src="/video/leoline_story_2.mp4"
        onClick={handleDeactivate}
      />

      <div className="absolute bottom-12 flex justify-center w-full gap-6">
        <Toggle
          states={[
            { value: "no-ghost", image: "/img/icons/no_ghost.png" },
            { value: "ghost", image: "/img/icons/ghost.png" },
          ]}
          initialState={isScaryActive ? "ghost" : "no-ghost"}
          onStateChange={(value) => {
            setIsScaryActive(value === "ghost");
            localStorage.setItem("options", JSON.stringify({ isScaryActive: value === "ghost", chaptersCount }));
          }}
        />

        <Toggle
          states={[
            { value: "1", image: "/img/icons/books_1.png" },
            { value: "2", image: "/img/icons/books_2.png" },
            { value: "3", image: "/img/icons/books_3.png" },
            { value: "4", image: "/img/icons/books_4.png" },
            { value: "5", image: "/img/icons/books_5.png" },
          ]}
          initialState={chaptersCount.toString()}
          onStateChange={(value) => {
            setChaptersCount(Number(value));
            localStorage.setItem("options", JSON.stringify({ isScaryActive, chaptersCount: Number(value) }));
          }}
        />
      </div>
    </div>
  );
};

export default Home;
