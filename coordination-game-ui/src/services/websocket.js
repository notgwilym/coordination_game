export function connectToRoom(roomCode, participantName, onMessage) {
  const socket = new WebSocket(`ws://127.0.0.1:8000/ws/${roomCode}/${participantName}`);

  socket.onopen = () => {
    console.log(`Connected to room ${roomCode}`);
  };

  socket.onmessage = (event) => {
    const message = event.data;
    console.log("Message from server:", message);
    if (onMessage) onMessage(message); // Trigger callback if provided
  };

  socket.onclose = (event) => {
    console.log("WebSocket connection closed:", event.code, event.reason);
  };

  socket.onerror = (error) => {
    console.error("WebSocket error:", error);
  };

  return socket;
}