'use client'

import { useState, useRef, useEffect } from 'react'
import { useChat } from '@ai-sdk/react'
import { DefaultChatTransport } from 'ai'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import {
  Send,
  Mic,
  Volume2,
  Phone,
  X,
  MessageCircle,
} from 'lucide-react'

const LANGUAGES = [
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Español' },
  { code: 'fr', name: 'Français' },
  { code: 'de', name: 'Deutsch' },
  { code: 'ja', name: '日本語' },
  { code: 'zh', name: '中文' },
]

export function EmergencyChatbot() {
  const [isOpen, setIsOpen] = useState(false)
  const [language, setLanguage] = useState('en')
  const [isListening, setIsListening] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const recognitionRef = useRef<any>(null)
  const synth = useRef<SpeechSynthesis | null>(null)

  const { messages, input, setInput, append, isLoading } = useChat({
    transport: new DefaultChatTransport({
      api: '/api/chat',
      prepareSendMessagesRequest: ({ messages }) => ({
        body: { messages, language },
      }),
    }),
  })

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
      if (SpeechRecognition) {
        recognitionRef.current = new SpeechRecognition()
        recognitionRef.current.continuous = false
        recognitionRef.current.interimResults = false
        recognitionRef.current.lang = language

        recognitionRef.current.onstart = () => setIsListening(true)
        recognitionRef.current.onend = () => setIsListening(false)
        recognitionRef.current.onresult = (event: any) => {
          const transcript = Array.from(event.results)
            .map((result: any) => result[0].transcript)
            .join('')
          setInput(transcript)
        }
      }

      synth.current = window.speechSynthesis
    }
  }, [language, setInput])

  const startListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.start()
    }
  }

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.abort()
    }
  }

  const handleSendMessage = async () => {
    if (input.trim()) {
      await append({
        role: 'user',
        content: input,
      })
      setInput('')

      // Speak the user's message
      speakText(input, language)
    }
  }

  const speakText = (text: string, lang: string) => {
    if (!synth.current) return

    // Cancel any ongoing speech
    synth.current.cancel()

    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = getVoiceLocale(lang)
    utterance.rate = 1
    utterance.pitch = 1
    utterance.volume = 1

    utterance.onstart = () => setIsSpeaking(true)
    utterance.onend = () => setIsSpeaking(false)

    synth.current.speak(utterance)
  }

  const handleSpeakResponse = (text: string) => {
    speakText(text, language)
  }

  const getVoiceLocale = (lang: string): string => {
    const locales: Record<string, string> = {
      en: 'en-US',
      es: 'es-ES',
      fr: 'fr-FR',
      de: 'de-DE',
      ja: 'ja-JP',
      zh: 'zh-CN',
    }
    return locales[lang] || 'en-US'
  }

  const getLastAssistantMessage = () => {
    for (let i = messages.length - 1; i >= 0; i--) {
      if (messages[i].role === 'assistant') {
        const parts = (messages[i] as any).parts || []
        return parts
          .filter((p: any) => p.type === 'text')
          .map((p: any) => p.text)
          .join('')
      }
    }
    return ''
  }

  return (
    <>
      {/* Floating Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-8 right-8 z-40 flex items-center justify-center w-14 h-14 rounded-full bg-accent hover:bg-accent/90 text-accent-foreground shadow-lg transition-all"
          aria-label="Open emergency chat"
        >
          <Phone className="w-6 h-6" />
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <Card className="fixed bottom-8 right-8 z-50 w-96 h-[600px] flex flex-col shadow-2xl border border-border">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-border bg-gradient-to-r from-primary to-primary/80">
            <div className="flex items-center gap-2">
              <MessageCircle className="w-5 h-5 text-accent" />
              <div>
                <h3 className="font-semibold text-foreground">Emergency Support</h3>
                <p className="text-xs text-muted-foreground">Available 24/7</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(false)}
              className="h-8 w-8 p-0"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>

          {/* Language Selector */}
          <div className="p-3 border-b border-border bg-card/50">
            <p className="text-xs font-medium text-muted-foreground mb-2">Language</p>
            <div className="flex flex-wrap gap-2">
              {LANGUAGES.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => setLanguage(lang.code)}
                  className={`px-2 py-1 text-xs rounded transition-colors ${
                    language === lang.code
                      ? 'bg-accent text-accent-foreground'
                      : 'bg-muted text-muted-foreground hover:bg-muted/80'
                  }`}
                >
                  {lang.name}
                </button>
              ))}
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.length === 0 && (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <MessageCircle className="w-12 h-12 text-muted-foreground/50 mb-2" />
                <p className="text-sm text-muted-foreground">
                  How can we help you today?
                </p>
              </div>
            )}

            {messages.map((message, index) => {
              const text =
                (message as any).parts
                  ?.filter((p: any) => p.type === 'text')
                  .map((p: any) => p.text)
                  .join('') || ''

              return (
                <div
                  key={index}
                  className={`flex ${
                    message.role === 'user' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  <div
                    className={`max-w-xs px-3 py-2 rounded-lg ${
                      message.role === 'user'
                        ? 'bg-accent text-accent-foreground'
                        : 'bg-card border border-border text-foreground'
                    }`}
                  >
                    <p className="text-sm">{text}</p>
                    {message.role === 'assistant' && (
                      <button
                        onClick={() => handleSpeakResponse(text)}
                        className="mt-1 text-xs opacity-70 hover:opacity-100 flex items-center gap-1"
                        disabled={isSpeaking}
                      >
                        <Volume2 className="w-3 h-3" />
                        {isSpeaking ? 'Speaking...' : 'Play'}
                      </button>
                    )}
                  </div>
                </div>
              )
            })}

            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-card border border-border px-3 py-2 rounded-lg">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" />
                    <div
                      className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"
                      style={{ animationDelay: '0.1s' }}
                    />
                    <div
                      className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"
                      style={{ animationDelay: '0.2s' }}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Input Area */}
          <div className="p-4 border-t border-border bg-card space-y-3">
            <div className="flex gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault()
                    handleSendMessage()
                  }
                }}
                placeholder="Type your message..."
                className="flex-1 text-sm"
              />
              <Button
                onClick={handleSendMessage}
                disabled={!input.trim() || isLoading}
                className="px-3"
                size="sm"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>

            {/* Voice Controls */}
            <div className="flex gap-2">
              <Button
                onClick={startListening}
                disabled={isListening || isLoading}
                variant={isListening ? 'default' : 'outline'}
                size="sm"
                className="flex-1"
              >
                <Mic className="w-4 h-4 mr-1" />
                {isListening ? 'Listening...' : 'Voice'}
              </Button>
              {isListening && (
                <Button
                  onClick={stopListening}
                  variant="destructive"
                  size="sm"
                  className="flex-1"
                >
                  Stop
                </Button>
              )}
            </div>
          </div>
        </Card>
      )}
    </>
  )
}
