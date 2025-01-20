import React, { useState } from "react";

function App() {
  const [roomCode, setRoomCode] = useState(""); // Store the entered room code
  const [participantName, setParticipantName] = useState(""); // Store the participant name
  const [message, setMessage] = useState(""); // Message to display feedback
  const [createdRoomCode, setCreatedRoomCode] = useState(""); // Room code after creating a game

  const handleJoinRoom = async () => {
    if (!roomCode.trim() || !participantName.trim()) {
      setMessage("Please enter both a room code and a participant name.");
      return;
    }

    try {
      const response = await fetch(`http://127.0.0.1:8000/rooms/${roomCode}/join`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ participant_name: participantName }),
      });

      if (response.ok) {
        const data = await response.json();
        setMessage(`Success! ${data.message}`);
      } else {
        const error = await response.json();
        setMessage(`Error: ${error.detail}`);
      }
    } catch (error) {
      setMessage("An error occurred while trying to join the room.");
      console.error("Error joining room:", error);
    }
  };

  const handleCreateGame = async () => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/rooms`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ capabilities: [] }), // Add any capabilities if needed
      });

      if (response.ok) {
        const data = await response.json();
        setCreatedRoomCode(data.room_code);
        setMessage(`Game created! Room Code: ${data.room_code}`);
      } else {
        const error = await response.json();
        setMessage(`Error: ${error.detail}`);
      }
    } catch (error) {
      setMessage("An error occurred while trying to create a game.");
      console.error("Error creating game:", error);
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

      {/* Feedback Messages */}
      {message && (
        <p style={{ marginTop: "20px", color: message.startsWith("Error") ? "red" : "green" }}>
          {message}
        </p>
      )}

      {/* Display Created Room Code */}
      {createdRoomCode && (
        <div>
          <p style={{ marginTop: "10px", fontWeight: "bold" }}>Room Code for Game: {createdRoomCode}</p>
        </div>
      )}
    </div>
  );
}

export default App;