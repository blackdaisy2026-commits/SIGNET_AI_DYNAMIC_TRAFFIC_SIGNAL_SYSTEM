'use client'

import { useState, useRef, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Play, Pause, RotateCcw, Download } from 'lucide-react'

export function TrafficDetection() {
  const [isLive, setIsLive] = useState(true)
  const [detections, setDetections] = useState([
    { id: 1, type: 'Car', confidence: 0.98, bbox: { x: 120, y: 80, w: 150, h: 100 } },
    { id: 2, type: 'Truck', confidence: 0.95, bbox: { x: 400, y: 150, w: 180, h: 120 } },
    { id: 3, type: 'Motorcycle', confidence: 0.87, bbox: { x: 650, y: 200, w: 80, h: 60 } },
  ])
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Draw camera feed (placeholder)
    ctx.fillStyle = 'hsl(240, 10%, 15%)'
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // Draw grid
    ctx.strokeStyle = 'hsl(200, 100%, 50%)'
    ctx.globalAlpha = 0.1
    for (let i = 0; i < canvas.width; i += 50) {
      ctx.beginPath()
      ctx.moveTo(i, 0)
      ctx.lineTo(i, canvas.height)
      ctx.stroke()
    }
    for (let i = 0; i < canvas.height; i += 50) {
      ctx.beginPath()
      ctx.moveTo(0, i)
      ctx.lineTo(canvas.width, i)
      ctx.stroke()
    }

    ctx.globalAlpha = 1

    // Draw detections
    detections.forEach((detection) => {
      const { bbox } = detection
      const colors: Record<string, string> = {
        Car: 'hsl(200, 100%, 50%)',
        Truck: 'hsl(10, 100%, 58%)',
        Motorcycle: 'hsl(180, 90%, 45%)',
      }

      ctx.strokeStyle = colors[detection.type] || 'hsl(200, 100%, 50%)'
      ctx.lineWidth = 2
      ctx.strokeRect(bbox.x, bbox.y, bbox.w, bbox.h)

      // Label
      ctx.fillStyle = colors[detection.type] || 'hsl(200, 100%, 50%)'
      ctx.fillRect(bbox.x, bbox.y - 25, 150, 24)

      ctx.fillStyle = 'hsl(0, 0%, 8%)'
      ctx.font = 'bold 12px Arial'
      ctx.fillText(
        `${detection.type} (${(detection.confidence * 100).toFixed(0)}%)`,
        bbox.x + 5,
        bbox.y - 8
      )
    })
  }, [detections])

  return (
    <div className="p-8 space-y-6">
      {/* Video Feed */}
      <Card className="p-6 bg-card border-border">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-foreground">Live Camera Feed</h3>
            <div className="flex items-center gap-2">
              {isLive && (
                <div className="flex items-center gap-2 px-3 py-1 bg-green-500/20 rounded-full">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-xs font-semibold text-green-500">LIVE</span>
                </div>
              )}
            </div>
          </div>

          {/* Canvas */}
          <div className="bg-black rounded-lg overflow-hidden border border-border">
            <canvas
              ref={canvasRef}
              width={960}
              height={540}
              className="w-full block"
            />
          </div>

          {/* Controls */}
          <div className="flex gap-2">
            <Button
              onClick={() => setIsLive(!isLive)}
              className={isLive ? 'bg-accent text-accent-foreground hover:bg-accent' : 'bg-primary text-primary-foreground hover:bg-primary'}
            >
              {isLive ? <Pause className="w-4 h-4 mr-2" /> : <Play className="w-4 h-4 mr-2" />}
              {isLive ? 'Pause' : 'Play'}
            </Button>
            <Button variant="outline" className="border-border text-foreground hover:bg-muted">
              <RotateCcw className="w-4 h-4 mr-2" />
              Reset
            </Button>
            <Button variant="outline" className="border-border text-foreground hover:bg-muted">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
        </div>
      </Card>

      {/* Detection Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-6 bg-card border-border">
          <p className="text-sm text-muted-foreground mb-2">Total Detections</p>
          <p className="text-3xl font-bold text-secondary">1,247</p>
          <p className="text-xs text-muted-foreground mt-2">Last 24 hours</p>
        </Card>
        <Card className="p-6 bg-card border-border">
          <p className="text-sm text-muted-foreground mb-2">Average Confidence</p>
          <p className="text-3xl font-bold text-accent">93.5%</p>
          <p className="text-xs text-muted-foreground mt-2">Across all types</p>
        </Card>
        <Card className="p-6 bg-card border-border">
          <p className="text-sm text-muted-foreground mb-2">Processing Speed</p>
          <p className="text-3xl font-bold text-secondary">30 FPS</p>
          <p className="text-xs text-muted-foreground mt-2">Frames per second</p>
        </Card>
      </div>

      {/* Detection List */}
      <Card className="p-6 bg-card border-border">
        <h3 className="text-lg font-semibold text-foreground mb-4">Current Frame Detections</h3>
        <div className="space-y-3">
          {detections.map((detection) => (
            <div key={detection.id} className="flex items-center justify-between p-4 bg-primary rounded-lg hover:bg-muted transition-colors">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center">
                  <div className="w-10 h-10 border-2 border-secondary rounded" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">{detection.type}</p>
                  <p className="text-xs text-muted-foreground">ID: {detection.id}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold text-secondary">{(detection.confidence * 100).toFixed(0)}%</p>
                <p className="text-xs text-muted-foreground">Confidence</p>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Configuration Panel */}
      <Card className="p-6 bg-card border-border">
        <h3 className="text-lg font-semibold text-foreground mb-4">Detection Settings</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Confidence Threshold</label>
            <input
              type="range"
              min="0"
              max="100"
              defaultValue="70"
              className="w-full accent-secondary"
            />
            <p className="text-xs text-muted-foreground mt-1">70%</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Model</label>
            <select className="w-full bg-primary border border-border text-foreground rounded-lg px-3 py-2 text-sm">
              <option>YOLOv8 (Real-time)</option>
              <option>YOLOv8 (Accurate)</option>
              <option>YOLOv5 (Fast)</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Video Input</label>
            <select className="w-full bg-primary border border-border text-foreground rounded-lg px-3 py-2 text-sm">
              <option>Camera 1</option>
              <option>Camera 2</option>
              <option>Camera 3</option>
            </select>
          </div>
        </div>
      </Card>
    </div>
  )
}
