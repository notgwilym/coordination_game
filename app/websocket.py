from fastapi import WebSocket, WebSocketDisconnect
from app.room_manager import RoomManager
import json

class ConnectionManager:
    def __init__(self):
        self.active_connections: dict[str, dict[str, WebSocket]] = {}  # Room -> {Participant Name -> WebSocket}

    async def connect(self, room_code: str, participant_name: str, websocket: WebSocket):
        """Connect a new WebSocket for a participant in a room."""
        if room_code not in self.active_connections:
            self.active_connections[room_code] = {}
        self.active_connections[room_code][participant_name] = websocket
        await websocket.accept()

    def disconnect(self, room_code: str, participant_name: str):
        """Disconnect a participant's WebSocket."""
        if room_code in self.active_connections:
            self.active_connections[room_code].pop(participant_name, None)
            if not self.active_connections[room_code]:
                del self.active_connections[room_code]  # Remove empty room

    async def send_to_participant(self, room_code: str, participant_name: str, message: str):
        """Send a message to a specific participant."""
        if room_code in self.active_connections:
            websocket = self.active_connections[room_code].get(participant_name)
            if websocket:
                await websocket.send_text(message)

    async def broadcast(self, room_code: str, message: str, exclude: str = None):
        """Broadcast a message to all participants in a room, excluding one optionally."""
        if room_code in self.active_connections:
            for participant_name, websocket in self.active_connections[room_code].items():
                if participant_name != exclude:
                    await websocket.send_text(message)


connection_manager = ConnectionManager()


async def handle_websocket(room_manager: RoomManager, websocket: WebSocket, room_code: str, participant_name: str):
    """Handle WebSocket connections for players."""
    try:
        print(f"WebSocket connection attempt: room_code={room_code}, participant_name={participant_name}")

        print(room_manager.rooms)

        if room_code not in room_manager.rooms.keys():
            print(f"Room {room_code} does not exist")
            await websocket.close(code=403, reason="Room not found")
            return

        # Accept WebSocket connection
        await connection_manager.connect(room_code, participant_name, websocket)
        print(f"WebSocket connection established: room_code={room_code}, participant_name={participant_name}")

        # Broadcast player update
        players = room_manager.get_participants(room_code)
        await connection_manager.broadcast(
            room_code,
            json.dumps({"type": "player_update", "data": {"players": players}})
        )

        # Listen for incoming messages
        while True:
            message = await websocket.receive_text()
            print(f"Received message from {participant_name}: {message}")

    except WebSocketDisconnect:
        print(f"WebSocket disconnected: room_code={room_code}, participant_name={participant_name}")
        room_manager.leave_room(room_code, participant_name)
        connection_manager.disconnect(room_code, participant_name)

        # Notify others about disconnection
        players = room_manager.get_participants(room_code)
        await connection_manager.broadcast(
            room_code,
            json.dumps({"type": "player_update", "data": {"players": players}})
        )
    except Exception as e:
        print(f"WebSocket error: {e}")
        await websocket.close()