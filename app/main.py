from fastapi import FastAPI, WebSocket, WebSocketDisconnect

app = FastAPI()

@app.get("/")
def read_root():
    return {"message": "Hello from the FastAPI Broker!"}

@app.websocket("/ws/{room_code}")
async def websocket_endpoint(websocket: WebSocket, room_code: str):
    await websocket.accept()
    try:
        while True:
            data = await websocket.receive_text()
            # Here we simply echo the data back
            await websocket.send_text(f"Room {room_code} received: {data}")
    except WebSocketDisconnect:
        print(f"Room {room_code}: Client disconnected")