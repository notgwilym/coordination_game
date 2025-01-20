import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { usePlayerContext } from "./PlayerContext";

function WaitingPage() {
  const { roomCode } = useParams(); // Extract room code from the URL
  const { playerName } = usePlayerContext();

  const [players, setPlayers] = useState([]);

  const socket = getWebSocket(roomCode, playerName);

  return (
    <div>
      <h1>Welcome {playerName}, waiting for Host to Start</h1>
      <p>Room Code: {roomCode}</p>
      <h3>Players in the Room:</h3>
      <ul>
        {players.map((player, index) => (
          <li key={index}>{player}</li>
        ))}
      </ul>
    </div>
  );
}

export default WaitingPage;