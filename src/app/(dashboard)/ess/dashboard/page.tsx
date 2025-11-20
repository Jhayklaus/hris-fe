'use client'

import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { FileText, Calendar, User, DollarSign, Clock, TrendingUp } from 'lucide-react'

export default function ESSDashboard() {
  const recentPayslips = [
    {
      id: 1,
      month: 'November',
      year: 2024,
      netPay: 245000,
      date: '2024-11-01',
    },
    {
      id: 2,
      month: 'October',
      year: 2024,
      netPay: 245000,
      date: '2024-10-01',
    },
    {
      id: 3,
      month: 'September',
      year: 2024,
      netPay: 238000,
      date: '2024-09-01',
    },
  ]

  const leaveBalance = {
    annual: 12,
    sick: 8,
    personal: 3,
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-NG', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">My Dashboard</h1>
        <p className="text-gray-600">Welcome back! Here's your personal overview.</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">This Month</p>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(245000)}</p>
                <p className="text-sm text-green-600">Net Pay</p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <DollarSign className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Annual Leave</p>
                <p className="text-2xl font-bold text-gray-900">{leaveBalance.annual}</p>
                <p className="text-sm text-blue-600">Days Remaining</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <Calendar className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Sick Leave</p>
                <p className="text-2xl font-bold text-gray-900">{leaveBalance.sick}</p>
                <p className="text-sm text-orange-600">Days Available</p>
              </div>
              <div className="p-3 bg-orange-100 rounded-lg">
                <Calendar className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Personal Leave</p>
                <p className="text-2xl font-bold text-gray-900">{leaveBalance.personal}</p>
                <p className="text-sm text-purple-600">Days Available</p>
              </div>
              <div className="p-3 bg-purple-100 rounded-lg">
                <Calendar className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Payslips */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Payslips</CardTitle>
            <CardDescription>Your latest payroll records</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentPayslips.map((payslip) => (
                <div key={payslip.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-primary rounded-lg">
                      <FileText className="h-4 w-4 text-white" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">
                        {payslip.month} {payslip.year}
                      </p>
                      <p className="text-sm text-gray-500">{formatDate(payslip.date)}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-900">{formatCurrency(payslip.netPay)}</p>
                    <Button variant="ghost" size="sm" className="text-xs">
                      Download
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common tasks</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button variant="outline" className="w-full justify-start">
              <FileText className="h-4 w-4 mr-2" />
              View All Payslips
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <Calendar className="h-4 w-4 mr-2" />
              Request Leave
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <User className="h-4 w-4 mr-2" />
              Update Profile
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <Clock className="h-4 w-4 mr-2" />
              View Leave History
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}