'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useAuth } from '@/hooks/useAuth'
import { toast } from 'sonner'
import { Building2, Mail, Lock, ArrowRight, Sparkles } from 'lucide-react'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [companyId, setCompanyId] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [mounted, setMounted] = useState(false)
  const { login } = useAuth()
  const router = useRouter()

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      await login({ email, password, companyId })
      toast.success('Login successful!')
      
      // Redirect based on user role
      const userData = typeof window !== 'undefined' ? localStorage.getItem('user') : null
      if (userData) {
        const user = JSON.parse(userData)
        switch (user.role) {
          case 'admin':
            router.push('/admin/dashboard')
            break
          case 'manager':
            router.push('/manager/dashboard')
            break
          case 'employee':
            router.push('/ess/dashboard')
            break
          default:
            router.push('/')
        }
      }
    } catch (error) {
      toast.error('Login failed. Please check your credentials.')
      console.error('Login error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-900">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-primary/20 to-accent/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-secondary/20 to-primary/20 rounded-full blur-3xl animate-pulse animation-delay-2000" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-accent/10 to-primary/10 rounded-full blur-3xl animate-pulse animation-delay-4000" />
      </div>

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 bg-grid-slate-800/20 [mask-image:linear-gradient(to_bottom,white_20%,transparent_100%)]" />

      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          {/* Header with premium branding */}
          <div className="text-center mb-8 animate-fade-in-up">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-primary to-accent rounded-2xl mb-6 shadow-2xl shadow-primary/25">
              <span className="text-white font-bold text-3xl font-display">K</span>
            </div>
            <div className="space-y-2">
              <h1 className="text-4xl font-display font-bold text-white mb-2">
                Welcome to Kọlá
                <Sparkles className="inline-block w-6 h-6 ml-2 text-accent animate-pulse" />
              </h1>
              <p className="text-slate-300 text-lg">Payroll-first HR for Nigerian SMEs</p>
            </div>
          </div>

          {/* Premium login card */}
          <Card className="premium-card border-white/10 backdrop-blur-xl">
            <CardHeader className="space-y-1 pb-6">
              <CardTitle className="text-2xl font-display text-white">Sign In</CardTitle>
              <CardDescription className="text-slate-300">
                Access your payroll dashboard
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Company ID Field */}
                <div className="space-y-2">
                  <Label htmlFor="companyId" className="text-slate-200 flex items-center">
                    <Building2 className="w-4 h-4 mr-2 text-accent" />
                    Company ID
                  </Label>
                  <Input
                    id="companyId"
                    type="text"
                    placeholder="Enter your company ID"
                    value={companyId}
                    onChange={(e) => setCompanyId(e.target.value)}
                    required
                    disabled={isLoading}
                    className="premium-input"
                  />
                </div>

                {/* Email Field */}
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-slate-200 flex items-center">
                    <Mail className="w-4 h-4 mr-2 text-accent" />
                    Email Address
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={isLoading}
                    className="premium-input"
                  />
                </div>

                {/* Password Field */}
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-slate-200 flex items-center">
                    <Lock className="w-4 h-4 mr-2 text-accent" />
                    Password
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={isLoading}
                    className="premium-input"
                  />
                </div>

                {/* Submit Button */}
                <Button 
                  type="submit" 
                  className="w-full premium-button"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <span className="flex items-center">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                      Signing in...
                    </span>
                  ) : (
                    <span className="flex items-center justify-center">
                      Sign In
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </span>
                  )}
                </Button>
              </form>

              {/* Demo credentials */}
              {/* <div className="mt-6 p-4 bg-slate-800/50 rounded-lg border border-white/10">
                <p className="text-slate-300 text-sm mb-2">Demo credentials:</p>
                <div className="space-y-1 text-xs text-slate-400">
                  <p><span className="text-accent">Company:</span> demo-company</p>
                  <p><span className="text-accent">Admin:</span> admin@kola.com / password</p>
                  <p><span className="text-accent">Manager:</span> manager@kola.com / password</p>
                  <p><span className="text-accent">Employee:</span> employee@kola.com / password</p>
                </div>
              </div> */}

              {/* Signup Link */}
              <div className="mt-6 text-center">
                <p className="text-slate-400 text-sm">
                  Don't have an account?{' '}
                  <button
                    onClick={() => router.push('/signup')}
                    className="text-accent hover:text-accent/80 font-medium transition-colors duration-200"
                  >
                    Sign up
                  </button>
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Footer */}
          <div className="mt-8 text-center">
            <p className="text-slate-400 text-sm">
              Powered by Kọlá HR Platform
            </p>
          </div>
        </div>
      </div>

      {/* Custom styles for animations */}
      <style jsx>{`
        .animate-fade-in-up {
          animation: fadeInUp 0.8s ease-out;
        }
        
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        
        .premium-card {
          animation: slideIn 0.6s ease-out 0.2s both;
        }
        
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  )
}