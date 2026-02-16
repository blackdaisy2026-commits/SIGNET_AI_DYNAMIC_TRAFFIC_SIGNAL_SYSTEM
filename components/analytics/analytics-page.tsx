'use client'

import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { BarChart, Bar, PieChart, Pie, Cell, LineChart, Line, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts'
import { Download, Calendar } from 'lucide-react'
import { ExportReports } from '@/components/reports/export-reports'

export function AnalyticsPage() {
  const hourlyData = [
    { hour: '00:00', cars: 45, trucks: 12, bikes: 8, efficiency: 85 },
    { hour: '02:00', cars: 32, trucks: 8, bikes: 5, efficiency: 82 },
    { hour: '04:00', cars: 28, trucks: 6, bikes: 3, efficiency: 88 },
    { hour: '06:00', cars: 78, trucks: 22, bikes: 15, efficiency: 90 },
    { hour: '08:00', cars: 245, trucks: 65, bikes: 42, efficiency: 87 },
    { hour: '10:00', cars: 178, trucks: 48, bikes: 32, efficiency: 91 },
    { hour: '12:00', cars: 298, trucks: 78, bikes: 54, efficiency: 89 },
    { hour: '14:00', cars: 245, trucks: 62, bikes: 38, efficiency: 92 },
    { hour: '16:00', cars: 267, trucks: 71, bikes: 45, efficiency: 88 },
    { hour: '18:00', cars: 289, trucks: 75, bikes: 52, efficiency: 90 },
    { hour: '20:00', cars: 178, trucks: 45, bikes: 28, efficiency: 85 },
    { hour: '22:00', cars: 98, trucks: 25, bikes: 15, efficiency: 86 },
  ]

  const vehicleDistribution = [
    { name: 'Cars', value: 68 },
    { name: 'Trucks', value: 18 },
    { name: 'Bikes', value: 14 },
  ]

  const intersectionData = [
    { name: 'Intersection A1', vehicles: 1245, efficiency: 94, incidents: 1 },
    { name: 'Intersection B2', vehicles: 987, efficiency: 91, incidents: 2 },
    { name: 'Intersection C1', vehicles: 756, efficiency: 88, incidents: 0 },
    { name: 'Intersection D3', vehicles: 654, efficiency: 89, incidents: 1 },
  ]

  const colors = ['hsl(200, 100%, 50%)', 'hsl(10, 100%, 58%)', 'hsl(180, 90%, 45%)']

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-foreground">Analytics & Reports</h2>
        <div className="flex gap-2">
          <Button variant="outline" className="border-border text-foreground hover:bg-muted">
            <Calendar className="w-4 h-4 mr-2" />
            Last 24 Hours
          </Button>
          <Button variant="outline" className="border-border text-foreground hover:bg-muted">
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-6 bg-card border-border">
          <p className="text-sm text-muted-foreground mb-2">Total Vehicles</p>
          <p className="text-3xl font-bold text-secondary">3,847</p>
          <p className="text-xs text-green-400 mt-2">+8.3% vs yesterday</p>
        </Card>
        <Card className="p-6 bg-card border-border">
          <p className="text-sm text-muted-foreground mb-2">Avg Efficiency</p>
          <p className="text-3xl font-bold text-accent">89.2%</p>
          <p className="text-xs text-green-400 mt-2">+2.1% vs yesterday</p>
        </Card>
        <Card className="p-6 bg-card border-border">
          <p className="text-sm text-muted-foreground mb-2">Total Incidents</p>
          <p className="text-3xl font-bold text-secondary">4</p>
          <p className="text-xs text-red-400 mt-2">-25% vs yesterday</p>
        </Card>
        <Card className="p-6 bg-card border-border">
          <p className="text-sm text-muted-foreground mb-2">Peak Hour</p>
          <p className="text-3xl font-bold text-accent">12:00</p>
          <p className="text-xs text-yellow-400 mt-2">298 vehicles detected</p>
        </Card>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Hourly Traffic */}
        <div className="lg:col-span-2">
          <Card className="p-6 bg-card border-border">
            <h3 className="text-lg font-semibold text-foreground mb-4">Hourly Traffic Pattern</h3>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={hourlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(240, 6%, 25%)" />
                <XAxis dataKey="hour" stroke="hsl(0, 0%, 70%)" />
                <YAxis stroke="hsl(0, 0%, 70%)" />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'hsl(240, 8%, 12%)', border: '1px solid hsl(240, 6%, 25%)' }}
                  labelStyle={{ color: 'hsl(0, 0%, 98%)' }}
                />
                <Legend />
                <Bar dataKey="cars" fill="hsl(200, 100%, 50%)" name="Cars" />
                <Bar dataKey="trucks" fill="hsl(10, 100%, 58%)" name="Trucks" />
                <Bar dataKey="bikes" fill="hsl(180, 90%, 45%)" name="Bikes" />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </div>

        {/* Vehicle Distribution */}
        <Card className="p-6 bg-card border-border">
          <h3 className="text-lg font-semibold text-foreground mb-4">Vehicle Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={vehicleDistribution}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name} ${value}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {vehicleDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ backgroundColor: 'hsl(240, 8%, 12%)', border: '1px solid hsl(240, 6%, 25%)' }}
                labelStyle={{ color: 'hsl(0, 0%, 98%)' }}
              />
            </PieChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Signal Efficiency Over Time */}
      <Card className="p-6 bg-card border-border">
        <h3 className="text-lg font-semibold text-foreground mb-4">Signal Efficiency Trend</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={hourlyData}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(240, 6%, 25%)" />
            <XAxis dataKey="hour" stroke="hsl(0, 0%, 70%)" />
            <YAxis stroke="hsl(0, 0%, 70%)" />
            <Tooltip 
              contentStyle={{ backgroundColor: 'hsl(240, 8%, 12%)', border: '1px solid hsl(240, 6%, 25%)' }}
              labelStyle={{ color: 'hsl(0, 0%, 98%)' }}
            />
            <Line 
              type="monotone" 
              dataKey="efficiency" 
              stroke="hsl(200, 100%, 50%)" 
              strokeWidth={3}
              dot={false}
              name="Efficiency %"
            />
          </LineChart>
        </ResponsiveContainer>
      </Card>

      {/* Intersection Performance */}
      <Card className="p-6 bg-card border-border">
        <h3 className="text-lg font-semibold text-foreground mb-4">Intersection Performance</h3>
        <div className="space-y-4">
          {intersectionData.map((intersection, idx) => (
            <div key={idx} className="p-4 bg-primary rounded-lg">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-semibold text-foreground">{intersection.name}</h4>
                <span className={`px-3 py-1 rounded text-xs font-semibold ${
                  intersection.incidents === 0 ? 'bg-green-500/20 text-green-400' : 'bg-orange-500/20 text-orange-400'
                }`}>
                  {intersection.incidents} incident{intersection.incidents !== 1 ? 's' : ''}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Total Vehicles</p>
                  <p className="text-2xl font-bold text-secondary">{intersection.vehicles}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Efficiency</p>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-accent rounded-full"
                        style={{ width: `${intersection.efficiency}%` }}
                      ></div>
                    </div>
                    <span className="text-lg font-bold text-accent">{intersection.efficiency}%</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Summary Statistics */}
      <Card className="p-6 bg-card border-border">
        <h3 className="text-lg font-semibold text-foreground mb-4">Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="p-4 bg-primary rounded-lg">
            <p className="text-sm text-muted-foreground mb-1">Peak Traffic Hour</p>
            <p className="text-2xl font-bold text-secondary">12:00 PM</p>
            <p className="text-xs text-muted-foreground mt-2">625 vehicles recorded</p>
          </div>
          <div className="p-4 bg-primary rounded-lg">
            <p className="text-sm text-muted-foreground mb-1">Average Wait Time</p>
            <p className="text-2xl font-bold text-accent">2.3 min</p>
            <p className="text-xs text-muted-foreground mt-2">Across all intersections</p>
          </div>
          <div className="p-4 bg-primary rounded-lg">
            <p className="text-sm text-muted-foreground mb-1">System Uptime</p>
            <p className="text-2xl font-bold text-secondary">99.8%</p>
            <p className="text-xs text-muted-foreground mt-2">Last 30 days</p>
          </div>
        </div>
      </Card>

      {/* Export Reports Section */}
      <ExportReports />
    </div>
  )
}
