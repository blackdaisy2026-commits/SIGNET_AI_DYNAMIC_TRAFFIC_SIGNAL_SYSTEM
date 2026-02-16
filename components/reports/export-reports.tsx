'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import {
  Download,
  FileText,
  BarChart3,
  Calendar,
  Filter,
} from 'lucide-react'

interface ReportData {
  title: string
  description: string
  data: any
  timestamp: Date
}

export function ExportReports() {
  const [selectedFormat, setSelectedFormat] = useState<'pdf' | 'csv' | 'json'>('pdf')
  const [dateRange, setDateRange] = useState({
    startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    endDate: new Date(),
  })

  // Mock data - in production, this would come from your backend
  const mockReportData: ReportData[] = [
    {
      title: 'Traffic Summary Report',
      description: 'Overall traffic statistics and vehicle detection metrics',
      data: {
        totalVehicles: 15420,
        averageSpeed: 45.2,
        trafficDensity: 'Medium',
        incidentCount: 23,
        detectionAccuracy: 94.8,
      },
      timestamp: new Date(),
    },
    {
      title: 'Incident Report',
      description: 'Detailed incident logs and emergency events',
      data: {
        incidents: [
          {
            id: 1,
            type: 'Accident',
            location: 'Main Street & 5th Ave',
            timestamp: new Date(),
            severity: 'High',
          },
          {
            id: 2,
            type: 'Congestion',
            location: 'Highway 101',
            timestamp: new Date(),
            severity: 'Medium',
          },
        ],
      },
      timestamp: new Date(),
    },
    {
      title: 'Vehicle Detection Analytics',
      description: 'Vehicle type and movement patterns',
      data: {
        vehicles: {
          cars: 8200,
          trucks: 2100,
          motorcycles: 1200,
          buses: 520,
        },
        hourlyTrends: [
          { hour: '00:00', count: 120 },
          { hour: '06:00', count: 450 },
          { hour: '12:00', count: 890 },
          { hour: '18:00', count: 1050 },
        ],
      },
      timestamp: new Date(),
    },
  ]

  const exportToCSV = (data: ReportData[]) => {
    let csv = 'Report Export\n'
    csv += `Generated: ${new Date().toISOString()}\n`
    csv += `Date Range: ${dateRange.startDate.toLocaleDateString()} to ${dateRange.endDate.toLocaleDateString()}\n\n`

    data.forEach((report) => {
      csv += `\n${report.title}\n`
      csv += `${report.description}\n`
      csv += JSON.stringify(report.data, null, 2)
        .split('\n')
        .map((line) => `"${line}"`)
        .join('\n')
      csv += '\n'
    })

    downloadFile(csv, `traffic-report-${Date.now()}.csv`, 'text/csv')
  }

  const exportToJSON = (data: ReportData[]) => {
    const jsonData = {
      exportDate: new Date().toISOString(),
      dateRange: {
        startDate: dateRange.startDate.toISOString(),
        endDate: dateRange.endDate.toISOString(),
      },
      reports: data.map((report) => ({
        ...report,
        timestamp: report.timestamp.toISOString(),
      })),
    }

    downloadFile(
      JSON.stringify(jsonData, null, 2),
      `traffic-report-${Date.now()}.json`,
      'application/json'
    )
  }

  const exportToPDF = (data: ReportData[]) => {
    let pdfContent = `%PDF-1.4
1 0 obj
<< /Type /Catalog /Pages 2 0 R >>
endobj
2 0 obj
<< /Type /Pages /Kids [3 0 R] /Count 1 >>
endobj
3 0 obj
<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >>
endobj
4 0 obj
<< /Length 1000 >>
stream
BT
/F1 24 Tf
50 750 Td
(Traffic Management System - Report Export) Tj
0 -30 Td
/F1 12 Tf
(Generated: ${new Date().toLocaleString()}) Tj
0 -20 Td
(Date Range: ${dateRange.startDate.toLocaleDateString()} to ${dateRange.endDate.toLocaleDateString()}) Tj
0 -40 Td
`

    data.forEach((report) => {
      pdfContent += `
/F1 14 Tf
(${report.title}) Tj
0 -15 Td
/F1 10 Tf
(${report.description}) Tj
0 -20 Td
(${JSON.stringify(report.data)}) Tj
0 -30 Td
`
    })

    pdfContent += `
ET
endstream
endobj
5 0 obj
<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>
endobj
xref
0 6
0000000000 65535 f 
0000000009 00000 n 
0000000058 00000 n 
0000000115 00000 n 
0000000244 00000 n 
0000001353 00000 n 
trailer
<< /Size 6 /Root 1 0 R >>
startxref
1432
%%EOF`

    downloadFile(pdfContent, `traffic-report-${Date.now()}.pdf`, 'application/pdf')
  }

  const downloadFile = (content: string, filename: string, mimeType: string) => {
    const blob = new Blob([content], { type: mimeType })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  const handleExport = () => {
    if (selectedFormat === 'csv') {
      exportToCSV(mockReportData)
    } else if (selectedFormat === 'json') {
      exportToJSON(mockReportData)
    } else if (selectedFormat === 'pdf') {
      exportToPDF(mockReportData)
    }
  }

  return (
    <Card className="w-full p-6">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <FileText className="w-5 h-5 text-accent" />
            Export Reports
          </h3>
          <p className="text-sm text-muted-foreground mt-1">
            Download detailed traffic and incident reports in your preferred format
          </p>
        </div>

        {/* Date Range Selection */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-foreground block mb-2">
              <Calendar className="w-4 h-4 inline mr-1" />
              Start Date
            </label>
            <input
              type="date"
              value={dateRange.startDate.toISOString().split('T')[0]}
              onChange={(e) =>
                setDateRange({
                  ...dateRange,
                  startDate: new Date(e.target.value),
                })
              }
              className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground text-sm"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-foreground block mb-2">
              <Calendar className="w-4 h-4 inline mr-1" />
              End Date
            </label>
            <input
              type="date"
              value={dateRange.endDate.toISOString().split('T')[0]}
              onChange={(e) =>
                setDateRange({
                  ...dateRange,
                  endDate: new Date(e.target.value),
                })
              }
              className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground text-sm"
            />
          </div>
        </div>

        {/* Report Types */}
        <div>
          <p className="text-sm font-medium text-foreground mb-3 flex items-center gap-2">
            <BarChart3 className="w-4 h-4" />
            Available Reports
          </p>
          <div className="grid gap-3">
            {mockReportData.map((report, idx) => (
              <div
                key={idx}
                className="p-3 border border-border rounded-lg bg-card/50 hover:bg-card transition-colors"
              >
                <p className="text-sm font-medium text-foreground">{report.title}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {report.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Export Format Selection */}
        <div>
          <p className="text-sm font-medium text-foreground mb-3 flex items-center gap-2">
            <Filter className="w-4 h-4" />
            Export Format
          </p>
          <div className="grid grid-cols-3 gap-3">
            {(['pdf', 'csv', 'json'] as const).map((format) => (
              <button
                key={format}
                onClick={() => setSelectedFormat(format)}
                className={`p-3 border rounded-lg transition-colors text-sm font-medium uppercase ${
                  selectedFormat === format
                    ? 'border-accent bg-accent text-accent-foreground'
                    : 'border-border bg-card hover:bg-card/80 text-foreground'
                }`}
              >
                {format}
              </button>
            ))}
          </div>
        </div>

        {/* Export Info */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-800">
            {selectedFormat === 'pdf' &&
              'PDF format includes formatted tables and charts. Best for printing and sharing.'}
            {selectedFormat === 'csv' &&
              'CSV format is compatible with Excel and other spreadsheet applications.'}
            {selectedFormat === 'json' &&
              'JSON format provides raw data for integration with other systems.'}
          </p>
        </div>

        {/* Export Button */}
        <Button
          onClick={handleExport}
          className="w-full h-11 bg-accent hover:bg-accent/90 text-accent-foreground text-base font-semibold"
        >
          <Download className="w-5 h-5 mr-2" />
          Export as {selectedFormat.toUpperCase()}
        </Button>

        {/* Additional Options */}
        <div className="border-t border-border pt-4 space-y-2">
          <p className="text-xs text-muted-foreground font-medium">Quick Export</p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setSelectedFormat('pdf')
                handleExport()
              }}
              className="flex-1"
            >
              Today's Report
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setDateRange({
                  startDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
                  endDate: new Date(),
                })
                setSelectedFormat('csv')
              }}
              className="flex-1"
            >
              Weekly Report
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setDateRange({
                  startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
                  endDate: new Date(),
                })
                setSelectedFormat('json')
              }}
              className="flex-1"
            >
              Monthly Report
            </Button>
          </div>
        </div>
      </div>
    </Card>
  )
}
