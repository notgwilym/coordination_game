export const connectToRoom = (roomCode, onMessage) => {
    const socket = new WebSocket(`ws://127.0.0.1:8000/ws/${roomCode}`);
  
    socket.onopen = () => {
      console.log(`Connected to room: ${roomCode}`);
    };
  
    socket.onmessage = (event) => {
      const message = JSON.parse(event.data);
      onMessage(message); // Pass message to handler
    };
  
    socket.onclose = () => {
      console.log("Disconnected from room");
    };
  
    return socket;
  };