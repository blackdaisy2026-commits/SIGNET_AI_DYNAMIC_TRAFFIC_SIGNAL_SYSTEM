from fastapi import APIRouter
from typing import Dict, List
from pydantic import BaseModel

router = APIRouter()

# --- Models ---
class TrafficSummary(BaseModel):
    totalVehicles: int
    averageSpeed: float
    trafficDensity: str # 'Low', 'Medium', 'High'
    incidentCount: int
    detectionAccuracy: float

class VehicleDistribution(BaseModel):
    cars: int
    trucks: int
    motorcycles: int
    buses: int

class AnalyticsReport(BaseModel):
    vehicles: VehicleDistribution
    hourlyTrends: List[Dict[str, int]]

# --- Mock Data ---

def get_report_summary():
    return {
        "totalVehicles": 15420,
        "averageSpeed": 45.2,
        "trafficDensity": "Medium",
        "incidentCount": 23,
        "detectionAccuracy": 94.8
    }

def get_report_analytics():
    return {
        "vehicles": {
            "cars": 8200,
            "trucks": 2100,
            "motorcycles": 1200,
            "buses": 520
        },
        "hourlyTrends": [
            {"hour": "00:00", "count": 120},
            {"hour": "06:00", "count": 450}
        ]
    }

# --- Endpoints ---

@router.get("/summary", response_model=TrafficSummary)
def get_traffic_summary(startDate: str = None, endDate: str = None):
    """
    Get a summary of traffic data for a reporting period.
    """
    return get_report_summary()

@router.get("/incidents", response_model=Dict[str, List[dict]])
def get_incident_report(startDate: str = None, endDate: str = None, type: str = None):
    """
    Get incident report data.
    """
    return {
        "incidents": [
            {
                "id": 1,
                "type": "Accident",
                "location": "Main Street & 5th Ave",
                "timestamp": "2024-02-14T10:30:00Z",
                "severity": "High"
            }
        ]
    }

@router.get("/analytics", response_model=AnalyticsReport)
def get_analytics_report(startDate: str = None, endDate: str = None):
    """
    Get detailed analytics for reporting.
    """
    return get_report_analytics()
