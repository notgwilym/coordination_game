from pydantic import BaseModel

class JoinRoomRequest(BaseModel):
    participant_name: str