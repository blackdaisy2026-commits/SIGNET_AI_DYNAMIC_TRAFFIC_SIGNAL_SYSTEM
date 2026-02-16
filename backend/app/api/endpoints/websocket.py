from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from typing import List
import json
import asyncio
import random
from datetime import datetime

router = APIRouter()

class ConnectionManager:
    def __init__(self):
        self.active_connections: List[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)

    def disconnect(self, websocket: WebSocket):
        self.active_connections.remove(websocket)

    async def broadcast(self, message: dict):
        for connection in self.active_connections:
            try:
                await connection.send_json(message)
            except:
                self.disconnect(connection)

manager = ConnectionManager()

async def generate_mock_data():
    """
    Background task to generate mock data for all types.
    """
    while True:
        timestamp = datetime.now().isoformat()
        
        # 1. Detection Update (High frequency: 30fps roughly for visual smoothness, but let's do 10fps for mock)
        detection_data = {
            "type": "detection",
            "data": {
                "id": f"det_{random.randint(1000, 9999)}",
                "type": random.choice(["car", "truck", "motorcycle", "bus"]),
                "confidence": round(random.uniform(0.8, 0.99), 2),
                "timestamp": timestamp,
                "cameraId": "cam_001",
                "bbox": {
                    "x": random.randint(0, 500),
                    "y": random.randint(0, 300),
                    "width": random.randint(100, 200),
                    "height": random.randint(80, 150)
                },
                "location": {
                    "intersection": "Intersection A1",
                    "latitude": 40.7128,
                    "longitude": -74.0060
                }
            },
            "timestamp": timestamp
        }
        await manager.broadcast(detection_data)

        # 2. Stats Update (Low frequency: every 5 seconds)
        if random.random() < 0.05: # approx every 20 frames
            stats_data = {
                "type": "stats_update",
                "data": {
                     "totalVehicles": random.randint(1000, 2000),
                     "activeIncidents": random.randint(0, 5),
                     "systemUptime": 99.9,
                     "avgSignalEfficiency": round(random.uniform(80, 100), 1)
                },
                "timestamp": timestamp
            }
            await manager.broadcast(stats_data)

        await asyncio.sleep(0.1) # 10 FPS

@router.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await manager.connect(websocket)
    try:
        # Start sending mock data for this connection (or globally if using a background task)
        # For simplicity in this mock, we just loop here. In production, use a broadcast system.
        while True:
            # We are using a shared generate_mock_data pattern implicitly if we had a background task,
            # but for a single connection loop, let's just generate data here.
            # To avoid dual loop issues, let's just send data in this loop.
            
            timestamp = datetime.now().isoformat()
            
            payload = {
                "type": "detection",
                "data": {
                    "id": f"det_{random.randint(1000, 9999)}",
                    "type": random.choice(["car", "truck", "motorcycle"]),
                    "confidence": round(random.uniform(0.85, 0.99), 2),
                     "bbox": {
                        "x": random.randint(100, 600),
                        "y": random.randint(100, 400),
                        "width": random.randint(100, 200),
                        "height": random.randint(80, 150)
                    }
                },
                "timestamp": timestamp
            }
            await websocket.send_json(payload)
            await asyncio.sleep(0.1) # 10 updates per second
            
    except WebSocketDisconnect:
        manager.disconnect(websocket)
    except Exception as e:
        print(f"WS Error: {e}")
        manager.disconnect(websocket)
