// Auth abstraction. Stage 2 will replace the mock branch with real JWT calls
// through apiClient — components never change, they only call these methods.

import { apiClient, mockDelay, setToken, USE_MOCKS } from '@/lib/apiClient'
import { mockUser } from '@/mocks/mockUser'
import { AuthResponse, LoginPayload, RegisterPayload, User } from '@/types'

const CURRENT_USER_KEY = 'interntrack_user'

function persistSession(response: AuthResponse) {
  setToken(response.token)
  localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(response.user))
}

export const authService = {
  async login(payload: LoginPayload): Promise<AuthResponse> {
    if (USE_MOCKS) {
      await mockDelay(600)
      if (!payload.email || !payload.password) {
        throw new Error('Email and password are required.')
      }
      const response: AuthResponse = { user: mockUser, token: 'mock_jwt_token' }
      persistSession(response)
      return response
    }
    const response = await apiClient.post<AuthResponse>('/auth/login', payload)
    persistSession(response)
    return response
  },

  async register(payload: RegisterPayload): Promise<AuthResponse> {
    if (USE_MOCKS) {
      await mockDelay(700)
      const response: AuthResponse = {
        user: { ...mockUser, name: payload.name, email: payload.email },
        token: 'mock_jwt_token',
      }
      persistSession(response)
      return response
    }
    const response = await apiClient.post<AuthResponse>('/auth/register', payload)
    persistSession(response)
    return response
  },

  logout(): void {
    setToken(null)
    localStorage.removeItem(CURRENT_USER_KEY)
  },

  async getCurrentUser(): Promise<User | null> {
    if (USE_MOCKS) {
      await mockDelay(200)
      const stored = localStorage.getItem(CURRENT_USER_KEY)
      return stored ? (JSON.parse(stored) as User) : null
    }
    try {
      return await apiClient.get<User>('/auth/me')
    } catch {
      return null
    }
  },
}
