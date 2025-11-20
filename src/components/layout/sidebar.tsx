'use client'

import React from 'react'
import { cn } from '@/lib/utils'
import { User, Building2, Users, Calculator, Calendar, FileText, Settings, LogOut } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/hooks/useAuth'

interface SidebarProps {
  className?: string
}

const Sidebar: React.FC<SidebarProps> = ({ className }) => {
  const { user, logout } = useAuth()

  const adminMenuItems = [
    { href: '/admin/dashboard', label: 'Dashboard', icon: Building2 },
    { href: '/admin/employees', label: 'Employees', icon: Users },
    { href: '/admin/payroll', label: 'Payroll', icon: Calculator },
    { href: '/admin/leave-approvals', label: 'Leave Approvals', icon: Calendar },
    { href: '/admin/audit', label: 'Audit Log', icon: FileText },
    { href: '/admin/settings', label: 'Settings', icon: Settings },
  ]

  const employeeMenuItems = [
    { href: '/ess/dashboard', label: 'Dashboard', icon: User },
    { href: '/ess/payslips', label: 'Payslips', icon: FileText },
    { href: '/ess/leave', label: 'Leave', icon: Calendar },
    { href: '/ess/profile', label: 'Profile', icon: Settings },
  ]

  const managerMenuItems = [
    { href: '/manager/dashboard', label: 'Dashboard', icon: User },
    { href: '/manager/leave-approvals', label: 'Leave Approvals', icon: Calendar },
    { href: '/manager/team', label: 'My Team', icon: Users },
  ]

  const getMenuItems = () => {
    if (!user) return []
    
    switch (user.role) {
      case 'admin':
        return adminMenuItems
      case 'manager':
        return [...managerMenuItems, ...employeeMenuItems.filter(item => 
          ['Dashboard', 'Payslips', 'Profile'].includes(item.label)
        )]
      case 'employee':
        return employeeMenuItems
      default:
        return []
    }
  }

  const menuItems = getMenuItems()

  return (
    <div className={cn('flex flex-col h-full bg-card border-r border-border', className)}>
      <div className="p-6 border-b border-border">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-lg">K</span>
          </div>
          <div>
            <h1 className="text-lg font-bold text-foreground">Kọlá</h1>
            <p className="text-xs text-muted-foreground">HR Platform</p>
          </div>
        </div>
      </div>
      
      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon
          return (
            <a
              key={item.href}
              href={item.href}
              className="flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
            >
              <Icon className="h-4 w-4" />
              <span>{item.label}</span>
            </a>
          )
        })}
      </nav>
      
      <div className="p-4 border-t border-border">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center">
            <span className="text-sm font-medium">
              {user ? `${user.firstName[0]}${user.lastName[0]}` : 'U'}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-foreground truncate">
              {user ? `${user.firstName} ${user.lastName}` : 'User'}
            </p>
            <p className="text-xs text-muted-foreground capitalize">
              {user?.role}
            </p>
          </div>
        </div>
        <Button 
          variant="outline" 
          size="sm" 
          className="w-full"
          onClick={logout}
        >
          <LogOut className="h-4 w-4 mr-2" />
          Sign Out
        </Button>
      </div>
    </div>
  )
}

export default Sidebar