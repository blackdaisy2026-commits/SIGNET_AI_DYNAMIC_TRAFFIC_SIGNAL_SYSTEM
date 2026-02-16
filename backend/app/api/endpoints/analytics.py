from fastapi import APIRouter
from typing import List, Dict
from pydantic import BaseModel

router = APIRouter()

# --- Models ---
class AnalyticData(BaseModel):
    hourly_traffic: List[Dict[str, int]]
    vehicle_distribution: Dict[str, int]
    intersection_performance: List[Dict[str, float]]

# --- Mock Data ---

def get_analytics_data():
    return {
        "hourly_traffic": [
            {"hour": "00:00", "count": 120},
            {"hour": "01:00", "count": 150},
            {"hour": "02:00", "count": 80},
            # ...
        ],
        "vehicle_distribution": {"cars": 8200, "trucks": 2100, "motorcycles": 1200},
        "intersection_performance": [{"id": "int_A1", "efficiency": 94.8}]
    }

# --- Endpoints ---

@router.get("/hourly")
def get_hourly_traffic(startDate: str = None, endDate: str = None, intersectionId: str = None):
    """
    Get hourly traffic statistics for a given period.
    """
    return get_analytics_data()["hourly_traffic"]

@router.get("/distribution")
def get_vehicle_distribution(startDate: str = None, endDate: str = None):
    """
    Get vehicle distribution (cars, trucks, etc.) for a given period.
    """
    return get_analytics_data()["vehicle_distribution"]

@router.get("/intersections")
def get_intersection_performance(startDate: str = None, endDate: str = None):
    """
    Get performance metrics for all intersections.
    """
    return get_analytics_data()["intersection_performance"]

@router.get("/export")
def export_report(format: str = "pdf", startDate: str = None, endDate: str = None):
    """
    Export analytics report in PDF or CSV format.
    """
    # Simulate exporting a file (return bytes or dummy content)
    import io
    
    if format == "pdf":
        buffer = io.BytesIO()
        buffer.write(b"%PDF-1.4... Dummy PDF Content ...")
        buffer.seek(0)
        return {"content": buffer.getvalue(), "filename": "analytics_report.pdf"}
    elif format == "csv":
         # Return CSV string
         csv_content = "Hour,Count\n00:00,120\n01:00,150"
         return csv_content

    return {"error": "Unsupported format"}
