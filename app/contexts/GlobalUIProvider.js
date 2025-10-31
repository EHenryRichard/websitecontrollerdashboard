'use client';
import { createContext, useContext, useState } from 'react';
const GlobalUIContext = createContext();

export function GlobalUIProvider({ children }) {
  const [notificationOpen, setNotificationOpen] =
    useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  return (
    <GlobalUIContext.Provider
      value={{
        notificationOpen,
        setNotificationOpen,
        searchOpen,
        setSearchOpen,
      }}
    >
      {children}
    </GlobalUIContext.Provider>
  );
}

export function useGlobalUI() {
  const context = useContext(GlobalUIContext);
  return context;
}
