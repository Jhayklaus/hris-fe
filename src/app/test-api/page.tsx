'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Loading } from '@/components/ui/loading'
import { ErrorState } from '@/components/ui/error-state'
import { apiService } from '@/services/api'
import { CheckCircle, XCircle, AlertCircle } from 'lucide-react'

interface TestResult {
  name: string
  status: 'pending' | 'success' | 'failed'
  message?: string
  error?: Error
}

export default function ApiTestPage() {
  const [tests, setTests] = useState<TestResult[]>([])
  const [isRunning, setIsRunning] = useState(false)
  const [overallStatus, setOverallStatus] = useState<'pending' | 'success' | 'failed'>('pending')

  const runTests = async () => {
    setIsRunning(true)
    setOverallStatus('pending')
    
    const testCases = [
      {
        name: 'Login Endpoint',
        test: async () => {
          const response = await apiService.login({
            email: 'admin@kola.com',
            password: 'password',
            companyId: 'demo-company'
          })
          return `Token received: ${response.token.substring(0, 10)}...`
        }
      },
      {
        name: 'Profile Endpoint',
        test: async () => {
          const profile = await apiService.getMyProfile()
          return `Profile: ${profile.email} (${profile.firstName} ${profile.lastName})`
        }
      },
      {
        name: 'Employees Endpoint',
        test: async () => {
          const employees = await apiService.getEmployees(0, 5)
          return `Found ${employees.total} employees`
        }
      },
      {
        name: 'Leave Types Endpoint',
        test: async () => {
          const leaveTypes = await apiService.getLeaveTypes()
          return `Found ${leaveTypes.length} leave types`
        }
      }
    ]

    setTests(testCases.map(tc => ({ name: tc.name, status: 'pending' })))

    for (let i = 0; i < testCases.length; i++) {
      const testCase = testCases[i]
      
      setTests(prev => prev.map((test, index) => 
        index === i ? { ...test, status: 'pending' } : test
      ))

      try {
        const message = await testCase.test()
        setTests(prev => prev.map((test, index) => 
          index === i ? { ...test, status: 'success', message } : test
        ))
      } catch (error) {
        setTests(prev => prev.map((test, index) => 
          index === i ? { 
            ...test, 
            status: 'failed', 
            error: error as Error,
            message: (error as Error).message 
          } : test
        ))
      }
    }

    setIsRunning(false)
    
    // Determine overall status
    const finalTests = tests.length > 0 ? tests : testCases.map(tc => ({ name: tc.name, status: 'pending' as const }))
    const hasFailed = finalTests.some(test => test.status === 'failed')
    const hasSuccess = finalTests.some(test => test.status === 'success')
    
    if (hasFailed) {
      setOverallStatus('failed')
    } else if (hasSuccess) {
      setOverallStatus('success')
    } else {
      setOverallStatus('failed')
    }
  }

  useEffect(() => {
    runTests()
  }, [])

  const successCount = tests.filter(test => test.status === 'success').length
  const failedCount = tests.filter(test => test.status === 'failed').length

  return (
    <div className="min-h-screen bg-slate-900 p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-display font-bold text-white">API Integration Test</h1>
          <p className="text-slate-300">Testing connection to Kọlá HR backend API</p>
        </div>

        <Card className="premium-card border-white/10 backdrop-blur-sm">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl font-display text-white">Test Results</CardTitle>
                <p className="text-slate-400">Backend API connectivity verification</p>
              </div>
              <div className="flex items-center space-x-2">
                {isRunning && <Loading size="sm" color="accent" text="" />}
                <Button
                  onClick={runTests}
                  disabled={isRunning}
                  className="premium-button"
                >
                  {isRunning ? 'Running Tests...' : 'Run Tests'}
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {tests.length === 0 && !isRunning ? (
              <div className="text-center py-8">
                <p className="text-slate-400">Click "Run Tests" to start API verification</p>
              </div>
            ) : (
              <div className="space-y-4">
                {tests.map((test, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10">
                    <div className="flex items-center space-x-3">
                      {test.status === 'pending' && <Loading size="sm" color="accent" text="" />}
                      {test.status === 'success' && <CheckCircle className="w-5 h-5 text-success" />}
                      {test.status === 'failed' && <XCircle className="w-5 h-5 text-destructive" />}
                      <div>
                        <p className="text-white font-medium">{test.name}</p>
                        {test.message && (
                          <p className="text-slate-400 text-sm">{test.message}</p>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <span className={`text-sm ${
                        test.status === 'success' ? 'text-success' :
                        test.status === 'failed' ? 'text-destructive' :
                        'text-slate-400'
                      }`}>
                        {test.status === 'success' ? '✅' :
                         test.status === 'failed' ? '❌' :
                         '⏳'}
                      </span>
                    </div>
                  </div>
                ))}

                {/* Summary */}
                {tests.length > 0 && (
                  <div className="mt-6 p-4 bg-white/5 rounded-lg border border-white/10">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        {overallStatus === 'success' && <CheckCircle className="w-5 h-5 text-success" />}
                        {overallStatus === 'failed' && <AlertCircle className="w-5 h-5 text-destructive" />}
                        {overallStatus === 'pending' && <Loading size="sm" color="accent" text="" />}
                        <span className="text-white font-medium">
                          {overallStatus === 'success' ? 'All tests passed!' :
                           overallStatus === 'failed' ? 'Some tests failed' :
                           'Tests in progress...'}
                        </span>
                      </div>
                      <div className="text-sm text-slate-400">
                        {successCount} passed, {failedCount} failed
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Backend Status */}
        <Card className="premium-card border-white/10 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-xl font-display text-white">Backend Configuration</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
                <span className="text-slate-300">API Base URL</span>
                <span className="text-white font-mono text-sm">
                  {process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'}
                </span>
              </div>
              <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
                <span className="text-slate-300">Connection Status</span>
                <span className={`font-medium ${
                  overallStatus === 'success' ? 'text-success' :
                  overallStatus === 'failed' ? 'text-destructive' :
                  'text-slate-400'
                }`}>
                  {overallStatus === 'success' ? 'Connected' :
                   overallStatus === 'failed' ? 'Connection Failed' :
                   'Testing...'}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}