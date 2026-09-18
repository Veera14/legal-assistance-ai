"use client";

import React, { createContext, useContext, useState, useCallback } from "react";

interface AnnouncerContextType {
  announce: (message: string, politeness?: "polite" | "assertive") => void;
}

const AnnouncerContext = createContext<AnnouncerContextType>({
  announce: () => {},
});

export const useAnnounce = () => useContext(AnnouncerContext);

export const AriaLiveAnnouncerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [politeMessage, setPoliteMessage] = useState("");
  const [assertiveMessage, setAssertiveMessage] = useState("");

  const announce = useCallback((message: string, politeness: "polite" | "assertive" = "polite") => {
    if (politeness === "assertive") {
      setAssertiveMessage("");
      setTimeout(() => setAssertiveMessage(message), 50);
    } else {
      setPoliteMessage("");
      setTimeout(() => setPoliteMessage(message), 50);
    }
  }, []);

  return (
    <AnnouncerContext.Provider value={{ announce }}>
      {children}
      {/* Off-screen live regions for screen readers */}
      <div
        aria-live="polite"
        aria-atomic="true"
        className="sr-only fixed -top-9999 -left-9999 w-1 h-1 overflow-hidden"
      >
        {politeMessage}
      </div>
      <div
        aria-live="assertive"
        aria-atomic="true"
        className="sr-only fixed -top-9999 -left-9999 w-1 h-1 overflow-hidden"
      >
        {assertiveMessage}
      </div>
    </AnnouncerContext.Provider>
  );
};
