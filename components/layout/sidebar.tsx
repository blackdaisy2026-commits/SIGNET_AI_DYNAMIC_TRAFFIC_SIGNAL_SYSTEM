import { 
  LayoutDashboard, 
  Camera, 
  AlertTriangle, 
  BarChart3,
  ChevronRight
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface SidebarProps {
  isOpen: boolean
  currentPage: string
  onPageChange: (page: string) => void
}

const menuItems = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: LayoutDashboard,
  },
  {
    id: 'detection',
    label: 'Vehicle Detection',
    icon: Camera,
  },
  {
    id: 'incidents',
    label: 'Incidents',
    icon: AlertTriangle,
  },
  {
    id: 'analytics',
    label: 'Analytics',
    icon: BarChart3,
  },
]

export function Sidebar({ isOpen, currentPage, onPageChange }: SidebarProps) {
  if (!isOpen) return null

  return (
    <div className="w-64 bg-sidebar border-r border-border h-screen overflow-y-auto flex flex-col">
      {/* Logo Section */}
      <div className="p-6 border-b border-border">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-accent rounded-lg flex items-center justify-center">
            <span className="text-accent-foreground font-bold text-lg">TS</span>
          </div>
          <div>
            <h1 className="text-base font-bold text-sidebar-foreground">Traffic Signal</h1>
            <p className="text-xs text-muted-foreground">Detection System</p>
          </div>
        </div>
      </div>

      {/* Menu Items */}
      <nav className="flex-1 px-3 py-6 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon
          const isActive = currentPage === item.id
          
          return (
            <button
              key={item.id}
              onClick={() => onPageChange(item.id)}
              className={cn(
                'w-full flex items-center justify-between px-4 py-3 rounded-lg transition-colors',
                isActive
                  ? 'bg-sidebar-primary text-sidebar-primary-foreground'
                  : 'text-sidebar-foreground hover:bg-sidebar-accent'
              )}
            >
              <div className="flex items-center gap-3">
                <Icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </div>
              {isActive && <ChevronRight className="w-4 h-4" />}
            </button>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="p-6 border-t border-border">
        <div className="bg-sidebar-accent rounded-lg p-4 mb-4">
          <p className="text-xs text-sidebar-foreground mb-2 font-semibold">System Status</p>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-xs text-muted-foreground">All Systems Operational</span>
          </div>
        </div>
        <p className="text-xs text-muted-foreground">v1.0.0</p>
      </div>
    </div>
  )
}
