import React, { createContext, useContext, useEffect, useState } from 'react'
import { authService } from '@/services/authService'
import { LoginPayload, RegisterPayload, User } from '@/types'

interface AuthContextValue {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  login: (payload: LoginPayload) => Promise<void>
  register: (payload: RegisterPayload) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    authService
      .getCurrentUser()
      .then(setUser)
      .finally(() => setIsLoading(false))
  }, [])

  async function login(payload: LoginPayload) {
    const response = await authService.login(payload)
    setUser(response.user)
  }

  async function register(payload: RegisterPayload) {
    const response = await authService.register(payload)
    setUser(response.user)
  }

  function logout() {
    authService.logout()
    setUser(null)
  }

  return (
    <AuthContext.Provider
      value={{ user, isLoading, isAuthenticated: !!user, login, register, logout }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
