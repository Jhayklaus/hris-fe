'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Calculator, Calendar, Users, DollarSign, Download, Eye } from 'lucide-react'

interface PayrollRun {
  id: string
  periodYear: number
  periodMonth: number
  status: 'draft' | 'processed' | 'posted'
  totalEmployees: number
  totalAmount: number
  startedAt: string
  completedAt?: string
}

const mockPayrollRuns: PayrollRun[] = [
  {
    id: '1',
    periodYear: 2024,
    periodMonth: 11,
    status: 'posted',
    totalEmployees: 24,
    totalAmount: 2450000,
    startedAt: '2024-11-01T09:00:00Z',
    completedAt: '2024-11-01T11:30:00Z',
  },
  {
    id: '2',
    periodYear: 2024,
    periodMonth: 10,
    status: 'posted',
    totalEmployees: 23,
    totalAmount: 2380000,
    startedAt: '2024-10-01T09:00:00Z',
    completedAt: '2024-10-01T11:15:00Z',
  },
]

export default function PayrollPage() {
  const [payrollRuns, setPayrollRuns] = useState<PayrollRun[]>(mockPayrollRuns)
  const [selectedMonth, setSelectedMonth] = useState('')
  const [selectedYear, setSelectedYear] = useState('2024')
  const [isProcessing, setIsProcessing] = useState(false)

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
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const getMonthName = (month: number) => {
    const months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ]
    return months[month - 1]
  }

  const handleProcessPayroll = async () => {
    setIsProcessing(true)
    // Simulate payroll processing
    setTimeout(() => {
      setIsProcessing(false)
      // Add new payroll run to the list
      const newRun: PayrollRun = {
        id: String(payrollRuns.length + 1),
        periodYear: parseInt(selectedYear),
        periodMonth: parseInt(selectedMonth),
        status: 'processed',
        totalEmployees: 24,
        totalAmount: 2450000,
        startedAt: new Date().toISOString(),
      }
      setPayrollRuns([newRun, ...payrollRuns])
    }, 3000)
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Payroll</h1>
          <p className="text-gray-600">Manage and process monthly payroll</p>
        </div>
      </div>

      {/* Process New Payroll */}
      <Card>
        <CardHeader>
          <CardTitle>Process New Payroll</CardTitle>
          <CardDescription>Run payroll for the selected period</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-end space-x-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Month
              </label>
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="w-full h-10 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="">Select Month</option>
                <option value="1">January</option>
                <option value="2">February</option>
                <option value="3">March</option>
                <option value="4">April</option>
                <option value="5">May</option>
                <option value="6">June</option>
                <option value="7">July</option>
                <option value="8">August</option>
                <option value="9">September</option>
                <option value="10">October</option>
                <option value="11">November</option>
                <option value="12">December</option>
              </select>
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Year
              </label>
              <Input
                type="number"
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                min="2020"
                max="2030"
                className="h-10"
              />
            </div>
            <Button 
              onClick={handleProcessPayroll}
              disabled={!selectedMonth || isProcessing}
              className="h-10"
            >
              {isProcessing ? (
                <>
                  <Calculator className="animate-spin h-4 w-4 mr-2" />
                  Processing...
                </>
              ) : (
                <>
                  <Calculator className="h-4 w-4 mr-2" />
                  Process Payroll
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Payroll History */}
      <Card>
        <CardHeader>
          <CardTitle>Payroll History</CardTitle>
          <CardDescription>Previous payroll runs</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {payrollRuns.map((run) => (
              <div key={run.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="p-2 bg-primary rounded-lg">
                    <Calendar className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">
                      {getMonthName(run.periodMonth)} {run.periodYear}
                    </h3>
                    <div className="flex items-center space-x-4 mt-1 text-sm text-gray-500">
                      <div className="flex items-center">
                        <Users className="h-3 w-3 mr-1" />
                        {run.totalEmployees} employees
                      </div>
                      <div className="flex items-center">
                        <DollarSign className="h-3 w-3 mr-1" />
                        {formatCurrency(run.totalAmount)}
                      </div>
                      <div className="flex items-center">
                        <Calendar className="h-3 w-3 mr-1" />
                        {formatDate(run.startedAt)}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    run.status === 'posted' 
                      ? 'bg-green-100 text-green-800' 
                      : run.status === 'processed'
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {run.status}
                  </span>
                  <Button variant="outline" size="sm">
                    <Eye className="h-4 w-4 mr-1" />
                    View
                  </Button>
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-1" />
                    Export
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}