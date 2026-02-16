from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from typing import List, Optional
from pydantic import BaseModel
import shutil
import os
import uuid
from datetime import datetime

router = APIRouter()

# --- Configuration ---
UPLOAD_DIR = "uploads/sos-recordings"
os.makedirs(UPLOAD_DIR, exist_ok=True)

# --- Models ---
class SOSRecording(BaseModel):
    id: str
    userId: str
    timestamp: datetime
    duration: int
    location: dict
    url: str

class SOSRecordingCreate(BaseModel):
    userId: str
    duration: int
    timestamp: datetime
    location: dict

# --- Mock Database ---
mock_sos_recordings = []

# --- Endpoints ---

@router.post("/", response_model=SOSRecording)
async def create_sos_recording(
    video: UploadFile = File(...),
    userId: str = Form(...),
    duration: int = Form(...),
    timestamp: str = Form(...),
    location: str = Form(...) # JSON string
):
    """
    Create a new SOS recording.
    """
    recording_id = str(uuid.uuid4())
    file_extension = os.path.splitext(video.filename)[1] or ".webm"
    file_name = f"{recording_id}{file_extension}"
    file_path = os.path.join(UPLOAD_DIR, file_name)

    try:
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(video.file, buffer)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to save video: {str(e)}")

    import json
    try:
        location_data = json.loads(location)
    except:
        location_data = {"latitude": 0, "longitude": 0}

    new_recording = SOSRecording(
        id=recording_id,
        userId=userId,
        timestamp=timestamp,
        duration=duration,
        location=location_data,
        url=f"/static/sos-recordings/{file_name}"
    )
    
    mock_sos_recordings.append(new_recording)
    return new_recording

@router.get("/", response_model=dict)
def get_sos_recordings(userId: Optional[str] = None):
    """
    Get all SOS recordings, optionally filtered by userId.
    """
    filtered_recordings = [r for r in mock_sos_recordings if not userId or r.userId == userId]
    return {"recordings": filtered_recordings, "total": len(filtered_recordings)}

@router.delete("/{recording_id}")
def delete_sos_recording(recording_id: str):
    """
    Delete an SOS recording by ID.
    """
    global mock_sos_recordings
    recording = next((r for r in mock_sos_recordings if r.id == recording_id), None)
    
    if not recording:
        raise HTTPException(status_code=404, detail="Recording not found")

    # Remove file (mock implementation won't actually check if file exists perfectly)
    # file_path = os.path.join(UPLOAD_DIR, os.path.basename(recording.url))
    # if os.path.exists(file_path):
    #     os.remove(file_path)

    mock_sos_recordings = [r for r in mock_sos_recordings if r.id != recording_id]
    return {"id": recording_id, "status": "deleted"}
