import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Compass } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { Button } from '@/components/ui'

export default function Register() {
  const { register } = useAuth()
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setIsLoading(true)
    try {
      await register({ name, email, password })
      navigate('/app/dashboard')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not create your account. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="mx-auto flex min-h-[calc(100vh-8rem)] max-w-md flex-col justify-center px-6 py-16">
      <div className="mb-8 flex flex-col items-center text-center">
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-600 text-white">
          <Compass className="h-5 w-5" />
        </span>
        <h1 className="mt-4 text-xl font-semibold text-ink-900">Create your account</h1>
        <p className="mt-1 text-sm text-ink-500">Start building your AI career command center.</p>
      </div>

      <form onSubmit={handleSubmit} className="rounded-2xl border border-ink-300/25 bg-white p-6 shadow-card">
        {error && (
          <div className="mb-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</div>
        )}
        <label className="block text-sm font-medium text-ink-700">
          Full name
          <input
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="focus-ring mt-1.5 w-full rounded-lg border border-ink-300/40 px-3 py-2.5 text-sm"
            placeholder="Aditi Sharma"
          />
        </label>
        <label className="mt-4 block text-sm font-medium text-ink-700">
          Email
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="focus-ring mt-1.5 w-full rounded-lg border border-ink-300/40 px-3 py-2.5 text-sm"
            placeholder="you@university.edu"
          />
        </label>
        <label className="mt-4 block text-sm font-medium text-ink-700">
          Password
          <input
            type="password"
            required
            minLength={6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="focus-ring mt-1.5 w-full rounded-lg border border-ink-300/40 px-3 py-2.5 text-sm"
            placeholder="At least 6 characters"
          />
        </label>
        <Button type="submit" isLoading={isLoading} className="mt-6 w-full">
          Create account
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-ink-500">
        Already have an account?{' '}
        <Link to="/login" className="font-medium text-brand-600 hover:text-brand-700">
          Log in
        </Link>
      </p>
    </div>
  )
}
