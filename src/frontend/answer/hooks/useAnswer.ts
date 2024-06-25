import { useEffect, useState } from "react";
import { AnswerParams } from "../types";
import { MessageWithRole } from "@/frontend/conversation/types";

export interface Props {
  messages: MessageWithRole[];
}

const useAnswer = ({ messages }: Props) => {
  const [answer, setAnswer] = useState<string>("");
  const [isAnswering, setIsAnswering] = useState<boolean>(false);

  useEffect(() => {
    (async () => {
      if (!messages.length || !messages[messages.length - 1].isUser) return;

      setIsAnswering(true);
      setAnswer("");

      const response = await fetch("/api/answer", {
        method: "POST",
        body: JSON.stringify({ messages }),
      });

      if (!response.ok || !response.body) {
        console.log(response);
        console.error("Failed to get answer");
        return;
      }

      const decoder = new TextDecoder();
      const stream = response.body.getReader();
      while (true) {
        const { done, value } = await stream.read();
        if (done) break;

        const tokenValue = decoder.decode(value);

        setAnswer((prev) => prev + tokenValue);
      }

      setIsAnswering(false);
    })();
  }, [messages]);

  return { answer, isAnswering };
};

export default useAnswer;
