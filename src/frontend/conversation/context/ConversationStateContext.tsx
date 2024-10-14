import React, { createContext, useContext, useState, ReactNode } from "react";
import { ConversationState } from "../types";

interface ConversationStateContextType {
  state: ConversationState;
  setState: React.Dispatch<React.SetStateAction<ConversationState>>;
}

const ConversationContext = createContext<ConversationStateContextType | undefined>(undefined);

const ConversationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, setState] = useState<ConversationState>(ConversationState.INITIALIZE);

  return <ConversationContext.Provider value={{ state, setState }}>{children}</ConversationContext.Provider>;
};

const useConversationContext = (): ConversationStateContextType => {
  const context = useContext(ConversationContext);
  if (context === undefined) {
    throw new Error("useConversationContext must be used within a ConversationProvider");
  }
  return context;
};

export { ConversationProvider, useConversationContext };
