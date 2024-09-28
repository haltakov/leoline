import React, { createContext, useContext, ReactNode } from "react";
import useUser from "../hooks/useUser";

interface UserContextType {
  xuid: string | null;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { xuid } = useUser();

  return <UserContext.Provider value={{ xuid }}>{children}</UserContext.Provider>;
};

export const useUserContext = (): UserContextType => {
  const context = useContext(UserContext);

  if (context === undefined) {
    throw new Error("useUserContext must be used within a UserProvider");
  }

  return context;
};
