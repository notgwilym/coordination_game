// websocket.js

let socket;

export function getWebSocket(roomCode, participantName) {
  if (!socket || socket.readyState === WebSocket.CLOSED) {
    socket = new WebSocket(`ws://127.0.0.1:8000/ws/${roomCode}/${participantName}`);
    // Set up event handlers, etc.
    socket.onopen = () => {
      console.log("WebSocket connected");
    };
    socket.onclose = () => {
      console.log("WebSocket closed");
    };
    socket.onerror = (err) => {
      console.error("WebSocket error:", err);
    };
    socket.onmessage = (event) => {
      console.log("Message from server:", event.data);
    };
  }
  return socket;
}