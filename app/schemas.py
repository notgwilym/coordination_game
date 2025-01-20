from pydantic import BaseModel

class CreateRoomRequest(BaseModel):
    capabilities: list[str] = []

class JoinRoomRequest(BaseModel):
    participant_name: str