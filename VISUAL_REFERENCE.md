# Visual Reference Guide

## Feature Locations & UI Layout

### Dashboard Layout

```
┌─────────────────────────────────────────────────────┐
│  Header Navigation (Logo, Menu, Notifications)     │
├──────────────┬──────────────────────────────────────┤
│              │                                      │
│   Sidebar    │     Main Content Area               │
│   (Menu)     │                                      │
│              │  ┌──────────────────────────────────┐│
│              │  │  Dashboard / Traffic / Incidents │┐
│              │  │  Incidents / Analytics           ││
│              │  └──────────────────────────────────┘│
│              │                                      │
│              │  ┌─ Emergency Features (Fixed) ────┐│
│              │  │                                  ││
│              │  │  [☎️] Chatbot                    ││
│              │  │  (bottom-right)                  ││
│              │  │                                  ││
│              │  │  [🔴 SOS] Emergency Recording   ││
│              │  │  (bottom-right)                  ││
│              │  │                                  ││
│              │  └──────────────────────────────────┘│
│              │                                      │
└──────────────┴──────────────────────────────────────┘
```

---

## Feature 1: Multilingual Chatbot

### Floating Button State
```
┌──────┐
│  ☎️  │  Phone Icon Button
│      │  Position: Fixed Bottom-Right
│      │  Color: Orange (Accent)
│      │  Size: 56px diameter
└──────┘
```

### Chat Window (Opened)
```
┌─────────────────────────────────────────┐
│ 🚨 Emergency Support        [X]         │  Header (Red)
├─────────────────────────────────────────┤
│ Language: [EN] [ES] [FR] [DE] [JA] [ZH] │  Language Selector
├─────────────────────────────────────────┤
│                                         │
│  Assistant: How can I help you?        │  Chat Messages
│                                         │
│  User: I need emergency help            │
│                                         │
│  Assistant: I'm here to assist...      │
│                                         │
├─────────────────────────────────────────┤
│ [Message Input...]        [Send ➤]      │  Input Area
├─────────────────────────────────────────┤
│ [🎤 Voice]  [❌ Stop (if recording)]    │  Voice Controls
└─────────────────────────────────────────┘

Dimensions: 384px width × 600px height
```

### Voice Feature States

**Listening State:**
```
┌──────────────────┐
│ 🎤 Listening...  │  Animated microphone
│ 🔴 Recording     │  Visual feedback
└──────────────────┘
```

**Speaking State:**
```
┌──────────────────┐
│ 🔊 Speaking...   │  Audio playing
│ ▓▓▓▓▓▓▓▓▓░░░░   │  Progress bar
└──────────────────┘
```

---

## Feature 2: SOS Emergency Recording

### SOS Button (Not Active)
```
┌────────────────┐
│ 🔴 SOS         │  Red button
│ PULSING        │  Animated pulse effect
└────────────────┘
Position: Fixed Bottom-24 Right-8
Visible from: All pages
```

### SOS Modal (Active Recording)
```
┌────────────────────────────────────────────┐
│ 🚨 Emergency Recording             [X]     │  Header (Red)
├────────────────────────────────────────────┤
│                                            │
│  Camera Feed:                              │
│  ┌──────────────────────────────────────┐ │
│  │                                      │ │
│  │  [📹 Video Preview]      🔴 05s/10s │ │
│  │                                      │ │
│  │                                      │ │
│  └──────────────────────────────────────┘ │
│                                            │
│  [📹 Start Recording] or [◻️ Stop]         │
│                                            │
│  Saved Recordings:                         │
│  ┌──────────────────────────────────────┐ │
│  │ 10:30 AM    Duration: 10s 📍Current │ │
│  │ [📥] [❌]                            │ │
│  │ 10:15 AM    Duration: 8s  📍Current │ │
│  │ [📥] [❌]                            │ │
│  └──────────────────────────────────────┘ │
│                                            │
│  ℹ️ Videos stored locally. Download to     │
│     persist. All videos cleared on close.  │
└────────────────────────────────────────────┘

Dimensions: Full-screen modal
```

### Recording Process Flow

```
1. User clicks [🔴 SOS]
   ↓
2. Modal opens + Camera access requested
   ↓
3. User grants permission (or denies)
   ↓
4. Camera feed displays in real-time
   ↓
5. User clicks [📹 Start Recording]
   ↓
6. Recording begins, timer shows 0-10s
   ↓
7. At 10s, automatically stops
   ↓
8. Video saved to recordings list
   ↓
9. User can download or delete
```

---

## Feature 3: Report Export

### Export Panel Location
```
Analytics & Reports Page
↓
[Charts and Analytics Data]
↓
[Key Performance Indicators]
↓
[Signal Efficiency Trends]
↓
[Intersection Performance]
↓
┌──────────────────────────────┐
│  📋 Export Reports           │  ← Export Component
│  ─────────────────────────   │
│  Download detailed reports   │
│  in your preferred format    │
└──────────────────────────────┘
```

### Export Component Layout
```
┌─────────────────────────────────────────────┐
│ 📋 Export Reports                           │
├─────────────────────────────────────────────┤
│                                             │
│ 📅 Date Range Selection:                    │
│ [Start Date: ________]  [End Date: ________]│
│                                             │
│ 📊 Available Reports:                       │
│ ☐ Traffic Summary Report                    │
│   Overall traffic statistics               │
│ ☐ Incident Report                          │
│   Detailed incident logs                   │
│ ☐ Vehicle Detection Analytics              │
│   Vehicle type and movement patterns       │
│                                             │
│ 🔽 Export Format:                          │
│ [PDF] [CSV] [JSON]                         │
│                                             │
│ Format Info:                                │
│ PDF: Professional formatted documents      │
│                                             │
│ [📥 Export as PDF]                         │
│                                             │
│ ⚡ Quick Export:                           │
│ [Today] [This Week] [This Month]           │
│                                             │
└─────────────────────────────────────────────┘
```

---

## Component File Tree

```
traffic-signal-system/
├── app/
│   ├── api/
│   │   └── chat/
│   │       └── route.ts              ← Chatbot API
│   ├── page.tsx                      ← Main page (updated)
│   └── layout.tsx
│
├── components/
│   ├── emergency/
│   │   ├── emergency-chatbot.tsx     ← Chatbot component
│   │   └── sos-button.tsx            ← SOS component
│   │
│   ├── reports/
│   │   └── export-reports.tsx        ← Export component
│   │
│   ├── dashboard/
│   │   └── dashboard.tsx
│   │
│   ├── analytics/
│   │   └── analytics-page.tsx        ← Contains export
│   │
│   ├── layout/
│   ├── traffic/
│   ├── incidents/
│   └── ui/
│
├── public/
│   └── uploads/                      ← SOS recordings (local)
│
└── docs/
    ├── FEATURES_DOCUMENTATION.md
    ├── IMPLEMENTATION_GUIDE.md
    ├── ENV_SETUP_GUIDE.md
    ├── NEW_FEATURES_SUMMARY.md
    └── FEATURES_INDEX.md
```

---

## Data Flow Diagrams

### Chatbot Data Flow
```
User Input (Text/Voice)
        ↓
[EmergencyChatbot Component]
        ↓
Language Selection
        ↓
POST /api/chat
(messages, language)
        ↓
[AI Service]
(OpenAI/Anthropic/etc)
        ↓
Server-Sent Events Stream
        ↓
[Display Response]
        ↓
Text-to-Speech Output (Optional)
        ↓
User hears audio response
```

### SOS Recording Data Flow
```
User clicks SOS
        ↓
[SOSButton Component]
        ↓
Request Camera Access
        ↓
User Grants Permission
        ↓
Camera Stream Activated
        ↓
User clicks "Start Recording"
        ↓
MediaRecorder captures video/audio
        ↓
Auto-stops at 10 seconds
        ↓
Video Blob Created
        ↓
Save to recordings array
        ↓
User can:
├─ Download (→ Browser Download)
├─ Delete (→ Remove from array)
└─ Upload (→ Backend endpoint)
```

### Export Data Flow
```
User selects date range
        ↓
Choose export format
        ↓
Click Export button
        ↓
Fetch report data:
├─ GET /api/reports/summary
├─ GET /api/reports/incidents
└─ GET /api/reports/analytics
        ↓
Format data:
├─ PDF: Create formatted document
├─ CSV: Convert to spreadsheet
└─ JSON: Structure as JSON
        ↓
Generate file
        ↓
Create download link
        ↓
Browser downloads file
        ↓
File saved to Downloads folder
```

---

## UI Component States

### Chatbot States
```
1. Closed (Button visible)
   └─ [☎️] Button

2. Open (Ready to chat)
   └─ Chat window visible
      └─ Input ready for typing

3. Listening (Voice input)
   └─ Microphone active
      └─ User speaks

4. Speaking (Audio response)
   └─ Playback active
      └─ Animation showing

5. Error (Something wrong)
   └─ Error message shown
      └─ Try again button
```

### SOS Recording States
```
1. Button ready
   └─ [🔴 SOS] pulsing

2. Modal open
   └─ Camera permission prompt OR
      Camera feed showing

3. Recording
   └─ Timer 0-10s
   └─ Stop button active

4. Stopped
   └─ Recording saved
   └─ Listed in recordings

5. Downloaded
   └─ File in Downloads folder
   └─ Persisted locally
```

### Export States
```
1. Ready
   └─ All fields empty
   └─ Export button ready

2. Date selected
   └─ Start/End dates set
   └─ Reports visible

3. Format selected
   └─ PDF/CSV/JSON chosen
   └─ Info text updates

4. Exporting
   └─ Loading state
   └─ Progress indicator

5. Complete
   └─ File downloaded
   └─ Success notification
```

---

## Button Reference

### Primary Buttons
```
Action Buttons:
[📥 Export as PDF]     Orange/Accent color
[📹 Start Recording]   Red color
[🎤 Voice]            Blue color
[Send ➤]              Blue color

Navigation Buttons:
[Language Tab]        Changes color on select
[Format Tab]          Changes color on select
[Quick Export]        Outline style
```

### Icon Reference
```
Navigation & Controls:
☎️  - Chatbot button (Phone)
🔴 - SOS button (Red alert)
📋 - Reports (Clipboard)
❌ - Close/Delete
🎤 - Microphone (Voice input)
📥 - Download
🔊 - Speaker (Audio output)
📹 - Camera/Video
◻️  - Stop recording
📱 - Phone/Mobile
❌ - Delete/Remove

Indicators:
🔴 - Recording active
▓▓ - Progress bar
... - Loading indicator
✓  - Success
⚠️  - Warning
```

---

## Responsive Breakpoints

### Mobile (< 768px)
```
- Chatbot window: 90vw width
- SOS modal: Full screen
- Export panel: Single column
- Stacked layout
```

### Tablet (768px - 1024px)
```
- Chatbot window: 384px
- SOS modal: Centered modal
- Export panel: 2 columns
- Adjusted spacing
```

### Desktop (> 1024px)
```
- Chatbot window: 384px (fixed)
- SOS modal: Centered modal
- Export panel: 3 columns
- Full width layouts
```

---

## Color Codes

### Primary Colors
```
Background:   #0f1419  (Navy dark)
Primary:      #1a2332  (Navy)
Foreground:   #fafbfc  (Off white)
Card:         #1e2633  (Darker navy)

Accent Colors:
Cyan:         #00d4ff  (Secondary)
Orange:       #ff3a1f  (Accent)

Status Colors:
Success:      #22c55e  (Green)
Warning:      #f59e0b  (Orange)
Error:        #ef4444  (Red)
Info:         #3b82f6  (Blue)
```

### Button States
```
Normal:       Background color
Hover:        Darker shade
Active:       Accent highlight
Disabled:     Muted gray
Loading:      Animated gradient
```

---

## Animation References

### Pulsing Button (SOS)
```
@keyframes pulse {
  0%, 100% { opacity: 1 }
  50%      { opacity: 0.7 }
}
Duration: 2s
Iteration: Infinite
```

### Blinking Indicator
```
@keyframes blink {
  0%, 100% { opacity: 1 }
  50%      { opacity: 0 }
}
Duration: 1s
Iteration: Infinite
```

### Slide In (Chat Window)
```
@keyframes slideIn {
  from { transform: translateX(400px) }
  to   { transform: translateX(0) }
}
Duration: 300ms
```

---

## Keyboard Shortcuts

### Chatbot
- `Enter` - Send message
- `Shift+Enter` - New line
- `Esc` - Close chat

### SOS Recording
- `Esc` - Close modal
- `Space` - Start/Stop recording (if focused)

### Report Export
- `Esc` - Close modal (if applicable)
- `Enter` - Execute export

---

## Accessibility Features

### ARIA Labels
```
<button aria-label="Open emergency chat">☎️</button>
<button aria-label="Start emergency recording">🔴</button>
<button aria-label="Download report">📥</button>
```

### Screen Reader Text
```
<span class="sr-only">Emergency Support Chat</span>
<span class="sr-only">SOS Recording Active</span>
```

### Keyboard Navigation
```
Tab - Move between elements
Enter - Activate buttons
Space - Toggle checkboxes
Arrow Keys - Navigate lists
```

---

**Visual Reference Complete** - Use this guide when implementing or customizing UI.

