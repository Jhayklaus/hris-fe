export interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  role: 'admin' | 'manager' | 'employee'
  companyId: string
  companyName: string
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface AuthResponse {
  user: User
  accessToken: string
  refreshToken: string
}

export interface Company {
  id: string
  name: string
  pencomNo?: string
  nsitfNo?: string
  nhfEnabled: boolean
  workWeekSchedule: 'MON_FRI' | 'MON_SAT'
  status: 'active' | 'inactive'
}

export interface Employee {
  id: string
  companyId: string
  firstName: string
  lastName: string
  email: string
  dateOfHire: string
  jobTitle: string
  bankAcctNo?: string
  bankName?: string
  status: 'active' | 'inactive'
  managerId?: string
  manager?: Employee
}

export interface SalaryHistory {
  id: string
  employeeId: string
  effectiveDate: string
  payType: 'SALARIED' | 'HOURLY'
  grossSalaryAnnual: number
  basicSalaryAnnual: number
  housingAllowanceAnnual: number
  transportAllowanceAnnual: number
  notes?: string
}

export interface PayrollRun {
  id: string
  companyId: string
  periodYear: number
  periodMonth: number
  status: 'draft' | 'processed' | 'posted'
  startedBy: string
  startedAt: string
  completedAt?: string
  rulesetVersionRef: string
}

export interface PayrollLineItem {
  id: string
  payrollRunId: string
  employeeId: string
  earningsGrossMonthly: number
  pensionEmployee: number
  pensionEmployer: number
  nhfEmployee: number
  nsitfEmployer: number
  taxableIncome: number
  paye: number
  netPay: number
  detailsJson?: any
}

export interface LeaveType {
  id: string
  companyId: string
  name: string
  defaultAllocationDaysPerYear: number
  carryoverPolicyJson?: any
}

export interface LeaveRequest {
  id: string
  employeeId: string
  leaveTypeId: string
  startDate: string
  endDate: string
  status: 'pending' | 'approved' | 'denied'
  reason?: string
  approvedBy?: string
  approvedAt?: string
  leaveType?: LeaveType
  employee?: Employee
}

export interface EssChangeRequest {
  id: string
  employeeId: string
  changeType: 'bank_details' | 'address' | 'personal_info'
  payloadBeforeJson: any
  payloadAfterJson: any
  status: 'pending' | 'approved' | 'denied'
  approvedBy?: string
  approvedAt?: string
}