from fastapi import APIRouter, WebSocket
from typing import List, Optional
from pydantic import BaseModel
import asyncio
import json

router = APIRouter()

# --- Models ---
class Detection(BaseModel):
    id: str
    type: str # 'car', 'truck', 'bike', etc.
    confidence: float
    bbox: dict # {x, y, width, height}

class DetectionLive(BaseModel):
    detections: List[Detection]
    timestamp: str

# --- Endpoints ---

@router.websocket("/live")
async def websocket_live(websocket: WebSocket):
    await websocket.accept()
    try:
        while True:
            # Simulate receiving detections and sending them to the client
            mock_data = {
                "detections": [
                    {
                        "id": "det_001",
                        "type": "car",
                        "confidence": 0.98,
                        "bbox": {"x": 120, "y": 80, "width": 150, "height": 100}
                    }
                ],
                "timestamp": "2024-01-15T14:32:00Z" # You should generate real timestamp
            }
            await websocket.send_json(mock_data)
            await asyncio.sleep(0.033) # Simulate 30fps
    except Exception as e:
        print(f"WebSocket closed: {e}")
    finally:
        await websocket.close()

@router.get("/stats")
def get_detection_stats():
    """
    Get statistics about vehicle detections.
    """
    return {
        "totalDetections": 1247,
        "averageConfidence": 93.5,
        "detectionsByType": {
            "car": 847,
            "truck": 224,
            "motorcycle": 176
        },
        "processingSpeed": 30
    }

@router.post("/config")
def update_detection_config(config: dict):
    """
    Update detection configuration settings.
    """
    # This would update settings in a real implementation
    return {"message": "Config updated successfully"}
