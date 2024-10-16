"use client";

import LeolineVideo from "@/frontend/conversation/components/LeolineVideo";
import Loading from "@/frontend/common/components/Loading";
import useConversation from "@/frontend/conversation/hooks/useConversation";
import { ConversationState } from "@/frontend/conversation/types";
import { useEffect, useState } from "react";
import Toggle from "@/frontend/conversation/components/Toggle";
import NoSleep from "nosleep.js";
import BackgroundBlur from "@/frontend/common/components/BackgroundBlur";
import { useRouter } from "next/navigation";

interface Props {
  params: {
    lang: string;
  };
}

const Home = ({ params: { lang } }: Props) => {
  const router = useRouter();

  const [chaptersCount, setChaptersCount] = useState(1);
  const [isScaryActive, setIsScaryActive] = useState(false);

  const { state, activate, deactivate } = useConversation({ language: lang, isScaryActive, chaptersCount });

  const [noSleep, setNoSleep] = useState<NoSleep | undefined>(undefined);

  useEffect(() => {
    setNoSleep(new NoSleep());
  }, []);

  useEffect(() => {
    const options = JSON.parse(localStorage.getItem("options") || "{}");

    setIsScaryActive(options.isScaryActive || false);
    setChaptersCount(options.chaptersCount || 1);
  }, []);

  const handleActivate = () => {
    if (noSleep && !noSleep.isEnabled) noSleep.enable();
    activate();
  };

  const handleDeactivate = () => {
    if (noSleep && !noSleep?.isEnabled) noSleep.enable();
    deactivate();
  };

  if (state === ConversationState.INITIALIZE) {
    return (
      <>
        <BackgroundBlur />
        <Loading />
      </>
    );
  }

  if (state === ConversationState.ERROR) {
    return <div>ERROR</div>;
  }

  return (
    <div className="relative h-screen">
      <div className="absolute right-3 top-3 z-50">
        <Toggle
          size="sm"
          states={[{ value: "1", image: "/img/icons/account.svg" }]}
          initialState="1"
          onStateChange={() => {
            router.push("/account");
          }}
        />
      </div>

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
        active={state === ConversationState.THINK}
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
