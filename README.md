# Traffic Signal Detection System - Frontend

A modern, responsive web application for real-time traffic signal monitoring and vehicle detection using AI/ML. Built with Next.js 16, React 19, TypeScript, and Tailwind CSS.

## Overview

This frontend provides a comprehensive dashboard for:
- **Real-time Vehicle Detection**: Monitor vehicle types and counts in real-time
- **Traffic Signal Management**: View and manage traffic signal states
- **Incident Reporting**: Create and track traffic incidents
- **Analytics & Reports**: Historical data analysis and performance metrics

## Screenshots & Features

### Dashboard
- Real-time statistics (total vehicles, incidents, system uptime)
- Interactive charts for vehicle trends
- Recent detection feed
- System status monitoring

### Vehicle Detection
- Live camera feed with bounding boxes
- Confidence scores for each detection
- Adjustable detection settings
- Performance metrics (FPS, average confidence)

### Incident Management
- Create incident reports
- Track incident status (open, in-progress, resolved)
- Severity levels (critical, high, medium, low)
- Real-time incident list

### Analytics
- Hourly traffic patterns
- Vehicle type distribution
- Intersection performance comparison
- System uptime and efficiency metrics
- Export reports (PDF, CSV, JSON)

## Tech Stack

- **Framework**: Next.js 16
- **Language**: TypeScript 5
- **UI Library**: React 19
- **Styling**: Tailwind CSS 4
- **Components**: Shadcn/ui
- **Charts**: Recharts
- **HTTP Client**: Built-in Fetch API
- **Data Fetching**: SWR
- **Icons**: Lucide React

## Quick Start

### Prerequisites
- Node.js 18+
- pnpm (recommended) or npm

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd traffic-signal-detection

# Install dependencies
pnpm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your backend URLs

# Start development server
pnpm dev

# Open http://localhost:3000
```

## Project Structure

```
├── app/                          # Next.js App Router
│   ├── page.tsx                 # Main application entry
│   ├── layout.tsx               # Root layout
│   └── globals.css              # Global styles & design tokens
├── components/
│   ├── layout/                  # Navigation components
│   │   ├── main-nav.tsx         # Top navigation
│   │   └── sidebar.tsx          # Sidebar menu
│   ├── dashboard/               # Dashboard components
│   ├── traffic/                 # Detection components
│   ├── incidents/               # Incident management
│   ├── analytics/               # Analytics pages
│   └── ui/                      # Shadcn/ui components
├── lib/
│   ├── api-service.ts           # API client
│   └── utils.ts                 # Utility functions
├── hooks/
│   └── useApi.ts                # Custom API hooks
├── types/
│   └── api.ts                   # TypeScript definitions
└── public/                      # Static assets
```

## Environment Setup

Create a `.env.local` file with the following:

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000/api
NEXT_PUBLIC_WS_URL=ws://localhost:8000/api/ws
```

See `.env.example` for all available configuration options.

## Backend Integration

This frontend is designed to work with the Antigravity backend. See `BACKEND_INTEGRATION.md` for:
- API endpoint specifications
- Expected request/response formats
- Integration examples
- Real-time WebSocket setup

## Usage

### Using API Hooks

```typescript
import { 
  useDashboardStats, 
  useIncidents, 
  useLiveDetections 
} from '@/hooks/useApi'

export function Dashboard() {
  const { data: stats, isLoading } = useDashboardStats()
  const { data: incidents } = useIncidents()
  const { data: detections } = useLiveDetections()

  if (isLoading) return <div>Loading...</div>

  return (
    <div>
      <p>Total Vehicles: {stats?.data?.totalVehicles}</p>
      <p>Active Incidents: {incidents?.data?.length}</p>
    </div>
  )
}
```

### Making API Calls

```typescript
import { incidentAPI } from '@/lib/api-service'

async function reportIncident() {
  const incident = await incidentAPI.create({
    type: 'Signal Malfunction',
    severity: 'critical',
    description: 'Red light stuck',
    intersectionId: 'int_001'
  })
  console.log('Incident created:', incident)
}
```

## Key Components

### MainNav
Top navigation bar with notifications and user menu

### Sidebar
Main navigation menu for page switching

### Dashboard
Real-time stats and trending charts

### TrafficDetection
Live video feed with vehicle detection overlays

### IncidentReporting
Create and manage traffic incidents

### AnalyticsPage
Historical data analysis and reporting

## Customization

### Changing Theme Colors
Edit design tokens in `app/globals.css`:

```css
:root {
  --primary: 240 6% 20%;      /* Dark Navy */
  --secondary: 200 100% 50%;  /* Bright Cyan */
  --accent: 10 100% 58%;      /* Vibrant Orange */
}
```

### Adding New Pages
1. Create component in `/components`
2. Add menu item to sidebar
3. Handle routing in main page

### Customizing Charts
All charts use Recharts. Examples are in each component.

## Performance

- **Lazy Loading**: Components are code-split automatically
- **Image Optimization**: Next.js Image component used where applicable
- **API Caching**: SWR provides intelligent caching
- **Real-time Updates**: WebSocket for low-latency data

## Deployment

### Deploy to Vercel
```bash
vercel deploy
```

### Deploy to Other Platforms
```bash
npm run build
npm start
```

### Production Environment Variables
Set these in your hosting platform:
- `NEXT_PUBLIC_API_BASE_URL` - Your production backend URL
- `NEXT_PUBLIC_WS_URL` - Your production WebSocket URL

## Development

### Build for Production
```bash
pnpm build
pnpm start
```

### Lint Code
```bash
pnpm lint
```

### Format Code
```bash
pnpm format
```

## API Documentation

See `BACKEND_INTEGRATION.md` for complete API specifications including:
- Dashboard endpoints
- Detection endpoints
- Incident management
- Analytics queries
- Real-time WebSocket protocol

## Type Definitions

All TypeScript types are defined in `/types/api.ts`:
- `VehicleDetection`
- `TrafficSignal`
- `Incident`
- `HourlyTrafficData`
- And more...

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

MIT License - See LICENSE file for details

## Support

For issues, questions, or suggestions:

1. Check `SETUP_GUIDE.md` for setup help
2. Review `BACKEND_INTEGRATION.md` for API issues
3. Check browser console for error messages
4. Review Network tab in DevTools for API problems

## Version History

### v1.0.0 (Current)
- Initial release
- Full dashboard with real-time stats
- Vehicle detection interface
- Incident management
- Analytics and reporting

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## Roadmap

- [ ] Mobile app support
- [ ] Advanced filtering and search
- [ ] Custom report generation
- [ ] User authentication
- [ ] Role-based access control
- [ ] System notifications
- [ ] API rate limiting

## Acknowledgments

Built with:
- [Next.js](https://nextjs.org/)
- [React](https://react.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Shadcn/ui](https://ui.shadcn.com/)
- [Recharts](https://recharts.org/)

## Related Documentation

- [Setup Guide](./SETUP_GUIDE.md) - Installation and configuration
- [Backend Integration](./BACKEND_INTEGRATION.md) - API specifications
- [API Service](./lib/api-service.ts) - API client implementation
- [API Hooks](./hooks/useApi.ts) - React hooks for API usage

---

**Last Updated**: January 2024  
**Maintained by**: AI Assistant (v0)  
**Status**: Active Development
