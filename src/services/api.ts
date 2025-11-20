import axios, { AxiosInstance, AxiosError } from 'axios'
import { AuthResponse, LoginCredentials, User, Employee, PayrollRun, LeaveRequest, LeaveType, Company } from '@/types'

class ApiService {
  private api: AxiosInstance
  private authToken: string | null = null

  constructor() {
    this.api = axios.create({
      baseURL: process.env.NEXT_PUBLIC_API_URL || 'https://vssuwsfcbbjuqsulmlkl.supabase.co',
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
        
      },
    })

    this.setupInterceptors()
  }

  private setupInterceptors() {
    // Request interceptor to add auth token
    this.api.interceptors.request.use(
      (config) => {
        if (this.authToken) {
          config.headers.Authorization = `Bearer ${this.authToken}`
        }
        return config
      },
      (error) => Promise.reject(error)
    )

    // Response interceptor to handle errors
    this.api.interceptors.response.use(
      (response) => response,
      async (error: AxiosError) => {
        if (error.response?.status === 401) {
          // Handle unauthorized access
          this.logout()
          if (typeof window !== 'undefined') {
            window.location.href = '/login'
          }
        }
        return Promise.reject(error)
      }
    )
  }

  setAuthToken(token: string | null) {
    this.authToken = token
    if (token) {
      localStorage.setItem('accessToken', token)
    } else {
      localStorage.removeItem('accessToken')
    }
  }

  getAuthToken(): string | null {
    if (!this.authToken && typeof window !== 'undefined') {
      this.authToken = localStorage.getItem('accessToken')
    }
    return this.authToken
  }

  logout() {
    this.setAuthToken(null)
    if (typeof window !== 'undefined') {
      localStorage.removeItem('accessToken')
      localStorage.removeItem('refreshToken')
      localStorage.removeItem('user')
    }
  }

  // Auth endpoints
  async login(credentials: { email: string; password: string; companyId: string }): Promise<{ token: string }> {
    const response = await this.api.post<{ token: string }>('/auth/login', credentials)
    const { token } = response.data
    
    this.setAuthToken(token)
    if (typeof window !== 'undefined') {
      localStorage.setItem('accessToken', token)
    }
    
    return response.data
  }

  async signup(data: { email: string; password: string; role: 'ADMIN' | 'MANAGER' | 'EMPLOYEE'; companyId: string }): Promise<{ token: string }> {
    const response = await this.api.post<{ token: string }>('/auth/signup', data)
    return response.data
  }

  // Company endpoints
  async getCompany(companyId: string): Promise<Company> {
    return this.get<Company>(`/companies/${companyId}`)
  }

  // Employee endpoints
  async getEmployees(skip = 0, take = 20, search = ''): Promise<{ employees: Employee[]; total: number }> {
    const params = { skip, take, q: search }
    return this.get<{ employees: Employee[]; total: number }>('/employees', params)
  }

  async getEmployee(id: string): Promise<Employee> {
    return this.get<Employee>(`/employees/${id}`)
  }

  async createEmployee(data: Partial<Employee>): Promise<Employee> {
    return this.post<Employee>('/employees', data)
  }

  // Payroll endpoints
  async getPayrollRuns(): Promise<PayrollRun[]> {
    return this.get<PayrollRun[]>('/payroll')
  }

  async createPayrollRun(data: { periodYear: number; periodMonth: number }): Promise<PayrollRun> {
    return this.post<PayrollRun>('/payroll', data)
  }

  // Leave endpoints
  async getLeaveRequests(): Promise<LeaveRequest[]> {
    return this.get<LeaveRequest[]>('/leave')
  }

  async createLeaveRequest(data: Partial<LeaveRequest>): Promise<LeaveRequest> {
    return this.post<LeaveRequest>('/leave', data)
  }

  async getLeaveTypes(): Promise<LeaveType[]> {
    return this.get<LeaveType[]>('/leave-types')
  }

  // ESS endpoints
  async getMyProfile(): Promise<Employee> {
    return this.get<Employee>('/ess/profile')
  }

  async updateMyProfile(data: Partial<Employee>): Promise<Employee> {
    return this.patch<Employee>('/ess/profile', data)
  }

  async getMyPayslips(): Promise<any[]> {
    return this.get<any[]>('/ess/payslips')
  }

  async getMyLeaveRequests(): Promise<LeaveRequest[]> {
    return this.get<LeaveRequest[]>('/ess/leave')
  }

  // Generic API methods
  async get<T>(url: string, params?: any): Promise<T> {
    const response = await this.api.get<T>(url, { params })
    return response.data
  }

  async post<T>(url: string, data?: any): Promise<T> {
    const response = await this.api.post<T>(url, data)
    return response.data
  }

  async put<T>(url: string, data?: any): Promise<T> {
    const response = await this.api.put<T>(url, data)
    return response.data
  }

  async patch<T>(url: string, data?: any): Promise<T> {
    const response = await this.api.patch<T>(url, data)
    return response.data
  }

  async delete<T>(url: string): Promise<T> {
    const response = await this.api.delete<T>(url)
    return response.data
  }
}

export const apiService = new ApiService()

// Initialize auth token from localStorage if available
if (typeof window !== 'undefined') {
  const token = localStorage.getItem('accessToken')
  if (token) {
    apiService.setAuthToken(token)
  }
}