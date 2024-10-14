"use client";

import { ConversationProvider } from "@/frontend/conversation/context/ConversationStateContext";
import { UserProvider } from "@/frontend/user/context/UserContext";
import { Suspense } from "react";

export default function UserContextLayout({ children }: { children: React.ReactNode }) {
  return (
    <Suspense>
      <ConversationProvider>
        <UserProvider>{children}</UserProvider>
      </ConversationProvider>
    </Suspense>
  );
}
