import React, { useState } from "react";
import { useParams } from "react-router-dom";

function HostPage() {
  const { roomCode } = useParams(); // Extract room code from the URL
  const [gameStarted, setGameStarted] = useState(false);

  const handleStartGame = () => {
    setGameStarted(true);
    // Replace with WebSocket or API call to notify participants
    console.log(`Game started in room ${roomCode}`);
  };

  return (
    <div>
      <h1>Host Screen</h1>
      <p>Room Code: {roomCode}</p>
      <button onClick={handleStartGame} disabled={gameStarted}>
        {gameStarted ? "Game Started" : "Start Game"}
      </button>
    </div>
  );
}

export default HostPage;