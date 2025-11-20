'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Users, Calculator, Calendar, TrendingUp, DollarSign, Clock, ArrowUpRight, Activity, Plus, FileText, Briefcase } from 'lucide-react'
import { apiService } from '@/services/api'
import { Loading, LoadingCard, LoadingState } from '@/components/ui/loading'
import { ErrorState } from '@/components/ui/error-state'
import { useRouter } from 'next/navigation'

interface DashboardStats {
  totalEmployees: number
  monthlyPayroll: number
  pendingLeave: number
  avgProcessingTime: number
}

interface Activity {
  id: number
  type: string
  message: string
  time: string
  status: 'success' | 'info' | 'warning'
  icon: any
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [activities, setActivities] = useState<Activity[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const router = useRouter()

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true)
      setError(null)

      // Fetch employees for stats
      const employeesData = await apiService.getEmployees(0, 100)
      const totalEmployees = employeesData.total

      // Fetch payroll runs
      const payrollRuns = await apiService.getPayrollRuns()
      let monthlyPayroll = 0
      if (payrollRuns.length > 0) {
        const latestRun = payrollRuns[0]
        const lines = await apiService.getPayrollRunLines(latestRun.id)
        monthlyPayroll = lines.reduce((sum: number, line: any) => sum + Number(line.netPay), 0)
      }

      // Fetch leave requests
      const leaveRequests = await apiService.getLeaveRequests()
      const pendingLeave = leaveRequests.filter((r: any) => r.status === 'pending').length

      const stats: DashboardStats = {
        totalEmployees,
        monthlyPayroll,
        pendingLeave,
        avgProcessingTime: 2.5 // Keep mock for now
      }

      const mockActivities: Activity[] = [
        {
          id: 1,
          type: 'payroll',
          message: 'November payroll processed successfully',
          time: '2 hours ago',
          status: 'success',
          icon: DollarSign,
        },
        {
          id: 2,
          type: 'employee',
          message: 'New employee John Doe added',
          time: '1 day ago',
          status: 'info',
          icon: Users,
        },
        {
          id: 3,
          type: 'leave',
          message: '3 leave requests pending approval',
          time: '2 days ago',
          status: 'warning',
          icon: Calendar,
        },
        {
          id: 4,
          type: 'report',
          message: 'Monthly HR report generated',
          time: '3 days ago',
          status: 'info',
          icon: FileText,
        },
      ]

      setStats(stats)
      setActivities(mockActivities)
    } catch (err) {
      console.error('Failed to fetch dashboard data:', err)
      setError(err as Error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const handleRetry = () => {
    fetchDashboardData()
  }

  const handleQuickAction = (action: string) => {
    switch (action) {
      case 'add-employee':
        router.push('/admin/employees/new')
        break
      case 'process-payroll':
        router.push('/admin/payroll')
        break
      case 'view-leave':
        router.push('/admin/leave')
        break
      case 'generate-reports':
        router.push('/admin/reports')
        break
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-8">
        <LoadingState
          title="Loading dashboard"
          description="Fetching your HR data..."
        />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <LoadingCard count={4} />
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <ErrorState
        title="Failed to load dashboard"
        message="We couldn't fetch your dashboard data. Please try again."
        error={error}
        onRetry={handleRetry}
        variant="network"
      />
    )
  }

  if (!stats) {
    return (
      <ErrorState
        title="No data available"
        message="No dashboard data is currently available."
        onRetry={handleRetry}
      />
    )
  }

  const statsData = [
    {
      title: 'Total Employees',
      value: stats.totalEmployees.toString(),
      change: '+12%',
      icon: Users,
      color: 'text-primary',
      bgColor: 'bg-primary/10',
      borderColor: 'border-primary/20',
      trend: 'up' as const
    },
    {
      title: 'Monthly Payroll',
      value: `₦${stats.monthlyPayroll.toLocaleString()}`,
      change: '+8%',
      icon: DollarSign,
      color: 'text-success',
      bgColor: 'bg-success/10',
      borderColor: 'border-success/20',
      trend: 'up' as const
    },
    {
      title: 'Pending Leave',
      value: stats.pendingLeave.toString(),
      change: '-2',
      icon: Calendar,
      color: 'text-warning',
      bgColor: 'bg-warning/10',
      borderColor: 'border-warning/20',
      trend: 'down' as const
    },
    {
      title: 'Avg. Processing Time',
      value: `${stats.avgProcessingTime} hrs`,
      change: '-15%',
      icon: Clock,
      color: 'text-accent',
      bgColor: 'bg-accent/10',
      borderColor: 'border-accent/20',
      trend: 'up' as const
    },
  ]

  const quickActions = [
    {
      title: 'Add New Employee',
      icon: Plus,
      description: 'Onboard team member',
      gradient: 'from-primary to-primary-light',
      action: 'add-employee' as const
    },
    {
      title: 'Process Payroll',
      icon: Calculator,
      description: 'Run monthly payroll',
      gradient: 'from-success to-success-light',
      action: 'process-payroll' as const
    },
    {
      title: 'View Leave Requests',
      icon: Calendar,
      description: 'Manage time off',
      gradient: 'from-warning to-warning-light',
      action: 'view-leave' as const
    },
    {
      title: 'Generate Reports',
      icon: TrendingUp,
      description: 'HR analytics',
      gradient: 'from-accent to-accent-light',
      action: 'generate-reports' as const
    },
  ]

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header Section */}
      <div className="flex justify-between items-center bg-gradient-to-r from-slate-900 to-slate-800 rounded-2xl p-8 border border-white/10 backdrop-blur-sm">
        <div className="space-y-2">
          <h1 className="text-4xl font-display font-bold text-white">Dashboard</h1>
          <p className="text-slate-300 text-lg">Welcome back! Here's what's happening with your team.</p>
        </div>
        <div className="flex space-x-4">
          <Button className="premium-button">
            <Calculator className="w-4 h-4 mr-2" />
            Run Payroll
          </Button>
          <Button variant="outline" className="border-white/20 text-white hover:bg-white/10">
            <Plus className="w-4 h-4 mr-2" />
            Add Employee
          </Button>
        </div>
      </div>

      {/* Stats Grid - Premium Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsData.map((stat, index) => {
          const Icon = stat.icon
          return (
            <Card key={index} className="premium-card border-white/10 backdrop-blur-sm hover-lift">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-xl ${stat.bgColor} border ${stat.borderColor}`}>
                    <Icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                  <div className={`flex items-center space-x-1 text-sm ${stat.trend === 'up' ? 'text-success' : 'text-warning'
                    }`}>
                    <ArrowUpRight className={`h-4 w-4 ${stat.trend === 'down' ? 'rotate-90' : ''
                      }`} />
                    <span>{stat.change}</span>
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-slate-400">{stat.title}</p>
                  <p className="text-3xl font-display font-bold text-white">{stat.value}</p>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Activities - Enhanced Timeline */}
        <Card className="lg:col-span-2 premium-card border-white/10 backdrop-blur-sm">
          <CardHeader className="pb-6">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl font-display text-white">Recent Activities</CardTitle>
                <CardDescription className="text-slate-400">Latest updates from your team</CardDescription>
              </div>
              <Activity className="w-5 h-5 text-accent" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {activities.map((activity, index) => (
                <div key={activity.id} className="flex items-start space-x-4 group hover:bg-white/5 rounded-lg p-3 transition-all">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${activity.status === 'success' ? 'bg-success/10 border border-success/20' :
                    activity.status === 'warning' ? 'bg-warning/10 border border-warning/20' :
                      'bg-primary/10 border border-primary/20'
                    }`}>
                    <activity.icon className={`w-5 h-5 ${activity.status === 'success' ? 'text-success' :
                      activity.status === 'warning' ? 'text-warning' :
                        'text-primary'
                      }`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-white font-medium">{activity.message}</p>
                    <p className="text-xs text-slate-400 mt-1">{activity.time}</p>
                  </div>
                  <div className={`w-2 h-2 rounded-full mt-2 ${activity.status === 'success' ? 'bg-success' :
                    activity.status === 'warning' ? 'bg-warning' :
                      'bg-primary'
                    }`} />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions - Modern Cards */}
        <Card className="premium-card border-white/10 backdrop-blur-sm">
          <CardHeader className="pb-6">
            <CardTitle className="text-2xl font-display text-white">Quick Actions</CardTitle>
            <CardDescription className="text-slate-400">Common tasks</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {quickActions.map((action, index) => {
              const Icon = action.icon
              return (
                <button
                  key={index}
                  className="w-full p-4 rounded-xl bg-gradient-to-r from-white/5 to-white/10 border border-white/10 hover:border-white/20 transition-all group hover-lift text-left"
                >
                  <div className="flex items-center space-x-4">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${action.gradient} flex items-center justify-center shadow-lg`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-white font-semibold group-hover:text-accent transition-colors">
                        {action.title}
                      </h3>
                      <p className="text-slate-400 text-sm">{action.description}</p>
                    </div>
                    <ArrowUpRight className="w-5 h-5 text-slate-400 group-hover:text-accent transition-colors" />
                  </div>
                </button>
              )
            })}
          </CardContent>
        </Card>
      </div>

      {/* Additional Insights Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Payroll Summary */}
        <Card className="premium-card border-white/10 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-xl font-display text-white">Payroll Summary</CardTitle>
            <CardDescription className="text-slate-400">This month's overview</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
              <span className="text-slate-300">Total Processed</span>
              <span className="text-white font-semibold">₦2,450,000</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
              <span className="text-slate-300">Employees Paid</span>
              <span className="text-white font-semibold">24</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
              <span className="text-slate-300">Average Salary</span>
              <span className="text-white font-semibold">₦102,083</span>
            </div>
          </CardContent>
        </Card>

        {/* Team Performance */}
        <Card className="premium-card border-white/10 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-xl font-display text-white">Team Performance</CardTitle>
            <CardDescription className="text-slate-400">Key metrics</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
              <span className="text-slate-300">Attendance Rate</span>
              <span className="text-success font-semibold">96%</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
              <span className="text-slate-300">Leave Utilization</span>
              <span className="text-warning font-semibold">68%</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
              <span className="text-slate-300">Satisfaction Score</span>
              <span className="text-success font-semibold">4.7/5</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}