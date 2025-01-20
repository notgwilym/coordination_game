from fastapi import WebSocket, WebSocketDisconnect
from app.room_manager import RoomManager

room_manager = RoomManager()

async def handle_websocket(websocket: WebSocket, room_code: str, participant_name: str):
    """Handle WebSocket connections for participants."""
    await websocket.accept()

    # Join the participant to the room
    if not room_manager.join_room(room_code, participant_name):
        await websocket.send_text("Error: Room not found or name conflict")
        await websocket.close()
        return

    try:
        while True:
            data = await websocket.receive_text()
            # Broadcast the message to other participants in the room
            for participant in room_manager.get_participants(room_code):
                # (Implement actual message sending here)
                pass

    except WebSocketDisconnect:
        # Handle participant disconnect
        room_manager.leave_room(room_code, participant_name)