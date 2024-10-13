"use client";

import { UserProvider } from "@/frontend/user/context/UserContext";
import { Suspense } from "react";

export default function UserContextLayout({ children }: { children: React.ReactNode }) {
  return (
    <Suspense>
      <UserProvider>{children}</UserProvider>
    </Suspense>
  );
}
