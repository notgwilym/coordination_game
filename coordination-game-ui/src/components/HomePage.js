import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function HomePage() {
  const [roomCode, setRoomCode] = useState("");
  const [participantName, setParticipantName] = useState("");
  const navigate = useNavigate();

  const handleJoinRoom = async () => {
    if (!roomCode.trim() || !participantName.trim()) {
      alert("Please enter both a room code and your name.");
      return;
    }

    try {
      const response = await fetch(`http://127.0.0.1:8000/rooms/${roomCode}/join`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ participant_name: participantName }),
      });

      if (response.ok) {
        navigate(`/waiting/${roomCode}`);
      } else {
        const error = await response.json();
        alert(`Error: ${error.detail}`);
      }
    } catch (error) {
      console.error("Error joining room:", error);
      alert("An error occurred. Please try again.");
    }
  };

  const handleCreateGame = async () => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/rooms`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ capabilities: [] }),
      });

      if (response.ok) {
        const data = await response.json();
        navigate(`/host/${data.room_code}`);
      } else {
        const error = await response.json();
        alert(`Error: ${error.detail}`);
      }
    } catch (error) {
      console.error("Error creating game:", error);
      alert("An error occurred. Please try again.");
    }
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h1>Coordination Game</h1>

      {/* Join Room Section */}
      <div>
        <h3>Join a Room</h3>
        <input
          type="text"
          placeholder="Enter Room Code"
          value={roomCode}
          onChange={(e) => setRoomCode(e.target.value)}
          style={{ marginRight: "10px", padding: "5px" }}
        />
        <input
          type="text"
          placeholder="Enter Your Name"
          value={participantName}
          onChange={(e) => setParticipantName(e.target.value)}
          style={{ marginRight: "10px", padding: "5px" }}
        />
        <button onClick={handleJoinRoom} style={{ padding: "10px 20px", cursor: "pointer" }}>
          Join Room
        </button>
      </div>

      {/* Create Game Section */}
      <div style={{ marginTop: "20px" }}>
        <h3>Or Create a Game</h3>
        <button onClick={handleCreateGame} style={{ padding: "10px 20px", cursor: "pointer" }}>
          Create Game
        </button>
      </div>
    </div>
  );
}

export default HomePage;