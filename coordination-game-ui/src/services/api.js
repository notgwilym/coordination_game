const API_BASE_URL = "http://127.0.0.1:8000";

export const createRoom = async () => {
  const response = await fetch(`${API_BASE_URL}/rooms`, {
    method: "POST",
  });
  if (!response.ok) {
    throw new Error("Failed to create room");
  }
  return response.json();
};

export const joinRoom = async (roomCode, participantName) => {
  const response = await fetch(`${API_BASE_URL}/rooms/${roomCode}/join`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ participant_name: participantName }),
  });
  if (!response.ok) {
    throw new Error("Failed to join room");
  }
};