"use client";

import { UserProvider } from "@/frontend/user/context/UserContext";

export default function UserContextLayout({ children }: { children: React.ReactNode }) {
  return <UserProvider>{children}</UserProvider>;
}
