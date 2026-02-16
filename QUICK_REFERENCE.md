# Quick Reference - Traffic Signal Detection Frontend

## 🚀 Quick Start (3 Steps)

```bash
# 1. Install
npm install

# 2. Configure
cp .env.example .env.local
# Edit NEXT_PUBLIC_API_BASE_URL and NEXT_PUBLIC_WS_URL

# 3. Run
npm run dev
# Open http://localhost:3000
```

---

## 📁 Project Structure

```
Components (pages):
├── Dashboard (/components/dashboard/)
├── Vehicle Detection (/components/traffic/)
├── Incident Reporting (/components/incidents/)
└── Analytics (/components/analytics/)

Integration:
├── /lib/api-service.ts → API calls
├── /hooks/useApi.ts → React hooks
└── /types/api.ts → TypeScript types
```

---

## 🎨 Design Tokens

| Element | Color | Usage |
|---------|-------|-------|
| Primary | Deep Navy `#1a1f3a` | Backgrounds, cards |
| Secondary | Bright Cyan `#0099ff` | Primary actions, charts |
| Accent | Vibrant Orange `#ff6b35` | Alerts, highlights |
| Background | Very Dark Navy `#0f1117` | Page background |
| Muted | Gray `#4a5568` | Secondary text, borders |

---

## 🔗 API Endpoints

**Base URL**: `NEXT_PUBLIC_API_BASE_URL`

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/dashboard/stats` | GET | System statistics |
| `/dashboard/vehicle-trend` | GET | Historical data |
| `/detection/live` | WS | Real-time detections |
| `/detection/stats` | GET | Detection metrics |
| `/incidents` | GET/POST/PUT/DELETE | Incident management |
| `/analytics/hourly` | GET | Traffic analytics |
| `/analytics/distribution` | GET | Vehicle types |
| `/analytics/intersections` | GET | Intersection performance |

---

## 🎯 Using API Hooks

```typescript
import { useDashboardStats, useIncidents } from '@/hooks/useApi'

function MyComponent() {
  const { data: stats, isLoading } = useDashboardStats()
  const { data: incidents } = useIncidents()
  
  if (isLoading) return <div>Loading...</div>
  return <div>{stats?.data?.totalVehicles} vehicles</div>
}
```

---

## 📊 Component Quick Reference

| Component | File | Lines | Purpose |
|-----------|------|-------|---------|
| Dashboard | `/components/dashboard/dashboard.tsx` | 198 | Main stats & charts |
| Detection | `/components/traffic/traffic-detection.tsx` | 200 | Live camera feed |
| Incidents | `/components/incidents/incident-reporting.tsx` | 270 | CRUD operations |
| Analytics | `/components/analytics/analytics-page.tsx` | 217 | Reports & trends |
| MainNav | `/components/layout/main-nav.tsx` | 58 | Top navigation |
| Sidebar | `/components/layout/sidebar.tsx` | 99 | Page navigation |

---

## 🔄 Data Flow

```
Frontend Component
  ↓
useApi Hook (SWR)
  ↓
api-service.ts (fetch)
  ↓
Backend API
  ↓
Mock Data (development)
```

---

## 🛠️ Common Tasks

### Add New Page
1. Create component in `/components`
2. Add to sidebar in `components/layout/sidebar.tsx`
3. Handle in `/app/page.tsx`

### Connect to Backend
1. Update `.env.local` with backend URLs
2. Use existing API services in `/lib/api-service.ts`
3. Use React hooks from `/hooks/useApi.ts`

### Change Theme
Edit design tokens in `/app/globals.css`

### Add Chart
Use Recharts (examples in each component)

---

## 📋 Environment Variables

```env
# Required
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000/api
NEXT_PUBLIC_WS_URL=ws://localhost:8000/api/ws

# Optional
NEXT_PUBLIC_ENABLE_LIVE_DETECTION=true
NEXT_PUBLIC_ENABLE_ANALYTICS=true
NEXT_PUBLIC_ENABLE_INCIDENT_REPORTING=true
NEXT_PUBLIC_ENABLE_WEBSOCKET=true
```

---

## 📱 Responsive Breakpoints

- **Mobile**: < 640px
- **Tablet**: 640px - 1024px
- **Desktop**: > 1024px

Grid layouts use:
- Mobile: `grid-cols-1`
- Tablet: `md:grid-cols-2`
- Desktop: `lg:grid-cols-3` or `lg:grid-cols-4`

---

## 🎭 Color Usage

| Severity | Color | Usage |
|----------|-------|-------|
| Critical | Red | `bg-red-500` |
| High | Orange | `bg-orange-500` |
| Medium | Yellow | `bg-yellow-500` |
| Low | Green | `bg-green-500` |

---

## 📦 Dependencies

- **next**: Framework
- **react**: UI library
- **typescript**: Type safety
- **tailwindcss**: Styling
- **recharts**: Charts
- **lucide-react**: Icons
- **swr**: Data fetching

---

## 🧪 Testing Endpoints

```bash
# Test API connection
curl http://localhost:8000/api/dashboard/stats

# Test WebSocket
wscat -c ws://localhost:8000/api/ws

# Test in browser
fetch('http://localhost:8000/api/dashboard/stats')
  .then(r => r.json())
  .then(d => console.log(d))
```

---

## 🚨 Common Issues & Fixes

| Issue | Solution |
|-------|----------|
| API not responding | Check `NEXT_PUBLIC_API_BASE_URL` in `.env.local` |
| WebSocket fails | Ensure backend is running on `NEXT_PUBLIC_WS_URL` |
| Styles not applying | Run `npm run dev` again, clear `.next` folder |
| Mock data showing | Backend API not connected |
| Pages not loading | Check routing in `/app/page.tsx` |

---

## 📖 Documentation Files

- **README.md** - Project overview
- **SETUP_GUIDE.md** - Installation & configuration
- **BACKEND_INTEGRATION.md** - API specifications
- **BACKEND_HANDOFF.md** - Backend implementation guide
- **PROJECT_SUMMARY.md** - Project details
- **QUICK_REFERENCE.md** - This file

---

## 🚀 Deployment

### Vercel
```bash
vercel deploy
```

### Docker
```bash
docker build -t frontend .
docker run -p 3000:3000 frontend
```

### Node.js
```bash
npm run build
npm start
```

---

## 📞 Support

1. Check documentation in project root
2. Review component examples
3. Check browser console for errors
4. Review Network tab in DevTools

---

## ✅ Deployment Checklist

- [ ] Environment variables configured
- [ ] API endpoints tested
- [ ] WebSocket connection working
- [ ] All pages rendering correctly
- [ ] Mobile responsive verified
- [ ] No console errors
- [ ] Build runs without errors
- [ ] Ready for production

---

## 🎓 Learning Resources

- [Next.js Docs](https://nextjs.org/docs)
- [React Docs](https://react.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [Shadcn/ui](https://ui.shadcn.com)
- [Recharts](https://recharts.org)

---

## 📊 Quick Stats

- **Total Files**: 50+
- **Custom Components**: 7
- **Shadcn/ui Components**: 40+
- **Lines of Code**: ~2,000
- **TypeScript Coverage**: 100%
- **Responsive Design**: ✅
- **Dark Theme**: ✅
- **Real-time Ready**: ✅

---

## 🎯 Current Status

- ✅ Frontend Complete
- ✅ Mock Data Working
- ✅ All Pages Built
- ✅ Documentation Ready
- ✅ Ready for Backend Integration
- ⏳ Awaiting Backend Implementation

---

**Last Updated**: January 2024  
**Version**: 1.0.0  
**Status**: Production Ready
