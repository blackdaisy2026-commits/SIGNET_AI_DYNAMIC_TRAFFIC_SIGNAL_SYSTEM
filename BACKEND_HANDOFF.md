# Backend Handoff - API Integration Requirements

**Date**: January 2024  
**Version**: 1.0.0  
**Frontend Status**: ✅ Complete & Ready for Integration

---

## Quick Start for Backend Team

This document outlines everything the backend needs to implement to integrate with this frontend.

### What You Need to Do

1. **Implement API endpoints** specified below
2. **Set up WebSocket** for real-time updates
3. **Configure CORS** to allow frontend requests
4. **Test with the frontend** in development

---

## API Endpoints Required

### Base URL
```
Development: http://localhost:8000/api
Production: https://your-api.com/api
```

### WebSocket URL
```
Development: ws://localhost:8000/api/ws
Production: wss://your-api.com/api/ws
```

---

## 1. Dashboard Endpoints

### GET `/dashboard/stats`
Returns current system statistics.

**Response:**
```json
{
  "totalVehicles": 1391,
  "activeIncidents": 3,
  "systemUptime": 99.8,
  "avgSignalEfficiency": 92.5
}
```

### GET `/dashboard/vehicle-trend?period=24h`
Returns hourly vehicle detection data for the specified period.

**Parameters:**
- `period`: "24h", "7d", "30d" (optional, default: "24h")

**Response:**
```json
{
  "data": [
    {
      "time": "00:00",
      "cars": 45,
      "trucks": 12,
      "bikes": 8
    },
    // ... more hours
  ]
}
```

### GET `/dashboard/recent-detections?limit=10`
Returns the most recent vehicle detections.

**Parameters:**
- `limit`: Number of results (optional, default: 10)

**Response:**
```json
{
  "data": [
    {
      "id": "det_001",
      "type": "car",
      "confidence": 0.98,
      "timestamp": "2024-01-15T14:32:00Z",
      "location": "Intersection A1"
    }
  ]
}
```

---

## 2. Detection Endpoints

### GET `/detection/live`
**Option A: REST Endpoint** - Returns current detections
**Option B: WebSocket (Preferred)** - Streams real-time detections

**WebSocket Message Format:**
```json
{
  "type": "detection",
  "data": {
    "id": "det_001",
    "type": "car",
    "confidence": 0.98,
    "timestamp": "2024-01-15T14:32:00Z",
    "cameraId": "cam_001",
    "bbox": {
      "x": 120,
      "y": 80,
      "width": 150,
      "height": 100
    },
    "location": {
      "intersection": "Intersection A1",
      "latitude": 40.7128,
      "longitude": -74.0060
    }
  },
  "timestamp": "2024-01-15T14:32:00Z"
}
```

### GET `/detection/stats`
Returns detection statistics.

**Response:**
```json
{
  "totalDetections": 1247,
  "averageConfidence": 93.5,
  "detectionsByType": {
    "car": 847,
    "truck": 224,
    "motorcycle": 176
  },
  "processingSpeed": 30
}
```

### POST `/detection/config`
Updates detection configuration.

**Request Body:**
```json
{
  "confidenceThreshold": 0.7,
  "model": "YOLOv8",
  "cameraId": "cam_001"
}
```

---

## 3. Incident Endpoints

### GET `/incidents?status=open&severity=high&limit=100&offset=0`
Returns paginated list of incidents.

**Query Parameters:**
- `status`: "open", "in-progress", "resolved" (optional)
- `severity`: "critical", "high", "medium", "low" (optional)
- `limit`: Results per page (optional, default: 100)
- `offset`: Pagination offset (optional, default: 0)

**Response:**
```json
{
  "data": [
    {
      "id": "inc_001",
      "type": "Signal Malfunction",
      "intersectionId": "int_001",
      "severity": "critical",
      "status": "in-progress",
      "description": "Red light stuck on for 45 seconds",
      "createdAt": "2024-01-15T14:32:00Z",
      "updatedAt": "2024-01-15T14:35:00Z",
      "assignedTo": "operator_001"
    }
  ],
  "pagination": {
    "total": 4,
    "page": 1,
    "pageSize": 100,
    "hasNextPage": false
  }
}
```

### POST `/incidents`
Creates a new incident.

**Request Body:**
```json
{
  "type": "Signal Malfunction",
  "intersectionId": "int_001",
  "severity": "critical",
  "description": "Red light stuck on for 45 seconds"
}
```

**Response:**
```json
{
  "id": "inc_001",
  "status": "open",
  "createdAt": "2024-01-15T14:32:00Z"
}
```

### PUT `/incidents/{id}`
Updates an incident.

**Request Body:**
```json
{
  "status": "in-progress",
  "severity": "critical",
  "description": "Updated description",
  "assignedTo": "operator_001"
}
```

### DELETE `/incidents/{id}`
Deletes an incident.

**Response:**
```json
{
  "success": true
}
```

---

## 4. Analytics Endpoints

### GET `/analytics/hourly?startDate=2024-01-15&endDate=2024-01-16&intersectionId=int_001`
Returns hourly traffic analytics.

**Query Parameters:**
- `startDate`: YYYY-MM-DD (required)
- `endDate`: YYYY-MM-DD (required)
- `intersectionId`: Filter by intersection (optional)

**Response:**
```json
{
  "data": [
    {
      "timestamp": "2024-01-15T00:00:00Z",
      "cars": 45,
      "trucks": 12,
      "motorcycles": 8,
      "buses": 3,
      "bicycles": 2,
      "totalVehicles": 70,
      "averageWaitTime": 2.3,
      "congestion": 15,
      "signalEfficiency": 85
    }
  ]
}
```

### GET `/analytics/distribution`
Returns vehicle type distribution.

**Response:**
```json
{
  "cars": 68,
  "trucks": 18,
  "motorcycles": 14
}
```

### GET `/analytics/intersections`
Returns performance metrics for all intersections.

**Response:**
```json
{
  "data": [
    {
      "intersectionId": "int_001",
      "name": "Intersection A1",
      "totalVehicles": 1245,
      "efficiency": 94,
      "incidentsCount": 1,
      "averageWaitTime": 2.1,
      "congestionLevel": "low"
    }
  ]
}
```

### GET `/analytics/export?format=pdf&startDate=2024-01-15&endDate=2024-01-16`
Exports analytics report.

**Query Parameters:**
- `format`: "pdf", "csv", "json" (required)
- `startDate`: YYYY-MM-DD (required)
- `endDate`: YYYY-MM-DD (required)

**Response:** File blob

---

## 5. Traffic Signal Endpoints (Optional)

### GET `/signals`
Returns all traffic signals.

### GET `/signals/intersection/{intersectionId}`
Returns signals for a specific intersection.

### PUT `/signals/{id}`
Updates signal timing.

**Request Body:**
```json
{
  "greenTime": 60,
  "redTime": 30
}
```

### POST `/signals/{id}/override`
Manually override signal state.

**Request Body:**
```json
{
  "state": "green"
}
```

---

## 6. System Endpoints (Optional)

### GET `/health`
Returns system health status.

**Response:**
```json
{
  "status": "healthy",
  "uptime": 99.8,
  "timestamp": "2024-01-15T14:32:00Z"
}
```

### GET `/system/status`
Returns detailed system status.

---

## WebSocket Protocol

### Connection
```
ws://localhost:8000/api/ws
```

### Message Types

#### Detection Update
```json
{
  "type": "detection",
  "data": { /* VehicleDetection object */ },
  "timestamp": "2024-01-15T14:32:00Z"
}
```

#### Signal Update
```json
{
  "type": "signal_update",
  "data": { /* TrafficSignal object */ },
  "timestamp": "2024-01-15T14:32:00Z"
}
```

#### Incident Update
```json
{
  "type": "incident",
  "data": { /* Incident object */ },
  "timestamp": "2024-01-15T14:32:00Z"
}
```

#### Stats Update
```json
{
  "type": "stats_update",
  "data": { /* DetectionStats object */ },
  "timestamp": "2024-01-15T14:32:00Z"
}
```

---

## Error Handling

All errors should return this format:

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human readable error message"
  },
  "timestamp": "2024-01-15T14:32:00Z"
}
```

### Common Error Codes
- `INVALID_REQUEST` - Bad request parameters
- `NOT_FOUND` - Resource not found
- `UNAUTHORIZED` - Authentication required
- `FORBIDDEN` - Insufficient permissions
- `INTERNAL_ERROR` - Server error

---

## CORS Configuration

The frontend is served from `http://localhost:3000` (development).

Configure CORS to allow:
```
Origin: http://localhost:3000
Methods: GET, POST, PUT, DELETE, OPTIONS
Headers: Content-Type, Authorization
Credentials: include (if using cookies)
```

---

## Rate Limiting Recommendations

- **Dashboard stats**: No limit (cached)
- **Live detection**: 30 FPS max
- **Incident creation**: 10 per minute
- **Analytics queries**: 5 per minute
- **Export requests**: 1 per minute

---

## Data Types

See `/types/api.ts` in the frontend for complete TypeScript definitions.

Key types:
- `VehicleDetection` - Vehicle detection record
- `DetectionStats` - Detection statistics
- `TrafficSignal` - Traffic signal state
- `Incident` - Incident report
- `HourlyTrafficData` - Analytics data point

---

## Testing Checklist

- [ ] All GET endpoints return correct data format
- [ ] All POST/PUT/DELETE endpoints work correctly
- [ ] WebSocket connects and sends messages
- [ ] Error responses follow error format
- [ ] CORS is properly configured
- [ ] Real-time updates flow through WebSocket
- [ ] Frontend receives and displays data correctly
- [ ] Charts render with real data
- [ ] Incident CRUD operations work end-to-end

---

## Frontend Integration Code

The frontend uses these main files for integration:

1. **`/lib/api-service.ts`** - API client with all endpoints
2. **`/hooks/useApi.ts`** - React hooks for API calls
3. **`/types/api.ts`** - TypeScript type definitions

The frontend makes API calls like this:

```typescript
import { dashboardAPI } from '@/lib/api-service'

const stats = await dashboardAPI.getStats()
```

---

## Development Workflow

1. **Start backend** on `http://localhost:8000`
2. **Start frontend** on `http://localhost:3000`
3. **Frontend connects** to backend via environment variables
4. **Test each page**:
   - Dashboard (tests stats and trends)
   - Detection (tests live updates)
   - Incidents (tests CRUD)
   - Analytics (tests data queries)

---

## Environment Variables (Frontend Side)

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000/api
NEXT_PUBLIC_WS_URL=ws://localhost:8000/api/ws
```

---

## Questions for Backend Team

1. Will you implement WebSocket or should we use polling?
2. Do you need authentication/authorization?
3. What video streaming format will be used for camera feeds?
4. Are there any rate limits or throttling requirements?
5. What database technology will you use?

---

## Support Resources

- Full API documentation: `BACKEND_INTEGRATION.md`
- Frontend setup guide: `SETUP_GUIDE.md`
- Project overview: `README.md`
- Frontend code: `/components` directory
- TypeScript types: `/types/api.ts`
- API service: `/lib/api-service.ts`

---

## Next Steps

1. ✅ **Frontend**: Complete (ready for integration)
2. 📋 **Backend**: Start implementing endpoints from this guide
3. 🔗 **Integration**: Connect frontend to backend
4. 🧪 **Testing**: Test end-to-end workflows
5. 🚀 **Deployment**: Deploy both frontend and backend

---

## Timeline Estimate

- Backend API implementation: 2-3 weeks
- Integration & testing: 1 week
- Deployment: 1-2 days
- **Total**: 3-4 weeks

---

## Success Criteria

- [ ] All API endpoints implemented and tested
- [ ] WebSocket connection working
- [ ] Real-time updates flowing
- [ ] Frontend displays backend data correctly
- [ ] All CRUD operations working
- [ ] Charts displaying real data
- [ ] No console errors in browser
- [ ] Mobile responsive
- [ ] Performance acceptable (<2s first load)
- [ ] Ready for production deployment

---

**Good luck with the backend implementation! Contact the frontend team if you have questions.**

---

Generated: January 2024  
Frontend Version: 1.0.0  
Status: Ready for Backend Integration
