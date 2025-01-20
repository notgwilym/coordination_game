import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { connectToRoom } from "../services/websocket";

function WaitingPage() {
  const { roomCode } = useParams(); // Extract room code from the URL
  const [players, setPlayers] = useState([]);

  useEffect(() => {
    const socket = connectToRoom(roomCode, "Player1", (message) => {
      console.log(message);
      if (message.startsWith("Player ")) {
        // Update player list when a new player joins
        const playerName = message.split(" ")[1];
        setPlayers((prevPlayers) => [...prevPlayers, playerName]);
      }
    });

    return () => {
      socket.close(); // Clean up WebSocket on component unmount
    };
  }, [roomCode]);

  return (
    <div>
      <h1>Waiting for Host to Start</h1>
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