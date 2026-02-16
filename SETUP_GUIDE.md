# Traffic Signal Detection System - Frontend Setup Guide

## Quick Start

This is a fully functional Next.js 16 frontend for the Traffic Signal Detection System built with React, TypeScript, and Tailwind CSS.

### Prerequisites
- Node.js 18+ 
- pnpm (or npm)

### Installation

1. **Clone or Download the Project**
   ```bash
   # If using GitHub
   git clone <repository-url>
   cd traffic-signal-detection
   
   # Or use the v0 CLI to download
   shadcn-cli <project-name>
   ```

2. **Install Dependencies**
   ```bash
   pnpm install
   # or
   npm install
   ```

3. **Set Up Environment Variables**
   ```bash
   # Copy the example env file
   cp .env.example .env.local
   
   # Edit with your backend URLs
   nano .env.local
   ```

   Required environment variables:
   ```env
   # Backend API Configuration
   NEXT_PUBLIC_API_BASE_URL=http://localhost:8000/api
   NEXT_PUBLIC_WS_URL=ws://localhost:8000/api/ws
   ```

4. **Start Development Server**
   ```bash
   pnpm dev
   # or
   npm run dev
   ```

5. **Open in Browser**
   ```
   http://localhost:3000
   ```

## Project Structure

```
traffic-signal-detection/
├── app/
│   ├── page.tsx              # Main entry point
│   ├── layout.tsx            # Root layout with metadata
│   └── globals.css           # Global styles and design tokens
├── components/
│   ├── layout/
│   │   ├── main-nav.tsx      # Top navigation bar
│   │   └── sidebar.tsx       # Left sidebar navigation
│   ├── dashboard/
│   │   └── dashboard.tsx     # Main dashboard with stats & charts
│   ├── traffic/
│   │   └── traffic-detection.tsx  # Live video detection feed
│   ├── incidents/
│   │   └── incident-reporting.tsx # Incident management
│   ├── analytics/
│   │   └── analytics-page.tsx     # Analytics and reports
│   └── ui/                   # Shadcn/ui components (auto-generated)
├── lib/
│   ├── api-service.ts        # API client and endpoints
│   ├── utils.ts              # Utility functions
├── hooks/
│   ├── useApi.ts             # Custom hooks for API calls
│   └── use-mobile.tsx        # Mobile detection hook
├── types/
│   └── api.ts                # TypeScript API types
├── public/                   # Static assets
├── tailwind.config.ts        # Tailwind CSS configuration
├── tsconfig.json             # TypeScript configuration
├── next.config.mjs           # Next.js configuration
├── package.json              # Dependencies
├── BACKEND_INTEGRATION.md    # Backend API documentation
└── SETUP_GUIDE.md           # This file
```

## Features

### Dashboard Page
- Real-time statistics (total vehicles, incidents, uptime, efficiency)
- Interactive charts showing vehicle trends
- Vehicle type distribution
- Recent detection feed

### Traffic Detection Page
- Live camera feed simulation with bounding boxes
- Detection settings (confidence threshold, model selection)
- Detection statistics (FPS, confidence, count)
- Play/pause/reset/export controls

### Incident Management
- Create and report incidents
- Severity levels (critical, high, medium, low)
- Status tracking (open, in-progress, resolved)
- Real-time incident list with filtering

### Analytics & Reports
- Hourly traffic patterns
- Vehicle distribution charts
- Intersection performance metrics
- System uptime and efficiency tracking
- Export functionality (PDF, CSV, JSON)

## Design System

### Color Palette
- **Primary**: Deep Navy (#1a1f3a)
- **Secondary**: Bright Cyan (#0099ff)
- **Accent**: Vibrant Orange (#ff6b35)
- **Background**: Very Dark Navy (#0f1117)
- **Muted**: Gray (#4a5568)

### Typography
- **Fonts**: Geist (sans-serif), Geist Mono (monospace)
- **Sizes**: 12px - 32px based on hierarchy

### Components
- Uses Shadcn/ui for consistent UI components
- Custom styling with Tailwind CSS
- Dark theme by default

## Backend Integration

### Environment Setup
1. Update `NEXT_PUBLIC_API_BASE_URL` in `.env.local`
2. Ensure your backend is running on the specified URL
3. Backend should implement the API endpoints specified in `BACKEND_INTEGRATION.md`

### API Services
See `/lib/api-service.ts` for implemented API calls:
- Dashboard stats and trends
- Live vehicle detections
- Incident CRUD operations
- Analytics queries
- Traffic signal control
- System health checks

### Using API Hooks
```typescript
import { 
  useDashboardStats, 
  useIncidents, 
  useLiveDetections 
} from '@/hooks/useApi'

function MyComponent() {
  const { data: stats, isLoading } = useDashboardStats()
  const { data: incidents } = useIncidents()
  
  return (
    <div>
      {/* Use data here */}
    </div>
  )
}
```

### Real-time WebSocket Updates
```typescript
import { useWebSocket } from '@/hooks/useApi'

function Detection() {
  const { isConnected } = useWebSocket(
    (detection) => console.log('New detection:', detection),
    (error) => console.error('Connection error:', error)
  )
  
  return <div>{isConnected ? 'Live' : 'Disconnected'}</div>
}
```

## Development

### Running Tests
```bash
npm run test
```

### Building for Production
```bash
npm run build
npm start
```

### Code Quality
```bash
# Run linting
npm run lint

# Format code
npm run format
```

## Customization

### Adding New Pages
1. Create a new component in `/components`
2. Add the page option to the sidebar in `/components/layout/sidebar.tsx`
3. Handle routing in `/app/page.tsx`

### Changing Colors
Edit the design tokens in `/app/globals.css`:
```css
:root {
  --primary: 240 6% 20%;
  --secondary: 200 100% 50%;
  --accent: 10 100% 58%;
  /* ... */
}
```

### Adding Charts
Use Recharts components from the existing examples:
```typescript
import { LineChart, Line, ResponsiveContainer } from 'recharts'

<ResponsiveContainer width="100%" height={300}>
  <LineChart data={data}>
    <Line dataKey="value" stroke="hsl(200, 100%, 50%)" />
  </LineChart>
</ResponsiveContainer>
```

## Deployment

### Deploy to Vercel
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Deploy to Other Platforms
1. Build: `npm run build`
2. Start: `npm start`
3. Ensure environment variables are set in your hosting platform

### Environment Variables for Production
Set these in your hosting platform's environment configuration:
```
NEXT_PUBLIC_API_BASE_URL=https://your-production-backend.com/api
NEXT_PUBLIC_WS_URL=wss://your-production-backend.com/api/ws
```

## Troubleshooting

### API Connection Issues
1. Check if backend is running on the specified URL
2. Verify CORS is enabled on backend
3. Check browser console for error messages
4. Ensure environment variables are correctly set

### WebSocket Connection Fails
1. WebSocket URL should use `ws://` or `wss://` (for HTTPS)
2. Verify backend supports WebSocket connections
3. Check firewall/proxy settings

### Charts Not Displaying
1. Ensure data is being fetched correctly
2. Check Recharts version compatibility
3. Verify responsive container has proper dimensions

### Styling Issues
1. Clear Next.js cache: `rm -rf .next`
2. Rebuild: `npm run build`
3. Check Tailwind config is applied

## Performance Optimization

### Recommended Optimizations
1. **Lazy Loading**: Implement code splitting for large components
2. **Image Optimization**: Use Next.js Image component
3. **Caching**: SWR is configured for intelligent caching
4. **Database Queries**: Implement pagination for incident lists
5. **Real-time Updates**: Use WebSocket instead of polling for live data

### Monitoring
- Use Next.js Analytics to monitor performance
- Check Core Web Vitals in browser DevTools
- Monitor API response times

## Security Considerations

1. **API Keys**: Never commit API keys, use environment variables
2. **CORS**: Configure CORS properly on backend
3. **Authentication**: Add authentication layer if needed
4. **Rate Limiting**: Implement rate limiting on backend
5. **Data Validation**: Validate all user inputs
6. **HTTPS**: Always use HTTPS in production

## Support & Documentation

### Useful Resources
- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Shadcn/ui Documentation](https://ui.shadcn.com)
- [TypeScript Documentation](https://www.typescriptlang.org/docs)

### Backend Integration Documentation
See `BACKEND_INTEGRATION.md` for complete API specifications and integration guide.

### Getting Help
1. Check the documentation files in the project
2. Review the example components for patterns
3. Check browser console for error messages
4. Review Network tab in DevTools for API issues

## Version Information

- **Frontend Version**: 1.0.0
- **Next.js**: 16.x
- **React**: 19.x
- **TypeScript**: 5.x
- **Tailwind CSS**: 4.x
- **Shadcn/ui**: Latest

## Next Steps

1. Set up environment variables for your backend
2. Test API connectivity
3. Customize colors and branding as needed
4. Deploy to your hosting platform
5. Set up monitoring and analytics

---

**Last Updated**: January 2024
**License**: MIT
**Author**: v0 AI Assistant
