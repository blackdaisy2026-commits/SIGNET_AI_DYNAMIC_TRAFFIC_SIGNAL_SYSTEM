'use client'

import { useState } from 'react'
import { MainNav } from '@/components/layout/main-nav'
import { Sidebar } from '@/components/layout/sidebar'
import { Dashboard } from '@/components/dashboard/dashboard'
import { TrafficDetection } from '@/components/traffic/traffic-detection'
import { IncidentReporting } from '@/components/incidents/incident-reporting'
import { AnalyticsPage } from '@/components/analytics/analytics-page'
import { EmergencyChatbot } from '@/components/emergency/emergency-chatbot'
import { SOSButton } from '@/components/emergency/sos-button'

export default function Page() {
  const [currentPage, setCurrentPage] = useState('dashboard')
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)

  return (
    <div className="flex h-screen bg-background">
      <Sidebar 
        isOpen={isSidebarOpen} 
        currentPage={currentPage} 
        onPageChange={setCurrentPage}
      />
      <div className="flex-1 flex flex-col overflow-hidden">
        <MainNav 
          onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
          currentPage={currentPage}
        />
        <main className="flex-1 overflow-auto">
          {currentPage === 'dashboard' && <Dashboard />}
          {currentPage === 'detection' && <TrafficDetection />}
          {currentPage === 'incidents' && <IncidentReporting />}
          {currentPage === 'analytics' && <AnalyticsPage />}
        </main>
      </div>

      {/* Emergency Features */}
      <EmergencyChatbot />
      <SOSButton />
    </div>
  )
}
