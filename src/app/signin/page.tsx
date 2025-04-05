'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { signIn } from '@/lib/auth'

export default function SignInPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    
    try {
      await signIn(email, password)
      router.push('/dashboard')
    } catch (err: any) {
      console.error('Sign in error:', err)
      setError(err.message || 'Failed to sign in')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-ncaa-blue via-ncaa-darkblue to-blue-800 flex items-center justify-center">
      <div className="bg-white/10 backdrop-blur-sm p-8 rounded-xl max-w-md w-full mx-4 shadow-xl">
        <div className="flex justify-center mb-6">
          <div className="h-12 w-12 bg-white rounded-lg flex items-center justify-center">
            <img src="/logo.png" alt="NILytics Logo" className="h-10 w-10" />
          </div>
        </div>
        <h1 className="text-3xl font-bold text-white text-center mb-8">Sign In to NILytics</h1>

        {error && (
          <div className="bg-red-500/20 border border-red-500/50 text-white px-4 py-3 rounded mb-6">
            <p>{error}</p>
          </div>
        )}

        <form onSubmit={handleSignIn} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-white mb-2">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="block w-full px-4 py-3 border border-white/30 rounded-lg bg-white/10 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/50"
              placeholder="your.email@university.edu"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-white mb-2">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="block w-full px-4 py-3 border border-white/30 rounded-lg bg-white/10 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/50"
              placeholder="••••••••"
            />
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-ncaa-blue bg-white hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-white/50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Signing in...' : 'Sign In'}
            </button>
          </div>
        </form>

        <div className="mt-8 text-center">
          <p className="text-white/70 text-sm">
            Need access? <a href="#demo" className="text-white hover:underline">Book a demo</a> to get started.
          </p>
        </div>

        <div className="mt-6 text-center">
          <Link href="/" className="text-white/70 text-sm hover:text-white">
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  )
} 