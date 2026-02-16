'use client'

import { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { AlertTriangle, Camera, Square, Download, X } from 'lucide-react'

interface SOSRecording {
  id: string
  timestamp: Date
  videoBlob?: Blob
  duration: number
  location?: string
}

export function SOSButton() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isRecording, setIsRecording] = useState(false)
  const [recordingTime, setRecordingTime] = useState(0)
  const [recordings, setRecordings] = useState<SOSRecording[]>([])
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const chunksRef = useRef<Blob[]>([])

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' },
        audio: true,
      })

      streamRef.current = stream

      if (videoRef.current) {
        videoRef.current.srcObject = stream
      }

      const mediaRecorder = new MediaRecorder(stream)
      mediaRecorderRef.current = mediaRecorder
      chunksRef.current = []

      mediaRecorder.ondataavailable = (event) => {
        chunksRef.current.push(event.data)
      }

      mediaRecorder.onstop = () => {
        const videoBlob = new Blob(chunksRef.current, { type: 'video/webm' })
        saveRecording(videoBlob)
      }

      mediaRecorder.start()
      setIsRecording(true)
      setRecordingTime(0)

      timerRef.current = setInterval(() => {
        setRecordingTime((prev) => {
          if (prev >= 10) {
            stopRecording()
            return 10
          }
          return prev + 1
        })
      }, 1000)
    } catch (error) {
      console.error('Error accessing camera:', error)
      alert('Unable to access camera. Please check permissions.')
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
    }

    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop())
    }

    if (timerRef.current) {
      clearInterval(timerRef.current)
    }

    setIsRecording(false)
  }

  const saveRecording = (videoBlob: Blob) => {
    const recording: SOSRecording = {
      id: `sos-${Date.now()}`,
      timestamp: new Date(),
      videoBlob,
      duration: recordingTime,
      location: 'Current Location',
    }

    setRecordings((prev) => [recording, ...prev])
    setRecordingTime(0)
  }

  const downloadRecording = (recording: SOSRecording) => {
    if (!recording.videoBlob) return

    const url = URL.createObjectURL(recording.videoBlob)
    const a = document.createElement('a')
    a.href = url
    a.download = `SOS-${recording.timestamp.getTime()}.webm`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const deleteRecording = (id: string) => {
    setRecordings((prev) => prev.filter((r) => r.id !== id))
  }

  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop())
      }
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }
  }, [])

  return (
    <>
      {/* SOS Button */}
      <Button
        onClick={() => setIsModalOpen(true)}
        className="fixed bottom-24 right-8 z-40 flex items-center justify-center h-16 px-6 rounded-full bg-red-600 hover:bg-red-700 text-white shadow-lg animate-pulse transition-all"
      >
        <AlertTriangle className="w-6 h-6 mr-2" />
        <span className="font-bold text-lg">SOS</span>
      </Button>

      {/* SOS Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <Card className="w-full max-w-2xl mx-4 p-0 overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-border bg-red-600 text-white">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-6 h-6" />
                <h2 className="text-xl font-bold">Emergency Recording</h2>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  stopRecording()
                  setIsModalOpen(false)
                }}
                className="h-8 w-8 p-0 text-white hover:bg-red-700"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              {/* Video Preview */}
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">
                  Camera Feed
                </p>
                <div className="relative bg-black rounded-lg overflow-hidden aspect-video">
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    className="w-full h-full object-cover"
                  />
                  <canvas
                    ref={canvasRef}
                    className="hidden"
                  />

                  {/* Recording Indicator */}
                  {isRecording && (
                    <div className="absolute top-4 right-4 flex items-center gap-2 bg-red-600 text-white px-3 py-2 rounded-lg">
                      <div className="w-3 h-3 bg-red-300 rounded-full animate-pulse" />
                      <span className="font-mono font-bold">{recordingTime}s / 10s</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Recording Controls */}
              <div className="flex gap-2">
                {!isRecording ? (
                  <Button
                    onClick={startRecording}
                    className="flex-1 h-12 bg-red-600 hover:bg-red-700 text-white text-lg font-bold"
                  >
                    <Camera className="w-5 h-5 mr-2" />
                    Start Recording
                  </Button>
                ) : (
                  <>
                    <Button
                      onClick={stopRecording}
                      className="flex-1 h-12 bg-red-600 hover:bg-red-700 text-white text-lg font-bold"
                    >
                      <Square className="w-5 h-5 mr-2" />
                      Stop Recording
                    </Button>
                  </>
                )}
              </div>

              {/* Recordings List */}
              {recordings.length > 0 && (
                <div className="space-y-3 border-t border-border pt-4">
                  <p className="text-sm font-medium text-muted-foreground">
                    Saved Recordings ({recordings.length})
                  </p>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {recordings.map((recording) => (
                      <div
                        key={recording.id}
                        className="flex items-center justify-between p-3 bg-card border border-border rounded-lg"
                      >
                        <div className="flex-1">
                          <p className="text-sm font-medium">
                            {recording.timestamp.toLocaleTimeString()}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Duration: {recording.duration}s • {recording.location}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            onClick={() => downloadRecording(recording)}
                            variant="outline"
                            size="sm"
                          >
                            <Download className="w-4 h-4" />
                          </Button>
                          <Button
                            onClick={() => deleteRecording(recording.id)}
                            variant="destructive"
                            size="sm"
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Info Text */}
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p className="text-sm text-yellow-800">
                  This recording will be saved for 10 seconds. All recordings are stored
                  locally on your device for emergency documentation.
                </p>
              </div>
            </div>
          </Card>
        </div>
      )}
    </>
  )
}
