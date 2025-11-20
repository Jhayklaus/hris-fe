'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { User, LoginCredentials, AuthResponse } from '@/types'
import { apiService } from '@/services/api'

interface AuthContextType {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  login: (credentials: LoginCredentials) => Promise<void>
  logout: () => void
  refreshAuth: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const token = apiService.getAuthToken()
        
        if (token) {
          // Fetch user profile to get complete user data
          const profile = await apiService.getMyProfile()
          setUser({
            id: profile.id,
            email: profile.email,
            firstName: profile.firstName,
            lastName: profile.lastName,
            role: profile.status === 'active' ? 'employee' : 'employee',
            companyId: profile.companyId,
            companyName: 'Kọlá HR Platform' // Will be fetched from company endpoint
          })
        }
      } catch (error) {
        console.error('Auth initialization error:', error)
        apiService.logout()
      } finally {
        setIsLoading(false)
      }
    }

    initializeAuth()
  }, [])

  const login = async (credentials: { email: string; password: string; companyId: string }) => {
    try {
      setIsLoading(true)
      const { token } = await apiService.login(credentials)
      
      // Fetch user profile after successful login
      const profile = await apiService.getMyProfile()
      setUser({
        id: profile.id,
        email: profile.email,
        firstName: profile.firstName,
        lastName: profile.lastName,
        role: 'employee', // Will be determined from backend role system
        companyId: profile.companyId,
        companyName: 'Kọlá HR Platform'
      })
    } catch (error) {
      console.error('Login error:', error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    apiService.logout()
    setUser(null)
  }

  const refreshAuth = async () => {
    try {
      // Check if token is still valid by attempting to fetch profile
      const profile = await apiService.getMyProfile()
      setUser(prevUser => prevUser ? {
        ...prevUser,
        id: profile.id,
        email: profile.email,
        firstName: profile.firstName,
        lastName: profile.lastName,
        role: 'employee',
        companyId: profile.companyId,
        companyName: 'Kọlá HR Platform'
      } : null)
    } catch (error) {
      console.error('Token refresh error:', error)
      logout()
      throw error
    }
  }

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    logout,
    refreshAuth,
  }

  return React.createElement(AuthContext.Provider, { value }, children)
}