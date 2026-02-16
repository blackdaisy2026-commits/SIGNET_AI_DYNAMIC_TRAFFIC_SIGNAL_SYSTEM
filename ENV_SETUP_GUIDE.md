# Environment Setup Guide

## Quick Setup for New Features

### 1. Chatbot (AI Chat)

#### Option A: Using Vercel AI Gateway (Recommended)
No additional setup needed! The project uses Vercel AI Gateway by default.

#### Option B: Using OpenAI Directly
Add to `.env.local`:
```env
OPENAI_API_KEY=sk-your-key-here
```

#### Option C: Using Anthropic Claude
Add to `.env.local`:
```env
ANTHROPIC_API_KEY=sk-ant-your-key-here
```

### 2. SOS Recording Module

#### Cloud Storage Setup (AWS S3)
```env
# AWS Configuration
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key
AWS_S3_BUCKET=your-bucket-name
```

#### Alternative: Azure Blob Storage
```env
# Azure Configuration
AZURE_STORAGE_ACCOUNT=your-account
AZURE_STORAGE_KEY=your-key
AZURE_STORAGE_CONTAINER=sos-recordings
```

#### Alternative: Google Cloud Storage
```env
# Google Cloud Configuration
GCP_PROJECT_ID=your-project
GCP_BUCKET_NAME=your-bucket
GCP_SERVICE_ACCOUNT_JSON=path/to/service-account.json
```

### 3. Report Export

#### Database Configuration
```env
# PostgreSQL
DATABASE_URL=postgresql://user:password@localhost:5432/traffic_db

# MongoDB
MONGODB_URI=mongodb://user:password@localhost:27017/traffic_db

# Supabase
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

---

## Local Development Setup

### Step 1: Install Dependencies
```bash
npm install
# or
pnpm install
# or
yarn install
```

### Step 2: Create `.env.local` File

Copy the template:
```env
# AI Services (choose one)
OPENAI_API_KEY=sk-your-key

# Or for Vercel AI Gateway (no key needed)
AI_GATEWAY_URL=https://gateway.ai.cloudflare.com

# Database
DATABASE_URL=postgresql://localhost:5432/traffic_db

# Storage (optional for local development)
AWS_S3_BUCKET=local-sos-bucket

# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:3000
```

### Step 3: Run Development Server
```bash
npm run dev
# Open http://localhost:3000
```

### Step 4: Test Features

**Test Chatbot:**
- Click phone icon (bottom-right)
- Type a message
- Should see AI response

**Test SOS:**
- Click red SOS button (bottom-right)
- Grant camera permissions
- Click "Start Recording"
- Should record for 10 seconds

**Test Export:**
- Go to Analytics page
- Scroll to Export Reports section
- Select date range and format
- Click export button

---

## Production Deployment Setup

### On Vercel

#### 1. Connect Repository
```bash
vercel link
```

#### 2. Add Environment Variables
In Vercel Dashboard → Settings → Environment Variables:

```
OPENAI_API_KEY=sk-...
AWS_S3_BUCKET=your-bucket
AWS_ACCESS_KEY_ID=...
AWS_SECRET_ACCESS_KEY=...
DATABASE_URL=postgresql://...
```

#### 3. Deploy
```bash
vercel deploy --prod
```

### On Docker

#### Dockerfile
```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

EXPOSE 3000

ENV NODE_ENV=production
CMD ["npm", "start"]
```

#### Docker Compose
```yaml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - DATABASE_URL=postgresql://postgres:password@db:5432/traffic
      - OPENAI_API_KEY=${OPENAI_API_KEY}
    depends_on:
      - db
    
  db:
    image: postgres:15
    environment:
      - POSTGRES_DB=traffic
      - POSTGRES_PASSWORD=password
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```

---

## Feature-Specific Setup

### Chatbot Setup

#### Step 1: Verify API Route
Check `/app/api/chat/route.ts` exists

#### Step 2: Test Streaming
```bash
curl -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"messages":[{"role":"user","content":"Hello"}],"language":"en"}'
```

#### Step 3: Verify AI Service
- Check API key is set
- Verify model exists
- Test response streaming

#### Troubleshooting
```
Error: AI_GATEWAY_API_KEY is not set
→ Add OPENAI_API_KEY or use Vercel AI Gateway

Error: 429 Rate Limited
→ Implement rate limiting on backend

Error: No response
→ Check API endpoint is reachable
```

### SOS Recording Setup

#### Step 1: Camera Permissions
- Works in HTTPS or localhost
- Browser will prompt for camera access
- User must allow permissions

#### Step 2: Storage Setup (Choose One)

**AWS S3:**
```bash
# Create bucket
aws s3 mb s3://sos-recordings

# Set bucket policy
aws s3api put-bucket-cors \
  --bucket sos-recordings \
  --cors-configuration file://cors.json
```

**cors.json:**
```json
{
  "CORSRules": [{
    "AllowedOrigins": ["*"],
    "AllowedMethods": ["PUT", "POST"],
    "AllowedHeaders": ["*"]
  }]
}
```

**Local Storage (Development):**
```bash
mkdir -p public/uploads/sos
```

#### Step 3: Backend Endpoint
Create `/api/sos-recordings` endpoint (see IMPLEMENTATION_GUIDE.md)

#### Troubleshooting
```
Error: Camera not accessible
→ Check browser permissions
→ Ensure HTTPS in production
→ Check getUserMedia support

Error: Video won't save
→ Check storage endpoint
→ Verify cloud credentials
→ Check file permissions
```

### Report Export Setup

#### Step 1: Database Connection
Test connection:
```bash
# PostgreSQL
psql $DATABASE_URL -c "SELECT 1"

# Supabase
curl -s $SUPABASE_URL/rest/v1/ \
  -H "Authorization: Bearer $SUPABASE_ANON_KEY"
```

#### Step 2: Create Report Endpoints
```typescript
// /app/api/reports/[type]/route.ts
export async function GET(req) {
  const { startDate, endDate } = req.nextUrl.searchParams
  // Query database
  // Return formatted data
}
```

#### Step 3: Test Export
- Go to Analytics page
- Select date range
- Click export button
- File should download

#### Troubleshooting
```
Error: No data in report
→ Check database connection
→ Verify date range
→ Check query parameters

Error: Export button disabled
→ Check API endpoints exist
→ Verify data fetching
→ Check browser console
```

---

## API Endpoints Reference

### Chatbot
```
POST /api/chat
Headers: Content-Type: application/json
Body: {
  messages: [{role: "user", content: "..."}],
  language: "en"
}
Response: Server-Sent Events stream
```

### SOS Recording
```
POST /api/sos-recordings - Save recording
GET /api/sos-recordings - List recordings
GET /api/sos-recordings/:id/download - Download
DELETE /api/sos-recordings/:id - Delete
```

### Reports
```
GET /api/reports/summary - Traffic stats
GET /api/reports/incidents - Incident data
GET /api/reports/analytics - Analytics data
GET /api/reports/:id - Download report
```

---

## Environment Variables Complete List

### Required
```env
# At least one AI service
OPENAI_API_KEY=sk-...
OR use Vercel AI Gateway (default)
```

### Recommended
```env
# Database
DATABASE_URL=postgresql://...

# Storage
AWS_S3_BUCKET=bucket-name
AWS_ACCESS_KEY_ID=...
AWS_SECRET_ACCESS_KEY=...

# API
NEXT_PUBLIC_API_URL=https://yoursite.com
```

### Optional
```env
# Monitoring
SENTRY_DSN=...

# Analytics
NEXT_PUBLIC_GA_ID=...

# Feature Flags
FEATURE_CHATBOT=true
FEATURE_SOS=true
FEATURE_EXPORT=true
```

---

## Common Issues & Solutions

### Issue: Chatbot returns empty responses
**Solution:**
- Check OPENAI_API_KEY is set
- Verify model name (should be gpt-4o-mini)
- Check API rate limits
- Restart dev server: `npm run dev`

### Issue: Camera permission denied
**Solution:**
- Ensure using HTTPS (or localhost)
- Check browser privacy settings
- Try different browser
- Clear browser cache
- Restart browser

### Issue: Export button does nothing
**Solution:**
- Check /api/reports endpoints exist
- Check browser console for errors
- Verify database connection
- Test endpoints manually with curl

### Issue: Videos not saving
**Solution:**
- Check storage bucket exists
- Verify cloud credentials
- Check file upload size limits
- Review server logs

---

## Verification Checklist

### Development Environment
- [ ] Node.js 18+ installed
- [ ] npm/pnpm/yarn installed
- [ ] `.env.local` created
- [ ] Dependencies installed (`npm install`)
- [ ] Dev server running (`npm run dev`)

### Chatbot
- [ ] API route exists: `/app/api/chat/route.ts`
- [ ] AI key configured
- [ ] Endpoint responds to requests
- [ ] Streaming works
- [ ] Multiple languages work

### SOS Recording
- [ ] Camera permissions working
- [ ] Recording starts and stops
- [ ] Timer shows 0-10 seconds
- [ ] Video downloads correctly
- [ ] Files can be deleted

### Report Export
- [ ] All endpoints respond
- [ ] Date range selector works
- [ ] All formats download
- [ ] Files open correctly
- [ ] Data displays

### Production Ready
- [ ] All tests passing
- [ ] No console errors
- [ ] Performance acceptable
- [ ] Security configured
- [ ] Monitoring in place

---

## Support Commands

### Clear Cache
```bash
npm run build
npm run dev
```

### Check API
```bash
# Test chatbot
curl http://localhost:3000/api/chat

# Test SOS endpoint
curl -X GET http://localhost:3000/api/sos-recordings

# Test reports
curl http://localhost:3000/api/reports/summary
```

### View Logs
```bash
# Development
npm run dev  # Shows terminal output

# Production (Vercel)
vercel logs
```

### Reset Environment
```bash
# Clear node modules
rm -rf node_modules
npm install

# Clear cache
rm -rf .next
npm run build

# Restart
npm run dev
```

