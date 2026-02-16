from fastapi import APIRouter
from typing import List, Optional
from pydantic import BaseModel

router = APIRouter()

# --- Models ---
class Statistics(BaseModel):
    totalVehicles: int
    activeIncidents: int
    systemUptime: float
    avgSignalEfficiency: float

class VehicleTrend(BaseModel):
    time: str
    cars: int
    trucks: int
    bikes: int

class VehicleTrendResponse(BaseModel):
    data: List[VehicleTrend]

class VehicleDetection(BaseModel):
    time: str
    vehicle: str
    location: str
    confidence: float

class RecentDetectionsResponse(BaseModel):
    data: List[VehicleDetection]


# --- Mock Data ---
def get_mock_stats():
    return Statistics(
        totalVehicles=1391,
        activeIncidents=3,
        systemUptime=99.8,
        avgSignalEfficiency=92.5
    )

def get_mock_trend():
    return [
        VehicleTrend(time="00:00", cars=5, trucks=1, bikes=0),
        VehicleTrend(time="01:00", cars=2, trucks=0, bikes=0),
        VehicleTrend(time="02:00", cars=0, trucks=1, bikes=0),
        # ... more data points
    ]

# --- Endpoints ---

@router.get("/stats", response_model=Statistics)
def get_dashboard_stats():
    """
    Get current dashboard statistics.
    """
    return get_mock_stats()

@router.get("/vehicle-trend", response_model=VehicleTrendResponse)
def get_vehicle_trend(period: str = "24h"):
    """
    Get vehicle detection trends based on the specified period.
    """
    # Simulate data for now
    mock_data = [
        {"time": "00:00", "cars": 45, "trucks": 12, "bikes": 8},
        {"time": "01:00", "cars": 30, "trucks": 10, "bikes": 5},
        # Add more mock data...
    ]
    formatted_data = [VehicleTrend(**item) for item in mock_data]
    return VehicleTrendResponse(data=formatted_data)

@router.get("/recent-detections", response_model=RecentDetectionsResponse)
def get_recent_detections(limit: int = 10):
    """
    Get the most recent vehicle detections.
    """
    mock_detections = [
        {"time": "14:32", "vehicle": "Car (Toyota Camry)", "location": "Intersection A1", "confidence": 98.0},
        {"time": "14:31", "vehicle": "Truck (Ford F-150)", "location": "Intersection B2", "confidence": 95.5},
        # Add more mock detections...
    ]
    formatted_detections = [VehicleDetection(**item) for item in mock_detections]
    return RecentDetectionsResponse(data=formatted_detections)
