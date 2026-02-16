'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Plus, X, Check, AlertCircle } from 'lucide-react'

interface Incident {
  id: number
  type: string
  location: string
  severity: 'critical' | 'high' | 'medium' | 'low'
  status: 'open' | 'in-progress' | 'resolved'
  description: string
  timestamp: string
}

export function IncidentReporting() {
  const [incidents, setIncidents] = useState<Incident[]>([
    {
      id: 1,
      type: 'Signal Malfunction',
      location: 'Intersection A1',
      severity: 'critical',
      status: 'in-progress',
      description: 'Red light stuck on for 45 seconds',
      timestamp: '2024-01-15 14:32:00',
    },
    {
      id: 2,
      type: 'Congestion Alert',
      location: 'Intersection B2',
      severity: 'high',
      status: 'open',
      description: 'Unusual traffic buildup detected',
      timestamp: '2024-01-15 14:28:00',
    },
    {
      id: 3,
      type: 'System Alert',
      location: 'Network Hub C',
      severity: 'medium',
      status: 'open',
      description: 'High CPU usage detected',
      timestamp: '2024-01-15 14:15:00',
    },
    {
      id: 4,
      type: 'Maintenance Alert',
      location: 'Intersection A1',
      severity: 'low',
      status: 'resolved',
      description: 'Scheduled maintenance completed',
      timestamp: '2024-01-15 13:45:00',
    },
  ])

  const [showNewIncident, setShowNewIncident] = useState(false)
  const [newIncident, setNewIncident] = useState({
    type: '',
    location: '',
    severity: 'medium' as const,
    description: '',
  })

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'bg-red-500/20 text-red-400 border-red-500/30'
      case 'high':
        return 'bg-orange-500/20 text-orange-400 border-orange-500/30'
      case 'medium':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
      case 'low':
        return 'bg-green-500/20 text-green-400 border-green-500/30'
      default:
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30'
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'critical':
        return 'bg-red-500'
      case 'in-progress':
        return 'bg-accent'
      case 'resolved':
        return 'bg-green-500'
      default:
        return 'bg-secondary'
    }
  }

  const handleAddIncident = () => {
    if (newIncident.type && newIncident.location && newIncident.description) {
      setIncidents([
        {
          id: incidents.length + 1,
          ...newIncident,
          status: 'open',
          timestamp: new Date().toLocaleString(),
        },
        ...incidents,
      ])
      setNewIncident({ type: '', location: '', severity: 'medium', description: '' })
      setShowNewIncident(false)
    }
  }

  const updateIncidentStatus = (id: number, status: string) => {
    setIncidents(incidents.map(inc => 
      inc.id === id ? { ...inc, status: status as any } : inc
    ))
  }

  const deleteIncident = (id: number) => {
    setIncidents(incidents.filter(inc => inc.id !== id))
  }

  return (
    <div className="p-8 space-y-6">
      {/* Header with Add Button */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-foreground">Incident Management</h2>
        <Button 
          onClick={() => setShowNewIncident(!showNewIncident)}
          className="bg-accent text-accent-foreground hover:bg-accent/90"
        >
          <Plus className="w-4 h-4 mr-2" />
          New Incident
        </Button>
      </div>

      {/* New Incident Form */}
      {showNewIncident && (
        <Card className="p-6 bg-card border-border">
          <h3 className="text-lg font-semibold text-foreground mb-4">Report New Incident</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Incident Type</label>
              <input
                type="text"
                placeholder="e.g., Signal Malfunction"
                value={newIncident.type}
                onChange={(e) => setNewIncident({ ...newIncident, type: e.target.value })}
                className="w-full bg-primary border border-border text-foreground rounded-lg px-3 py-2 text-sm placeholder-muted-foreground"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Location</label>
              <input
                type="text"
                placeholder="e.g., Intersection A1"
                value={newIncident.location}
                onChange={(e) => setNewIncident({ ...newIncident, location: e.target.value })}
                className="w-full bg-primary border border-border text-foreground rounded-lg px-3 py-2 text-sm placeholder-muted-foreground"
              />
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-foreground mb-2">Severity</label>
            <select
              value={newIncident.severity}
              onChange={(e) => setNewIncident({ ...newIncident, severity: e.target.value as any })}
              className="w-full bg-primary border border-border text-foreground rounded-lg px-3 py-2 text-sm"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="critical">Critical</option>
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-foreground mb-2">Description</label>
            <textarea
              placeholder="Describe the incident..."
              value={newIncident.description}
              onChange={(e) => setNewIncident({ ...newIncident, description: e.target.value })}
              className="w-full bg-primary border border-border text-foreground rounded-lg px-3 py-2 text-sm placeholder-muted-foreground resize-none h-24"
            />
          </div>
          <div className="flex gap-2">
            <Button 
              onClick={handleAddIncident}
              className="bg-secondary text-secondary-foreground hover:bg-secondary/90"
            >
              Submit Report
            </Button>
            <Button 
              onClick={() => setShowNewIncident(false)}
              variant="outline"
              className="border-border text-foreground hover:bg-muted"
            >
              Cancel
            </Button>
          </div>
        </Card>
      )}

      {/* Incidents List */}
      <div className="space-y-4">
        {incidents.map((incident) => (
          <Card key={incident.id} className="p-6 bg-card border-border hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-start gap-4">
                <div className={`p-3 rounded-lg ${getSeverityColor(incident.severity)}`}>
                  <AlertCircle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground">{incident.type}</h3>
                  <p className="text-sm text-muted-foreground">{incident.location}</p>
                </div>
              </div>
              <Button
                onClick={() => deleteIncident(incident.id)}
                variant="ghost"
                size="icon"
                className="text-muted-foreground hover:text-accent hover:bg-muted"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>

            <p className="text-sm text-foreground mb-4">{incident.description}</p>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-xs text-muted-foreground">{incident.timestamp}</span>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${
                  incident.severity === 'critical' ? 'bg-red-500/20 text-red-400' :
                  incident.severity === 'high' ? 'bg-orange-500/20 text-orange-400' :
                  incident.severity === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                  'bg-green-500/20 text-green-400'
                }`}>
                  {incident.severity}
                </span>
              </div>

              <div className="flex gap-2">
                {incident.status === 'open' && (
                  <Button
                    onClick={() => updateIncidentStatus(incident.id, 'in-progress')}
                    className="bg-accent text-accent-foreground hover:bg-accent/90 text-xs"
                  >
                    Start Investigation
                  </Button>
                )}
                {incident.status === 'in-progress' && (
                  <Button
                    onClick={() => updateIncidentStatus(incident.id, 'resolved')}
                    className="bg-secondary text-secondary-foreground hover:bg-secondary/90 text-xs"
                  >
                    <Check className="w-3 h-3 mr-1" />
                    Mark Resolved
                  </Button>
                )}
                {incident.status === 'resolved' && (
                  <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded text-xs font-semibold">
                    Resolved
                  </span>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
