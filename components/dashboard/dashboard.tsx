'use client'

import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { LineChart, Line, AreaChart, Area, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts'
import { TrendingUp, AlertCircle, Activity, Zap } from 'lucide-react'

export function Dashboard() {
  const [vehicleData, setVehicleData] = useState([
    { time: '00:00', cars: 45, trucks: 12, bikes: 8 },
    { time: '04:00', cars: 32, trucks: 8, bikes: 5 },
    { time: '08:00', cars: 125, trucks: 35, bikes: 22 },
    { time: '12:00', cars: 298, trucks: 78, bikes: 54 },
    { time: '16:00', cars: 245, trucks: 62, bikes: 38 },
    { time: '20:00', cars: 178, trucks: 45, bikes: 28 },
    { time: '23:59', cars: 68, trucks: 15, bikes: 9 },
  ])

  const [stats, setStats] = useState({
    totalVehicles: 1391,
    activeIncidents: 3,
    systemUptime: 99.8,
    avgSignalEff: 92.5,
  })

  return (
    <div className="p-8 space-y-8">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          title="Total Vehicles Detected"
          value={stats.totalVehicles.toLocaleString()}
          icon={<Activity className="w-6 h-6" />}
          change="+12%"
          color="secondary"
        />
        <StatCard 
          title="Active Incidents"
          value={stats.activeIncidents}
          icon={<AlertCircle className="w-6 h-6" />}
          change="-2"
          color="accent"
        />
        <StatCard 
          title="System Uptime"
          value={`${stats.systemUptime}%`}
          icon={<Zap className="w-6 h-6" />}
          change="Excellent"
          color="secondary"
        />
        <StatCard 
          title="Avg Signal Efficiency"
          value={`${stats.avgSignalEff}%`}
          icon={<TrendingUp className="w-6 h-6" />}
          change="+3.2%"
          color="accent"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Vehicle Detection Trend */}
        <Card className="p-6 bg-card border-border">
          <h3 className="text-lg font-semibold text-foreground mb-4">Vehicle Detection Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={vehicleData}>
              <defs>
                <linearGradient id="colorCars" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(200, 100%, 50%)" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="hsl(200, 100%, 50%)" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(240, 6%, 25%)" />
              <XAxis dataKey="time" stroke="hsl(0, 0%, 70%)" />
              <YAxis stroke="hsl(0, 0%, 70%)" />
              <Tooltip 
                contentStyle={{ backgroundColor: 'hsl(240, 8%, 12%)', border: '1px solid hsl(240, 6%, 25%)' }}
                labelStyle={{ color: 'hsl(0, 0%, 98%)' }}
              />
              <Area 
                type="monotone" 
                dataKey="cars" 
                stroke="hsl(200, 100%, 50%)" 
                fillOpacity={1} 
                fill="url(#colorCars)"
                name="Cars"
              />
            </AreaChart>
          </ResponsiveContainer>
        </Card>

        {/* Vehicle Type Distribution */}
        <Card className="p-6 bg-card border-border">
          <h3 className="text-lg font-semibold text-foreground mb-4">Vehicle Type Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={vehicleData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(240, 6%, 25%)" />
              <XAxis dataKey="time" stroke="hsl(0, 0%, 70%)" />
              <YAxis stroke="hsl(0, 0%, 70%)" />
              <Tooltip 
                contentStyle={{ backgroundColor: 'hsl(240, 8%, 12%)', border: '1px solid hsl(240, 6%, 25%)' }}
                labelStyle={{ color: 'hsl(0, 0%, 98%)' }}
              />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="cars" 
                stroke="hsl(200, 100%, 50%)" 
                strokeWidth={2}
                name="Cars"
                dot={false}
              />
              <Line 
                type="monotone" 
                dataKey="trucks" 
                stroke="hsl(10, 100%, 58%)" 
                strokeWidth={2}
                name="Trucks"
                dot={false}
              />
              <Line 
                type="monotone" 
                dataKey="bikes" 
                stroke="hsl(180, 90%, 45%)" 
                strokeWidth={2}
                name="Bikes"
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card className="p-6 bg-card border-border">
        <h3 className="text-lg font-semibold text-foreground mb-4">Recent Detections</h3>
        <div className="space-y-4">
          {[
            { time: '14:32', vehicle: 'Car (Toyota Camry)', location: 'Intersection A1', confidence: 98 },
            { time: '14:31', vehicle: 'Truck (Heavy Duty)', location: 'Intersection B2', confidence: 95 },
            { time: '14:30', vehicle: 'Motorcycle', location: 'Intersection A1', confidence: 87 },
            { time: '14:29', vehicle: 'Car (Honda Civic)', location: 'Intersection C1', confidence: 99 },
            { time: '14:28', vehicle: 'Bus', location: 'Intersection B2', confidence: 93 },
          ].map((item, idx) => (
            <div key={idx} className="flex items-center justify-between p-3 bg-primary rounded-lg hover:bg-muted transition-colors">
              <div>
                <p className="text-sm font-medium text-foreground">{item.vehicle}</p>
                <p className="text-xs text-muted-foreground">{item.location}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-secondary font-semibold">{item.confidence}%</p>
                <p className="text-xs text-muted-foreground">{item.time}</p>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}

interface StatCardProps {
  title: string
  value: string | number
  icon: React.ReactNode
  change: string
  color: 'primary' | 'secondary' | 'accent'
}

function StatCard({ title, value, icon, change, color }: StatCardProps) {
  const colorClass = {
    primary: 'text-primary',
    secondary: 'text-secondary',
    accent: 'text-accent',
  }[color]

  const bgClass = {
    primary: 'bg-primary/10',
    secondary: 'bg-secondary/10',
    accent: 'bg-accent/10',
  }[color]

  return (
    <Card className="p-6 bg-card border-border">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-muted-foreground mb-2">{title}</p>
          <p className="text-3xl font-bold text-foreground">{value}</p>
          <p className="text-xs text-muted-foreground mt-2">{change}</p>
        </div>
        <div className={`${bgClass} p-3 rounded-lg ${colorClass}`}>
          {icon}
        </div>
      </div>
    </Card>
  )
}
