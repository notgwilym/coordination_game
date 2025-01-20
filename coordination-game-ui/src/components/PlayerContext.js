import React, { createContext, useContext, useState } from "react";

// Create the context
const PlayerContext = createContext();

// Create the provider
export function PlayerProvider({ children }) {
  const [playerName, setPlayerName] = useState("");

  return (
    <PlayerContext.Provider value={{ playerName, setPlayerName }}>
      {children}
    </PlayerContext.Provider>
  );
}

// Custom hook to access player context
export function usePlayerContext() {
  return useContext(PlayerContext);
}