# Traffic Signal Detection System - Backend Integration Guide

## Overview

This frontend is designed to integrate with the Antigravity backend for the Traffic Signal Detection System. This document outlines the API endpoints, data structures, and integration points required for the backend.

## Architecture Overview

```
Frontend (React/Next.js) 
  ↓
API Gateway
  ↓
Backend Services (Antigravity)
  ├── Vehicle Detection Service (Python/YOLO)
  ├── Signal Management Service
  ├── Incident Management Service
  └── Analytics Service
  ↓
Database & Streaming Services
```

## API Endpoints Required

### 1. Dashboard Analytics

#### Get Dashboard Stats
```
GET /api/dashboard/stats
Response:
{
  "totalVehicles": 1391,
  "activeIncidents": 3,
  "systemUptime": 99.8,
  "avgSignalEfficiency": 92.5
}
```

#### Get Vehicle Detection Trend
```
GET /api/dashboard/vehicle-trend?period=24h
Response:
{
  "data": [
    {
      "time": "00:00",
      "cars": 45,
      "trucks": 12,
      "bikes": 8
    },
    ...
  ]
}
```

#### Get Recent Detections
```
GET /api/dashboard/recent-detections?limit=10
Response:
{
  "data": [
    {
      "time": "14:32",
      "vehicle": "Car (Toyota Camry)",
      "location": "Intersection A1",
      "confidence": 98
    },
    ...
  ]
}
```

### 2. Vehicle Detection

#### Get Live Detection Feed
```
GET /api/detection/live
Response (WebSocket or Server-Sent Events):
{
  "detections": [
    {
      "id": "det_001",
      "type": "car",
      "confidence": 0.98,
      "bbox": {
        "x": 120,
        "y": 80,
        "width": 150,
        "height": 100
      }
    }
  ],
  "timestamp": "2024-01-15T14:32:00Z"
}
```

#### Get Detection Statistics
```
GET /api/detection/stats
Response:
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

#### Update Detection Settings
```
POST /api/detection/config
Body:
{
  "confidenceThreshold": 0.7,
  "model": "YOLOv8",
  "cameraId": "cam_001"
}
```

### 3. Incident Management

#### Get All Incidents
```
GET /api/incidents?status=open&sort=severity
Response:
{
  "data": [
    {
      "id": "inc_001",
      "type": "Signal Malfunction",
      "location": "Intersection A1",
      "severity": "critical",
      "status": "in-progress",
      "description": "Red light stuck on",
      "timestamp": "2024-01-15T14:32:00Z"
    }
  ]
}
```

#### Create Incident Report
```
POST /api/incidents
Body:
{
  "type": "Signal Malfunction",
  "location": "Intersection A1",
  "severity": "critical",
  "description": "Red light stuck on for 45 seconds"
}
Response:
{
  "id": "inc_001",
  "status": "open",
  "createdAt": "2024-01-15T14:32:00Z"
}
```

#### Update Incident Status
```
PUT /api/incidents/{id}
Body:
{
  "status": "in-progress"
}
```

#### Delete Incident
```
DELETE /api/incidents/{id}
Response:
{
  "success": true
}
```

### 4. Analytics & Reports

#### Get Hourly Traffic Data
```
GET /api/analytics/hourly?startDate=2024-01-15&endDate=2024-01-16
Response:
{
  "data": [
    {
      "timestamp": "2024-01-15T00:00:00Z",
      "cars": 45,
      "trucks": 12,
      "motorcycles": 8,
      "efficiency": 85
    },
    ...
  ]
}
```

#### Get Vehicle Distribution
```
GET /api/analytics/distribution
Response:
{
  "cars": 68,
  "trucks": 18,
  "motorcycles": 14
}
```

#### Get Intersection Performance
```
GET /api/analytics/intersections
Response:
{
  "data": [
    {
      "name": "Intersection A1",
      "totalVehicles": 1245,
      "efficiency": 94,
      "incidents": 1
    },
    ...
  ]
}
```

#### Export Report
```
GET /api/analytics/export?format=pdf&startDate=2024-01-15&endDate=2024-01-16
Response: PDF file
```

### 5. Real-time Updates (WebSocket)

#### Connect to WebSocket
```
WebSocket: ws://your-api.com/api/ws
```

#### Message Format
```
{
  "type": "detection",
  "data": {
    "id": "det_001",
    "type": "car",
    "confidence": 0.98
  },
  "timestamp": "2024-01-15T14:32:00Z"
}
```

## Data Types

See `/types/api.ts` for complete TypeScript interfaces. Key types:

- `VehicleDetection` - Individual vehicle detection
- `TrafficSignal` - Signal state and timing
- `Incident` - Incident report
- `HourlyTrafficData` - Analytics data point
- `ApiResponse<T>` - Standard API response wrapper

## Frontend Components & Integration Points

### Dashboard (`/components/dashboard/dashboard.tsx`)
- Displays real-time statistics
- Requires: `/api/dashboard/stats`, `/api/dashboard/vehicle-trend`, `/api/dashboard/recent-detections`

### Traffic Detection (`/components/traffic/traffic-detection.tsx`)
- Shows live detection feed
- Requires: WebSocket connection or `/api/detection/live`, `/api/detection/stats`
- Canvas rendering of vehicle bounding boxes

### Incident Reporting (`/components/incidents/incident-reporting.tsx`)
- CRUD operations for incidents
- Requires: `/api/incidents` (GET, POST, PUT, DELETE)
- Status updates for incident management

### Analytics (`/components/analytics/analytics-page.tsx`)
- Charts and reports
- Requires: `/api/analytics/hourly`, `/api/analytics/distribution`, `/api/analytics/intersections`

## Environment Variables Required

```env
# Backend API Configuration
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
NEXT_PUBLIC_WS_URL=ws://localhost:8000

# Optional: Camera/Stream Configuration
NEXT_PUBLIC_CAMERA_FEED_URL=http://localhost:8080/stream
NEXT_PUBLIC_RTSP_URL=rtsp://camera-server:554/stream
```

## Integration Steps

### 1. Setup Environment Variables
```bash
# Copy and modify
cp .env.example .env.local

# Update with your backend URLs
NEXT_PUBLIC_API_BASE_URL=your_api_url
NEXT_PUBLIC_WS_URL=your_websocket_url
```

### 2. Create API Client
```typescript
// Create lib/api-client.ts
import axios from 'axios'

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
})

export default apiClient
```

### 3. Create Service Hooks
```typescript
// Create hooks/useDetections.ts
import useSWR from 'swr'
import apiClient from '@/lib/api-client'

export function useDetections() {
  const { data, error, isLoading } = useSWR(
    '/api/detection/live',
    (url) => apiClient.get(url).then(res => res.data)
  )
  return { data, error, isLoading }
}
```

### 4. Connect WebSocket
```typescript
// For real-time updates
useEffect(() => {
  const ws = new WebSocket(process.env.NEXT_PUBLIC_WS_URL || '')
  
  ws.onmessage = (event) => {
    const message = JSON.parse(event.data)
    // Handle real-time updates
  }
  
  return () => ws.close()
}, [])
```

## Example Backend Responses

### Detection Response
```json
{
  "id": "det_12345",
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
}
```

### Incident Response
```json
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
```

## Testing

### Mock API Responses
The frontend includes mock data for development. To test with actual backend:

1. Update API endpoints in components
2. Replace mock data with actual API calls
3. Use SWR for caching and real-time updates

### Example Mock to Real Transition
```typescript
// Before (mock)
const [vehicleData] = useState([...mockData])

// After (real API)
const { data: vehicleData } = useSWR('/api/dashboard/vehicle-trend', fetcher)
```

## Error Handling

All API errors should follow this format:
```json
{
  "success": false,
  "error": {
    "code": "INVALID_REQUEST",
    "message": "Error description"
  },
  "timestamp": "2024-01-15T14:32:00Z"
}
```

## Rate Limiting

- Dashboard stats: No limit (cached)
- Real-time detection: 30 FPS max
- Incident creation: 10 per minute
- Analytics queries: 5 per minute

## Performance Considerations

1. **Real-time Updates**: Use WebSocket for <100ms latency
2. **Caching**: Implement SWR with 30-second revalidation
3. **Canvas Rendering**: Optimize bounding box drawing for 30 FPS
4. **Pagination**: Use for incident lists (100 items per page)

## Support & Documentation

For backend documentation and API details, contact the Antigravity team or refer to their documentation.

---

**Last Updated**: January 2024
**Frontend Version**: 1.0.0
**API Version**: v1.0
