let socket;

export function getWebSocket(roomCode, participantName) {
  // If the socket doesn't exist or is closed, create a new one
  if (!socket || socket.readyState === WebSocket.CLOSED) {

    console.log(`Attempting WebSocket connection: roomCode=${roomCode}, participantName=${participantName}`);
    
    socket = new WebSocket(`ws://127.0.0.1:8000/ws/${roomCode}/${participantName}`);

    // WebSocket event handlers
    socket.onopen = () => {
      console.log(`WebSocket connected to room ${roomCode} as ${participantName}`);
    };

    socket.onclose = (event) => {
      console.log("WebSocket closed:", event.code, event.reason);
      // Optional: Reconnect logic can go here if desired
    };

    socket.onerror = (err) => {
      console.error("WebSocket error:", err);
    };

    socket.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);
        console.log("Message from server:", message);
        // Handle messages (e.g., player updates, game start) here
      } catch (e) {
        console.error("Error parsing WebSocket message:", e);
      }
    };
  }

  return socket;
}