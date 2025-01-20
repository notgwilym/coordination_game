from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from app.room_manager import RoomManager
from app.schemas import CreateRoomRequest, JoinRoomRequest

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Allow requests from the React frontend
    allow_credentials=True,  # Allow cookies (if needed for auth)
    allow_methods=["*"],  # Allow all HTTP methods (GET, POST, etc.)
    allow_headers=["*"],  # Allow all headers (e.g., Content-Type, Authorization)
)

room_manager = RoomManager()

@app.post("/rooms")
def create_room(request: CreateRoomRequest):
    """Create a new room with optional capabilities."""
    room_code = room_manager.create_room(request.capabilities)
    return {"room_code": room_code}

@app.post("/rooms/{room_code}/join")
def join_room(room_code: str, request: JoinRoomRequest):
    """Join a participant to an existing room."""
    success = room_manager.join_room(room_code, request.participant_name)
    if not success:
        raise HTTPException(status_code=400, detail="Room not found or name conflict")
    return {"message": f"Joined room {room_code} as {request.participant_name}"}