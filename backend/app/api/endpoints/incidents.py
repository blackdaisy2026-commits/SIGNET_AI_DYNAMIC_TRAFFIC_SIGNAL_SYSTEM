from fastapi import APIRouter, HTTPException
from typing import List, Optional
from pydantic import BaseModel
from datetime import datetime

router = APIRouter()

# --- Models ---
class Incident(BaseModel):
    id: str
    type: str
    intersectionId: str
    severity: str # 'critical', 'high', 'medium', 'low'
    status: str # 'open', 'in-progress', 'resolved'
    description: str
    createdAt: datetime
    updatedAt: datetime
    assignedTo: Optional[str] = None

class IncidentCreate(BaseModel):
    type: str
    intersectionId: str
    severity: str
    description: str

class IncidentUpdate(BaseModel):
    status: Optional[str] = None
    severity: Optional[str] = None
    description: Optional[str] = None
    assignedTo: Optional[str] = None

class IncidentsListResponse(BaseModel):
    data: List[Incident]
    pagination: dict

# --- Mock Data ---
mock_incidents = [
    Incident(
        id="inc_001",
        type="Signal Malfunction",
        intersectionId="int_001",
        severity="critical",
        status="in-progress",
        description="Red light stuck on for 45 seconds",
        createdAt=datetime.now(),
        updatedAt=datetime.now(),
        assignedTo="operator_001"
    )
]

# --- Endpoints ---

@router.get("/", response_model=IncidentsListResponse)
def get_incidents(status: Optional[str] = None, severity: Optional[str] = None, limit: int = 100, offset: int = 0):
    """
    Get a list of incidents, optionally filtered by status and severity.
    """
    # Filter incidents based on query parameters (mock implementation)
    filtered_incidents = [
        incident for incident in mock_incidents
        if (not status or incident.status == status) and (not severity or incident.severity == severity)
    ]
    
    # Pagination
    paginated_incidents = filtered_incidents[offset : offset + limit]

    return IncidentsListResponse(
        data=paginated_incidents,
        pagination={
            "total": len(filtered_incidents),
            "page": offset // limit + 1,
            "pageSize": limit,
            "hasNextPage": offset + limit < len(filtered_incidents)
        }
    )

@router.post("/", response_model=Incident)
def create_incident(incident: IncidentCreate):
    """
    Create a new incident report.
    """
    # Create new incident object
    new_incident = Incident(
        id=f"inc_{len(mock_incidents) + 1:03d}",
        **incident.dict(),
        status="open",
        createdAt=datetime.now(),
        updatedAt=datetime.now()
    )
    mock_incidents.append(new_incident)
    return new_incident

@router.put("/{incident_id}", response_model=Incident)
def update_incident(incident_id: str, updates: IncidentUpdate):
    """
    Update an existing incident by ID.
    """
    # Find and update the incident
    for idx, incident in enumerate(mock_incidents):
        if incident.id == incident_id:
            updated_incident = incident.copy(update=updates.dict(exclude_unset=True))
            updated_incident.updatedAt = datetime.now()
            mock_incidents[idx] = updated_incident
            return updated_incident
            
    raise HTTPException(status_code=404, detail="Incident not found")

@router.delete("/{incident_id}")
def delete_incident(incident_id: str):
    """
    Delete an incident by ID.
    """
    global mock_incidents
    initial_len = len(mock_incidents)
    mock_incidents = [inc for inc in mock_incidents if inc.id != incident_id]
    
    if len(mock_incidents) == initial_len:
        raise HTTPException(status_code=404, detail="Incident not found")
        
    return {"success": True}
