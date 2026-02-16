import { Menu, Bell, Settings, User } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface MainNavProps {
  onToggleSidebar: () => void
  currentPage: string
}

export function MainNav({ onToggleSidebar, currentPage }: MainNavProps) {
  const pageTitle = {
    dashboard: 'Real-time Dashboard',
    detection: 'Vehicle Detection',
    incidents: 'Incident Reporting',
    analytics: 'Analytics & Reports',
  }[currentPage] || 'Dashboard'

  return (
    <nav className="h-16 bg-card border-b border-border flex items-center justify-between px-6 shadow-sm">
      <div className="flex items-center gap-4">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={onToggleSidebar}
          className="text-foreground hover:bg-muted"
        >
          <Menu className="w-5 h-5" />
        </Button>
        <h1 className="text-xl font-semibold text-foreground">{pageTitle}</h1>
      </div>
      
      <div className="flex items-center gap-4">
        <Button 
          variant="ghost" 
          size="icon"
          className="relative text-foreground hover:bg-muted"
        >
          <Bell className="w-5 h-5" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-accent rounded-full"></span>
        </Button>
        <Button 
          variant="ghost" 
          size="icon"
          className="text-foreground hover:bg-muted"
        >
          <Settings className="w-5 h-5" />
        </Button>
        <Button 
          variant="ghost" 
          size="icon"
          className="text-foreground hover:bg-muted"
        >
          <User className="w-5 h-5" />
        </Button>
      </div>
    </nav>
  )
}
