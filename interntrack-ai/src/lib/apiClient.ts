// Centralized HTTP client. Every service goes through this — never call
// fetch/axios directly from a component or a service. When Stage 2's
// backend is ready, set VITE_USE_MOCKS=false and this is the only file
// that talks to the network.

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:5000/api'

export const USE_MOCKS = (import.meta.env.VITE_USE_MOCKS ?? 'true') === 'true'

function getToken(): string | null {
  return localStorage.getItem('interntrack_token')
}

export function setToken(token: string | null) {
  if (token) localStorage.setItem('interntrack_token', token)
  else localStorage.removeItem('interntrack_token')
}

export class ApiClientError extends Error {
  status?: number
  constructor(message: string, status?: number) {
    super(message)
    this.status = status
  }
}

interface RequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'
  body?: unknown
  headers?: Record<string, string>
}

async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const token = getToken()

  // FormData (used by resumeService.uploadResume for multipart file uploads)
  // must be sent as-is, with no Content-Type header — the browser sets
  // "multipart/form-data; boundary=..." itself. JSON.stringify-ing a
  // FormData object or forcing "application/json" onto it silently breaks
  // the upload, so this is the one branch in the client that isn't JSON.
  const isFormData = typeof FormData !== 'undefined' && options.body instanceof FormData

  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: options.method ?? 'GET',
    headers: {
      ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
    body: options.body ? (isFormData ? (options.body as FormData) : JSON.stringify(options.body)) : undefined,
  })

  if (!response.ok) {
    let message = `Request failed with status ${response.status}`
    try {
      const errorBody = await response.json()
      message = errorBody.message ?? message
    } catch {
      // response had no JSON body
    }
    throw new ApiClientError(message, response.status)
  }

  if (response.status === 204) return undefined as T
  return (await response.json()) as T
}

export const apiClient = {
  get: <T>(path: string) => request<T>(path, { method: 'GET' }),
  post: <T>(path: string, body?: unknown) => request<T>(path, { method: 'POST', body }),
  put: <T>(path: string, body?: unknown) => request<T>(path, { method: 'PUT', body }),
  patch: <T>(path: string, body?: unknown) => request<T>(path, { method: 'PATCH', body }),
  delete: <T>(path: string) => request<T>(path, { method: 'DELETE' }),
}

/** Simulated network latency for mock services, so loading states are visible in the demo. */
export const mockDelay = (ms = 500) => new Promise((resolve) => setTimeout(resolve, ms))
