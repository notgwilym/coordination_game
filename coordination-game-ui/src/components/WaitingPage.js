import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { usePlayerContext } from "./PlayerContext";
import { getWebSocket } from "../services/player_socket";

function WaitingPage() {
  const { roomCode } = useParams(); // Extract room code from the URL
  const { playerName } = usePlayerContext();

  const [players, setPlayers] = useState([]);

  useEffect(() => {
    // Set up the WebSocket connection
    const socket = getWebSocket(roomCode, playerName);

    // Handle incoming WebSocket messages
    socket.onmessage = (event) => {
      const message = JSON.parse(event.data);

      if (message.type === "player_update") {
        setPlayers(message.data.players); // Update player list
      } else if (message.type === "error") {
        console.error("Error from server:", message.data);
      } else {
        console.warn("Unknown message type:", message.type);
      }
    };

    // Clean up the WebSocket connection on component unmount
    return () => {
      socket.close();
    };
  }, [roomCode, playerName]);

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