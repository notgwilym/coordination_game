from fastapi import WebSocket, WebSocketDisconnect
from app.room_manager import RoomManager

room_manager = RoomManager()  # Ensure this instance is shared across routes

class ConnectionManager:
    def __init__(self):
        self.active_connections: dict[str, list[WebSocket]] = {}

    async def connect(self, room_code: str, websocket: WebSocket):
        """Connect a new WebSocket to a room."""
        if room_code not in self.active_connections:
            self.active_connections[room_code] = []
        self.active_connections[room_code].append(websocket)
        await websocket.accept()

    def disconnect(self, room_code: str, websocket: WebSocket):
        """Disconnect a WebSocket from a room."""
        if room_code in self.active_connections:
            self.active_connections[room_code].remove(websocket)
            if not self.active_connections[room_code]:
                del self.active_connections[room_code]  # Remove empty room

    async def broadcast(self, room_code: str, message: str):
        """Broadcast a message to all WebSockets in a room."""
        if room_code in self.active_connections:
            for connection in self.active_connections[room_code]:
                await connection.send_text(message)

connection_manager = ConnectionManager()

async def handle_websocket(websocket: WebSocket, room_code: str, participant_name: str):
    """Handle WebSocket connections for players."""
    try:
        await connection_manager.connect(room_code, websocket)
        if not room_manager.join_room(room_code, participant_name):
            await websocket.send_text("Error: Room not found or name conflict")
            await websocket.close()
            return

        # Notify other players
        await connection_manager.broadcast(
            room_code, f"Player {participant_name} joined the room"
        )
        print(f"{participant_name} connected to room {room_code}")

        # Keep the connection open
        while True:
            data = await websocket.receive_text()
            print(f"Message received: {data}")

    except WebSocketDisconnect:
        print(f"{participant_name} disconnected from room {room_code}")
        room_manager.leave_room(room_code, participant_name)
        connection_manager.disconnect(room_code, websocket)
        await connection_manager.broadcast(
            room_code, f"Player {participant_name} left the room"
        )
    except Exception as e:
        print(f"Error in WebSocket: {e}")
        await websocket.close()