import IUser from "@/types/global/user";
import React, { createContext, ReactNode, useContext, useState } from "react";

// Define the shape of the context state
interface GlobalState {
  loading: boolean;
  setLoading: (loading: boolean) => void;
  user: IUser | null;
  setUser: (user: IUser | null) => void;
  disclaimerAccepted: boolean;
  setDisclaimerAccepted: (disclaimerAccepted: boolean) => void;
}

// Create the context with a default value
const GlobalContext = createContext<GlobalState | undefined>(undefined);

// Create the provider component
interface GlobalProviderProps {
  children: ReactNode;
}

export const GlobalProvider: React.FC<GlobalProviderProps> = ({ children }) => {
  const [user, setUser] = useState<IUser | null>(null);
  const [disclaimerAccepted, setDisclaimerAccepted] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  return (
    <GlobalContext.Provider
      value={{
        user,
        setUser,
        disclaimerAccepted,
        setDisclaimerAccepted,
        loading,
        setLoading,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

// Create a custom hook to use the context
export const useGlobalContext = (): GlobalState => {
  const context = useContext(GlobalContext);
  if (context === undefined) {
    throw new Error("useGlobalContext must be used within a GlobalProvider");
  }
  return context;
};
