class RoomManager:
    def __init__(self):
        # In-memory store for rooms. Replace with a database for production.
        self.rooms: dict[str, dict] = {}

    def create_room(self) -> str:
        """Create a room and return its room_code."""
        room_code = self._generate_room_code()
        self.rooms[room_code] = {
            "participants": {},  # Dictionary of participant_name -> metadata
        }
        # log the current rooms in the server
        print(self.rooms)
        return room_code

    def join_room(self, room_code: str, participant_name: str) -> bool:
        """Add a participant to a room. Return success or failure."""
        if room_code not in self.rooms:
            return False
        if participant_name in self.rooms[room_code]["participants"]:
            return False  # Participant name conflict
        self.rooms[room_code]["participants"][participant_name] = {}
        return True

    def leave_room(self, room_code: str, participant_name: str):
        """Remove a participant from a room and delete the room if empty."""
        if room_code in self.rooms:
            self.rooms[room_code]["participants"].pop(participant_name, None)
            if not self.rooms[room_code]["participants"]:  # Room is empty
                del self.rooms[room_code]

    def get_participants(self, room_code: str) -> list[str]:
        """Return a list of participant names in a room."""
        return list(self.rooms.get(room_code, {}).get("participants", {}).keys())

    def _generate_room_code(self) -> str:
        """Generate a unique 6-character room code."""
        code = self._random_code()
        while code in self.rooms:
            code = self._random_code()
        return code
    
    def _random_code(self) -> str:
        """Generate a random 4-character code."""
        import random
        import string
        return "".join(random.choices(string.ascii_uppercase, k=4))
    
        