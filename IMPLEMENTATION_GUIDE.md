# Implementation Guide for New Features

## Quick Start

This guide helps your backend team implement the necessary endpoints and services for the three new features.

---

## 1. Chatbot Backend Implementation

### Required Endpoint
**POST** `/api/chat`

### Request Format
```json
{
  "messages": [
    {
      "role": "user",
      "content": "I need emergency help"
    }
  ],
  "language": "en"
}
```

### Response Format (Server-Sent Events / Streaming)
```
data: {"type":"text-delta","delta":"Hello, "}
data: {"type":"text-delta","delta":"how can I help?"}
data: [DONE]
```

### Implementation Steps

#### 1. In Your Backend (Node.js/Express Example)
```typescript
import { Anthropic } from '@anthropic-ai/sdk'

app.post('/api/chat', async (req, res) => {
  const { messages, language = 'en' } = req.body

  const systemPrompt = getSystemPrompt(language)

  const client = new Anthropic()
  
  res.setHeader('Content-Type', 'text/event-stream')
  res.setHeader('Cache-Control', 'no-cache')
  res.setHeader('Connection', 'keep-alive')

  const stream = await client.messages.stream({
    model: 'claude-3-5-sonnet-20241022',
    max_tokens: 1024,
    system: systemPrompt,
    messages: messages,
  })

  for await (const chunk of stream) {
    if (chunk.type === 'content_block_delta' && chunk.delta.type === 'text_delta') {
      res.write(`data: ${JSON.stringify({
        type: 'text-delta',
        delta: chunk.delta.text
      })}\n\n`)
    }
  }

  res.write('data: [DONE]\n\n')
  res.end()
})

function getSystemPrompt(language: string): string {
  // Return language-specific prompt
  return `You are an emergency support chatbot...`
}
```

#### 2. Using OpenAI's API
```typescript
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

app.post('/api/chat', async (req, res) => {
  const { messages, language = 'en' } = req.body

  res.setHeader('Content-Type', 'text/event-stream')
  
  const stream = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: messages,
    stream: true,
    system: getSystemPrompt(language),
  })

  for await (const chunk of stream) {
    if (chunk.choices[0]?.delta?.content) {
      res.write(`data: ${JSON.stringify({
        type: 'text-delta',
        delta: chunk.choices[0].delta.content
      })}\n\n`)
    }
  }

  res.write('data: [DONE]\n\n')
  res.end()
})
```

#### 3. Using Anthropic's Claude API
```typescript
const Anthropic = require('@anthropic-ai/sdk')

const client = new Anthropic()

app.post('/api/chat', async (req, res) => {
  const { messages, language = 'en' } = req.body

  res.setHeader('Content-Type', 'text/event-stream')

  const stream = client.messages.stream({
    model: 'claude-3-5-sonnet-20241022',
    max_tokens: 1024,
    system: getSystemPrompt(language),
    messages: messages,
  })

  stream.on('text', (text) => {
    res.write(`data: ${JSON.stringify({
      type: 'text-delta',
      delta: text
    })}\n\n`)
  })

  stream.on('end', () => {
    res.write('data: [DONE]\n\n')
    res.end()
  })

  stream.on('error', (error) => {
    console.error('Stream error:', error)
    res.status(500).end()
  })
})
```

### Database Schema (Optional - for Chat History)
```sql
CREATE TABLE chat_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id),
  session_id UUID,
  language VARCHAR(10),
  role VARCHAR(20), -- 'user' or 'assistant'
  content TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_chat_session ON chat_messages(session_id);
CREATE INDEX idx_chat_user ON chat_messages(user_id);
```

### Multi-language Support
The system prompts should be customized per language. Store them in a configuration file or database:

```typescript
const SYSTEM_PROMPTS: Record<string, string> = {
  en: 'You are an emergency support chatbot...',
  es: 'Eres un chatbot de soporte de emergencia...',
  fr: 'Vous êtes un chatbot d\'assistance d\'urgence...',
  de: 'Sie sind ein Notfall-Support-Chatbot...',
  ja: 'あなたは緊急サポートチャットボットです...',
  zh: '您是一个紧急支持聊天机器人...'
}
```

---

## 2. SOS Recording Module Backend

### Required Endpoints

#### POST `/api/sos-recordings`
Save SOS recording metadata

**Request:**
```json
{
  "recordingBlob": "base64 encoded video",
  "duration": 10,
  "timestamp": "2024-02-14T10:30:00Z",
  "location": {
    "latitude": 40.7128,
    "longitude": -74.0060
  },
  "userId": "user-123"
}
```

**Response:**
```json
{
  "id": "sos-recording-123",
  "status": "saved",
  "url": "/storage/sos-recordings/sos-recording-123.webm"
}
```

#### GET `/api/sos-recordings`
Retrieve all SOS recordings for a user

**Query Parameters:**
- `userId`: User ID
- `startDate`: Optional date filter
- `endDate`: Optional date filter
- `limit`: Results per page (default: 20)

**Response:**
```json
{
  "recordings": [
    {
      "id": "sos-recording-123",
      "timestamp": "2024-02-14T10:30:00Z",
      "duration": 10,
      "location": { "latitude": 40.7128, "longitude": -74.0060 },
      "url": "/storage/sos-recordings/sos-recording-123.webm"
    }
  ],
  "total": 5
}
```

#### DELETE `/api/sos-recordings/:id`
Delete a specific SOS recording

**Response:**
```json
{
  "id": "sos-recording-123",
  "status": "deleted"
}
```

### Implementation Example

```typescript
import multer from 'multer'
import { v4 as uuidv4 } from 'uuid'
import fs from 'fs'
import path from 'path'

const upload = multer({ 
  dest: 'uploads/sos-recordings/',
  limits: { fileSize: 50 * 1024 * 1024 } // 50MB max
})

// Save recording
app.post('/api/sos-recordings', upload.single('video'), async (req, res) => {
  try {
    const { userId, location, timestamp, duration } = req.body
    const recordingId = uuidv4()

    // Rename uploaded file
    const fileName = `${recordingId}.webm`
    const newPath = path.join('uploads/sos-recordings', fileName)
    fs.renameSync(req.file.path, newPath)

    // Save to database
    const recording = await db.sosRecordings.create({
      id: recordingId,
      userId,
      fileName,
      duration: parseInt(duration),
      location: JSON.parse(location),
      timestamp: new Date(timestamp),
      fileSize: req.file.size,
      createdAt: new Date(),
    })

    res.json({
      id: recordingId,
      status: 'saved',
      url: `/api/sos-recordings/${recordingId}/download`
    })
  } catch (error) {
    res.status(500).json({ error: 'Failed to save recording' })
  }
})

// Retrieve recordings
app.get('/api/sos-recordings', async (req, res) => {
  try {
    const { userId, startDate, endDate, limit = 20 } = req.query

    const recordings = await db.sosRecordings.find({
      userId,
      timestamp: {
        $gte: startDate ? new Date(startDate) : new Date(0),
        $lte: endDate ? new Date(endDate) : new Date()
      }
    })
    .limit(parseInt(limit))
    .sort({ timestamp: -1 })

    res.json({
      recordings: recordings.map(r => ({
        id: r.id,
        timestamp: r.timestamp,
        duration: r.duration,
        location: r.location,
        url: `/api/sos-recordings/${r.id}/download`
      })),
      total: recordings.length
    })
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve recordings' })
  }
})

// Download recording
app.get('/api/sos-recordings/:id/download', async (req, res) => {
  try {
    const recording = await db.sosRecordings.findById(req.params.id)
    
    if (!recording) {
      return res.status(404).json({ error: 'Recording not found' })
    }

    const filePath = path.join('uploads/sos-recordings', recording.fileName)
    res.download(filePath, `SOS-${recording.id}.webm`)
  } catch (error) {
    res.status(500).json({ error: 'Failed to download recording' })
  }
})

// Delete recording
app.delete('/api/sos-recordings/:id', async (req, res) => {
  try {
    const recording = await db.sosRecordings.findByIdAndDelete(req.params.id)
    
    if (!recording) {
      return res.status(404).json({ error: 'Recording not found' })
    }

    // Delete file
    const filePath = path.join('uploads/sos-recordings', recording.fileName)
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath)
    }

    res.json({ id: req.params.id, status: 'deleted' })
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete recording' })
  }
})
```

### Database Schema
```sql
CREATE TABLE sos_recordings (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id) NOT NULL,
  file_name VARCHAR(255) NOT NULL,
  duration INTEGER NOT NULL, -- seconds
  location JSONB, -- {latitude, longitude}
  file_size BIGINT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_sos_user ON sos_recordings(user_id);
CREATE INDEX idx_sos_created ON sos_recordings(created_at);
```

---

## 3. Report Export Backend

### Required Endpoints

#### GET `/api/reports/summary`
Get traffic summary data

**Query Parameters:**
- `startDate`: ISO date string
- `endDate`: ISO date string

**Response:**
```json
{
  "totalVehicles": 15420,
  "averageSpeed": 45.2,
  "trafficDensity": "Medium",
  "incidentCount": 23,
  "detectionAccuracy": 94.8
}
```

#### GET `/api/reports/incidents`
Get incident data for report

**Query Parameters:**
- `startDate`: ISO date string
- `endDate`: ISO date string
- `type`: Optional filter (Accident, Congestion, etc.)

**Response:**
```json
{
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
```

#### GET `/api/reports/analytics`
Get vehicle detection analytics

**Query Parameters:**
- `startDate`: ISO date string
- `endDate`: ISO date string

**Response:**
```json
{
  "vehicles": {
    "cars": 8200,
    "trucks": 2100,
    "motorcycles": 1200,
    "buses": 520
  },
  "hourlyTrends": [
    { "hour": "00:00", "count": 120 },
    { "hour": "06:00", "count": 450 }
  ]
}
```

### Implementation Example

```typescript
// Get traffic summary
app.get('/api/reports/summary', async (req, res) => {
  const { startDate, endDate } = req.query

  try {
    const detections = await db.vehicleDetections.find({
      timestamp: {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      }
    })

    const incidents = await db.incidents.find({
      timestamp: {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      }
    })

    const summary = {
      totalVehicles: detections.length,
      averageSpeed: calculateAverageSpeed(detections),
      trafficDensity: calculateDensity(detections),
      incidentCount: incidents.length,
      detectionAccuracy: calculateAccuracy(detections)
    }

    res.json(summary)
  } catch (error) {
    res.status(500).json({ error: 'Failed to generate report' })
  }
})

// Get incidents for report
app.get('/api/reports/incidents', async (req, res) => {
  const { startDate, endDate, type } = req.query

  try {
    const query = {
      timestamp: {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      }
    }

    if (type) {
      query.type = type
    }

    const incidents = await db.incidents.find(query).sort({ timestamp: -1 })

    res.json({ incidents })
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve incidents' })
  }
})

// Get analytics data
app.get('/api/reports/analytics', async (req, res) => {
  const { startDate, endDate } = req.query

  try {
    const detections = await db.vehicleDetections.find({
      timestamp: {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      }
    })

    const analytics = {
      vehicles: calculateVehicleDistribution(detections),
      hourlyTrends: calculateHourlyTrends(detections)
    }

    res.json(analytics)
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve analytics' })
  }
})
```

### Database Queries

```sql
-- Vehicle summary
SELECT 
  COUNT(*) as total_vehicles,
  AVG(speed) as average_speed,
  COUNT(CASE WHEN severity = 'High' THEN 1 END) as incidents
FROM vehicle_detections
WHERE timestamp BETWEEN $1 AND $2;

-- Vehicle type distribution
SELECT 
  vehicle_type,
  COUNT(*) as count
FROM vehicle_detections
WHERE timestamp BETWEEN $1 AND $2
GROUP BY vehicle_type;

-- Hourly trends
SELECT 
  DATE_TRUNC('hour', timestamp) as hour,
  COUNT(*) as count
FROM vehicle_detections
WHERE timestamp BETWEEN $1 AND $2
GROUP BY DATE_TRUNC('hour', timestamp)
ORDER BY hour;
```

---

## Testing the Implementation

### 1. Test Chatbot
```bash
curl -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d '{
    "messages": [{"role": "user", "content": "Hello"}],
    "language": "en"
  }'
```

### 2. Test SOS Recording
```bash
# Upload recording
curl -X POST http://localhost:3000/api/sos-recordings \
  -F "video=@recording.webm" \
  -F "userId=user-123" \
  -F "duration=10" \
  -F "timestamp=2024-02-14T10:30:00Z"

# List recordings
curl http://localhost:3000/api/sos-recordings?userId=user-123
```

### 3. Test Report Export
```bash
curl "http://localhost:3000/api/reports/summary?startDate=2024-02-01&endDate=2024-02-14"
curl "http://localhost:3000/api/reports/incidents?startDate=2024-02-01&endDate=2024-02-14"
curl "http://localhost:3000/api/reports/analytics?startDate=2024-02-01&endDate=2024-02-14"
```

---

## Production Considerations

1. **Security**:
   - Validate all input parameters
   - Implement rate limiting on chat endpoint
   - Use authentication for all endpoints
   - Encrypt stored recordings
   - Validate file uploads

2. **Performance**:
   - Stream responses (already implemented for chat)
   - Cache report data
   - Use pagination for listings
   - Compress videos before storage

3. **Storage**:
   - Use cloud storage (S3, GCS) for videos
   - Clean up old recordings
   - Set retention policies
   - Monitor storage usage

4. **Monitoring**:
   - Log all API calls
   - Track response times
   - Monitor errors
   - Alert on failures

---

## Environment Variables

```env
# AI Services
OPENAI_API_KEY=your-openai-key
ANTHROPIC_API_KEY=your-anthropic-key

# Storage
AWS_S3_BUCKET=your-bucket
AWS_ACCESS_KEY_ID=your-key
AWS_SECRET_ACCESS_KEY=your-secret

# Database
DATABASE_URL=postgresql://user:pass@localhost/db

# API Configuration
MAX_UPLOAD_SIZE=52428800  # 50MB
MAX_CHAT_LENGTH=10000
CHAT_RATE_LIMIT=30  # requests per minute
```

