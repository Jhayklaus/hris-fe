'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Calendar, CheckCircle, XCircle, Clock } from 'lucide-react'
import { apiService } from '@/services/api'
import { LeaveRequest } from '@/types'
import { LoadingState, LoadingCard } from '@/components/ui/loading'
import { ErrorState } from '@/components/ui/error-state'
import { toast } from 'sonner'

export default function LeavePage() {
    const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<Error | null>(null)

    const fetchLeaveRequests = async () => {
        try {
            setIsLoading(true)
            const data = await apiService.getLeaveRequests()
            setLeaveRequests(data)
        } catch (err) {
            console.error('Failed to fetch leave requests:', err)
            setError(err as Error)
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        fetchLeaveRequests()
    }, [])

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-NG', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        })
    }

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'approved':
                return 'bg-green-100 text-green-800'
            case 'denied':
                return 'bg-red-100 text-red-800'
            default:
                return 'bg-yellow-100 text-yellow-800'
        }
    }

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'approved':
                return <CheckCircle className="h-4 w-4 mr-1" />
            case 'denied':
                return <XCircle className="h-4 w-4 mr-1" />
            default:
                return <Clock className="h-4 w-4 mr-1" />
        }
    }

    if (isLoading && leaveRequests.length === 0) {
        return (
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Leave Management</h1>
                        <p className="text-gray-600">Review and manage employee leave requests</p>
                    </div>
                </div>
                <LoadingCard count={3} />
            </div>
        )
    }

    if (error) {
        return (
            <ErrorState
                title="Failed to load leave requests"
                message="We couldn't fetch leave requests. Please try again."
                onRetry={fetchLeaveRequests}
            />
        )
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Leave Management</h1>
                    <p className="text-gray-600">Review and manage employee leave requests</p>
                </div>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Leave Requests</CardTitle>
                    <CardDescription>
                        {leaveRequests.length} request{leaveRequests.length !== 1 ? 's' : ''} found
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {leaveRequests.length === 0 ? (
                            <div className="text-center py-8 text-gray-500">
                                No leave requests found.
                            </div>
                        ) : (
                            leaveRequests.map((request) => (
                                <div key={request.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                                    <div className="flex items-center space-x-4">
                                        <div className="p-2 bg-primary/10 rounded-lg">
                                            <Calendar className="h-5 w-5 text-primary" />
                                        </div>
                                        <div>
                                            <h3 className="font-medium text-gray-900">
                                                {request.employee ? `${request.employee.firstName} ${request.employee.lastName}` : 'Unknown Employee'}
                                            </h3>
                                            <p className="text-sm text-gray-600">
                                                {request.leaveType?.name || 'Leave'} • {formatDate(request.startDate)} - {formatDate(request.endDate)}
                                            </p>
                                            {request.reason && (
                                                <p className="text-xs text-gray-500 mt-1 italic">"{request.reason}"</p>
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-4">
                                        <span className={`flex items-center px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(request.status)}`}>
                                            {getStatusIcon(request.status)}
                                            {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                                        </span>
                                        {request.status === 'pending' && (
                                            <div className="flex space-x-2">
                                                <Button size="sm" variant="outline" className="text-green-600 border-green-200 hover:bg-green-50">
                                                    Approve
                                                </Button>
                                                <Button size="sm" variant="outline" className="text-red-600 border-red-200 hover:bg-red-50">
                                                    Deny
                                                </Button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
