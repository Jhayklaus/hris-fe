'use client'

import React from 'react'
import { cn } from '@/lib/utils'
import { User, Building2, Users, Calculator, Calendar, FileText, Settings, LogOut, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/hooks/useAuth'
import { usePathname } from 'next/navigation'
import Link from 'next/link'

interface SidebarProps {
  className?: string
}

const Sidebar: React.FC<SidebarProps> = ({ className }) => {
  const { user, logout } = useAuth()
  const pathname = usePathname()

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
    <div className={cn('flex flex-col h-full bg-[var(--sidebar-bg)] text-[var(--sidebar-fg)] border-r border-[var(--sidebar-border)] transition-all duration-300', className)}>
      {/* Header */}
      <div className="p-6 border-b border-[var(--sidebar-border)]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
            <span className="text-primary-foreground font-bold text-xl font-display">K</span>
          </div>
          <div>
            <h1 className="text-lg font-bold font-display tracking-tight">Kọlá</h1>
            <p className="text-xs text-slate-400 font-medium">HR Platform</p>
          </div>
        </div>
      </div>
      
      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto custom-scrollbar">
        {menuItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "group flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
                isActive 
                  ? "bg-[var(--sidebar-accent)] text-[var(--sidebar-accent-fg)] shadow-sm" 
                  : "text-slate-400 hover:bg-[var(--sidebar-accent)]/50 hover:text-slate-200"
              )}
            >
              <div className="flex items-center gap-3">
                <Icon className={cn("h-4 w-4 transition-colors", isActive ? "text-primary" : "text-slate-500 group-hover:text-slate-300")} />
                <span>{item.label}</span>
              </div>
              {isActive && <ChevronRight className="h-3 w-3 text-primary opacity-100 transition-opacity" />}
            </Link>
          )
        })}
      </nav>
      
      {/* User Profile */}
      <div className="p-4 border-t border-[var(--sidebar-border)] bg-[var(--sidebar-bg)]">
        <div className="flex items-center gap-3 mb-4 p-2 rounded-lg hover:bg-[var(--sidebar-accent)]/50 transition-colors cursor-pointer group">
          <div className="w-9 h-9 bg-slate-800 rounded-full flex items-center justify-center border border-slate-700 group-hover:border-slate-600 transition-colors">
            <span className="text-sm font-medium text-slate-300 group-hover:text-white">
              {user ? `${user.firstName[0]}${user.lastName[0]}` : 'U'}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-slate-200 truncate group-hover:text-white transition-colors">
              {user ? `${user.firstName} ${user.lastName}` : 'User'}
            </p>
            <p className="text-xs text-slate-500 capitalize truncate group-hover:text-slate-400 transition-colors">
              {user?.role || 'Guest'}
            </p>
          </div>
        </div>
        <Button 
          variant="ghost" 
          size="sm" 
          className="w-full justify-start text-slate-400 hover:text-red-400 hover:bg-red-950/30"
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