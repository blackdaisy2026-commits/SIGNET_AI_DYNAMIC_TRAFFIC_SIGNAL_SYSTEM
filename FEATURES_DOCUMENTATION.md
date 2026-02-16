# New Features Documentation

## Overview
Three major features have been added to the Traffic Signal Detection System:

1. **Multilingual Emergency Chatbot** - AI-powered emergency support with voice
2. **SOS Emergency Recording Module** - 10-second video recording capability
3. **Report Export Functionality** - Download reports in multiple formats

---

## 1. Multilingual Emergency Chatbot

### Location
- **Component**: `/components/emergency/emergency-chatbot.tsx`
- **API Route**: `/app/api/chat/route.ts`

### Features
- 6 languages supported: English, Spanish, French, German, Japanese, Chinese
- Real-time text chat with AI responses
- Voice recognition (speech-to-text)
- Text-to-speech audio responses
- 24/7 emergency support
- Professional UI with status indicators

### Supported Languages
| Code | Language | Locale |
|------|----------|--------|
| en | English | en-US |
| es | Spanish | es-ES |
| fr | French | fr-FR |
| de | German | de-DE |
| ja | Japanese | ja-JP |
| zh | Chinese | zh-CN |

### User Interface
- **Floating Button**: Phone icon in bottom-right corner (bottom-8 right-8)
- **Chat Window**: 384px width, 600px height
- **Header**: Shows "Emergency Support" with status
- **Language Selector**: Quick language switching tabs
- **Input Area**: Text input + Send button
- **Voice Controls**: Mic button for speech recognition

### Usage
```tsx
import { EmergencyChatbot } from '@/components/emergency/emergency-chatbot'

export default function Page() {
  return (
    <>
      <EmergencyChatbot />
    </>
  )
}
```

### API Integration
The chatbot connects to `/api/chat` endpoint which uses OpenAI's GPT-4o-mini model via Vercel AI Gateway.

**Request Format:**
```json
{
  "messages": [
    { "role": "user", "content": "..." },
    { "role": "assistant", "content": "..." }
  ],
  "language": "en"
}
```

### Voice Features
- **Speech Recognition**: Uses Web Speech API
- **Speech Synthesis**: Browser's built-in SpeechSynthesis API
- **Auto-detection**: Language-aware voice parameters
- **Controls**: Start/Stop listening buttons
- **Status**: Real-time feedback (Listening, Speaking)

### AI System Prompt
The chatbot system prompt includes:
- Emergency incident assistance
- Clear, concise instructions
- Emergency service contact information
- Empathetic and professional tone
- Multilingual support

---

## 2. SOS Emergency Recording Module

### Location
- **Component**: `/components/emergency/sos-button.tsx`

### Features
- Big red SOS button (animated, pulsing effect)
- Camera access with video preview
- Automatic 10-second recording
- Local video file storage
- Download recording capability
- Recording management (delete, view)

### User Interface
- **SOS Button**: Fixed position, bottom-24 right-8
- **Modal**: Full emergency recording interface
- **Camera Feed**: Real-time video preview
- **Recording Indicator**: Shows current time / 10s
- **Controls**: Start/Stop recording buttons
- **Recordings List**: All saved recordings with timestamps

### Technical Specifications
- **Video Format**: WebM (VP8/VP9 codec)
- **Audio**: Included (if microphone available)
- **Duration**: Fixed 10 seconds
- **Camera**: Rear-facing (environment) preferred
- **Storage**: Browser memory (Blob objects)

### Usage
```tsx
import { SOSButton } from '@/components/emergency/sos-button'

export default function Page() {
  return (
    <>
      <SOSButton />
    </>
  )
}
```

### Recording Process
1. User clicks SOS button (red, animated)
2. Modal opens with camera feed
3. User clicks "Start Recording"
4. Camera feed displays with timer
5. Recording auto-stops at 10 seconds
6. Video saved to recordings list
7. User can download or delete recording

### Recording Data Structure
```typescript
interface SOSRecording {
  id: string              // Unique identifier
  timestamp: Date         // Recording time
  videoBlob?: Blob        // Video file
  duration: number        // Seconds (0-10)
  location?: string       // Location info
}
```

### Permissions Required
- Camera access (getUserMedia)
- Audio access (for video audio track)
- Browser permissions prompt will appear on first use

### Browser Compatibility
- Chrome/Chromium: Full support
- Firefox: Full support
- Safari: iOS 14.5+ (may have limitations)
- Edge: Full support

---

## 3. Report Export Functionality

### Location
- **Component**: `/components/reports/export-reports.tsx`
- **Integrated in**: `/components/analytics/analytics-page.tsx`

### Features
- Export in 3 formats: PDF, CSV, JSON
- Date range selection
- Multiple report types
- Quick export shortcuts
- Download with timestamp
- Browser-based generation

### Supported Export Formats

#### PDF
- Formatted document layout
- Professional appearance
- Best for: Printing, sharing with stakeholders
- Generated using text-based PDF format

#### CSV
- Spreadsheet-compatible format
- Data easily analyzable
- Best for: Excel, data analysis tools
- Compatible with most data tools

#### JSON
- Raw data format
- Structured data with metadata
- Best for: API integration, data processing
- Includes export date and date range

### Report Types Available
1. **Traffic Summary Report**
   - Total vehicles detected
   - Average speed metrics
   - Traffic density
   - Incident count
   - Detection accuracy

2. **Incident Report**
   - Incident type (Accident, Congestion, etc.)
   - Location and timestamp
   - Severity levels
   - Detailed logs

3. **Vehicle Detection Analytics**
   - Vehicle type breakdown (cars, trucks, bikes)
   - Hourly trends
   - Movement patterns
   - Peak hours analysis

### User Interface
- **Date Range Selector**: Start and end date inputs
- **Available Reports**: List of all reports
- **Format Selection**: PDF/CSV/JSON buttons
- **Export Button**: Large, prominent download button
- **Quick Exports**: Shortcuts (Today, Weekly, Monthly)
- **Format Info**: Help text for each format

### Usage
```tsx
import { ExportReports } from '@/components/reports/export-reports'

export default function AnalyticsPage() {
  return (
    <div>
      <ExportReports />
    </div>
  )
}
```

### Integration
The ExportReports component is integrated at the bottom of the Analytics & Reports page.

### File Naming Convention
```
traffic-report-{timestamp}.{format}
Example: traffic-report-1707345600000.pdf
```

### Data Included in Exports
- Export date/time
- Selected date range
- All report data with metrics
- Formatted headers and summaries

### Backend Integration Notes
Currently using mock data. To connect to real backend:

1. Replace `mockReportData` with API calls
2. Update date range filtering on backend
3. Stream large datasets for performance

```typescript
// Replace this:
const mockReportData: ReportData[] = [...]

// With this:
const { data } = useSWR(
  `/api/reports?startDate=${startDate}&endDate=${endDate}`,
  fetcher
)
```

---

## Integration Points

### In Main Page
All three features are automatically available in the main dashboard:

```tsx
import { EmergencyChatbot } from '@/components/emergency/emergency-chatbot'
import { SOSButton } from '@/components/emergency/sos-button'

export default function Page() {
  return (
    <>
      {/* Your main layout */}
      <EmergencyChatbot />
      <SOSButton />
    </>
  )
}
```

### In Analytics Page
Export reports are integrated:

```tsx
import { ExportReports } from '@/components/reports/export-reports'

export function AnalyticsPage() {
  return (
    <div>
      {/* Analytics content */}
      <ExportReports />
    </div>
  )
}
```

---

## Dependencies

### New AI SDK Integration
- Package: `@ai-sdk/react`
- Uses Vercel AI Gateway
- Model: `openai/gpt-4o-mini`

### Browser APIs Used
- **Speech Recognition**: `SpeechRecognition` (Web Speech API)
- **Speech Synthesis**: `SpeechSynthesis` (Web Speech API)
- **Media Recorder**: `MediaRecorder` API
- **Camera Access**: `getUserMedia` (Media Devices API)

### Styling
- All components use Tailwind CSS
- Consistent with existing design system
- Color scheme: Navy, Cyan, Orange
- Responsive design

---

## Customization Guide

### Chatbot Languages
Edit `/app/api/chat/route.ts` to modify system prompts:

```typescript
const prompts: Record<string, string> = {
  en: 'Your custom English prompt...',
  es: 'Your custom Spanish prompt...',
  // Add more languages
}
```

### SOS Recording Duration
Edit `/components/emergency/sos-button.tsx`:

```typescript
if (prev >= 10) {  // Change 10 to desired seconds
  stopRecording()
}
```

### Export Formats
To add new export formats, edit `/components/reports/export-reports.tsx`:

```typescript
const handleExport = () => {
  if (selectedFormat === 'xlsx') {
    exportToXLSX(mockReportData)
  }
}
```

---

## Security Considerations

1. **Chatbot**: 
   - No personal data stored in chat
   - System prompt doesn't reveal backend details
   - Rate limiting recommended on backend

2. **SOS Recording**:
   - Videos stored locally (browser memory)
   - Not automatically uploaded
   - Manual download to persist
   - Clear after browser close (unless downloaded)

3. **Report Export**:
   - Mock data only (no real data leaks)
   - Date range filtering on frontend
   - Backend should validate permissions

---

## Future Enhancements

1. **Chatbot**:
   - Add sentiment analysis
   - Implement chat history persistence
   - Add emergency escalation workflow
   - Support for local language models

2. **SOS Recording**:
   - Cloud upload integration
   - Incident auto-tagging
   - GPS location embedding
   - Multiple device storage

3. **Report Export**:
   - Advanced filters (location, incident type)
   - Scheduled auto-export
   - Email delivery
   - Real-time report generation

---

## Troubleshooting

### Chatbot Not Responding
- Check API key is set
- Verify `/api/chat` route exists
- Check browser console for errors
- Test with mock data first

### Camera Not Accessing
- Check browser camera permissions
- Ensure HTTPS in production
- Test camera in browser settings
- Try different camera device

### Export Not Downloading
- Check browser download settings
- Ensure pop-ups not blocked
- Check file size (may be large for JSON)
- Try different format

---

## Support & Maintenance

For issues or questions:
1. Check error messages in browser console
2. Review API responses
3. Test in different browser
4. Check backend connectivity

